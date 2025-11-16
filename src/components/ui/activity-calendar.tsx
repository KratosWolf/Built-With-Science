"use client"

import * as React from "react"
import { format, subDays, startOfWeek, addDays, isSameDay } from "date-fns"
import { ptBR } from "date-fns/locale"

interface ActivityCalendarProps {
  period: number
  workouts: Array<{
    date: string
    count: number
  }>
}

interface TooltipState {
  show: boolean
  x: number
  y: number
  content: string
}

export function ActivityCalendar({ period, workouts }: ActivityCalendarProps) {
  const [tooltip, setTooltip] = React.useState<TooltipState>({
    show: false,
    x: 0,
    y: 0,
    content: "",
  })

  // Função para obter a cor baseada na intensidade
  const getIntensityColor = (count: number): string => {
    if (count === 0) return "bg-[#161b22]"
    if (count === 1) return "bg-[#0e4429]"
    if (count === 2) return "bg-[#006d32]"
    return "bg-[#10b981]"
  }

  // Função para encontrar o workout de uma data específica
  const getWorkoutCount = (date: Date): number => {
    const workout = workouts.find((w) =>
      isSameDay(new Date(w.date), date)
    )
    return workout?.count || 0
  }

  // Gerar array de datas baseado no período
  const generateDates = (): Date[] => {
    const today = new Date()
    const dates: Date[] = []

    for (let i = period - 1; i >= 0; i--) {
      dates.push(subDays(today, i))
    }

    return dates
  }

  const dates = generateDates()

  // Handler para mostrar tooltip
  const handleMouseEnter = (e: React.MouseEvent, date: Date, count: number) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const formattedDate = format(date, "dd/MM/yyyy", { locale: ptBR })
    const content = count === 0
      ? `Nenhum treino em ${formattedDate}`
      : count === 1
      ? `1 treino em ${formattedDate}`
      : `${count} treinos em ${formattedDate}`

    setTooltip({
      show: true,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      content,
    })
  }

  const handleMouseLeave = () => {
    setTooltip({ ...tooltip, show: false })
  }

  // Renderizar calendário de 30 dias (layout semanal)
  const render30Days = () => {
    const weeks: Date[][] = []
    let currentWeek: Date[] = []

    dates.forEach((date) => {
      currentWeek.push(date)
      if (currentWeek.length === 7) {
        weeks.push(currentWeek)
        currentWeek = []
      }
    })

    if (currentWeek.length > 0) {
      weeks.push(currentWeek)
    }

    return (
      <div className="space-y-2">
        {/* Labels dos dias */}
        <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 mb-2">
          <div className="text-center">D</div>
          <div className="text-center">S</div>
          <div className="text-center">T</div>
          <div className="text-center">Q</div>
          <div className="text-center">Q</div>
          <div className="text-center">S</div>
          <div className="text-center">S</div>
        </div>

        {/* Grid de células */}
        <div className="space-y-1">
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="grid grid-cols-7 gap-1">
              {week.map((date, dayIdx) => {
                const count = getWorkoutCount(date)
                const colorClass = getIntensityColor(count)

                return (
                  <div
                    key={dayIdx}
                    className={`${colorClass} h-8 sm:h-10 rounded-sm border border-[#30363d] cursor-pointer hover:ring-2 hover:ring-[#10b981] transition-all`}
                    onMouseEnter={(e) => handleMouseEnter(e, date, count)}
                    onMouseLeave={handleMouseLeave}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Renderizar calendário de 90 dias (layout compacto)
  const render90Days = () => {
    const rows = 10
    const cols = 9

    return (
      <div className="space-y-2">
        <div className="text-xs text-gray-500 mb-2">
          Últimos 90 dias
        </div>

        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {dates.map((date, idx) => {
            const count = getWorkoutCount(date)
            const colorClass = getIntensityColor(count)

            return (
              <div
                key={idx}
                className={`${colorClass} h-6 sm:h-8 rounded-sm border border-[#30363d] cursor-pointer hover:ring-2 hover:ring-[#10b981] transition-all`}
                onMouseEnter={(e) => handleMouseEnter(e, date, count)}
                onMouseLeave={handleMouseLeave}
              />
            )
          })}
        </div>
      </div>
    )
  }

  // Renderizar calendário de 365 dias (layout GitHub)
  const render365Days = () => {
    // Começar da primeira segunda-feira
    const firstDate = dates[0]
    const firstMonday = startOfWeek(firstDate, { weekStartsOn: 1 })

    // Criar grid de 52 semanas x 7 dias
    const weeks: Date[][] = []
    let currentDate = firstMonday

    for (let week = 0; week < 53; week++) {
      const weekDates: Date[] = []
      for (let day = 0; day < 7; day++) {
        weekDates.push(currentDate)
        currentDate = addDays(currentDate, 1)
      }
      weeks.push(weekDates)
    }

    // Obter meses únicos para labels
    const months = Array.from(
      new Set(dates.map((d) => format(d, "MMM", { locale: ptBR })))
    )

    return (
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Labels dos meses */}
          <div className="flex gap-1 text-xs text-gray-500 mb-2">
            {months.slice(0, 12).map((month, idx) => (
              <div key={idx} className="w-12">
                {month}
              </div>
            ))}
          </div>

          {/* Labels dos dias */}
          <div className="flex gap-1">
            {/* Coluna de labels */}
            <div className="flex flex-col gap-1 text-xs text-gray-500 mr-2">
              <div className="h-3">Seg</div>
              <div className="h-3">Ter</div>
              <div className="h-3">Qua</div>
              <div className="h-3">Qui</div>
              <div className="h-3">Sex</div>
              <div className="h-3">Sáb</div>
              <div className="h-3">Dom</div>
            </div>

            {/* Grid de células */}
            <div className="flex gap-1">
              {weeks.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-1">
                  {week.map((date, dayIdx) => {
                    const count = getWorkoutCount(date)
                    const colorClass = getIntensityColor(count)
                    const isInRange = dates.some((d) => isSameDay(d, date))

                    return (
                      <div
                        key={dayIdx}
                        className={`${isInRange ? colorClass : 'bg-[#0d1117]'} w-3 h-3 rounded-sm border border-[#30363d] cursor-pointer hover:ring-1 hover:ring-[#10b981] transition-all`}
                        onMouseEnter={(e) => isInRange && handleMouseEnter(e, date, count)}
                        onMouseLeave={handleMouseLeave}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Renderizar legenda
  const renderLegend = () => {
    return (
      <div className="flex items-center gap-2 text-xs text-gray-500 mt-4">
        <span>Menos</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-[#161b22] border border-[#30363d] rounded-sm" />
          <div className="w-3 h-3 bg-[#0e4429] border border-[#30363d] rounded-sm" />
          <div className="w-3 h-3 bg-[#006d32] border border-[#30363d] rounded-sm" />
          <div className="w-3 h-3 bg-[#10b981] border border-[#30363d] rounded-sm" />
        </div>
        <span>Mais</span>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Renderizar o layout apropriado baseado no período */}
      {period === 30 && render30Days()}
      {period === 90 && render90Days()}
      {period === 365 && render365Days()}

      {/* Legenda */}
      {renderLegend()}

      {/* Tooltip customizado */}
      {tooltip.show && (
        <div
          className="fixed z-50 px-3 py-2 text-xs text-white bg-[#21262d] rounded-md shadow-lg pointer-events-none"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: "translate(-50%, -100%)",
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  )
}
