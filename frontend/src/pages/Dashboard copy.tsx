import { useState, useMemo, useEffect } from 'react'
import TopBar from '../components/TopBar'
import { process_image } from '../api/api'
import useAuth from '../hooks/useAuth'
import {
  mapBackendReportToDashboard,
  mapBackendHistoryToDashboard,
  getInitials,
} from '../utils/dashboardUtils'
import {
  getMyProfile,
  updateMyProfile,
  getDiagnosticHistory,
  getDiagnosticReportById,
  getAnalyticsOverview } from "../api/api";
import type { AnalyticsOverview  } from "../types/Global";

import type {
  DiagnosticHistoryItem,
  DiagnosticReport
} from "../types/Global";
import { useNavigate } from 'react-router-dom'
import DiagnosisLoadingPopup from '../components/DiagnosisLoadingPopup'

const cropDatabase: Record<string, DiagnosticReport> = {
  tomato_blight: {
    plant: 'Tomato',
    disease: 'Late Blight (Phytophthora)',
    confidence: 98.4,
    severity: 'High',
    description: 'Late blight is caused by the oomycete Phytophthora infestans. It appears as greasy blackish-brown lesions on leaves that rapidly enlarge during high humidity, eventually rotting the foliage and stems.',
    organicCure: 'Apply organic copper-based liquid sprays. Promptly prune lower foliage to maximize air circulation. Avoid overhead watering and remove heavily infected stems.',
    chemicalCure: 'Apply Chlorothalonil or Mancozeb protective sprays at the first warning sign. Maintain a 7-10 day cycle in wet, warm spring weather.',
    prevention: 'Ensure proper greenhouse ventilation. Practice rigid crop rotation. Plant disease-resistant cultivars and space seedlings at least 24 inches apart.',
    date: 'May 24, 2026',
    image: 'tomato_blight'
  },
  grape_rot: {
    plant: 'Grape',
    disease: 'Black Rot (Guignardia)',
    confidence: 91.2,
    severity: 'Medium',
    description: 'Black rot is a severe fungal pathogen. It produces reddish-brown circular spots on the leaf blade which gradually develop tiny black fruiting bodies, eventually shriveling berries into hard black mummies.',
    organicCure: 'Spray vines thoroughly with liquid copper or sulfur compounds. Remove and burn shriveled grape clusters and fallen leaf litter from the vineyard floor.',
    chemicalCure: 'Apply systemic Myclobutanil or protective Mancozeb prior to bloom. Maintain coverage during active warm, humid cycles.',
    prevention: 'Prune vines heavily to promote sunlight exposure and wind drying. Keep grasses mowed beneath vines to reduce humidity thresholds.',
    date: 'May 23, 2026',
    image: 'grape_rot'
  },
  potato_blight: {
    plant: 'Potato',
    disease: 'Early Blight (Alternaria)',
    confidence: 87.5,
    severity: 'Medium',
    description: 'Early blight is caused by the fungus Alternaria solani. It manifests as distinctive target-like dark concentric rings on mature lower foliage, gradually spreading upwards and stressing the plant.',
    organicCure: 'Enrich soil with organic compost tea to build bio-resistance. Mulch heavily around stems to prevent fungal spores from splashing up from the soil during rains.',
    chemicalCure: 'Apply systemic Azoxystrobin or protective Chlorothalonil sprays. Ensure consistent nitrogen levels to keep plant stress low.',
    prevention: 'Clean and sanitize all harvesting equipment. Avoid planting tomatoes and potatoes in adjacent plots. Deep-plow crop residues at the season end.',
    date: 'May 22, 2026',
    image: 'potato_blight'
  },
  healthy_leaf: {
    plant: 'Bell Pepper',
    disease: 'Healthy (No disease)',
    confidence: 99.1,
    severity: 'Low',
    description: 'The leaf exhibits excellent chlorophyll density, uniform vein structure, fully intact margins, and absolutely zero pathogenic spot lesions or chlorotic boundaries.',
    organicCure: 'No major fungicides needed. Apply organic cold-pressed neem oil monthly as a natural insect repellent and foliage clean-up.',
    chemicalCure: 'No chemical fungicides or bactericides required. Maintain baseline N-P-K mineral levels to sustain vegetative growth.',
    prevention: 'Maintain consistent drip irrigation. Perform weekly leaf underside inspection for early insect or egg cluster outbreaks.',
    date: 'May 24, 2026',
    image: 'healthy_leaf'
  }
}



const Dashboard2 = () => {
  const {access_token, user} = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'scanner' | 'analytics' | 'history' | 'profile' | 'tracking'>('scanner')
  const [reportTab, setReportTab] = useState<'desc' | 'organic' | 'chemical' | 'prevent'>('desc')
  // Simulated State variables
  const [scanning, setScanning] = useState(false)
  const [scanStep, setScanStep] = useState(0)
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [customFile, setCustomFile] = useState<File | null>(null)

  // Loaded Diagnostic Report
  const [currentReport, setCurrentReport] = useState<DiagnosticReport | null>(cropDatabase.tomato_blight)

  // Search state for history
  const [searchQuery, setSearchQuery] = useState('')
  const [historyItems, setHistoryItems] = useState<DiagnosticHistoryItem[]>([])

  // Researcher Profile state
  const [userEmail, setUserEmail] = useState('')
  const [researcherName, setResearcherName] = useState('Dr. Green Patel')
  const [farmLocation, setFarmLocation] = useState('Biotech Science Park, Switzerland')
  const [cropFocus, setCropFocus] = useState('Nightshade Family (Tomato, Potato)')
  const [avatarInitials, setAvatarInitials] = useState('GP')
  


  // analytics 
  const [analyticsOverview, setAnalyticsOverview] =
  useState<AnalyticsOverview | null>(null);



const loadMyProfile = async () => {
  if (!access_token) return

  try {
    const response = await getMyProfile(access_token)
    const user = response.data

    const fullName = `${user.first_name} ${user.last_name}`.trim()

    setResearcherName(fullName)
    setUserEmail(user.email)
    setAvatarInitials(getInitials(user.first_name, user.last_name))
  } catch (error) {
    console.error('Failed to load profile:', error)
  }
}

const loadDiagnosticHistory = async () => {
  if (!access_token) return

  try {
    const response = await getDiagnosticHistory(access_token)
    const mappedHistory = response.data.map(mapBackendHistoryToDashboard)
    setHistoryItems(mappedHistory)
  } catch (error) {
    console.error('Failed to load diagnostic history:', error)
  }
}

const loadAnalyticsOverview = async () => {
  if (!access_token) return;

  try {
    const response = await getAnalyticsOverview(access_token);
    setAnalyticsOverview(response.data);
  } catch (error) {
    console.error("Failed to load analytics overview:", error);
  }
};

useEffect(() => {
  if (activeTab === "analytics") {
    loadAnalyticsOverview();
  }
}, [activeTab, access_token]);
useEffect(() => {
  if (activeTab === 'profile') {
    loadMyProfile()
  }
}, [activeTab, access_token])

useEffect(() => {
  if (activeTab === 'history') {
    loadDiagnosticHistory()
  }
}, [activeTab, access_token])

const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files || !e.target.files[0]) return

  const file = e.target.files[0]

  setCustomFile(file)
  setSelectedPreset(null)
  setPreviewUrl(URL.createObjectURL(file))
  setScanning(true)
  setScanStep(0)

  if (!access_token) {
    console.log('No access token')
    setScanning(false)
    return
  }

  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await process_image(formData, access_token)

    if (!response?.data) {
      console.log('Process failed')
      return
    }

    const dashboardReport = mapBackendReportToDashboard(response.data)
    setCurrentReport(dashboardReport)

    setHistoryItems(prev => [
      {
        id: response.data.id,
        plant: dashboardReport.plant,
        disease: dashboardReport.disease,
        confidence: dashboardReport.confidence,
        severity: dashboardReport.severity,
        date: dashboardReport.date,
      },
    ...prev,
  ])
  } catch (error) {
    console.error('Failed to process image:', error)
  } finally {
    setScanning(false)
  }
}


  // Greeting helper
  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }, [])

  // Live log compiler during model sweep
  const scanLogs = [
    'Initializing camera tensor conversion...',
    'Resizing file boundaries to 224x224x3...',
    'Isolating cell boundaries & pigment variances...',
    'Triggering ResNet50 deep convolutional network...',
    'Extracting necrotic spot coordinates...',
    'Calculating softmax diagnostic values...'
  ]

  useEffect(() => {
    if (scanning) {
      const interval = setInterval(() => {
        setScanStep((prev) => {
          if (prev >= scanLogs.length - 1) {
            clearInterval(interval)
            return prev
          }
          return prev + 1
        })
      }, 300)

      return () => clearInterval(interval)
    }
  }, [scanning])

  // Trigger diagnostic simulation
  const handlePresetSelect = (presetKey: string) => {
    setSelectedPreset(presetKey)
    setCustomFile(null)
    setScanning(true)
    setScanStep(0)

    // Set simulated image previews
    if (presetKey === 'tomato_blight') setPreviewUrl('tomato')
    else if (presetKey === 'grape_rot') setPreviewUrl('grape')
    else if (presetKey === 'potato_blight') setPreviewUrl('potato')
    else setPreviewUrl('pepper')

    setTimeout(() => {
      setScanning(false)
      const report = cropDatabase[presetKey]
      setCurrentReport(report)

      // Add to history list dynamically
      setHistoryItems(prev => [
        {
          id: '',
          plant: report.plant,
          disease: report.disease,
          confidence: report.confidence,
          severity: report.severity,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        },
        ...prev
      ])
    }, 2000)
  }



  const handleRecallReport = async (item: DiagnosticHistoryItem) => {
  if (!access_token) return

  try {
    const response = await getDiagnosticReportById(Number(item.id), access_token)

    const dashboardReport = mapBackendReportToDashboard(response.data)

    setCurrentReport(dashboardReport)
    setPreviewUrl('custom_upload')
    setActiveTab('scanner')
  } catch (error) {
    console.error('Failed to recall diagnostic report:', error)
  }
}

  // Filter history
  const filteredHistory = useMemo(() => {
    return historyItems.filter(
      item =>
        item.plant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.disease.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery, historyItems])

  // Save settings profile
 const handleProfileSave = async (e: React.FormEvent) => {
  e.preventDefault()

  if (!access_token) return

  const parts = researcherName.trim().split(' ')

  const firstName = parts[0] || ''
  const lastName = parts.slice(1).join(' ') || ''

  try {
    const response = await updateMyProfile(
      {
        first_name: firstName,
        last_name: lastName,
      },
      access_token
    )

    const user = response.data
    const fullName = `${user.first_name} ${user.last_name}`.trim()

    setResearcherName(fullName)
    setUserEmail(user.email)
    setAvatarInitials(getInitials(user.first_name, user.last_name))

    alert('Profile settings saved successfully!')
  } catch (error) {
    console.error('Failed to update profile:', error)
  }
}


const analyticsStats = useMemo(() => {
  return {
    total: analyticsOverview?.total_reports ?? 0,
    averageConfidence: analyticsOverview?.average_confidence?.toFixed(1) ?? "0.0",
    highRiskCount: analyticsOverview?.high_risk_count ?? 0,
    mediumRiskCount: analyticsOverview?.medium_risk_count ?? 0,
    lowRiskCount: analyticsOverview?.low_risk_count ?? 0,
  };
}, [analyticsOverview]);


const monthlyChartStats = useMemo(() => {
  return (
    analyticsOverview?.monthly_stats.map(item => ({
      month: item.month,
      healthyScore: item.healthy_score,
      outbreakScore: item.outbreak_score,
    })) ?? []
  );
}, [analyticsOverview]);

const buildChartPath = (
  data: typeof monthlyChartStats,
  key: 'healthyScore' | 'outbreakScore'
) => {
  if (data.length === 0) return ''

  return data
    .map((item, index) => {
      const x = 50 + index * 80
      const y = 170 - (item[key] / 100) * 150

      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ')
}

const healthyPath = useMemo(() => {
  return buildChartPath(monthlyChartStats, 'healthyScore')
}, [monthlyChartStats])

const outbreakPath = useMemo(() => {
  return buildChartPath(monthlyChartStats, 'outbreakScore')
}, [monthlyChartStats])



  return (
    <div className="shell">
     <DiagnosisLoadingPopup open={scanning} />
      <div className="cyber-grid"></div>
      <TopBar showLogout />

      <main className="dashboard" style={{ position: 'relative', zIndex: 10 }}>
        {/* DASHBOARD HEADER */}
        <header className="dashboard__header glass-card">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span className="eyebrow">AgroAI Workspace Console</span>
            <h2>{greeting}, Dr. {`${user?.first_name} ${user?.last_name}`}.</h2>
            <p>Monitor pathogen risks, catalog scanned leaves, and execute remedy protocols.</p>
          </div>
          <div className="profile">
            <div style={{ textAlign: 'right' }}>
              <p className="profile__name"> Dr. {`${user?.first_name} ${user?.last_name}`}</p>
              <p className="profile__role">{cropFocus}</p>
            </div>
            <div className="avatar">{getInitials(user?.first_name ?? "I", user?.last_name ?? "A")}</div>
          </div>
        </header>

        {/* WORKSPACE NAVIGATION TABS */}
        <div className="dash-tabs">
          <button
            className={`dash-tab-btn ${activeTab === 'scanner' ? 'active' : ''}`}
            onClick={() => setActiveTab('scanner')}
            type="button"
          >
            🌱 AI Leaf Scanner
          </button>
          <button
            className={`dash-tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
            type="button"
          >
            📊 Analytics & Charts
          </button>
          <button
            className={`dash-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
            type="button"
          >
            ⏱ Diagnostic Log ({historyItems.length})
          </button>
          <button
            className={`dash-tab-btn ${activeTab === 'tracking' ? 'active' : ''}`}
            onClick={() => setActiveTab('tracking')}
            type="button"
          >
            👁️ Tracking
          </button>
          <button
            className={`dash-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
            type="button"
          >
            ⚙ Settings & Profile
          </button>
        </div>

        {/* TAB 1: SCANNER WORKSPACE */}
        {activeTab === 'scanner' && (
          <section className="dashboard__grid">
            {/* SCANNING WORKSPACE COLUMN */}
            <div className="glass-card upload-card animate-fade-in">
              <div>
                <h3 style={{ marginBottom: '6px' }}>Upload Crop Leaf</h3>
                <p>Select one of our preset infected leaves to simulate AI analysis instantly, or drop your own plant leaf file.</p>
              </div>

              {/* MOCK SAMPLES SELECTOR */}
              <div className="presets-container">
                <span className="preset-title">🌾 Select Interactive Sample Preset:</span>
                <div className="preset-grid">
                  <button
                    className={`preset-btn ${selectedPreset === 'tomato_blight' ? 'active' : ''}`}
                    onClick={() => handlePresetSelect('tomato_blight')}
                    type="button"
                  >
                    Tomato Late Blight
                  </button>
                  <button
                    className={`preset-btn ${selectedPreset === 'grape_rot' ? 'active' : ''}`}
                    onClick={() => handlePresetSelect('grape_rot')}
                    type="button"
                  >
                    Grape Black Rot
                  </button>
                  <button
                    className={`preset-btn ${selectedPreset === 'potato_blight' ? 'active' : ''}`}
                    onClick={() => handlePresetSelect('potato_blight')}
                    type="button"
                  >
                    Potato Early Blight
                  </button>
                  <button
                    className={`preset-btn ${selectedPreset === 'healthy_leaf' ? 'active' : ''}`}
                    onClick={() => handlePresetSelect('healthy_leaf')}
                    type="button"
                  >
                    Healthy Leaf
                  </button>
                </div>
              </div>

              {/* DROPZONE */}
              <div
                className="dropzone"
                onClick={() => document.getElementById('leaf-file-input')?.click()}
              >
                <input
                  id="leaf-file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <span className="dropzone__icon">
                  <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                  </svg>
                </span>
                <p style={{ fontWeight: '600', color: 'var(--text)' }}>Drag and drop leaf image here</p>
                <span className="hint">Or click to browse storage (PNG, JPG up to 10MB)</span>
              </div>

              {/* IMAGE PREVIEW */}
              {previewUrl && (
                <div className="preview-container">
                  <span className="preview-title">
                    <span>Selected Foliage Preview:</span>
                    {selectedPreset && <span style={{ color: 'var(--primary)', fontSize: '12px' }}>Preset: {selectedPreset}</span>}
                  </span>
                  <div className="preview">
                    {/* Simulated laser scan overlay */}
                    {scanning && (
                      <div className="scanner-overlay">
                        <div className="scan-laser"></div>
                        <div className="scanning-spinner"></div>
                        <div className="scanning-log">
                          [MODEL_RUNNING] &gt; {scanLogs[scanStep]}
                        </div>
                      </div>
                    )}

                    <div className="preview__image-wrapper">
                      {previewUrl === 'tomato' ? (
                        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #f87171, #b91c1c)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '11px', textAlign: 'center', padding: '4px' }}>Tomato Blight Leaf</div>
                      ) : previewUrl === 'grape' ? (
                        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #c084fc, #6b21a8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '11px', textAlign: 'center', padding: '4px' }}>Grape Rot Leaf</div>
                      ) : previewUrl === 'potato' ? (
                        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #fbbf24, #92400e)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '11px', textAlign: 'center', padding: '4px' }}>Potato Blight Leaf</div>
                      ) : previewUrl === 'pepper' ? (
                        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #34d399, #065f46)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '11px', textAlign: 'center', padding: '4px' }}>Healthy Pepper Leaf</div>
                      ) : (
                        <img src={previewUrl} className="preview__image" alt="Leaf uploaded" />
                      )}
                    </div>
                    <div>
                      <p className="value" style={{ fontSize: '15px' }}>
                        {selectedPreset ? selectedPreset.replace('_', ' ').toUpperCase() : customFile ? customFile.name : 'Custom leaf upload'}
                      </p>
                      <p className="hint">Foliage bounds parsed successfully.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* DIAGNOSTIC RESULT PANEL */}
            <div className="glass-card result-card animate-fade-in">
              {currentReport ? (
                <>
                  <div className="result-header">
                    <div>
                      <h3 style={{ marginBottom: '4px' }}>AI Diagnostic Findings</h3>
                      <p style={{ fontSize: '13px' }}>Classified: {currentReport.date}</p>
                    </div>
                    <span className={`pill ${currentReport.severity === 'High' ? 'danger' : currentReport.severity === 'Medium' ? 'warning' : 'success'}`}>
                      Severity: {currentReport.severity}
                    </span>
                  </div>

                  {/* INFO GRID */}
                  <div className="result-main-grid">
                    <div>
                      <span className="label">Classified Plant</span>
                      <p className="value">{currentReport.plant}</p>
                    </div>
                    <div>
                      <span className="label">Diagnosed Disease</span>
                      <p className="value">{currentReport.disease}</p>
                    </div>
                  </div>

                  {/* DYNAMIC CONFIDENCE CIRCULAR GAUGE */}
                  <div className="accuracy-visual-container">
                    <svg className="gauge-svg" viewBox="0 0 60 60">
                      <circle className="gauge-bg" cx="30" cy="30" r="27" />
                      <circle
                        className="gauge-fill"
                        cx="30"
                        cy="30"
                        r="27"
                        strokeDashoffset={170 - (170 * currentReport.confidence) / 100}
                      />
                      <text className="gauge-percent" x="30" y="35" textAnchor="middle" fill="var(--text)" transform="rotate(90 30 30)" style={{ fontSize: '11px', fontWeight: 800 }}>
                        {currentReport.confidence}%
                      </text>
                    </svg>
                    <div>
                      <span className="label">Classifier Confidence</span>
                      <p style={{ fontSize: '14px', color: 'var(--text)', fontWeight: '700' }}>Efficientnet Softmax Match</p>
                      <p style={{ fontSize: '11px', color: 'var(--muted)' }}>Weight validation checks cleared.</p>
                    </div>
                  </div>
                  <div
                        style={{
                          marginTop: '18px',
                          display: 'flex',
                          justifyContent: 'center',
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => navigate(`/playground/${currentReport.id}`)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                          
                            padding: '12px 18px',
                          
                            borderRadius: '14px',
                            border: '1px solid rgba(34, 197, 94, 0.35)',
                          
                            background:
                              'linear-gradient(135deg, rgba(34,197,94,0.18), rgba(16,185,129,0.08))',
                          
                            color: 'var(--text)',
                          
                            fontWeight: 700,
                            fontSize: '14px',
                          
                            cursor: 'pointer',
                          
                            transition: 'all .25s ease',
                          
                            boxShadow:
                              '0 10px 30px rgba(34,197,94,0.15)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow =
                              '0 15px 40px rgba(34,197,94,0.25)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow =
                              '0 10px 30px rgba(34,197,94,0.15)';
                          }}
                        >
                          🔬
                        
                          <span>
                            Explore Detected Regions
                          </span>
                        
                          <span
                            style={{
                              color: 'var(--primary)',
                              fontSize: '18px',
                              lineHeight: 1,
                            }}
                          >
                            →
                          </span>
                        </button>
                      </div>

                  {/* REPORT NAVIGATION TABS */}
                  <div className="result-tabs">
                    <button
                      className={`result-tab-trigger ${reportTab === 'desc' ? 'active' : ''}`}
                      onClick={() => setReportTab('desc')}
                      type="button"
                    >
                      Description
                    </button>
                    <button
                      className={`result-tab-trigger ${reportTab === 'organic' ? 'active' : ''}`}
                      onClick={() => setReportTab('organic')}
                      type="button"
                    >
                      Organic Cure
                    </button>
                    <button
                      className={`result-tab-trigger ${reportTab === 'chemical' ? 'active' : ''}`}
                      onClick={() => setReportTab('chemical')}
                      type="button"
                    >
                      Chemical Cure
                    </button>
                    <button
                      className={`result-tab-trigger ${reportTab === 'prevent' ? 'active' : ''}`}
                      onClick={() => setReportTab('prevent')}
                      type="button"
                    >
                      Prevention
                    </button>
                  </div>

                  {/* REPORT TAB DETAILS */}
                  <div className="result-tab-content">
                    {reportTab === 'desc' && <p>{currentReport.description}</p>}
                    {reportTab === 'organic' && (
                      <div>
                        <strong style={{ color: 'var(--primary)', display: 'block', marginBottom: '4px' }}>Biological & Mechanical:</strong>
                        <p>{currentReport.organicCure}</p>
                      </div>
                    )}
                    {reportTab === 'chemical' && (
                      <div>
                        <strong style={{ color: 'var(--secondary)', display: 'block', marginBottom: '4px' }}>Systemic & Protective sprays:</strong>
                        <p>{currentReport.chemicalCure}</p>
                      </div>
                    )}
                    {reportTab === 'prevent' && <p>{currentReport.prevention}</p>}
                  </div>
                </>
              ) : (
                <div className="result-placeholder">
                  <span className="result-placeholder-icon">🌱</span>
                  <h3>Awaiting Scan</h3>
                  <p style={{ maxWidth: '320px', fontSize: '13px' }}>Select an interactive crop preset on the left, or upload a custom leaf image to trigger live AI scanner models.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* TAB 2: ANALYTICS & CHARTS */}
        
        {activeTab === 'analytics' && (
  <section className="dashboard animate-fade-in">
    <div className="analytics-grid">
      <div className="glass-card analytics-stat-card">
        <span className="label">Diagnostics Catalogued</span>
        <div className="analytics-stat-flex">
          <h2 style={{ fontSize: '32px' }}>{analyticsStats.total}</h2>
          <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '13px' }}>
            Total saved scans
          </span>
        </div>
      </div>

      <div className="glass-card analytics-stat-card">
        <span className="label">Average Confidence</span>
        <div className="analytics-stat-flex">
          <h2 style={{ fontSize: '32px' }}>{analyticsStats.averageConfidence}%</h2>
          <span style={{ color: 'var(--secondary)', fontWeight: 'bold', fontSize: '13px' }}>
            Model certainty
          </span>
        </div>
      </div>

      <div className="glass-card analytics-stat-card">
        <span className="label">High Risk Reports</span>
        <div className="analytics-stat-flex">
          <h2 style={{ fontSize: '32px' }}>{analyticsStats.highRiskCount}</h2>
          <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '13px' }}>
            {analyticsStats.mediumRiskCount} medium / {analyticsStats.lowRiskCount} low
          </span>
        </div>
      </div>
    </div>

    <div className="glass-card chart-card">
      <h3 style={{ marginBottom: '14px' }}>
        2026 Monthly Diagnostic Overview
      </h3>

      <p style={{ fontSize: '13px', marginBottom: '20px' }}>
        Based on your saved diagnostic reports. Healthy score measures healthy scans;
        outbreak score measures high-risk detections.
      </p>

      <div className="line-chart-svg">
        <svg viewBox="0 0 500 200" width="100%" height="100%">
          <line x1="50" y1="20" x2="450" y2="20" stroke="rgba(16, 185, 129, 0.08)" strokeDasharray="4" />
          <line x1="50" y1="70" x2="450" y2="70" stroke="rgba(16, 185, 129, 0.08)" strokeDasharray="4" />
          <line x1="50" y1="120" x2="450" y2="120" stroke="rgba(16, 185, 129, 0.08)" strokeDasharray="4" />
          <line x1="50" y1="170" x2="450" y2="170" stroke="rgba(16, 185, 129, 0.15)" />

          <path
            d={healthyPath}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          <path
            d={outbreakPath}
            fill="none"
            stroke="var(--secondary)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="4 2"
          />

          {monthlyChartStats.map((item, index) => {
            const x = 50 + index * 80
            const y = 170 - (item.healthyScore / 100) * 150

            return (
              <circle
                key={`healthy-${item.month}`}
                cx={x}
                cy={y}
                r="5"
                fill="var(--primary)"
              />
            )
          })}

          {monthlyChartStats.map((item, index) => {
            const x = 50 + index * 80
            const y = 170 - (item.outbreakScore / 100) * 150

            return (
              <circle
                key={`outbreak-${item.month}`}
                cx={x}
                cy={y}
                r="4"
                fill="var(--secondary)"
              />
            )
          })}

          {monthlyChartStats.map((item, index) => {
            const x = 50 + index * 80

            return (
              <text
                key={item.month}
                x={x}
                y="190"
                fill="var(--muted)"
                fontSize="10"
                textAnchor="middle"
              >
                {item.month}
              </text>
            )
          })}

          <text x="40" y="24" fill="var(--muted)" fontSize="10" textAnchor="end">100%</text>
          <text x="40" y="74" fill="var(--muted)" fontSize="10" textAnchor="end">50%</text>
          <text x="40" y="124" fill="var(--muted)" fontSize="10" textAnchor="end">25%</text>
          <text x="40" y="174" fill="var(--muted)" fontSize="10" textAnchor="end">0%</text>
        </svg>
      </div>

      <div className="chart-legend">
        <div className="legend-item">
          <span className="legend-color" style={{ background: 'var(--primary)' }} />
          <span style={{ color: 'var(--text)' }}>Healthy Scan Score</span>
        </div>

        <div className="legend-item">
          <span className="legend-color" style={{ background: 'var(--secondary)' }} />
          <span style={{ color: 'var(--text)' }}>High-Risk Outbreak Score</span>
        </div>
      </div>
    </div>
  </section>
)}

        {/* TAB 3: DIAGNOSTIC LOG (HISTORY LIST) */}
        {activeTab === 'history' && (
          <section className="glass-card history-card animate-fade-in">
            <div className="history-header">
              <div>
                <h3 style={{ marginBottom: '4px' }}>Historic Prediction Log</h3>
                <p>Track all previous neural net scans, classification dates, and precision percentages.</p>
              </div>
              <div className="search-bar">
                {/* Search SVG icon */}
                <svg fill="none" height="14" stroke="var(--muted)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="14">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  type="text"
                  placeholder="Search plant or disease..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="history-list">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className="history-item"
                    onClick={() => handleRecallReport(item)}
                    title="Click to recall report inside diagnostic scanner"
                  >
                    <div className="history-info">
                      <h5>{item.plant}</h5>
                      <p style={{ fontSize: '11px', color: 'var(--muted)' }}>Foliage Subject</p>
                    </div>
                    <div>
                      <p className="value" style={{ fontSize: '15px' }}>{item.disease}</p>
                      <p style={{ fontSize: '11px', color: 'var(--muted)' }}>Diagnostic finding</p>
                    </div>
                    <div>
                      <p className="value" style={{ fontSize: '15px' }}>{item.confidence}%</p>
                      <p style={{ fontSize: '11px', color: 'var(--muted)' }}>Model certainty</p>
                    </div>
                    <div>
                      <p className="value" style={{ fontSize: '15px' }}>{item.date}</p>
                      <p style={{ fontSize: '11px', color: 'var(--muted)' }}>Scan date</p>
                    </div>
                    <span className={`pill ${item.severity === 'High' ? 'danger' : item.severity === 'Medium' ? 'warning' : 'success'}`}>
                      {item.severity} Risk
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
                  No historical diagnostic records matched your queries.
                </div>
              )}
            </div>
          </section>
        )}

        {/* TAB 4: RESEARCHER PROFILE & SETTINGS */}
        {activeTab === 'profile' && (
          <section className="glass-card animate-fade-in">
            <h3 style={{ marginBottom: '20px' }}>Researcher Node Settings</h3>
            <div className="profile-settings-layout">
              {/* Avatar column */}
              <div className="profile-avatar-upload" style={{ background: 'rgba(16, 185, 129, 0.02)', borderRadius: '20px', border: '1px solid var(--card-border)' }}>
                <div className="avatar-large">{avatarInitials}</div>
                <div>
                  <h4>{researcherName}</h4>
                  <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>Active Researcher Node // AgroAI Beta</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => setResearcherName('Dr. Sarah Connor')} type="button">Mock Bio 1</button>
                  <button className="secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => setResearcherName('Prof. Charles Darwin')} type="button">Mock Bio 2</button>
                </div>
              </div>

              {/* Form settings column */}
              <form onSubmit={handleProfileSave} className="profile-fields-card">
                <div className="settings-row">
                  <div className="settings-group">
                    <label>Researcher Name</label>
                    <input
                      type="text"
                      value={researcherName}
                      onChange={(e) => setResearcherName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="settings-group">
                    <label>Associated Organization</label>
                    <input
                      type="text"
                      value={farmLocation}
                      onChange={(e) => setFarmLocation(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="settings-row">
                  <div className="settings-group">
                    <label>Crop Research Focus</label>
                    <input
                      type="text"
                      value={cropFocus}
                      onChange={(e) => setCropFocus(e.target.value)}
                      required
                    />
                  </div>
                  <div className="settings-group">
                    <label>Active Database Sync</label>
                    <select style={{ height: '45px' }}>
                      <option value="swiss">European Science Hub (Lausanne)</option>
                      <option value="usa">Americas Green Lab (Napa Valley)</option>
                      <option value="offline">Local Database Only (Offline-safe)</option>
                    </select>
                  </div>
                </div>

                <div className="settings-group">
                  <label>Primary Email Node (Locked)</label>
                  <input
                    type="email"
                    value={userEmail}
                    disabled
                    style={{ opacity: 0.5, cursor: 'not-allowed' }}
                  />
                </div>

                <button
                  className="primary"
                  type="submit"
                  style={{ alignSelf: 'flex-start', marginTop: '10px' }}
                >
                  Save Profile Settings
                </button>
              </form>
            </div>
          </section>
        )}
        
       {activeTab === 'tracking' && (
  <section className="glass-card animate-fade-in">
    <div
      style={{
        minHeight: '420px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '40px',
      }}
    >
      <span style={{ fontSize: '56px', marginBottom: '20px' }}>👁️</span>

      <h3 style={{ marginBottom: '12px' }}>Plant Disease Tracking</h3>

      <p
        style={{
          color: 'var(--muted)',
          maxWidth: '460px',
          lineHeight: 1.7,
          marginBottom: '28px',
        }}
      >
        Track your plants over time, compare new scans with previous diagnoses,
        view health evolution graphs, and monitor disease progression from the
        dedicated tracking dashboard.
      </p>

      <button
        className="primary"
        type="button"
        onClick={() => navigate('/tracking')}
      >
        Open Tracking Dashboard →
      </button>
    </div>
  </section>
)}
      </main>
    </div>
  )
}

export default Dashboard2

