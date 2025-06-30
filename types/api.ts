export interface GenerationRequest {
    prompt: string
    userId: string
  }
  
  export interface GenerationResponse {
    explanation: string
    code: string
    success: boolean
    error?: string
  }
  
  export interface Message {
    id: number
    text: string
    isUser: boolean
    timestamp?: Date
  }
  
  export interface UsageInfo {
    current: number
    limit: number
    remaining: number
    resetTime: Date
  }