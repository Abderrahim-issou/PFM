import type { DiagnosticReport, DiagnosticHistoryItem } from '../types/Global'

export const mapBackendReportToDashboard = (report: any): DiagnosticReport => ({
  id: report.id,
  plant: report.plant,
  disease: report.disease,
  confidence: report.confidence,
  severity: report.severity,
  description: report.description,
  organicCure: report.organic_cure,
  chemicalCure: report.chemical_cure,
  prevention: report.prevention,
  date: new Date(report.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }),
  image: report.model_prediction || 'custom_upload',
})

export const mapBackendHistoryToDashboard = (report: any): DiagnosticHistoryItem => ({
  id: report.id,
  plant: report.plant,
  disease: report.disease,
  confidence: report.confidence,
  severity: report.severity,
  date: new Date(report.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }),
})

export const getInitials = (firstName: string, lastName: string) => {
  const first = firstName?.trim()?.[0] || ''
  const last = lastName?.trim()?.[0] || ''
  return `${first}${last}`.toUpperCase() || 'U'
}