export interface DiseaseInfo {
  description: string
  symptoms: string[]
  precautions: string[]
  treatment: string
  causes?: string[]
  prevention?: string[]
}

export interface PredictionResponse {
  disease: string
  confidence: number
  severity: number

  explanation?: string

  image_url?: string

  audio_url?: string | null

  info?: DiseaseInfo
}