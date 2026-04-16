import { CheckCircle } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'

const points = [
  'Licensed and certified therapists with 12+ years combined experience',
  'Evidence-based approaches: CBT, DBT, EMDR, and mindfulness',
  'Confidential, judgment-free space for every individual and family',
]

export default function AboutSection() {
  return (
    <section id="about" className="py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="relative z-10 rounded-2xl overflow-hidden aspect-[4/3] shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1200&q=80"
                alt="Therapy session in a calm office setting"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative block */}
            <div className="absolute -bottom-5 -left-5 w-32 h-32 rounded-2xl bg-accent/30 z-0" />
            <div className="absolute -top-5 -right-5 w-20 h-20 rounded-xl bg-primary/10 z-0" />
          </div>

          {/* Text */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">
              About Clarity Care
            </p>
            <h2
              className="text-4xl lg:text-5xl font-bold leading-tight mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Dedicated to helping you lead a more fulfilling life
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              At Clarity Care, our licensed therapists combine deep empathy with
              evidence-based methods to support your mental and physical
              well-being. We believe that every person deserves access to
              compassionate, high-quality care in a safe and confidential
              environment.
            </p>
            <ul className="space-y-4 mb-10">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircle
                    size={20}
                    className="text-accent shrink-0 mt-0.5"
                  />
                  <span className="text-foreground">{point}</span>
                </li>
              ))}
            </ul>
            <a href="#contact" className={buttonVariants({ size: 'lg' })}>
              Start Your Journey
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
