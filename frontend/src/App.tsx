import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import About from './pages/About'
import Contact from './pages/Contact'
import Dashboard2  from './pages/Dashboard copy'
import Login from './pages/Login'
import Signup from './pages/Signup'
import PlayGroundCheck from './pages/PlayGroundCheck'
import ProtectedRoute from './components/Protected_Routes'

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Landing />
          </ProtectedRoute>
        }
      />

      <Route
        path="/about"
        element={
          <ProtectedRoute>
            <About />
          </ProtectedRoute>
        }
      />

      <Route
        path="/contact"
        element={
          <ProtectedRoute>
            <Contact />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard2 />
          </ProtectedRoute>
        }
      />

      <Route
        path="/playground/:reportId"
        element={
          <ProtectedRoute>
            <PlayGroundCheck />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Landing />} />
    </Routes>
  </BrowserRouter>
)


export default App