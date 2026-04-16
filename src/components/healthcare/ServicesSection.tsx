import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button'
import { careServices } from '@/data/clarityCareBooking'
import { buildClarityCareBookCallPath } from '@/lib/routes'

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 lg:py-32 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end mb-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
              Our Services
            </p>
            <h2
              className="text-4xl lg:text-5xl font-bold leading-tight"
              style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}
            >
              Empowering you on<br className="hidden lg:block" /> the journey
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <p className="text-muted-foreground leading-relaxed flex-1">
              A full spectrum of therapy services — so wherever you are in life,
              there's a path forward with Clarity Care.
            </p>
            <Link
              to={buildClarityCareBookCallPath()}
              className={buttonVariants({
                variant: 'outline',
                className: 'shrink-0 self-start sm:self-auto',
              })}
            >
              Book a Consult
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Service cards — asymmetric grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {careServices.map(({ id, name, description, image, tag }, i) => (
            <Link
              key={id}
              to={buildClarityCareBookCallPath({ service: id })}
              className={`group relative rounded-2xl overflow-hidden block ${
                i === 0 ? 'sm:row-span-1 lg:row-span-1' : ''
              }`}
              style={{ aspectRatio: i === 0 ? '3/4' : '3/4' }}
            >
              {/* Photo */}
              <img
                src={image}
                alt={name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-[#0D1F38]/90 via-[#0D1F38]/30 to-transparent" />

              {/* Tag */}
              {tag && (
                <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full text-xs font-semibold bg-white text-[#0D1F38]">
                  {tag}
                </div>
              )}

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3
                  className="text-white font-semibold text-lg mb-1.5 leading-snug"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {name}
                </h3>
                <p className="text-white/70 text-xs leading-relaxed mb-4 line-clamp-2">
                  {description}
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-white/15 hover:bg-white/25 transition-colors px-3 py-1.5 rounded-full">
                  Learn more <ArrowRight size={11} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
