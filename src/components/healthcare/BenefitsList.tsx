import { CheckCircle2 } from 'lucide-react'

const benefits = [
  {
    title: 'Holistic Approach',
    description:
      'We treat the whole person — integrating mental, emotional, and physical health for lasting well-being.',
  },
  {
    title: 'Confidential Space',
    description:
      'Your privacy is our priority. Every session is protected under strict confidentiality and ethical standards.',
  },
  {
    title: 'Personalized Care',
    description:
      'Treatment plans are built around your unique needs, history, and goals — never generic or one-size-fits-all.',
  },
  {
    title: 'Compassionate Professionals',
    description:
      'Our therapists lead with empathy and genuine care, creating a warm and supportive experience every time.',
  },
  {
    title: 'Flexible Scheduling',
    description:
      'Book in-person or virtual sessions at times that work for your lifestyle — evenings and weekends available.',
  },
]

export default function BenefitsList() {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative order-2 lg:order-1">
            <div className="rounded-2xl overflow-hidden aspect-[4/3] shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80"
                alt="Calm meditation and wellness practice"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl bg-primary/10 -z-0" />
          </div>

          {/* Benefits list */}
          <div className="order-1 lg:order-2">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">
              What We Offer
            </p>
            <h2
              className="text-4xl lg:text-5xl font-bold leading-tight mb-10"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Everything you need for true wellness
            </h2>
            <ul className="space-y-6">
              {benefits.map(({ title, description }) => (
                <li key={title} className="flex items-start gap-4">
                  <CheckCircle2
                    size={24}
                    className="text-accent shrink-0 mt-0.5"
                  />
                  <div>
                    <h4 className="font-semibold text-base mb-1">{title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
