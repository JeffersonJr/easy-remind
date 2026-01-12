'use server'

import { parseNaturalLanguage, parseWithRegex, type ParsedReminder } from '@/lib/ai-parser'

export async function parseReminderText(text: string): Promise<ParsedReminder | null> {
  try {
    // Tenta primeiro com AI, fallback para regex
    let parsed = await parseNaturalLanguage(text)
    if (!parsed) {
      parsed = parseWithRegex(text)
    }
    
    return parsed
  } catch (error) {
    console.error('Error parsing reminder:', error)
    // Fallback para regex se AI falhar
    return parseWithRegex(text)
  }
}
