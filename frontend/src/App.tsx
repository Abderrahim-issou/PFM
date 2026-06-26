import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import About from './pages/About'
import Contact from './pages/Contact'
import Dashboard2  from './pages/Dashboard copy'
import Login from './pages/Login'
import Signup from './pages/Signup'
import PlayGroundCheck from './pages/PlayGroundCheck'
import ProtectedRoute from './components/Protected_Routes'
import TrackingPage from "./pages/Tracking_Page";
import { Toaster } from "react-hot-toast";

const App = () => (
  <BrowserRouter>
  <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={10}
        toastOptions={{
          duration: 3500,

          style: {
            background: "rgba(8, 15, 12, 0.95)",
            color: "#ECFDF5",
            border: "1px solid rgba(16,185,129,.35)",
            borderRadius: "16px",
            backdropFilter: "blur(18px)",
            fontSize: "14px",
            padding: "14px 16px",
          },

          success: {
            iconTheme: {
              primary: "#10B981",
              secondary: "#fff",
            },
          },

          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: "#fff",
            },
          },
        }}
      />
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/tracking" element={<TrackingPage />} />


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