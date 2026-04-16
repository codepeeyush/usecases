import { Link, useLocation } from 'react-router-dom'
import { clarityCareBasePath, summitTrailBasePath } from '@/lib/routes'
import { HeartPulse, Mountain, LayoutGrid } from 'lucide-react'

export default function AppSwitcher() {
  const location = useLocation()
  
  // Don't show the switcher on the main AppHub page
  if (location.pathname === '/') return null;

  const isClarityCare = location.pathname.startsWith(clarityCareBasePath);
  const isSummitTrail = location.pathname.startsWith(summitTrailBasePath);

  return (
    <div className="group fixed bottom-6 left-6 z-[9999] flex items-center rounded-full border border-neutral-200/60 bg-white/90 p-1.5 shadow-xl backdrop-blur-md transition-all duration-300">
      <Link
        to="/"
        className="flex shrink-0 items-center justify-center rounded-full p-2.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        title="Usecases Hub"
      >
        <LayoutGrid size={18} strokeWidth={2} />
      </Link>
      
      <div className="flex max-w-0 items-center overflow-hidden opacity-0 transition-all duration-300 ease-in-out group-hover:max-w-[500px] group-hover:opacity-100">
        <div className="mx-1.5 h-6 w-[1px] shrink-0 bg-neutral-200" />

        <div className="flex items-center gap-1">
          <Link
            to={clarityCareBasePath}
            className={`flex whitespace-nowrap items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              isClarityCare 
                ? 'bg-neutral-900 text-white shadow-md' 
                : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
            }`}
          >
            <HeartPulse size={16} strokeWidth={2} />
            Clarity Care
          </Link>

          <Link
            to={summitTrailBasePath}
            className={`flex whitespace-nowrap items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              isSummitTrail
                ? 'bg-neutral-900 text-white shadow-md'
                : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
            }`}
          >
            <Mountain size={16} strokeWidth={2} />
            Summit Trail
          </Link>
        </div>
      </div>
    </div>
  )
}
