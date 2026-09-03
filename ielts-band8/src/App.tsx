import type { ReactNode } from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { useApp } from './context/AppContext'
import { Dashboard } from './pages/Dashboard'
import { Mocks, MockRun } from './pages/Mocks'
import { Onboarding } from './pages/Onboarding'
import { Plan } from './pages/Plan'
import { Practice } from './pages/Practice'
import { Progress } from './pages/Progress'
import { Resources } from './pages/Resources'
import { Skills } from './pages/Skills'
import { Topics } from './pages/Topics'
import { Vocabulary } from './pages/Vocabulary'
import { Write } from './pages/Write'
import { ExamReport, FullExam, FullExamGate } from './pages/FullExam'

function Gate({ children }: { children?: ReactNode }) {
  const { profile } = useApp()
  if (!profile) return <Navigate to="/onboard" replace />
  return children ?? <Outlet />
}

export default function App() {
  return (
    <Routes>
      <Route path="/onboard" element={<Onboarding />} />
      <Route
        element={
          <Gate>
            <Layout />
          </Gate>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/plan" element={<Plan />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/write" element={<Write />} />
        <Route path="/practice/:id" element={<Practice />} />
        <Route path="/topics" element={<Topics />} />
        <Route path="/vocab" element={<Vocabulary />} />
        <Route path="/mocks" element={<Mocks />} />
        <Route path="/run/:mockId" element={<MockRun />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/resources" element={<Resources />} />
      </Route>
      <Route element={<Gate />}>
        <Route path="/exam/fresh" element={<FullExamGate />} />
        <Route path="/exam/:examId" element={<FullExam />} />
        <Route path="/exam/:examId/report" element={<ExamReport />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
