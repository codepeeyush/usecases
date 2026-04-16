import { Navigate, Route, Routes } from 'react-router-dom'
import SummitTrailApp from '@/apps/SummitTrailApp'
import { clarityCarePaths, summitTrailBasePath } from '@/lib/routes'
import ClarityCareBookCallPage from '@/pages/ClarityCareBookCallPage'
import HealthcarePage from '@/pages/HealthcarePage'
import AppHub from '@/pages/AppHub'
import AppSwitcher from '@/components/AppSwitcher'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<AppHub />} />
        <Route path={clarityCarePaths.home} element={<HealthcarePage />} />
        <Route path={clarityCarePaths.bookCall} element={<ClarityCareBookCallPage />} />
        <Route path={`${summitTrailBasePath}/*`} element={<SummitTrailApp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <AppSwitcher />
    </>
  )
}
