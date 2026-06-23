import './PlantLoader.css'

const PlantLoader = () => {
  return (
    <div className="plant-loader-container">
      <div className="plant-loader-content">
        <div className="leaf-svg-container pulse-glow-effect">
          <svg viewBox="0 0 24 24" fill="var(--primary)" width="50" height="50">
            <path d="M17.06 4.94A9.97 9.97 0 0 0 10 2a9.97 9.97 0 0 0-7.06 2.94A9.97 9.97 0 0 0 2 12c0 2.4.84 4.6 2.24 6.34L2 21.06 3.44 22.5l2.72-2.24A9.95 9.95 0 0 0 12 22a9.97 9.97 0 0 0 7.06-2.94A9.97 9.97 0 0 0 22 12a9.97 9.97 0 0 0-2.94-7.06zM12 20a7.98 7.98 0 0 1-5.66-2.34L17.66 6.34A7.98 7.98 0 0 1 20 12a7.98 7.98 0 0 1-2.34 5.66A7.98 7.98 0 0 1 12 20z" />
          </svg>
          <div className="scan-line"></div>
        </div>
        <h3 className="loader-text">Analyzing Foliage...</h3>
        <p className="loader-subtext">Running neural network models on leaf structure to detect anomalies.</p>
      </div>
    </div>
  )
}

export default PlantLoader
