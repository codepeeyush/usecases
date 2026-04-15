import { Phone, Mail, MapPin, ArrowRight, CalendarCheck } from 'lucide-react'

const contactInfo = [
  { icon: Phone, label: '+1 (800) 555-0199', sub: 'Mon–Fri, 8am–8pm' },
  { icon: Mail, label: 'hello@claritycare.com', sub: 'Response within 2 hours' },
  { icon: MapPin, label: '123 Wellness Ave, NY 10001', sub: 'Virtual sessions available' },
]

export default function ContactSection() {
  return (
    <section id="contact" className="py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left: copy + contact details */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">
              Get In Touch
            </p>
            <h2
              className="text-4xl lg:text-5xl font-bold leading-tight mb-6"
              style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}
            >
              Let's talk about what you need
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-md">
              No pressure, no commitment. Just a friendly conversation with one of our
              care coordinators to find the right fit for you.
            </p>

            {/* Contact details */}
            <div className="space-y-5 mb-10">
              {contactInfo.map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={17} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Next-appointment CTA */}
            <div
              className="flex items-center gap-3 rounded-xl px-5 py-4 border border-border"
              style={{ background: 'var(--secondary)' }}
            >
              <CalendarCheck size={20} className="text-primary shrink-0" />
              <p className="text-sm text-muted-foreground flex-1">
                First appointment available <span className="text-foreground font-semibold">tomorrow</span>
              </p>
            </div>
          </div>

          {/* Right: form */}
          <div className="rounded-2xl border border-border p-8 lg:p-10 shadow-sm" style={{ background: 'var(--card)' }}>
            <h3 className="text-xl font-semibold mb-6">Request a free call</h3>
            <form
              className="space-y-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5" htmlFor="firstName">
                    First name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    placeholder="Sarah"
                    className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow placeholder:text-muted-foreground/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5" htmlFor="lastName">
                    Last name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Thompson"
                    className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow placeholder:text-muted-foreground/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5" htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="sarah@example.com"
                  className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow placeholder:text-muted-foreground/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5" htmlFor="serviceType">
                  What are you looking for?
                </label>
                <select
                  id="serviceType"
                  className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow text-foreground"
                >
                  <option value="">Select a service…</option>
                  <option>Individual Therapy</option>
                  <option>Couples Therapy</option>
                  <option>Family Therapy</option>
                  <option>Physical Therapy</option>
                  <option>Not sure yet</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5" htmlFor="message">
                  Anything you'd like us to know? <span className="text-muted-foreground/50">(optional)</span>
                </label>
                <textarea
                  id="message"
                  rows={3}
                  placeholder="Brief note about what's going on…"
                  className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow resize-none placeholder:text-muted-foreground/50"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl text-sm transition-all duration-150 hover:opacity-90 active:scale-[0.98]"
              >
                Request My Free Call
                <ArrowRight size={15} />
              </button>

              <p className="text-center text-xs text-muted-foreground">
                We'll reach out within 24 hours. No spam, ever.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
