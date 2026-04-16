import { ArrowRight, HeartPulse, Mountain } from 'lucide-react'
import { Link } from 'react-router-dom'
import { clarityCarePath, summitTrailPaths } from '@/lib/routes'

const apps = [
  {
    name: 'Clarity Care',
    description:
      'Healthcare landing experience focused on wellness programs, care pathways, and conversion sections.',
    path: clarityCarePath,
    icon: HeartPulse,
    eyebrow: 'Healthcare',
    image: '/images/health_clean.png',
  },
  {
    name: 'Summit Trail',
    description:
      'Outdoor commerce experience with catalog browsing, product detail, cart, and checkout flows.',
    path: summitTrailPaths.home,
    icon: Mountain,
    eyebrow: 'Outdoor retail',
    image: '/images/outdoor_clean.png',
  },
]

export default function AppHub() {
  return (
    <main className="min-h-screen bg-[#faf9f6]">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-20 sm:px-8 lg:px-10">
        <h1
          className="text-[3rem] font-bold tracking-tight text-neutral-900 mb-10"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Usecases
        </h1>

        <div className="grid gap-8 md:grid-cols-2">
          {apps.map(({ name, description, path, icon: Icon, eyebrow, image }) => (
            <Link
              key={name}
              to={path}
              className="group flex flex-col overflow-hidden rounded-[1.5rem] border border-neutral-200/60 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="h-56 w-full overflow-hidden bg-neutral-100 relative">
                <img 
                  src={image} 
                  alt={name} 
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
              </div>
              
              <div className="flex flex-1 flex-col p-8">
                <div className="flex items-center justify-between">
                  <div className="rounded-xl bg-neutral-100/80 p-3 text-neutral-700">
                    <Icon size={22} strokeWidth={1.5} />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">
                    {eyebrow}
                  </span>
                </div>
                
                <div className="mt-8 flex-1">
                  <h2
                    className="text-3xl font-bold tracking-tight text-neutral-900"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {name}
                  </h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">
                    {description}
                  </p>
                </div>
                
                <div className="mt-10 flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-neutral-900">
                  Open app
                  <ArrowRight
                    size={16}
                    strokeWidth={2}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
