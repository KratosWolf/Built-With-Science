"use client"

import * as React from "react"
import { Calendar } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface TimeSelectorProps {
  selectedPeriod: number
  onPeriodChange: (days: number) => void
}

const TIME_PERIODS = [
  { value: 30, label: "30 dias" },
  { value: 90, label: "90 dias" },
  { value: 365, label: "365 dias" },
] as const

export function TimeSelector({ selectedPeriod, onPeriodChange }: TimeSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Calendar className="h-4 w-4 text-muted-foreground" />
      <Select
        value={selectedPeriod.toString()}
        onValueChange={(value) => onPeriodChange(Number(value))}
      >
        <SelectTrigger className="w-[140px] bg-[#0d1117] border-[#30363d] hover:bg-[#161b22] transition-colors">
          <SelectValue placeholder="Selecione o período" />
        </SelectTrigger>
        <SelectContent className="bg-[#0d1117] border-[#30363d]">
          {TIME_PERIODS.map((period) => (
            <SelectItem
              key={period.value}
              value={period.value.toString()}
              className="text-gray-300 hover:bg-[#161b22] hover:text-white focus:bg-[#161b22] focus:text-white data-[state=checked]:text-[#10b981]"
            >
              {period.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
