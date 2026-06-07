


export interface loginCredentials {
    email: string;
    password: string;
}

export interface registerCredentials {
    email: string;
    password: string;
    first_name: string, 
    last_name: string,
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
};

export interface authReturnType {
    access_token: string;
    user: User
}


export interface authContext {
    access_token: string | null;
    user: User | null;
    setAuth: (data: {access_token: string, user: User, loading: boolean} | null) => void,
    loading: boolean
}


// export interface DiagnosticReport {
//   id?: string;
//   plant: string;
//   disease: string;
//   confidence: number;
//   severity: "Low" | "Medium" | "High";
//   description: string;
//   organicCure: string;
//   chemicalCure: string;
//   prevention: string;
//   date: string;
//   image?: string;
// }


export interface MonthlyAnalyticsItem {
  month: string;
  healthy_score: number;
  outbreak_score: number;
}

export interface AnalyticsOverview {
  total_reports: number;
  average_confidence: number;
  high_risk_count: number;
  medium_risk_count: number;
  low_risk_count: number;
  monthly_stats: MonthlyAnalyticsItem[];
}




export interface DiagnosticHistoryItem {
  id: string;
  plant: string;
  disease: string;
  confidence: number;
  severity: "Low" | "Medium" | "High";
  date: string;
}



export interface DashboardAnalytics {
  diagnosticsCount: number;
  monthlyGrowthPercent: number;
  averageF1: number;
  remediationSuccess: number;
  yieldIncreasePercent: number;
  monthlyHealthScores: {
    month: string;
    healthScore: number;
    outbreakScore: number;
  }[];
}


export interface UserProfile {
  id: string;
  name: string;
  email: string;
  organization: string;
  cropFocus: string;
  avatarInitials: string;
}


// export interface TrackedPlant {
//   id: string;
//   name: string;
//   icon?: string;
//   createdAt: string;
//   currentHealth?: number;
//   currentDisease?: string | null;
// }


export interface TrackedPlantDetails extends TrackedPlant {
  history: {
    id: string;
    date: string;
    health: number;
    disease: string | null;
    image?: string;
    notes?: string;
  }[];
}




// src/types/tracking.ts

export interface TrackedPlant {
  id: number;
  user_id: number;
  name: string;
  icon: string | null;
  current_health: number | null;
  current_disease: string | null;
  created_at: string;
}

// export interface DiagnosticReport {
//   id: number;
//   user_id: number;
//   model_prediction: string;
//   plant: string;
//   disease: string;
//   confidence: number;
//   severity: "Low" | "Medium" | "High";
//   description: string;
//   organic_cure: string;
//   chemical_cure: string;
//   prevention: string;
//   image_url: string | null;
//   created_at: string;
// }
export interface DiagnosticReport {
  id?: number, 
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

export interface TrackingEntry {
  id: number;
  tracked_plant_id: number;
  diagnostic_report_id: number;
  health: number | null;
  progress_status: string | null;
  progress_message: string | null;
  notes: string | null;
  created_at: string;
  diagnostic_report?: DiagnosticReport | null;
}

export interface TrackedPlantDetails extends TrackedPlant {
  tracking_entries: TrackingEntry[];
}