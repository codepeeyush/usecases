const team = [
  {
    name: 'Dr. Sarah Mitchell',
    title: 'Licensed Clinical Psychologist',
    bio: 'Specializing in anxiety, trauma, and cognitive behavioral therapy with over 10 years of clinical experience.',
    image:
      'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Dr. James Okonkwo',
    title: 'Family & Couples Therapist',
    bio: 'Expert in relationship dynamics, communication skills, and evidence-based family systems therapy.',
    image:
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Dr. Emily Chen',
    title: 'Physical & Rehabilitation Therapist',
    bio: 'Combining movement science with mindfulness techniques to restore function and improve quality of life.',
    image:
      'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=600&q=80',
  },
]

export default function TeamSection() {
  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
            Our Team
          </p>
          <h2
            className="text-4xl lg:text-5xl font-bold"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Meet your care team
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {team.map(({ name, title, bio, image }) => (
            <div key={name} className="group text-center">
              {/* Photo */}
              <div className="relative mb-5 mx-auto w-full max-w-xs">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                </div>
              </div>
              <h3
                className="text-xl font-bold mb-1"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {name}
              </h3>
              <p className="text-primary font-medium text-sm mb-3">{title}</p>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
                {bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
