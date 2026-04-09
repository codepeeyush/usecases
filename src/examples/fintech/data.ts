export type StepStatus = 'complete' | 'error' | 'active' | 'pending' | 'locked'
export type FieldStatus = 'verified' | 'error' | 'warning' | 'idle'

export interface KYCField {
  id: string
  label: string
  value: string
  placeholder: string
  hint: string
  status: FieldStatus
  errorMessage?: string
  format?: string
  type?: 'text' | 'date' | 'otp' | 'masked'
}

export interface KYCStep {
  id: string
  number: number
  title: string
  subtitle: string
  status: StepStatus
  fields: KYCField[]
  docRequired?: string
}

export const kycSteps: KYCStep[] = [
  {
    id: 'personal',
    number: 1,
    title: 'Personal Info',
    subtitle: 'Basic identity details',
    status: 'complete',
    fields: [
      {
        id: 'full_name',
        label: 'Full Name',
        value: 'Arjun Mehta',
        placeholder: 'As per government ID',
        hint: 'Must match your PAN card and Aadhaar exactly',
        status: 'verified',
        type: 'text',
      },
      {
        id: 'dob',
        label: 'Date of Birth',
        value: '15/03/1992',
        placeholder: 'DD/MM/YYYY',
        hint: 'Must match your PAN card records',
        status: 'verified',
        type: 'date',
      },
      {
        id: 'email',
        label: 'Email Address',
        value: 'arjun.mehta@gmail.com',
        placeholder: 'you@example.com',
        hint: 'OTP and account updates will be sent here',
        status: 'verified',
        type: 'text',
      },
      {
        id: 'phone',
        label: 'Mobile Number',
        value: '+91 98765 43210',
        placeholder: '+91 XXXXX XXXXX',
        hint: 'Linked to your Aadhaar for OTP verification',
        status: 'verified',
        type: 'text',
      },
    ],
  },
  {
    id: 'pan',
    number: 2,
    title: 'PAN Verification',
    subtitle: 'Permanent Account Number',
    status: 'error',
    docRequired: 'PAN Card (front side)',
    fields: [
      {
        id: 'pan_number',
        label: 'PAN Number',
        value: 'ABCDE123F',
        placeholder: 'ABCDE1234F',
        hint: '10-character alphanumeric code on your PAN card',
        format: 'ABCDE1234F',
        status: 'error',
        errorMessage: 'Invalid format — PAN must be exactly 10 characters (5 letters, 4 digits, 1 letter)',
        type: 'text',
      },
      {
        id: 'pan_dob',
        label: 'Date of Birth (as on PAN)',
        value: '15/04/1992',
        placeholder: 'DD/MM/YYYY',
        hint: 'Enter the exact date on your PAN card',
        status: 'warning',
        errorMessage: 'Date mismatch — This does not match PAN records. Check your PAN card carefully.',
        type: 'date',
      },
      {
        id: 'pan_name',
        label: 'Name on PAN',
        value: 'ARJUN MEHTA',
        placeholder: 'Exactly as printed on PAN card',
        hint: 'Enter in capital letters, exactly as on the card',
        status: 'verified',
        type: 'text',
      },
    ],
  },
  {
    id: 'aadhaar',
    number: 3,
    title: 'Aadhaar Linking',
    subtitle: 'UIDAI identity verification',
    status: 'active',
    docRequired: 'Aadhaar Card (front & back)',
    fields: [
      {
        id: 'aadhaar_number',
        label: 'Aadhaar Number',
        value: '9876 5432 1098',
        placeholder: 'XXXX XXXX XXXX',
        hint: '12-digit unique identification number issued by UIDAI',
        status: 'verified',
        type: 'masked',
      },
      {
        id: 'aadhaar_otp',
        label: 'OTP Verification',
        value: '',
        placeholder: 'Enter 6-digit OTP',
        hint: 'OTP sent to +91 98765 XXXXX (linked to your Aadhaar)',
        status: 'idle',
        type: 'otp',
      },
    ],
  },
  {
    id: 'bank',
    number: 4,
    title: 'Bank Account',
    subtitle: 'Link your savings account',
    status: 'pending',
    docRequired: 'Cancelled cheque or bank passbook',
    fields: [
      {
        id: 'account_number',
        label: 'Account Number',
        value: '',
        placeholder: 'Enter your account number',
        hint: 'Found on your cheque book or bank statement',
        status: 'idle',
        type: 'text',
      },
      {
        id: 'ifsc',
        label: 'IFSC Code',
        value: '',
        placeholder: 'e.g. HDFC0001234',
        hint: '11-character code identifying your bank branch (on cheque book)',
        format: 'ABCD0123456',
        status: 'idle',
        type: 'text',
      },
      {
        id: 'account_holder',
        label: 'Account Holder Name',
        value: '',
        placeholder: 'As per bank records',
        hint: 'Must match your KYC name exactly',
        status: 'idle',
        type: 'text',
      },
    ],
  },
  {
    id: 'review',
    number: 5,
    title: 'Review & Submit',
    subtitle: 'Final verification',
    status: 'locked',
    fields: [],
  },
]

export const stepStatusConfig: Record<StepStatus, {
  label: string
  circleBase: string
  circleFill: string
  labelColor: string
  selectedBg: string
}> = {
  complete: {
    label: 'Complete',
    circleBase: 'border-emerald-500 bg-emerald-500',
    circleFill: 'text-white',
    labelColor: 'text-emerald-600',
    selectedBg: 'bg-emerald-50/60',
  },
  error: {
    label: 'Action Required',
    circleBase: 'border-red-500 bg-red-500',
    circleFill: 'text-white',
    labelColor: 'text-red-600',
    selectedBg: 'bg-red-50/60',
  },
  active: {
    label: 'In Progress',
    circleBase: 'border-sky-500 bg-sky-500',
    circleFill: 'text-white',
    labelColor: 'text-sky-600',
    selectedBg: 'bg-sky-50/60',
  },
  pending: {
    label: 'Not Started',
    circleBase: 'border-slate-300 bg-white',
    circleFill: 'text-slate-400',
    labelColor: 'text-slate-400',
    selectedBg: 'bg-slate-50',
  },
  locked: {
    label: 'Locked',
    circleBase: 'border-slate-200 bg-slate-100',
    circleFill: 'text-slate-300',
    labelColor: 'text-slate-300',
    selectedBg: 'bg-slate-50',
  },
}
