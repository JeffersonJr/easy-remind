import OpenAI from 'openai'

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('The OPENAI_API_KEY environment variable is missing or empty')
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

export interface ParsedReminder {
  content: string
  isRecurring: boolean
  frequency?: 'WEEKLY' | 'DAILY' | 'MONTHLY'
  daysOfWeek?: number[]
  nextRunAt: Date
  time?: string
  confidence: number
}

export async function parseNaturalLanguage(text: string): Promise<ParsedReminder | null> {
  try {
    const prompt = `
Analise o seguinte texto em português e extraia informações para criar um lembrete.

Texto: "${text}"

Retorne APENAS um JSON válido com esta estrutura exata:
{
  "content": "descrição do lembrete",
  "isRecurring": boolean,
  "frequency": "WEEKLY" | "DAILY" | "MONTHLY" | null,
  "daysOfWeek": [array de números 0-6 onde 0=domingo, 1=segunda...],
  "nextRunAt": "data ISO 8601",
  "time": "HH:mm" ou null,
  "confidence": número 0-1
}

Regras:
- Se não mencionar recorrência, isRecurring deve ser false
- Dias: segunda=1, terça=2, quarta=3, quinta=4, sexta=5, sábado=6, domingo=0
- Se mencionar "todo dia", frequency = "DAILY"
- Se mencionar "toda semana", frequency = "WEEKLY" 
- Se mencionar "todo mês", frequency = "MONTHLY"
- Para horários, use formato 24h (ex: "7h" = "07:00", "14:30" = "14:30")
- Calcule a próxima ocorrência baseada na data atual: ${new Date().toISOString()}
- confidence deve ser 0.9 se for claro, 0.6 se for ambíguo

Exemplos:
"academia toda segunda e quarta às 7h" -> recurring weekly, daysOfWeek [1,3], time "07:00"
"reunião amanhã às 14h" -> não recurring, amanhã = ${new Date(Date.now() + 86400000).toISOString().split('T')[0]}, time "14:00"
"pagar aluguel todo dia 10" -> recurring monthly, day 10
`

    const openai = getOpenAIClient()
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      max_tokens: 500,
    })

    const responseText = response.choices[0]?.message?.content || ''
    
    // Extrai JSON da resposta
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return null
    }

    const parsed = JSON.parse(jsonMatch[0])
    
    return {
      ...parsed,
      nextRunAt: new Date(parsed.nextRunAt),
      confidence: parsed.confidence || 0.5
    }
  } catch (error) {
    console.error('Error parsing with AI:', error)
    return null
  }
}

// Fallback parser para quando a IA falhar
export function parseWithRegex(text: string): ParsedReminder | null {
  const lowerText = text.toLowerCase()
  
  // Padrões para datas e horas
  const timeRegex = /(\d{1,2})h(\d{0,2})?/
  const dayRegex = /(segunda|terça|quarta|quinta|sexta|sábado|domingo)/gi
  const frequencyRegex = /(toda|todo)s?\s+(dia|semana|mês)/gi
  
  const timeMatch = text.match(timeRegex)
  const days = lowerText.match(dayRegex)
  const frequency = lowerText.match(frequencyRegex)
  
  if (!timeMatch && !days && !frequency) {
    return null
  }

  const now = new Date()
  let nextRunAt = new Date()
  
  if (timeMatch) {
    const hours = parseInt(timeMatch[1])
    const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0
    nextRunAt.setHours(hours, minutes, 0, 0)
    
    if (nextRunAt <= now) {
      nextRunAt.setDate(nextRunAt.getDate() + 1)
    }
  }

  const dayMap: { [key: string]: number } = {
    'domingo': 0, 'segunda': 1, 'terça': 2, 'quarta': 3, 
    'quinta': 4, 'sexta': 5, 'sábado': 6
  }

  let daysOfWeek: number[] = []
  if (days) {
    daysOfWeek = [...new Set(days.map(day => dayMap[day.toLowerCase()]))]
  }

  let isRecurring = false
  let freq: 'WEEKLY' | 'DAILY' | 'MONTHLY' | undefined
  
  if (frequency) {
    isRecurring = true
    const freqText = frequency[0].toLowerCase()
    if (freqText.includes('dia')) freq = 'DAILY'
    else if (freqText.includes('semana')) freq = 'WEEKLY'
    else if (freqText.includes('mês')) freq = 'MONTHLY'
  }

  return {
    content: text,
    isRecurring,
    frequency: freq,
    daysOfWeek: daysOfWeek.length > 0 ? daysOfWeek : undefined,
    nextRunAt,
    time: timeMatch ? `${timeMatch[1]}h${timeMatch[2] || ''}` : undefined,
    confidence: 0.7
  }
}
