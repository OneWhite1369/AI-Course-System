import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/Layout'
import Home from '@/pages/Home'
import Courses from '@/pages/Courses'
import Adjust from '@/pages/Adjust'
import Makeup from '@/pages/Makeup'
import Income from '@/pages/Income'
import Settings from '@/pages/Settings'

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="courses" element={<Courses />} />
          <Route path="adjust" element={<Adjust />} />
          <Route path="makeup" element={<Makeup />} />
          <Route path="income" element={<Income />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
