export interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy'
  uptime: number
  environment: string
  version: string
  timestamp: string
  database: {
    status: 'up' | 'down'
    responseTime?: number
  }
  redis: {
    status: 'up' | 'down'
    responseTime?: number
  }
  memory: {
    used: number
    total: number
    percentage: number
  }
  cpu: {
    usage: number
  }
  responseTime: number
}
