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

      <main className="text-page-layout about-page animate-slide-up" style={{ position: 'relative', zIndex: 10 }}>
        <section className="text-page-header">
          <span className="badge-futuristic">Research & Technology</span>
          <h1>AgroAI Research Project</h1>
          <p>
            Bridging state-of-the-art computer vision models with organic agronomy to build a sustainable, disease-free agricultural future.
          </p>
        </section>

        <section className="card-row about-card-row">
          <div className="glass-card">
            <h3 style={{ color: 'var(--primary)', marginBottom: '14px' }}>PlantVillage Dataset</h3>
            <p className="about-card-text">
              AgroAI Detect is trained on the open-source <strong>PlantVillage</strong> dataset, comprising <strong>54,306 high-resolution images</strong> of crop leaves. The model covers 14 unique crop varieties and classifies them into 38 distinct health profiles.
            </p>

            <div className="about-stat-row">
              <div>
                <span className="about-stat-value">54k+</span>
                <span className="about-stat-label">Sample Images</span>
              </div>
              <div>
                <span className="about-stat-value">14</span>
                <span className="about-stat-label">Crop Species</span>
              </div>
              <div>
                <span className="about-stat-value">38</span>
                <span className="about-stat-label">Disease Classes</span>
              </div>
            </div>
          </div>

          <div className="glass-card">
            <h3 style={{ color: 'var(--secondary)', marginBottom: '14px' }}>Deep Learning Architecture</h3>
            <p className="about-card-text">
              The core classifier utilizes a <strong>ResNet50</strong> architecture, pre-trained on ImageNet and fine-tuned in PyTorch. Residual shortcut connections help the model extract detailed lesion margins and disease patterns.
            </p>

            <div className="about-stat-row">
              <div>
                <span className="about-stat-value">PyTorch</span>
                <span className="about-stat-label">Framework</span>
              </div>
              <div>
                <span className="about-stat-value">ResNet50</span>
                <span className="about-stat-label">Core Neural Net</span>
              </div>
              <div>
                <span className="about-stat-value">98.7%</span>
                <span className="about-stat-label">Validation F1</span>
              </div>
            </div>
          </div>
        </section>

        <section className="glass-card about-feature-section">
          <h3 style={{ marginBottom: '16px' }}>Image Analysis & Feature Maps</h3>
          <p style={{ marginBottom: '24px' }}>
            When you upload a plant leaf image, the classifier converts it to a normalized tensor. Feature layers identify boundaries, color shifts, and geometric structures.
          </p>

          <div className="about-feature-map-grid">
            {[
              ['01', 'Layer 1-10: Edge Isolation', 'Identifies leaf shapes, outline veins, margins, and coarse details.'],
              ['02', 'Layer 11-30: Spot Contrast', 'Detects brown spot necrosis, yellow haloes, powdery mildews, and chlorosis grids.'],
              ['03', 'Layer 31-50: Pathogen Match', 'Softmax layer correlates multi-dimensional weights against agricultural categories.']
            ].map(([number, title, desc], index) => (
              <div className="about-feature-map-item" key={number}>
                <span className={index === 1 ? 'about-layer-badge secondary-layer' : 'about-layer-badge'}>
                  {number}
                </span>
                <h5>{title}</h5>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-card">
          <h3 style={{ marginBottom: '16px' }}>Supported Crop Species</h3>
          <p style={{ marginBottom: '24px' }}>
            Our model has custom classification modules optimized for these key crop types:
          </p>

          <div className="supported-crops-grid">
            {supportedCrops.map(crop => (
              <div className="supported-crop-item" key={crop}>
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