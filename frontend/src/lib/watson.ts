// Cliente para IBM Watson Assistant (watsonx assistant)
// Usa la API REST de Watson Assistant v2

interface WatsonMessage {
  input?: {
    text?: string
    message_type?: string
  }
  context?: {
    skills?: {
      'main skill'?: {
        user_defined?: {
          [key: string]: any
        }
      }
    }
  }
}

interface WatsonResponse {
  output: {
    generic: Array<{
      response_type: string
      text?: string
      title?: string
      options?: Array<{
        label: string
        value: {
          input: {
            text: string
          }
        }
      }>
    }>
    intents?: Array<{
      intent: string
      confidence: number
    }>
    entities?: Array<{
      entity: string
      value: string
      confidence: number
    }>
  }
  context?: {
    skills?: {
      'main skill'?: {
        user_defined?: {
          [key: string]: any
        }
      }
    }
  }
}

interface WatsonConfig {
  apiKey: string
  serviceUrl: string
  assistantId: string
  version?: string
}

class WatsonAssistant {
  private config: WatsonConfig
  private sessionId: string | null = null

  constructor(config: WatsonConfig) {
    this.config = {
      ...config,
      version: config.version || '2023-06-15'
    }
  }

  /**
   * Obtiene un token de acceso IAM usando el API Key
   */
  private async getAccessToken(): Promise<string> {
    try {
      const response = await fetch(
        'https://iam.cloud.ibm.com/identity/token',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${this.config.apiKey}`
        }
      )

      if (!response.ok) {
        throw new Error(`Error al obtener token: ${response.statusText}`)
      }

      const data = await response.json()
      return data.access_token
    } catch (error) {
      console.error('Error al obtener token de acceso:', error)
      throw error
    }
  }

  /**
   * Crea una nueva sesión con Watson Assistant
   */
  async createSession(): Promise<string> {
    try {
      const accessToken = await this.getAccessToken()
      
      const response = await fetch(
        `${this.config.serviceUrl}/v2/assistants/${this.config.assistantId}/sessions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Error al crear sesión: ${response.statusText} - ${errorText}`)
      }

      const data = await response.json()
      this.sessionId = data.session_id
      return data.session_id
    } catch (error) {
      console.error('Error al crear sesión de Watson:', error)
      throw error
    }
  }

  /**
   * Envía un mensaje a Watson Assistant
   */
  async sendMessage(
    message: string,
    context?: any
  ): Promise<WatsonResponse> {
    try {
      // Crear sesión si no existe
      if (!this.sessionId) {
        await this.createSession()
      }

      const accessToken = await this.getAccessToken()

      const requestBody: WatsonMessage = {
        input: {
          text: message,
          message_type: 'text'
        }
      }

      if (context) {
        requestBody.context = {
          skills: {
            'main skill': {
              user_defined: context
            }
          }
        }
      }

      const response = await fetch(
        `${this.config.serviceUrl}/v2/assistants/${this.config.assistantId}/sessions/${this.sessionId}/message`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify(requestBody)
        }
      )

      if (!response.ok) {
        // Si la sesión expiró, crear una nueva
        if (response.status === 404) {
          await this.createSession()
          return this.sendMessage(message, context)
        }
        const errorText = await response.text()
        throw new Error(`Error al enviar mensaje: ${response.statusText} - ${errorText}`)
      }

      const data: WatsonResponse = await response.json()
      return data
    } catch (error) {
      console.error('Error al enviar mensaje a Watson:', error)
      throw error
    }
  }

  /**
   * Extrae intenciones del mensaje
   */
  extractIntents(response: WatsonResponse): Array<{ intent: string; confidence: number }> {
    return response.output.intents || []
  }

  /**
   * Extrae entidades del mensaje
   */
  extractEntities(response: WatsonResponse): Array<{ entity: string; value: string; confidence: number }> {
    return response.output.entities || []
  }

  /**
   * Obtiene el texto de respuesta de Watson
   */
  getResponseText(response: WatsonResponse): string {
    const generic = response.output.generic || []
    const textResponse = generic.find(r => r.response_type === 'text')
    return textResponse?.text || 'Lo siento, no pude procesar tu mensaje.'
  }

  /**
   * Verifica si hay una intención de búsqueda de productos
   */
  isProductSearchIntent(response: WatsonResponse): boolean {
    const intents = this.extractIntents(response)
    return intents.some(
      intent => 
        intent.intent.toLowerCase().includes('buscar') ||
        intent.intent.toLowerCase().includes('producto') ||
        intent.intent.toLowerCase().includes('calzado') ||
        intent.intent.toLowerCase().includes('zapato')
    )
  }

  /**
   * Extrae parámetros de búsqueda de productos de las entidades
   */
  extractProductSearchParams(response: WatsonResponse): {
    categoria?: string
    talla?: string
    color?: string
    precioMin?: number
    precioMax?: number
    nombre?: string
  } {
    const entities = this.extractEntities(response)
    const params: any = {}

    entities.forEach(entity => {
      const entityName = entity.entity.toLowerCase()
      const value = entity.value

      if (entityName.includes('categoria') || entityName.includes('tipo')) {
        params.categoria = value
      } else if (entityName.includes('talla') || entityName.includes('numero')) {
        params.talla = value
      } else if (entityName.includes('color')) {
        params.color = value
      } else if (entityName.includes('precio') || entityName.includes('costo')) {
        // Intentar extraer precio numérico
        const precio = parseFloat(value)
        if (!isNaN(precio)) {
          if (!params.precioMin || precio < params.precioMin) {
            params.precioMin = precio
          }
          if (!params.precioMax || precio > params.precioMax) {
            params.precioMax = precio
          }
        }
      } else if (entityName.includes('producto') || entityName.includes('nombre')) {
        params.nombre = value
      }
    })

    return params
  }

  /**
   * Cierra la sesión
   */
  async closeSession(): Promise<void> {
    if (!this.sessionId) return

    try {
      const accessToken = await this.getAccessToken()
      
      await fetch(
        `${this.config.serviceUrl}/v2/assistants/${this.config.assistantId}/sessions/${this.sessionId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      )
      this.sessionId = null
    } catch (error) {
      console.error('Error al cerrar sesión de Watson:', error)
    }
  }
}

// Crear instancia singleton
let watsonInstance: WatsonAssistant | null = null

/**
 * Inicializa Watson Assistant con las credenciales
 */
export function initWatson(config: WatsonConfig): WatsonAssistant {
  watsonInstance = new WatsonAssistant(config)
  return watsonInstance
}

/**
 * Obtiene la instancia de Watson Assistant
 */
export function getWatson(): WatsonAssistant | null {
  return watsonInstance
}

/**
 * Crea una nueva instancia de Watson Assistant
 */
export function createWatsonClient(config: WatsonConfig): WatsonAssistant {
  return new WatsonAssistant(config)
}

export type { WatsonResponse, WatsonConfig }

