import { useId } from 'react';

export function InquiryHoneypot({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const id = useId();
  return (
    <div aria-hidden="true" className="absolute -left-[10000px] top-0 h-px w-px overflow-hidden">
      <label htmlFor={id}>Leave this field empty</label>
      <input id={id} name="websiteTrap" type="text" autoComplete="off" tabIndex={-1}
        value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}
