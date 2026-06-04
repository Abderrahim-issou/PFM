import { useState, useMemo, useEffect } from 'react'
import TopBar from '../components/TopBar'
import { process_image } from '../api/api'
import useAuth from '../hooks/useAuth'

// Mock disease database
interface DiagnosticReport {
  plant: string
  disease: string
  confidence: number
  severity: 'Low' | 'Medium' | 'High'
  description: string
  organicCure: string
  chemicalCure: string
  prevention: string
  date: string
  image: string
}

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

// Initial history items
const initialHistory = [
  {
    plant: 'Tomato',
    disease: 'Late Blight (Phytophthora)',
    confidence: 98.4,
    severity: 'High' as const,
    date: 'May 24, 2026',
  },
  {
    plant: 'Grape',
    disease: 'Black Rot (Guignardia)',
    confidence: 91.2,
    severity: 'Medium' as const,
    date: 'May 23, 2026',
  },
  {
    plant: 'Potato',
    disease: 'Early Blight (Alternaria)',
    confidence: 87.5,
    severity: 'Medium' as const,
    date: 'May 22, 2026',
  },
  {
    plant: 'Apple',
    disease: 'Scab (Venturia)',
    confidence: 94.1,
    severity: 'High' as const,
    date: 'May 19, 2026',
  },
  {
    plant: 'Tomato',
    disease: 'Healthy (No disease)',
    confidence: 97.6,
    severity: 'Low' as const,
    date: 'May 18, 2026',
  }
]

const Dashboard = () => {
  const {access_token} = useAuth();
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
  const [historyItems, setHistoryItems] = useState(initialHistory)

  // Researcher Profile state
  const [researcherName, setResearcherName] = useState('Dr. Green Patel')
  const [farmLocation, setFarmLocation] = useState('Biotech Science Park, Switzerland')
  const [cropFocus, setCropFocus] = useState('Nightshade Family (Tomato, Potato)')
  const [avatarInitials, setAvatarInitials] = useState('GP')
  const [selectedTrackingPlant, setSelectedTrackingPlant] = useState<string | null>(null)
  const [trackedPlants, setTrackedPlants] = useState([
    { id: 'Plant 1', name: 'Plant 1', icon: '🌱' },
    { id: 'Plant 2', name: 'Plant 2', icon: '🌿' },
    { id: 'Plant 3', name: 'Plant 3', icon: '🌾' },
  ])

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

  // Handle custom file upload simulation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setCustomFile(file)
      setSelectedPreset(null)
      setPreviewUrl(URL.createObjectURL(file))
      setScanning(true)
      setScanStep(0)

      const formData = new FormData()
      formData.append('file', file)

      // Send the image to the backend
      
      
      
       window.setTimeout( async () => {
            if(!access_token || !formData){
              console.log('no access token , or form data');
              return;
            }
            const data = await process_image(formData, access_token);
            if (!data) {
              console.log("process failed!");
              return;
            }
      
            console.log('this is the result', data);
            // saveToken(data.access_token);
            window.setTimeout(() => {

            }, 700)
        }, 1100)

      setTimeout(() => {
        setScanning(false)
        // Dynamically select a mock result to simulate custom upload
        const mockKeys = Object.keys(cropDatabase)
        const randomPreset = mockKeys[Math.floor(Math.random() * mockKeys.length)]
        const report = { ...cropDatabase[randomPreset], plant: 'Custom Upload', date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }
        setCurrentReport(report)

        setHistoryItems(prev => [
          {
            plant: report.plant,
            disease: report.disease,
            confidence: report.confidence,
            severity: report.severity,
            date: report.date
          },
          ...prev
        ])
      }, 2000)
    }
  }

  // Recall previous search diagnostics
  const handleRecallReport = (item: typeof initialHistory[0]) => {
    // Find matching in mock database
    let matchingReport = Object.values(cropDatabase).find(
      r => r.plant === item.plant || r.disease.includes(item.disease.split(' ')[0])
    )
    if (matchingReport) {
      setCurrentReport(matchingReport)
      if (matchingReport.image === 'tomato_blight') setPreviewUrl('tomato')
      else if (matchingReport.image === 'grape_rot') setPreviewUrl('grape')
      else if (matchingReport.image === 'potato_blight') setPreviewUrl('potato')
      else setPreviewUrl('pepper')
      setActiveTab('scanner')
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
  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault()
    // derive initials
    const parts = researcherName.trim().split(' ')
    let initials = 'R'
    if (parts.length > 1) {
      initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    } else if (parts[0].length > 0) {
      initials = parts[0][0].toUpperCase()
    }
    setAvatarInitials(initials)
    alert('Secure profile adjustments saved successfully!')
  }

  // Handle new tracking
  const handleStartNewTracking = () => {
    const nextNumber = trackedPlants.length + 1
    const newPlantId = `Plant ${nextNumber}`
    const icons = ['🌱', '🌿', '🌾', '🌻', '🌲', '🪴']
    const newIcon = icons[(nextNumber - 1) % icons.length]

    setTrackedPlants(prev => [...prev, { id: newPlantId, name: newPlantId, icon: newIcon }])
    setSelectedTrackingPlant(newPlantId)
  }

  return (
    <div className="shell">
      <div className="cyber-grid"></div>
      <TopBar showLogout />

      <main className="dashboard" style={{ position: 'relative', zIndex: 10 }}>
        {/* DASHBOARD HEADER */}
        <header className="dashboard__header glass-card">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span className="eyebrow">AgroAI Workspace Console</span>
            <h2>{greeting}, {researcherName}.</h2>
            <p>Monitor pathogen risks, catalog scanned leaves, and execute remedy protocols.</p>
          </div>
          <div className="profile">
            <div style={{ textAlign: 'right' }}>
              <p className="profile__name">{researcherName}</p>
              <p className="profile__role">{cropFocus}</p>
            </div>
            <div className="avatar">{avatarInitials}</div>
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
                      <p style={{ fontSize: '14px', color: 'var(--text)', fontWeight: '700' }}>ResNet50 Softmax Match</p>
                      <p style={{ fontSize: '11px', color: 'var(--muted)' }}>Weight validation checks cleared.</p>
                    </div>
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
                  <h2 style={{ fontSize: '32px' }}>{historyItems.length}</h2>
                  <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '13px' }}>+12% vs May</span>
                </div>
              </div>
              <div className="glass-card analytics-stat-card">
                <span className="label">Average Crop F1</span>
                <div className="analytics-stat-flex">
                  <h2 style={{ fontSize: '32px' }}>96.4%</h2>
                  <span style={{ color: 'var(--secondary)', fontWeight: 'bold', fontSize: '13px' }}>Highly Precise</span>
                </div>
              </div>
              <div className="glass-card analytics-stat-card">
                <span className="label">Remediation Success</span>
                <div className="analytics-stat-flex">
                  <h2 style={{ fontSize: '32px' }}>84%</h2>
                  <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '13px' }}>+3% yield increase</span>
                </div>
              </div>
            </div>

            {/* CUSTOM RESPONSIVE SVG LINE CHART */}
            <div className="glass-card chart-card">
              <h3 style={{ marginBottom: '14px' }}>2026 Monthly Agricultural Health Scores</h3>
              <p style={{ fontSize: '13px', marginBottom: '20px' }}>Indicates proportion of scans returning healthy crops vs highly severe diseases over time.</p>

              {/* Responsive SVG Chart */}
              <div className="line-chart-svg">
                <svg viewBox="0 0 500 200" width="100%" height="100%">
                  {/* Grids */}
                  <line x1="50" y1="20" x2="450" y2="20" stroke="rgba(16, 185, 129, 0.08)" strokeDasharray="4" />
                  <line x1="50" y1="70" x2="450" y2="70" stroke="rgba(16, 185, 129, 0.08)" strokeDasharray="4" />
                  <line x1="50" y1="120" x2="450" y2="120" stroke="rgba(16, 185, 129, 0.08)" strokeDasharray="4" />
                  <line x1="50" y1="170" x2="450" y2="170" stroke="rgba(16, 185, 129, 0.15)" />

                  {/* Path for Healthy Score (Primary) */}
                  <path
                    d="M 50 150 Q 130 110 210 130 T 370 60 T 450 40"
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  {/* Path for Blight Outbreaks (Secondary) */}
                  <path
                    d="M 50 80 Q 130 90 210 70 T 370 140 T 450 160"
                    fill="none"
                    stroke="var(--secondary)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray="4 2"
                  />

                  {/* Interactive Circles */}
                  <circle cx="50" cy="150" r="5" fill="var(--primary)" />
                  <circle cx="130" cy="110" r="5" fill="var(--primary)" />
                  <circle cx="210" cy="130" r="5" fill="var(--primary)" />
                  <circle cx="290" cy="95" r="5" fill="var(--primary)" />
                  <circle cx="370" cy="60" r="5" fill="var(--primary)" />
                  <circle cx="450" cy="40" r="5" fill="var(--primary)" />

                  {/* Labels */}
                  <text x="50" y="190" fill="var(--muted)" fontSize="10" textAnchor="middle">Jan</text>
                  <text x="130" y="190" fill="var(--muted)" fontSize="10" textAnchor="middle">Feb</text>
                  <text x="210" y="190" fill="var(--muted)" fontSize="10" textAnchor="middle">Mar</text>
                  <text x="290" y="190" fill="var(--muted)" fontSize="10" textAnchor="middle">Apr</text>
                  <text x="370" y="190" fill="var(--muted)" fontSize="10" textAnchor="middle">May</text>
                  <text x="450" y="190" fill="var(--muted)" fontSize="10" textAnchor="middle">Jun</text>

                  <text x="40" y="24" fill="var(--muted)" fontSize="10" textAnchor="end">100%</text>
                  <text x="40" y="74" fill="var(--muted)" fontSize="10" textAnchor="end">50%</text>
                  <text x="40" y="124" fill="var(--muted)" fontSize="10" textAnchor="end">25%</text>
                  <text x="40" y="174" fill="var(--muted)" fontSize="10" textAnchor="end">0%</text>
                </svg>
              </div>

              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-color" style={{ background: 'var(--primary)' }}></span>
                  <span style={{ color: 'var(--text)' }}>Average Crop Health F1</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{ background: 'var(--secondary)' }}></span>
                  <span style={{ color: 'var(--text)' }}>Pathogen Outbreak Score</span>
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
                    value={'researcher@agro.ai'}
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
            <h3 style={{ marginBottom: '20px' }}>Researcher Node Tracking</h3>
            <div className="profile-settings-layout">
              {/* Plants List Column */}
              <div className="profile-avatar-upload" style={{ background: 'rgba(16, 185, 129, 0.02)', borderRadius: '20px', border: '1px solid var(--card-border)', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'stretch' }}>
                <h4 style={{ marginBottom: '8px', textAlign: 'center' }}>Tracked Subjects</h4>
                {trackedPlants.map(plant => (
                  <div
                    key={plant.id}
                    className={`glass-card ${selectedTrackingPlant === plant.id ? 'active' : ''}`}
                    style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.3s ease', borderColor: selectedTrackingPlant === plant.id ? 'var(--primary)' : 'var(--card-border)' }}
                    onClick={() => setSelectedTrackingPlant(plant.id)}
                  >
                    <span style={{ fontSize: '24px' }}>{plant.icon}</span>
                    <span style={{ fontWeight: 600 }}>{plant.name}</span>
                  </div>
                ))}
              </div>

              {/* Details column */}
              <div className="profile-fields-card">
                {selectedTrackingPlant ? (
                  <div className="glass-card animate-fade-in" style={{ padding: '40px', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ fontSize: '64px', marginBottom: '20px' }}>
                      {trackedPlants.find(p => p.id === selectedTrackingPlant)?.icon || '🌱'}
                    </div>
                    <h2 style={{ marginBottom: '16px', fontSize: '28px' }}>{selectedTrackingPlant} Analysis</h2>
                    <p style={{ color: 'var(--muted)', maxWidth: '400px', lineHeight: '1.6', fontSize: '15px' }}>
                      This is a placeholder illustration. Real-time growth monitoring, biometrics, and predictive yield models for {selectedTrackingPlant} will be rendered here.
                    </p>
                    <button className="secondary" onClick={() => setSelectedTrackingPlant(null)} style={{ marginTop: '32px' }} type="button">
                      Close Tracking View
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '40px', border: '2px dashed rgba(16, 185, 129, 0.2)', borderRadius: '20px', background: 'rgba(16, 185, 129, 0.02)' }}>
                    <span style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }}>👁️</span>
                    <h3 style={{ color: 'var(--text)', marginBottom: '12px' }}>Select a Plant to Track</h3>
                    <p style={{ color: 'var(--muted)', textAlign: 'center', marginBottom: '32px', maxWidth: '300px', lineHeight: '1.6' }}>
                      Choose one of the tracked plants from the list to view its growth progression and biometric data.
                    </p>
                    <button
                      className="primary"
                      type="button"
                      onClick={handleStartNewTracking}
                    >
                      + Start new tracking
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default Dashboard
