type DiagnosisLoadingPopupProps = {
  open: boolean
}

const DiagnosisLoadingPopup = ({ open }: DiagnosisLoadingPopupProps) => {
  if (!open) return null

  return (
    <div className="diagnosis-popup-backdrop">
      <div className="diagnosis-popup glass-card">
        <div className="diagnosis-orbit">
          <div className="diagnosis-orbit-ring" />
          <div className="diagnosis-leaf">🌿</div>
        </div>

        <span className="eyebrow">AI Diagnosis Running</span>

        <h3>Analyzing detected leaves...</h3>

        <p>
          This operation may take some time depending on the number of leaves
          detected in your plant image. Each leaf is analyzed individually and a
          Grad-CAM visualization is generated for every region.
        </p>

        <div className="diagnosis-progress">
          <div />
        </div>

        <div className="diagnosis-steps">
          <span>🌱 Detecting leaves</span>
          <span>🧠 Classifying diseases</span>
          <span>🔥 Generating Grad-CAM</span>
        </div>

        <p className="diagnosis-warning">
          Please keep this page open while the diagnosis is running.
        </p>
      </div>
    </div>
  )
}

export default DiagnosisLoadingPopup