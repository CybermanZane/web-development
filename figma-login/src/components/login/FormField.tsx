type FormFieldProps = { id: string; label: string; type: 'email' | 'password'; placeholder: string; autoComplete: string }

export function FormField({ id, label, type, placeholder, autoComplete }: FormFieldProps) {
  return <label className="block text-[11px] font-medium text-[#26324a]" htmlFor={id}>{label}<input className="mt-1 block h-[35px] w-full rounded-[7px] border border-[#d9e0e9] bg-[#f5f8fc] px-[11px] text-[11px] text-[#26324a] outline-none placeholder:text-[#8ca0bd] focus:border-[#2559ee] focus:ring-2 focus:ring-[#2559ee]/15" id={id} type={type} placeholder={placeholder} autoComplete={autoComplete} required /></label>
}
