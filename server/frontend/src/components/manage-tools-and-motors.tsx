"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Pencil, Trash2 } from "lucide-react"
import { getTools, addTool, updateTool, deleteTool, getMotors, addMotor, updateMotor, deleteMotor, TestTool, Motor } from "@/utils/api"
import { CategoryCombobox } from "@/components/components-category-combobox"

export function ManageToolsAndMotorsComponent() {
  const [tools, setTools] = useState<TestTool[]>([])
  const [motors, setMotors] = useState<Motor[]>([])
  const [editingTool, setEditingTool] = useState<TestTool | null>(null)
  const [editingMotor, setEditingMotor] = useState<Motor | null>(null)

  const [newTool, setNewTool] = useState<Omit<TestTool, 'id'>>({ name: "", serialNumber: "", category: "" })
  const [newMotor, setNewMotor] = useState<Omit<Motor, 'id'>>({ model: "", serialNumber: "", power: 0, voltage: 0, category: "" })

  const [toolCategories, setToolCategories] = useState<string[]>([])
  const [motorCategories, setMotorCategories] = useState<string[]>([])

  useEffect(() => {
    fetchTools()
    fetchMotors()
  }, [])

  const fetchTools = async () => {
    try {
      const fetchedTools = await getTools()
      setTools(fetchedTools)
      const categories = [...new Set(fetchedTools.map(tool => tool.category))]
      setToolCategories(categories.filter((category): category is string => category !== undefined))
    } catch (error) {
      console.error("Failed to fetch tools:", error)
    }
  }

  const fetchMotors = async () => {
    try {
      const fetchedMotors = await getMotors()
      setMotors(fetchedMotors)
      const categories = [...new Set(fetchedMotors.map(motor => motor.category))]
      setMotorCategories(categories.filter((category): category is string => category !== undefined))
    } catch (error) {
      console.error("Failed to fetch motors:", error)
    }
  }

  const handleAddTool = async () => {
    try {
      const addedTool = await addTool(newTool)
      setTools([...tools, addedTool])
      setNewTool({ name: "", serialNumber: "", category: "" })
      if (addedTool.category && !toolCategories.includes(addedTool.category)) {
        setToolCategories([...toolCategories, addedTool.category])
      }
    } catch (error) {
      console.error("Failed to add tool:", error)
    }
  }

  const handleUpdateTool = async () => {
    if (editingTool) {
      try {
        const updatedTool = await updateTool(editingTool)
        setTools(tools.map(tool => tool.id === updatedTool.id ? updatedTool : tool))
        setEditingTool(null)
        if (updatedTool.category && !toolCategories.includes(updatedTool.category)) {
          setToolCategories([...toolCategories, updatedTool.category])
        }
      } catch (error) {
        console.error("Failed to update tool:", error)
      }
    }
  }

  const handleDeleteTool = async (id: number) => {
    try {
      await deleteTool(id)
      setTools(tools.filter(tool => tool.id !== id))
    } catch (error) {
      console.error("Failed to delete tool:", error)
    }
  }

  const handleAddMotor = async () => {
    try {
      const addedMotor = await addMotor(newMotor)
      setMotors([...motors, addedMotor])
      setNewMotor({ model: "", serialNumber: "", power: 0, voltage: 0, category: "" })
      if (addedMotor.category && !motorCategories.includes(addedMotor.category)) {
        setMotorCategories([...motorCategories, addedMotor.category])
      }
    } catch (error) {
      console.error("Failed to add motor:", error)
    }
  }

  const handleUpdateMotor = async () => {
    if (editingMotor) {
      try {
        const updatedMotor = await updateMotor(editingMotor)
        setMotors(motors.map(motor => motor.id === updatedMotor.id ? updatedMotor : motor))
        setEditingMotor(null)
        if (updatedMotor.category && !motorCategories.includes(updatedMotor.category)) {
          setMotorCategories([...motorCategories, updatedMotor.category])
        }
      } catch (error) {
        console.error("Failed to update motor:", error)
      }
    }
  }

  const handleDeleteMotor = async (id: number) => {
    try {
      await deleteMotor(id)
      setMotors(motors.filter(motor => motor.id !== id))
    } catch (error) {
      console.error("Failed to delete motor:", error)
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Manage Tools and Motors</h1>

      <Tabs defaultValue="tools">
        <TabsList>
          <TabsTrigger value="tools">Tools</TabsTrigger>
          <TabsTrigger value="motors">Motors</TabsTrigger>
        </TabsList>

        <TabsContent value="tools">
          <Card>
            <CardHeader>
              <CardTitle>Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="toolName">Name</Label>
                    <Input
                      id="toolName"
                      value={editingTool ? editingTool.name : newTool.name}
                      onChange={(e) => editingTool ? setEditingTool({ ...editingTool, name: e.target.value }) : setNewTool({ ...newTool, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="toolSerialNumber">Serial Number</Label>
                    <Input
                      id="toolSerialNumber"
                      value={editingTool ? editingTool.serialNumber : newTool.serialNumber}
                      onChange={(e) => editingTool ? setEditingTool({ ...editingTool, serialNumber: e.target.value }) : setNewTool({ ...newTool, serialNumber: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="toolCategory">Category</Label>
                    <CategoryCombobox
                      categories={toolCategories}
                      value={editingTool ? editingTool.category : newTool.category}
                      onChange={(value) => editingTool ? setEditingTool({ ...editingTool, category: value }) : setNewTool({ ...newTool, category: value })}
                    />
                  </div>
                </div>
                <Button onClick={editingTool ? handleUpdateTool : handleAddTool}>
                  {editingTool ? "Update Tool" : "Add Tool"}
                </Button>
              </div>

              <Table className="mt-4">
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Serial Number</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tools.map((tool) => (
                    <TableRow key={tool.id}>
                      <TableCell>{tool.name}</TableCell>
                      <TableCell>{tool.serialNumber}</TableCell>
                      <TableCell>{tool.category}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => setEditingTool(tool)}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteTool(tool.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="motors">
          <Card>
            <CardHeader>
              <CardTitle>Motors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-5 gap-4">
                  <div>
                    <Label htmlFor="motorModel">Model</Label>
                    <Input
                      id="motorModel"
                      value={editingMotor ? editingMotor.model : newMotor.model}
                      onChange={(e) => editingMotor ? setEditingMotor({ ...editingMotor, model: e.target.value }) : setNewMotor({ ...newMotor, model: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="motorSerialNumber">Serial Number</Label>
                    <Input
                      id="motorSerialNumber"
                      value={editingMotor ? editingMotor.serialNumber : newMotor.serialNumber}
                      onChange={(e) => editingMotor ? setEditingMotor({ ...editingMotor, serialNumber: e.target.value }) : setNewMotor({ ...newMotor, serialNumber: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="motorPower">Power (kW)</Label>
                    <Input
                      id="motorPower"
                      type="number"
                      value={editingMotor ? editingMotor.power : newMotor.power}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        editingMotor ? setEditingMotor({ ...editingMotor, power: value }) : setNewMotor({ ...newMotor, power: value });
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="motorVoltage">Voltage (V)</Label>
                    <Input
                      id="motorVoltage"
                      type="number"
                      value={editingMotor ? editingMotor.voltage : newMotor.voltage}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        editingMotor ? setEditingMotor({ ...editingMotor, voltage: value }) : setNewMotor({ ...newMotor, voltage: value });
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="motorCategory">Category</Label>
                    <CategoryCombobox
                      categories={motorCategories}
                      value={editingMotor ? editingMotor.category : newMotor.category}
                      onChange={(value) => editingMotor ? setEditingMotor({ ...editingMotor, category: value }) : setNewMotor({ ...newMotor, category: value })}
                    />
                  </div>
                </div>
                <Button onClick={editingMotor ? handleUpdateMotor : handleAddMotor}>
                  {editingMotor ? "Update Motor" : "Add Motor"}
                </Button>
              </div>

              <Table className="mt-4">
                <TableHeader>
                  <TableRow>
                    <TableHead>Model</TableHead>
                    <TableHead>Serial Number</TableHead>
                    <TableHead>Power (kW)</TableHead>
                    <TableHead>Voltage (V)</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {motors.map((motor) => (
                    <TableRow key={motor.id}>
                      <TableCell>{motor.model}</TableCell>
                      <TableCell>{motor.serialNumber}</TableCell>
                      <TableCell>{motor.power}</TableCell>
                      <TableCell>{motor.voltage}</TableCell>
                      <TableCell>{motor.category}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => setEditingMotor(motor)}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteMotor(motor.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}