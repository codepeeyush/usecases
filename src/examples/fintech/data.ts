export type StepStatus = 'complete' | 'error' | 'active' | 'pending' | 'locked'
export type FieldStatus = 'verified' | 'error' | 'warning' | 'idle'
export type FieldType = 'text' | 'url' | 'email' | 'select' | 'date' | 'otp' | 'masked' | 'number'

export interface FieldOption { value: string; label: string }

export interface ComplianceField {
  id: string
  label: string
  value: string
  placeholder: string
  hint: string
  status: FieldStatus
  errorMessage?: string
  format?: string
  type?: FieldType
  options?: FieldOption[]
  prefix?: string
}

export interface ComplianceStep {
  id: string
  number: number
  title: string
  subtitle: string
  status: StepStatus
  fields: ComplianceField[]
  docRequired?: string
}

// ─── Step definitions ────────────────────────────────────────────────────────

export const complianceSteps: ComplianceStep[] = [
  {
    id: 'business',
    number: 1,
    title: 'Business Details',
    subtitle: 'Tell us about your company',
    status: 'active',
    fields: [
      {
        id: 'company_name',
        label: 'Registered Legal Name',
        value: '',
        placeholder: 'e.g. Acme Technologies Inc.',
        hint: 'Must match your Certificate of Incorporation or business registration exactly',
        status: 'idle',
        type: 'text',
      },
      {
        id: 'business_type',
        label: 'Business Structure',
        value: '',
        placeholder: 'Select structure',
        hint: 'How your business is legally registered in your country',
        status: 'idle',
        type: 'select',
        options: [
          { value: 'corporation', label: 'Corporation (C-Corp / S-Corp)' },
          { value: 'llc', label: 'Limited Liability Company (LLC)' },
          { value: 'ltd', label: 'Private Limited (Ltd.)' },
          { value: 'partnership', label: 'Partnership' },
          { value: 'sole', label: 'Sole Proprietor / Individual' },
          { value: 'nonprofit', label: 'Non-Profit / NGO' },
        ],
      },
      {
        id: 'website',
        label: 'Business Website',
        value: '',
        placeholder: 'yourcompany.com',
        hint: 'Must be a live, publicly accessible domain showing your product or service',
        status: 'idle',
        type: 'url',
        prefix: 'https://',
      },
      {
        id: 'tax_id',
        label: 'Tax Identification Number',
        value: '',
        placeholder: 'EIN, VAT, ABN, or local equivalent',
        hint: 'Government-issued tax ID for your country — EIN (US), VAT (EU), ABN (AU), CRN (UK)',
        status: 'idle',
        type: 'text',
      },
    ],
  },
  {
    id: 'signatory',
    number: 2,
    title: 'Authorized Signatory',
    subtitle: 'Owner or director identity',
    status: 'pending',
    docRequired: 'Government-issued photo ID · Proof of address (last 3 months)',
    fields: [
      {
        id: 'signatory_name',
        label: 'Full Legal Name',
        value: '',
        placeholder: 'As it appears on your government ID',
        hint: 'Must match exactly — including middle names if present',
        status: 'idle',
        type: 'text',
      },
      {
        id: 'id_number',
        label: 'Government ID Number',
        value: '',
        placeholder: 'Passport, Driver\'s License, or National ID',
        hint: 'Accepted: Passport, Driver\'s License, National ID card — must be current and unexpired',
        status: 'idle',
        type: 'text',
      },
      {
        id: 'dob',
        label: 'Date of Birth',
        value: '',
        placeholder: 'MM/DD/YYYY',
        hint: 'Must match the date on your submitted government ID document',
        status: 'idle',
        type: 'date',
      },
      {
        id: 'nationality',
        label: 'Country of Residence',
        value: '',
        placeholder: 'Select country',
        hint: 'Country where you currently reside — used for identity verification and compliance',
        status: 'idle',
        type: 'select',
        options: [
          { value: 'us', label: 'United States' },
          { value: 'uk', label: 'United Kingdom' },
          { value: 'ca', label: 'Canada' },
          { value: 'au', label: 'Australia' },
          { value: 'de', label: 'Germany' },
          { value: 'fr', label: 'France' },
          { value: 'sg', label: 'Singapore' },
          { value: 'in', label: 'India' },
          { value: 'other', label: 'Other' },
        ],
      },
    ],
  },
  {
    id: 'bank',
    number: 3,
    title: 'Settlement Account',
    subtitle: 'Where we send your payouts',
    status: 'locked',
    docRequired: 'Voided check or official bank statement (last 90 days)',
    fields: [
      {
        id: 'account_holder',
        label: 'Account Holder Name',
        value: '',
        placeholder: 'As it appears on your bank account',
        hint: 'Must match your registered business or legal name',
        status: 'idle',
        type: 'text',
      },
      {
        id: 'account_number',
        label: 'Account Number / IBAN',
        value: '',
        placeholder: 'Account number or IBAN',
        hint: 'US/CA: routing + account number · EU: IBAN · AU: BSB + account',
        status: 'idle',
        type: 'text',
      },
      {
        id: 'routing',
        label: 'Routing / Sort / SWIFT Code',
        value: '',
        placeholder: 'e.g. 021000021 or CHASUS33',
        hint: 'US: 9-digit routing number · UK: 6-digit sort code · International: SWIFT/BIC code',
        status: 'idle',
        type: 'text',
      },
      {
        id: 'currency',
        label: 'Settlement Currency',
        value: '',
        placeholder: 'Select currency',
        hint: 'Payouts will be sent in this currency — must match your bank account currency',
        status: 'idle',
        type: 'select',
        options: [
          { value: 'usd', label: 'USD — US Dollar' },
          { value: 'eur', label: 'EUR — Euro' },
          { value: 'gbp', label: 'GBP — British Pound' },
          { value: 'aud', label: 'AUD — Australian Dollar' },
          { value: 'cad', label: 'CAD — Canadian Dollar' },
          { value: 'sgd', label: 'SGD — Singapore Dollar' },
        ],
      },
    ],
  },
  {
    id: 'review',
    number: 4,
    title: 'Review & Activate',
    subtitle: 'Go live with payments',
    status: 'locked',
    fields: [],
  },
]

export const stepStatusConfig: Record<StepStatus, {
  label: string
  pill: string
  dot: string
  accentBar: string
  circleBg: string
}> = {
  complete: {
    label: 'Complete',
    pill: 'bg-emerald-50 text-emerald-700',
    dot: 'bg-emerald-500',
    accentBar: 'bg-emerald-400',
    circleBg: 'bg-emerald-500',
  },
  error: {
    label: 'Needs attention',
    pill: 'bg-red-50 text-red-600',
    dot: 'bg-red-500 animate-pulse',
    accentBar: 'bg-red-400',
    circleBg: 'bg-red-500',
  },
  active: {
    label: 'In progress',
    pill: 'bg-amber-50 text-amber-700',
    dot: 'bg-amber-500 animate-pulse',
    accentBar: 'bg-amber-400',
    circleBg: 'bg-amber-500',
  },
  pending: {
    label: 'Not started',
    pill: 'bg-slate-100 text-slate-400',
    dot: 'bg-slate-300',
    accentBar: 'bg-slate-200',
    circleBg: 'bg-slate-300',
  },
  locked: {
    label: 'Locked',
    pill: 'bg-slate-50 text-slate-300',
    dot: 'bg-slate-200',
    accentBar: 'bg-slate-100',
    circleBg: 'bg-slate-200',
  },
}
