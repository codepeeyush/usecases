export type CareServiceId = 'individual' | 'couples' | 'family' | 'physical'
export type SessionFormatId = 'virtual' | 'in-person' | 'flexible'

export type CareService = {
  id: CareServiceId
  name: string
  selectorLabel: string
  selectorSublabel: string
  heroSummary: string
  description: string
  image: string
  tag?: string
  focusAreas: string
  sessionLength: string
  coordinator: string
}

export type SessionFormat = {
  id: SessionFormatId
  label: string
  description: string
}

export type BookingDay = {
  id: string
  weekday: string
  dateLabel: string
  fullLabel: string
}

export type BookingSlot = {
  id: string
  label: string
  windowLabel: string
}

const weekdayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'short' })
const monthDayFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
})
const fullDateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
})

function createDateId(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const careServices: CareService[] = [
  {
    id: 'individual',
    name: 'Individual Therapy',
    selectorLabel: 'For Myself',
    selectorSublabel: '1:1 therapy support',
    heroSummary: 'A calm, focused place to work through stress, burnout, anxiety, and life changes.',
    description:
      'Work through anxiety, depression, trauma, or life transitions one-on-one with a licensed therapist who truly listens.',
    image:
      'https://images.unsplash.com/photo-1573497491765-dccce02b29df?auto=format&fit=crop&w=800&q=80',
    tag: 'Most Popular',
    focusAreas: 'Stress, burnout, anxiety, life transitions',
    sessionLength: '50-minute sessions',
    coordinator: 'Matched with a therapist focused on your goals and pace.',
  },
  {
    id: 'family',
    name: 'Family Therapy',
    selectorLabel: 'For My Family',
    selectorSublabel: 'Support for households',
    heroSummary: 'Guided sessions that help everyone feel heard and reset healthier patterns together.',
    description:
      'Rebuild trust and communication within your family. Guided sessions that help every member feel heard.',
    image:
      'https://images.unsplash.com/photo-1609220136736-443140cffec6?auto=format&fit=crop&w=800&q=80',
    focusAreas: 'Conflict repair, parenting alignment, big transitions',
    sessionLength: '60-minute sessions',
    coordinator: 'A family-focused clinician who can hold multiple perspectives clearly.',
  },
  {
    id: 'couples',
    name: 'Couples Therapy',
    selectorLabel: 'For My Relationship',
    selectorSublabel: 'Partner sessions',
    heroSummary: 'Structured support for communication, repair, and building healthier shared habits.',
    description:
      'Reconnect with your partner through structured sessions focused on empathy, communication, and shared goals.',
    image:
      'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
    focusAreas: 'Communication, reconnection, conflict patterns',
    sessionLength: '60-minute sessions',
    coordinator: 'Matched with a therapist experienced in partner dynamics and repair.',
  },
  {
    id: 'physical',
    name: 'Physical Therapy',
    selectorLabel: 'For Recovery',
    selectorSublabel: 'Mobility and rehab',
    heroSummary: 'Evidence-based treatment for pain reduction, recovery, and getting back to daily movement.',
    description:
      'Evidence-based movement and recovery programs that restore function, reduce pain, and support long-term well-being.',
    image:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80',
    focusAreas: 'Pain management, mobility, post-injury recovery',
    sessionLength: '45-minute sessions',
    coordinator: 'A movement specialist who can balance recovery with your weekly routine.',
  },
]

export const sessionFormats: SessionFormat[] = [
  {
    id: 'virtual',
    label: 'Virtual',
    description: 'Secure video sessions from home, work, or wherever feels most comfortable.',
  },
  {
    id: 'in-person',
    label: 'In Person',
    description: 'Meet at our Manhattan studio for a more grounded, face-to-face experience.',
  },
  {
    id: 'flexible',
    label: 'Open to Either',
    description: 'We will match you to the fastest available option and adjust if needed.',
  },
]

export const bookingSlots: BookingSlot[] = [
  { id: '09:00', label: '9:00 AM', windowLabel: 'Morning' },
  { id: '11:30', label: '11:30 AM', windowLabel: 'Late Morning' },
  { id: '14:00', label: '2:00 PM', windowLabel: 'Afternoon' },
  { id: '17:30', label: '5:30 PM', windowLabel: 'Evening' },
]

export function getCareService(serviceId: string | null | undefined) {
  return careServices.find(({ id }) => id === serviceId) ?? careServices[0]
}

export function getSessionFormat(formatId: string | null | undefined) {
  return sessionFormats.find(({ id }) => id === formatId) ?? sessionFormats[0]
}

export function buildBookingDays(count = 5): BookingDay[] {
  const days: BookingDay[] = []
  const cursor = new Date()

  while (days.length < count) {
    cursor.setDate(cursor.getDate() + 1)

    if (cursor.getDay() === 0) {
      continue
    }

    const current = new Date(cursor)

    days.push({
      id: createDateId(current),
      weekday: weekdayFormatter.format(current),
      dateLabel: monthDayFormatter.format(current),
      fullLabel: fullDateFormatter.format(current),
    })
  }

  return days
}
