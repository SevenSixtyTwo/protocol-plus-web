"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

export function ProtocolField({ field, onChange }) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (field.type === "group") {
    return (
      <div className="mb-4 border rounded-md p-4">
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          variant="ghost"
          className="w-full flex justify-between items-center mb-2"
        >
          <span className="font-semibold">{field.name}</span>
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        {isExpanded && (
          <div className="space-y-4">
            {field.fields.map((subField, index) => (
              <div key={index} className="ml-4">
                <Label htmlFor={`${field.name}-${subField.name}`}>{subField.name}</Label>
                <Input
                  id={`${field.name}-${subField.name}`}
                  value={subField.value}
                  onChange={(e) => onChange(field.name, index, "value", e.target.value)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="mb-4">
      <Label htmlFor={field.name}>{field.name}</Label>
      <Input
        id={field.name}
        value={field.value}
        onChange={(e) => onChange(field.name, null, "value", e.target.value)}
      />
    </div>
  )
}