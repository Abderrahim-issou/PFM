import { NavLink, useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar'

const Landing = () => {
  const navigate = useNavigate()

  return (
    <div className="shell">
      <div className="cyber-grid"></div>
      <TopBar showAuthButtons showLogout={false} />

      <main style={{ position: 'relative', zIndex: 10 }}>
        {/* HERO SECTION */}
        <section className="landing-hero animate-slide-up">
          <div className="hero-text">
            <span className="badge-futuristic">✨ AI Agriculture Innovation</span>
            <h1>
              Detect Crop Diseases <span>Instantly</span>. Protect Your Yields.
            </h1>
            <p className="lead">
              AgroAI Detect leverages deep learning trained on hundreds of thousands of high-resolution crop leaves to identify pathogens, blights, and deficiencies in under two seconds.
            </p>
            <div className="hero-buttons">
              <button
                className="primary"
                onClick={() => navigate('/signup')}
                type="button"
              >
                Get Started Free
                <svg
                  fill="none"
                  height="16"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  width="16"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
              <button
                className="secondary"
                onClick={() => navigate('/about')}
                type="button"
              >
                Explore Technology
              </button>
            </div>
            <div className="hero-stats hero-stats-cards">
  <div className="hero-stat-item hero-stat-card">
    <span className="num">98.7%</span>
    <span className="desc">Model Precision</span>
  </div>

  <div className="hero-stat-item hero-stat-card">
    <span className="num">&lt; 2s</span>
    <span className="desc">Analysis Speed</span>
  </div>

  <div className="hero-stat-item hero-stat-card">
    <span className="num">38+</span>
    <span className="desc">Plant Diseases</span>
  </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="glow-circle"></div>
            <div className="glass-card animate-float" style={{ width: '100%', padding: '24px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                }}
              >
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)' }}></span>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--secondary)' }}></span>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--muted)' }}></span>
                </div>
                <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--primary)' }}>SYS_READY // CLOUD_SYNC</span>
              </div>

              {/* simulated scanner visual */}
              <div
                style={{
                  background: 'rgba(4, 9, 7, 0.4)',
                  borderRadius: '16px',
                  height: '240px',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--card-border)',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    backgroundImage: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 80%)',
                    zIndex: 1,
                  }}
                ></div>
                <div
                  style={{
                    position: 'absolute',
                    left: '0',
                    right: '0',
                    height: '3px',
                    background: 'var(--primary)',
                    boxShadow: '0 0 10px var(--primary)',
                    animation: 'scan 2.5s linear infinite',
                    zIndex: 5,
                  }}
                ></div>
                
                {/* SVG glowing holographic leaf graphic */}
                <svg
                  fill="none"
                  height="120"
                  stroke="var(--primary)"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                  style={{ opacity: 0.65, zIndex: 2, filter: 'drop-shadow(0 0 15px rgba(16, 185, 129, 0.3))' }}
                  viewBox="0 0 24 24"
                  width="120"
                >
                  <path d="M12 2C6.5 2 2 6.5 2 12c0 5 3.5 9.2 8.2 9.9l1.8.1.1-.1.1-1.8.8-1.5 1-2.2c1-2.2 2-3.8 2-3.8l.8-.2.2-.8c.8-1 .4-2.8.2-3.2-.2-.4-.8-.4-.8-.4s.2-.8 0-1.4c-.2-.6-.8-.8-.8-.8s.2-1 .2-1.8c0-.8-.6-1.2-.6-1.2s-.2-.8-1-1.2C13.2 2 12 2 12 2Z" />
                  <path d="M12 2v20M2 12c5 0 8 3 10 10M12 12c3-4 6-6 10-6" />
                </svg>

                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    background: 'rgba(4, 9, 7, 0.75)',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    zIndex: 10,
                  }}
                >
                  SCANNING RESNET50 // ID: TL-206
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginTop: '16px',
                  fontSize: '13px',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.1)',
                    display: 'grid',
                    placeItems: 'center',
                    color: 'var(--primary)',
                    fontWeight: 'bold',
                  }}
                >
                  ✓
                </div>
                <div>
                  <p style={{ fontWeight: 'bold', margin: '0', color: 'var(--text)' }}>Diagnostic Successful</p>
                  <p style={{ fontSize: '11px', color: 'var(--muted)', margin: '0' }}>Tomato Blight Detected - 98.4% accuracy</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section style={{ padding: '60px 0 40px' }}>
          <div className="section-title">
            <span className="badge-futuristic">Key Capabilities</span>
            <h2>Armed with Modern AI Technology</h2>
            <p>We combine advanced computer vision with agronomist-validated treatments to safeguard crop production.</p>
          </div>

          <div className="features-grid">
            <div className="glass-card feature-card">
              <div className="feature-icon-wrapper">
                <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
              <h3>Leaf Scanner</h3>
              <p>Just snap a picture of any infected plant leaf. Our ResNet deep learning neural net will detect margins and flag lesions instantly.</p>
            </div>

            <div className="glass-card feature-card">
              <div className="feature-icon-wrapper">
                <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <h3>Cure Prescriptions</h3>
              <p>Receive immediate chemical and organic treatment recipes tailored specifically to the diagnosed crop and pathogen severity.</p>
            </div>

            <div className="glass-card feature-card">
              <div className="feature-icon-wrapper">
                <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
              <h3>Farmer Insights</h3>
              <p>Gain actionable prevention schedules, weather impact correlations, and regional pathogen risk mapping to ahead of outbreaks.</p>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SHOWCASE */}
        <section className="showcase-layout">
          <div className="hero-visual">
            <div className="glow-circle" style={{ background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)' }}></div>
            <div className="glass-card" style={{ padding: '40px', width: '100%' }}>
              <h3 style={{ marginBottom: '20px', letterSpacing: '-0.5px' }}>Simple, Tech-Forward Interface</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ border: '1px solid var(--card-border)', background: 'rgba(16, 185, 129, 0.02)', padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ width: '40px', height: '40px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '10px', display: 'grid', placeItems: 'center', color: 'var(--primary)', fontWeight: 'bold' }}>01</span>
                  <div>
                    <h5 style={{ margin: '0', color: 'var(--text)' }}>Upload Plant Image</h5>
                    <p style={{ margin: '0', fontSize: '12px', color: 'var(--text-secondary)' }}>JPG, PNG leaves are analyzed locally or cloud-scanned.</p>
                  </div>
                </div>
                <div style={{ border: '1px solid var(--card-border)', background: 'rgba(16, 185, 129, 0.02)', padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ width: '40px', height: '40px', background: 'rgba(6, 182, 212, 0.08)', borderRadius: '10px', display: 'grid', placeItems: 'center', color: 'var(--secondary)', fontWeight: 'bold' }}>02</span>
                  <div>
                    <h5 style={{ margin: '0', color: 'var(--text)' }}>Holographic Laser Sweep</h5>
                    <p style={{ margin: '0', fontSize: '12px', color: 'var(--text-secondary)' }}>Neural networks classify plant strain & pathogenic tissue.</p>
                  </div>
                </div>
                <div style={{ border: '1px solid var(--card-border)', background: 'rgba(16, 185, 129, 0.02)', padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ width: '40px', height: '40px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '10px', display: 'grid', placeItems: 'center', color: 'var(--primary)', fontWeight: 'bold' }}>03</span>
                  <div>
                    <h5 style={{ margin: '0', color: 'var(--text)' }}>Actionable Agronomy Advice</h5>
                    <p style={{ margin: '0', fontSize: '12px', color: 'var(--text-secondary)' }}>Receive direct recipe plans & organic spray recommendations.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-text">
            <span className="badge-futuristic">Seamless Workflow</span>
            <h2>How It Works</h2>
            <p>From leaf picture to immediate biological and chemical solutions in three simple steps.</p>
            <div className="steps-list">
              <div className="step-item">
                <span className="step-number">1</span>
                <div className="step-content">
                  <h4>Take a Leaf Photo</h4>
                  <p>Capture a clean top-down picture of the diseased crop leaf in natural lighting. High contrast margins improve diagnostic accuracy.</p>
                </div>
              </div>
              <div className="step-item">
                <span className="step-number">2</span>
                <div className="step-content">
                  <h4>Deep Scanning Inference</h4>
                  <p>Our server classifies the sample, matching it against 38 unique crop-disease classes. We provide exact severity percentages.</p>
                </div>
              </div>
              <div className="step-item">
                <span className="step-number">3</span>
                <div className="step-content">
                  <h4>Apply Treatments</h4>
                  <p>Execute targeted treatments based on pesticide, organic spraying, soil ventilating, and irrigation scheduling tips.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="testimonials-section">
          <div className="section-title">
            <span className="badge-futuristic">Trusted Community</span>
            <h2>Approved by Agri-Tech Leaders</h2>
            <p>Here is what growers, modern researchers, and agriculture experts are saying about AgroAI Detect.</p>
          </div>

          <div className="testimonials-grid">
            <div className="glass-card testimonial-card">
              <p className="testimonial-text">
                "AgroAI Detect changed our grape farm monitoring. We identified Leaf Blight 2 weeks before standard visual inspections would have spotted it, saving 15% of our Cabernet Sauvignon harvest."
              </p>
              <div className="testimonial-user">
                <div className="user-avatar">MK</div>
                <div className="user-info">
                  <h5>Marc K.</h5>
                  <span>Vineyard Operator, Napa Valley</span>
                </div>
              </div>
            </div>

            <div className="glass-card testimonial-card">
              <p className="testimonial-text">
                "As an agronomy student, this simulation and diagnostic tool is invaluable. The detailed pathogen descriptions and organic cure options have enriched my study and research immensely."
              </p>
              <div className="testimonial-user">
                <div className="user-avatar">SR</div>
                <div className="user-info">
                  <h5>Siddharth R.</h5>
                  <span>Research Student, ISA France</span>
                </div>
              </div>
            </div>

            <div className="glass-card testimonial-card">
              <p className="testimonial-text">
                "The accuracy levels are incredible. Having a 2-second cloud diagnostics system allows our greenhouse managers to take swift chemical isolation protocols and avoid cross-contamination."
              </p>
              <div className="testimonial-user">
                <div className="user-avatar">HP</div>
                <div className="user-info">
                  <h5>Dr. Helen P.</h5>
                  <span>Director of Greenhouse Operations</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section style={{ textAlign: 'center', padding: '60px 0 80px' }}>
          <div className="glass-card" style={{ padding: '60px 20px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
            <span className="badge-futuristic">Start Protecting Crops Today</span>
            <h2 style={{ fontSize: '38px', letterSpacing: '-1px' }}>Ready to Experience Smarter Agriculture?</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto' }}>
              Create an account instantly. No credit card required. Gain access to modern AI leaf scanning, prediction analytics, and complete cure blueprints.
            </p>
            <button
              className="primary animate-pulse-glow"
              onClick={() => navigate('/signup')}
              style={{ marginTop: '12px', padding: '16px 36px', fontSize: '15px' }}
              type="button"
            >
              Sign Up For Free Now
            </button>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="tech-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="brand">
              <span className="brand__logo">🌱</span>
              <span className="brand__title">AgroAI Detect</span>
            </div>
            <p>Bringing premium deep learning computer vision models directly to greenhouses, research labs, and fields worldwide.</p>
          </div>
          <div className="footer-links">
            <h5>Product</h5>
            <ul>
              <li><NavLink to="/signup">AI Leaf Scanner</NavLink></li>
              <li><NavLink to="/about">Model Details</NavLink></li>
              <li><NavLink to="/">Pricing</NavLink></li>
            </ul>
          </div>
          <div className="footer-links">
            <h5>Resources</h5>
            <ul>
              <li><NavLink to="/about">PlantVillage Dataset</NavLink></li>
              <li><NavLink to="/contact">Agri-Guides</NavLink></li>
              <li><NavLink to="/contact">Support Center</NavLink></li>
            </ul>
          </div>
          <div className="footer-links">
            <h5>Company</h5>
            <ul>
              <li><NavLink to="/about">About Us</NavLink></li>
              <li><NavLink to="/contact">Contact Support</NavLink></li>
              <li><NavLink to="/about">SaaS Technology</NavLink></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 AgroAI Detect Inc. All rights reserved. Precision Agri-Tech Platform.</p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
