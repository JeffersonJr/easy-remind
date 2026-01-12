"use client"

import { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Calendar, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DatePicker } from './date-picker'
import { UpgradeModal } from './upgrade-modal'
import { createReminder } from '@/app/actions/reminder'
import { useToast } from '@/components/ui/use-toast'
import { parseNaturalLanguage, parseWithRegex } from '@/lib/ai-parser'

interface ParsedReminder {
  content: string
  isRecurring: boolean
  frequency?: 'WEEKLY' | 'DAILY' | 'MONTHLY'
  daysOfWeek?: number[]
  nextRunAt: Date
  time?: string
}

export function CommandBar({ onReminderCreated }: { onReminderCreated: () => void }) {
  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [parsedPreview, setParsedPreview] = useState<ParsedReminder | null>(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const { toast } = useToast()
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'pt-BR'

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
        setIsListening(false)
      }

      recognition.onerror = () => {
        setIsListening(false)
        toast({
          title: "Erro de reconhecimento",
          description: "Não foi possível reconhecer sua voz. Tente novamente.",
          variant: "destructive"
        })
      }

      recognitionRef.current = recognition
    }
  }, [toast])

  const handleInputChange = async (value: string) => {
    setInput(value)
    
    if (value.length < 3) {
      setParsedPreview(null)
      return
    }
    
    // Tenta primeiro com AI, fallback para regex
    let parsed = await parseNaturalLanguage(value)
    if (!parsed) {
      parsed = parseWithRegex(value)
    }
    
    setParsedPreview(parsed)
  }

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Reconhecimento não suportado",
        description: "Seu navegador não suporta reconhecimento de voz.",
        variant: "destructive"
      })
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const handleCreateReminder = async (overrideData?: Partial<ParsedReminder>) => {
    if (!parsedPreview && !overrideData) {
      toast({
        title: "Formato inválido",
        description: "Use formatos como 'academia toda segunda às 7h' ou 'reunião amanhã às 14h'",
        variant: "destructive"
      })
      return
    }

    setIsCreating(true)
    try {
      const data = overrideData || parsedPreview!
      const result = await createReminder({
        content: data.content,
        rawText: input,
        isRecurring: data.isRecurring,
        frequency: data.frequency,
        daysOfWeek: data.daysOfWeek,
        nextRunAt: data.nextRunAt,
      })

      if (result.success) {
        setInput('')
        setParsedPreview(null)
        onReminderCreated()
        
        toast({
          title: "Lembrete criado!",
          description: "Seu lembrete foi configurado com sucesso.",
        })
      } else if (result.error === 'FREE_PLAN_LIMIT') {
        setShowUpgradeModal(true)
      }
    } catch (error) {
      toast({
        title: "Erro ao criar lembrete",
        description: "Ocorreu um erro. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleDateConfirm = (newDate: Date) => {
    if (parsedPreview) {
      const updated = { ...parsedPreview, nextRunAt: newDate }
      handleCreateReminder(updated)
    }
    setShowDatePicker(false)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="flex items-center gap-2 p-4 bg-card border rounded-xl shadow-sm">
          <input
            type="text"
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && parsedPreview) {
                handleCreateReminder()
              }
            }}
            placeholder="Digite ou fale seu lembrete... ex: academia toda segunda às 7h"
            className="flex-1 bg-transparent border-none outline-none text-foreground placeholder-muted-foreground"
            disabled={isCreating}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleListening}
            disabled={isCreating}
            className={isListening ? 'text-red-500' : ''}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          {parsedPreview && (
            <Button
              onClick={() => handleCreateReminder()}
              disabled={isCreating}
              className="zen-gradient text-white"
            >
              {isCreating ? 'Criando...' : 'Criar'}
            </Button>
          )}
        </div>

        {/* Preview Badges */}
        {parsedPreview && (
          <div className="mt-3 flex flex-wrap gap-2 animate-fade-in">
            {parsedPreview.time && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {parsedPreview.time}
              </Badge>
            )}
            {parsedPreview.daysOfWeek && parsedPreview.daysOfWeek.length > 0 && (
              <Badge 
                variant="secondary" 
                className="flex items-center gap-1 cursor-pointer hover:bg-accent"
                onClick={() => setShowDatePicker(true)}
              >
                <Calendar className="h-3 w-3" />
                {parsedPreview.daysOfWeek.map(day => 
                  ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][day]
                ).join(' e ')}
              </Badge>
            )}
            {parsedPreview.isRecurring && (
              <Badge variant="outline">
                {parsedPreview.frequency === 'DAILY' ? 'Diário' : 
                 parsedPreview.frequency === 'WEEKLY' ? 'Semanal' : 'Mensal'}
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Date Picker Modal */}
      {showDatePicker && parsedPreview && (
        <DatePicker
          initialDate={parsedPreview.nextRunAt}
          onConfirm={handleDateConfirm}
          onCancel={() => setShowDatePicker(false)}
        />
      )}

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </div>
  )
}
