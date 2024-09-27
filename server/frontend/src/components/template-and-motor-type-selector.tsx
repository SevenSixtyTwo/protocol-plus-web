"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

const templates = [
  { id: "template1", name: "Standard Test Protocol" },
  { id: "template2", name: "Extended Performance Test" },
  { id: "template3", name: "Safety Compliance Check" },
]

const motorTypes = [
  { id: "type1", name: "AC Induction Motor" },
  { id: "type2", name: "DC Motor" },
  { id: "type3", name: "Synchronous Motor" },
]

type TemplateAndMotorTypeSelectorProps = {
  onGenerate: (templateId: string, motorTypeId: string) => void;
}

export function TemplateAndMotorTypeSelector({ onGenerate }: TemplateAndMotorTypeSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [selectedMotorType, setSelectedMotorType] = useState<string>("")

  const handleGenerate = () => {
    if (selectedTemplate && selectedMotorType) {
      onGenerate(selectedTemplate, selectedMotorType)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="template-select" className="block text-sm font-medium text-gray-700">
          Select Document Template
        </label>
        <Select onValueChange={setSelectedTemplate}>
          <SelectTrigger id="template-select">
            <SelectValue placeholder="Select a template" />
          </SelectTrigger>
          <SelectContent>
            {templates.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                {template.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label htmlFor="motor-type-select" className="block text-sm font-medium text-gray-700">
          Select Motor Type
        </label>
        <Select onValueChange={setSelectedMotorType}>
          <SelectTrigger id="motor-type-select">
            <SelectValue placeholder="Select a motor type" />
          </SelectTrigger>
          <SelectContent>
            {motorTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button onClick={handleGenerate} disabled={!selectedTemplate || !selectedMotorType}>
        Generate Protocol Fields
      </Button>
    </div>
  )
}