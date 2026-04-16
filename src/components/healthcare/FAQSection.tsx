import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const faqs = [
  {
    question: 'What therapy approaches do you use (CBT, DBT, EMDR)?',
    answer:
      'Our therapists are trained in a range of evidence-based modalities including Cognitive Behavioral Therapy (CBT), Dialectical Behavior Therapy (DBT), Eye Movement Desensitization and Reprocessing (EMDR), and mindfulness-based approaches. Your therapist will recommend the most suitable approach based on your individual needs and goals.',
  },
  {
    question: 'How do I book my first appointment?',
    answer:
      'Simply click the "Request A Call" button on this page and fill in your contact details. One of our care coordinators will reach out within 24 hours to match you with the right therapist and schedule your first session at a time that works for you.',
  },
  {
    question: 'Is virtual therapy available?',
    answer:
      'Yes! We offer fully secure, HIPAA-compliant video therapy sessions for individuals, couples, and families. Virtual sessions are available on all our standard booking slots, including evenings and weekends, making care accessible wherever you are.',
  },
  {
    question: 'How confidential are my sessions?',
    answer:
      'Complete confidentiality is the foundation of everything we do. All sessions are protected under strict therapist-client confidentiality laws. Information is only shared in rare legal circumstances (e.g., imminent risk of harm). We will always explain your rights fully before your first session.',
  },
  {
    question: 'What does therapy cost, and do you accept insurance?',
    answer:
      'Session fees vary by therapist and session type. We provide a full fee schedule during your initial consultation. We accept most major insurance plans and also offer a sliding-scale fee structure for clients who qualify. Please contact us for specific pricing and insurance information.',
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-24 bg-secondary/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
            FAQ
          </p>
          <h2
            className="text-4xl lg:text-5xl font-bold"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Frequently asked questions
          </h2>
        </div>

        <div className="space-y-0 divide-y divide-border border border-border rounded-2xl overflow-hidden bg-card">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div key={index}>
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-secondary/40 transition-colors"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold pr-4">{faq.question}</span>
                  <ChevronDown
                    size={18}
                    className={cn(
                      'shrink-0 text-muted-foreground transition-transform duration-200',
                      isOpen && 'rotate-180'
                    )}
                  />
                </button>
                <div
                  className={cn(
                    'overflow-hidden transition-all duration-300',
                    isOpen ? 'max-h-96' : 'max-h-0'
                  )}
                >
                  <p className="px-6 pb-5 text-muted-foreground leading-relaxed text-sm">
                    {faq.answer}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
