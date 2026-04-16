import { Navigate, Route, Routes } from 'react-router-dom'
import SummitTrailApp from '@/apps/SummitTrailApp'
import { clarityCarePath, summitTrailBasePath } from '@/lib/routes'
import HealthcarePage from '@/pages/HealthcarePage'
import AppHub from '@/pages/AppHub'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppHub />} />
      <Route path={clarityCarePath} element={<HealthcarePage />} />
      <Route path={`${summitTrailBasePath}/*`} element={<SummitTrailApp />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
