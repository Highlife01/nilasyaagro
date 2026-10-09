export class NotificationError extends Error {
  constructor(code, retryable = true) { super(code); this.name = 'NotificationError'; this.code = code; this.retryable = retryable; }
}

export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/gu, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
}

export function notificationMessages(inquiry, { from, teamEmail }) {
  const email = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/u;
  if (!email.test(from || '') || !email.test(teamEmail || '')) throw new NotificationError('mail_configuration_missing');
  const fields = [
    ['Reference', inquiry.referenceCode], ['Type', inquiry.kind], ['Language', inquiry.language],
    ['Product', inquiry.product], ['Variety / grade', inquiry.variety], ['Technical specification', inquiry.caliber],
    ['Quantity', inquiry.quantity && `${inquiry.quantity} ${inquiry.unit}`], ['Packaging', inquiry.packaging],
    ['Destination country', inquiry.destinationCountry], ['Destination city', inquiry.destinationCity],
    ['Destination port', inquiry.destinationPort], ['Delivery address', inquiry.deliveryAddress],
    ['Incoterm', inquiry.incoterm], ['Requested delivery date', inquiry.requestedDeliveryDate],
    ['Company', inquiry.companyName], ['Contact', inquiry.contactPerson], ['Email', inquiry.email],
    ['Phone', inquiry.phone], ['WhatsApp', inquiry.whatsapp], ['Website', inquiry.website],
    ['Subject', inquiry.subject], ['Message', inquiry.message], ['Source page', inquiry.metadata?.sourcePage],
  ].filter(([, value]) => value);
  const teamText = fields.map(([label, value]) => `${label}: ${value}`).join('\n');
  const teamHtml = `<h1>New Nilasya inquiry</h1><table>${fields.map(([label, value]) => `<tr><th align="left">${escapeHtml(label)}</th><td style="white-space:pre-wrap">${escapeHtml(value)}</td></tr>`).join('')}</table>`;
  const confirmation = inquiry.language === 'tr'
    ? `Başvurunuz kaydedildi. Referans numaranız: ${inquiry.referenceCode}. İhracat ekibimiz talebinizi inceleyecek ve sizinle iletişime geçecektir.`
    : `Your inquiry has been saved. Your reference is ${inquiry.referenceCode}. Our export team will review your request and contact you.`;
  const sender = `Nilasya Agro Foods <${from}>`;
  return {
    team: { from: sender, to: [teamEmail], reply_to: inquiry.email, subject: `Nilasya inquiry ${inquiry.referenceCode}`, text: teamText, html: teamHtml },
    customer: { from: sender, to: [inquiry.email], reply_to: teamEmail, subject: `Nilasya inquiry receipt ${inquiry.referenceCode}`, text: confirmation, html: `<p>${escapeHtml(confirmation)}</p>` },
  };
}

export function createResendTransport({ apiKey, fetchImpl = fetch }) {
  return async (message, idempotencyKey) => {
    const key = typeof apiKey === 'function' ? apiKey() : apiKey;
    if (!key) throw new NotificationError('mail_configuration_missing');
    let response;
    try {
      response = await fetchImpl('https://api.resend.com/emails', {
        method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
        body: JSON.stringify(message), signal: AbortSignal.timeout(8000),
      });
    } catch { throw new NotificationError('provider_network_error'); }
    const body = await response.json().catch(() => null);
    if (!response.ok || typeof body?.id !== 'string' || !body.id || body.id.length > 200) {
      // Never persist provider responses: they can contain addresses and other customer data.
      const retryable = [401, 403, 408, 409, 429].includes(response.status) || response.status >= 500;
      throw new NotificationError(`provider_http_${response.status}`, retryable);
    }
    return { providerId: body.id };
  };
}

export function createNotificationWorker({ store, sendMail, mailConfig, now = () => Date.now(), logError = () => {} }) {
  return async (id) => {
    const claim = await store.claimNotification(id, now());
    if (!claim.leaseToken) return { status: claim.status === 'sent' ? 'sent' : claim.status === 'failed' ? 'failed' : 'pending' };
    try {
      // Freeze the exact request body before sending, so provider idempotency keys
      // remain valid across crashes, code updates, and partial team/customer sends.
      const messages = claim.messages || await store.prepareNotificationMessages(id, claim.leaseToken, notificationMessages(claim.inquiry, mailConfig()));
      for (const audience of ['team', 'customer']) {
        if (claim.accepted?.[audience]) continue;
        const result = await sendMail(messages[audience], `nilasya/${id}/${audience}`);
        await store.acceptNotification(id, claim.leaseToken, audience, result.providerId, now());
      }
      await store.completeNotification(id, claim.leaseToken, now());
      return { status: 'sent' };
    } catch (error) {
      const code = error instanceof NotificationError ? error.code : 'notification_processing_error';
      logError({ name: 'NotificationError', code, inquiryId: id });
      const status = await store.failNotification(id, claim.leaseToken, { code, retryable: error.retryable !== false, timestamp: now() });
      return { status };
    }
  };
}
