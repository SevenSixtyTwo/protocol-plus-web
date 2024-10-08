"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProtocolField } from "@/components/protocol-field"
import { TestToolSearch } from "@/components/test-tool-search"
import { MotorSearch } from "@/components/motor-search"
import { TemplateAndMotorTypeSelector } from "@/components/template-and-motor-type-selector"
import { getProtocolFields, submitTestReport, TestTool, Motor, FieldType } from "@/utils/api"

export function TestReportFormComponent() {
  const [protocolFields, setProtocolFields] = useState<FieldType[]>([])
  const [testTools, setTestTools] = useState<TestTool[]>([])
  const [motorInfo, setMotorInfo] = useState<Motor | null>(null)

  const generateProtocolFields = async (templateId: string, motorTypeId: string) => {
    try {
      const fields = await getProtocolFields(templateId, motorTypeId)
      setProtocolFields(fields)
    } catch (error) {
      console.error("Failed to fetch protocol fields:", error)
    }
  }

  const updateProtocolField = (fieldName: string, subIndex: number | null, key: string, value: string) => {
    setProtocolFields(prevFields => 
      prevFields.map(field => {
        if (field && field.name === fieldName) {
          if (field.type === "group" && field.fields && subIndex !== null) {
            return {
              ...field,
              fields: field.fields.map((subField, index) => 
                index === subIndex ? { ...subField, [key]: value } : subField
              )
            }
          } else {
            return { ...field, [key]: value }
          }
        }
        return field
      })
    )
  }

  const addTestTool = (tool: TestTool) => {
    setTestTools(prevTools => [...prevTools, tool])
  }

  const setMotor = (motor: Motor) => {
    setMotorInfo(motor)
  }

  const handleSubmitReport = async () => {
    if (!motorInfo) {
      console.error("No motor selected")
      return
    }

    try {
      await submitTestReport({
        protocolFields,
        testTools,
        motor: motorInfo
      })
      console.log("Test report submitted successfully")
      // Reset form or show success message
    } catch (error) {
      console.error("Failed to submit test report:", error)
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Electric Motor Acceptance Test Report</h1>

      <Card>
        <CardHeader>
          <CardTitle>Template and Motor Type Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <TemplateAndMotorTypeSelector onGenerate={generateProtocolFields} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Protocol Fields</CardTitle>
        </CardHeader>
        <CardContent>
          {protocolFields.map((field, index) => (
            <ProtocolField
              key={index}
              field={field}
              onChange={updateProtocolField}
            />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <TestToolSearch onSelect={addTestTool} />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tool Name</TableHead>
                <TableHead>Serial Number</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testTools.map((tool, index) => (
                <TableRow key={index}>
                  <TableCell>{tool.name}</TableCell>
                  <TableCell>{tool.serialNumber}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Electric Motor Information</CardTitle>
        </CardHeader>
        <CardContent>
          <MotorSearch onSelect={setMotor} />
          {motorInfo && (
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Model</TableCell>
                  <TableCell>{motorInfo.model}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Serial Number</TableCell>
                  <TableCell>{motorInfo.serialNumber}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Power</TableCell>
                  <TableCell>{motorInfo.power} kW</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Voltage</TableCell>
                  <TableCell>{motorInfo.voltage} V</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Button className="w-full" onClick={handleSubmitReport}>Generate Report</Button>
    </div>
  )
}