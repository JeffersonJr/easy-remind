"use client"

import { useState } from 'react'
import { Calendar as CalendarIcon, Clock, X } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface DatePickerProps {
  initialDate: Date
  onConfirm: (date: Date) => void
  onCancel: () => void
}

export function DatePicker({ initialDate, onConfirm, onCancel }: DatePickerProps) {
  const [selectedDate, setSelectedDate] = useState(initialDate)
  const [selectedHour, setSelectedHour] = useState(initialDate.getHours())
  const [selectedMinute, setSelectedMinute] = useState(initialDate.getMinutes())

  const hours = Array.from({ length: 24 }, (_, i) => i)
  const minutes = Array.from({ length: 60 }, (_, i) => i)

  const handleConfirm = () => {
    const newDate = new Date(selectedDate)
    newDate.setHours(selectedHour, selectedMinute, 0, 0)
    onConfirm(newDate)
  }

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Ajustar Data e Hora
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Date Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Data</label>
            <input
              type="date"
              value={format(selectedDate, 'yyyy-MM-dd')}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="w-full p-2 border rounded-md bg-background"
            />
          </div>

          {/* Time Selectors */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Horário
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Hora</label>
                <div className="max-h-32 overflow-y-auto border rounded-md bg-background">
                  {hours.map((hour) => (
                    <button
                      key={hour}
                      onClick={() => setSelectedHour(hour)}
                      className={`w-full px-3 py-2 text-left hover:bg-accent transition-colors ${
                        selectedHour === hour ? 'bg-accent text-accent-foreground' : ''
                      }`}
                    >
                      {hour.toString().padStart(2, '0')}h
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Minuto</label>
                <div className="max-h-32 overflow-y-auto border rounded-md bg-background">
                  {minutes.map((minute) => (
                    <button
                      key={minute}
                      onClick={() => setSelectedMinute(minute)}
                      className={`w-full px-3 py-2 text-left hover:bg-accent transition-colors ${
                        selectedMinute === minute ? 'bg-accent text-accent-foreground' : ''
                      }`}
                    >
                      {minute.toString().padStart(2, '0')}min
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="p-4 bg-muted rounded-md">
            <p className="text-sm text-muted-foreground mb-1">Preview:</p>
            <p className="font-medium">
              {format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })} às{' '}
              {selectedHour.toString().padStart(2, '0')}:{selectedMinute.toString().padStart(2, '0')}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleConfirm} className="flex-1 zen-gradient text-white">
              Confirmar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
