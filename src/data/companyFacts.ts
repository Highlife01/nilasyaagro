import facts from '../../content/company-facts.json';

export { facts as companyFacts };

export function getCompanyFactLabels(lang: string) {
  const labels = facts.labels;
  return labels[lang as keyof typeof labels] || labels.en;
}

/** A fact may be published only after its definition and written approval are recorded. */
export function approvedCompanyFact(name: keyof typeof facts.facts): string | number | null {
  const fact = facts.facts[name] as { status: string; value: string | number | null; definition: string | null; approvedBy: string | null; approvedAt: string | null; evidence: string | null };
  return fact.status === 'approved' && fact.definition && fact.approvedBy && fact.approvedAt && fact.evidence ? fact.value : null;
}
