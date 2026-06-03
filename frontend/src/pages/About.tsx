import TopBar from '../components/TopBar'

const About = () => {
  const supportedCrops = [
    'Tomato', 'Potato', 'Grape', 'Apple', 'Pepper', 
    'Strawberry', 'Peach', 'Cherry', 'Corn', 'Blueberry'
  ]

  return (
    <div className="shell">
      <div className="cyber-grid"></div>
      <TopBar showAuthButtons showLogout={false} />

      <main className="text-page-layout animate-slide-up" style={{ position: 'relative', zIndex: 10 }}>
        {/* HEADER */}
        <section className="text-page-header">
          <span className="badge-futuristic">Research & Technology</span>
          <h1>AgroAI Research Project</h1>
          <p>
            Bridging state-of-the-art computer vision models with organic agronomy to build a sustainable, disease-free agricultural future.
          </p>
        </section>

        {/* CORE STATS */}
        <section className="card-row">
          <div className="glass-card">
            <h3 style={{ color: 'var(--primary)', marginBottom: '14px' }}>PlantVillage Dataset</h3>
            <p style={{ fontSize: '15px', lineHeight: '1.6', marginBottom: '14px' }}>
              AgroAI Detect is trained on the open-source **PlantVillage** dataset, comprising **54,306 high-resolution images** of crop leaves. The model covers 14 unique crop varieties and classifies them into 38 distinct health profiles (both healthy leaves and leaves suffering from various bacterial, fungal, or viral infections).
            </p>
            <div style={{ display: 'flex', gap: '20px', borderTop: '1px solid var(--card-border)', paddingTop: '16px', marginTop: '16px' }}>
              <div>
                <span style={{ fontSize: '24px', fontFamily: 'var(--heading)', fontWeight: 'bold', color: 'var(--text)' }}>54k+</span>
                <span style={{ fontSize: '12px', color: 'var(--muted)', display: 'block' }}>Sample Images</span>
              </div>
              <div>
                <span style={{ fontSize: '24px', fontFamily: 'var(--heading)', fontWeight: 'bold', color: 'var(--text)' }}>14</span>
                <span style={{ fontSize: '12px', color: 'var(--muted)', display: 'block' }}>Crop Species</span>
              </div>
              <div>
                <span style={{ fontSize: '24px', fontFamily: 'var(--heading)', fontWeight: 'bold', color: 'var(--text)' }}>38</span>
                <span style={{ fontSize: '12px', color: 'var(--muted)', display: 'block' }}>Disease Classes</span>
              </div>
            </div>
          </div>

          <div className="glass-card">
            <h3 style={{ color: 'var(--secondary)', marginBottom: '14px' }}>Deep Learning Architecture</h3>
            <p style={{ fontSize: '15px', lineHeight: '1.6', marginBottom: '14px' }}>
              The core classifier utilizes a **ResNet50 (Residual Network)** architecture, pre-trained on ImageNet and fine-tuned in PyTorch. By utilizing residual shortcut connections, the model avoids vanishing gradient issues, enabling deep feature extraction of intricate lesion margins and spots.
            </p>
            <div style={{ display: 'flex', gap: '20px', borderTop: '1px solid var(--card-border)', paddingTop: '16px', marginTop: '16px' }}>
              <div>
                <span style={{ fontSize: '24px', fontFamily: 'var(--heading)', fontWeight: 'bold', color: 'var(--text)' }}>PyTorch</span>
                <span style={{ fontSize: '12px', color: 'var(--muted)', display: 'block' }}>Framework</span>
              </div>
              <div>
                <span style={{ fontSize: '24px', fontFamily: 'var(--heading)', fontWeight: 'bold', color: 'var(--text)' }}>ResNet50</span>
                <span style={{ fontSize: '12px', color: 'var(--muted)', display: 'block' }}>Core Neural Net</span>
              </div>
              <div>
                <span style={{ fontSize: '24px', fontFamily: 'var(--heading)', fontWeight: 'bold', color: 'var(--text)' }}>98.7%</span>
                <span style={{ fontSize: '12px', color: 'var(--muted)', display: 'block' }}>Validation F1</span>
              </div>
            </div>
          </div>
        </section>

        {/* NEURAL NET GRAPHIC SIMULATION */}
        <section className="glass-card" style={{ padding: '40px' }}>
          <h3 style={{ marginBottom: '16px' }}>Image Analysis & Feature Maps</h3>
          <p style={{ marginBottom: '24px' }}>
            When you upload a plant leaf image, the classifier converts it to a normalized 224x224 tensor. Feature layers identify boundaries, color shifts, and geometric structures. Here is how our three primary convolutional block segments isolate agricultural indicators:
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px',
              border: '1px solid var(--card-border)',
              background: 'rgba(4, 9, 7, 0.4)',
              padding: '24px',
              borderRadius: '16px',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <span
                style={{
                  display: 'inline-flex',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: 'var(--primary)',
                  fontWeight: 'bold',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px',
                }}
              >
                01
              </span>
              <h5 style={{ color: 'var(--text)', marginBottom: '6px' }}>Layer 1-10: Edge Isolation</h5>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Identifies leaf shapes, outline veins, margins, and coarse details.
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <span
                style={{
                  display: 'inline-flex',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(6, 182, 212, 0.1)',
                  color: 'var(--secondary)',
                  fontWeight: 'bold',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px',
                }}
              >
                02
              </span>
              <h5 style={{ color: 'var(--text)', marginBottom: '6px' }}>Layer 11-30: Spot Contrast</h5>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Detects brown spot necrosis, yellow haloes, powdery mildews, and chlorosis grids.
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <span
                style={{
                  display: 'inline-flex',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: 'var(--primary)',
                  fontWeight: 'bold',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px',
                }}
              >
                03
              </span>
              <h5 style={{ color: 'var(--text)', marginBottom: '6px' }}>Layer 31-50: Pathogen Match</h5>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Softmax layer correlates multi-dimensional weights against 38 agricultural categories.
              </p>
            </div>
          </div>
        </section>

        {/* SUPPORTED CROPS */}
        <section className="glass-card">
          <h3 style={{ marginBottom: '16px' }}>Supported Crop Species</h3>
          <p style={{ marginBottom: '24px' }}>
            Our model has custom classification modules optimized for these key crop types:
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '12px',
            }}
          >
            {supportedCrops.map(crop => (
              <div
                key={crop}
                style={{
                  background: 'rgba(16, 185, 129, 0.05)',
                  border: '1px solid var(--card-border)',
                  padding: '12px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  fontWeight: '600',
                  fontSize: '14px',
                }}
              >
                {crop}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default About
