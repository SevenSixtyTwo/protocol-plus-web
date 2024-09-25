"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

// Mock data for test tools
const testTools = [
  { id: 1, name: "Multimeter", serialNumber: "MM001", category: "Electrical" },
  { id: 2, name: "Oscilloscope", serialNumber: "OS001", category: "Electrical" },
  { id: 3, name: "Power Analyzer", serialNumber: "PA001", category: "Electrical" },
  { id: 4, name: "Torque Wrench", serialNumber: "TW001", category: "Mechanical" },
  { id: 5, name: "Vibration Analyzer", serialNumber: "VA001", category: "Mechanical" },
  { id: 6, name: "Thermal Camera", serialNumber: "TC001", category: "Thermal" },
]

export function TestToolSearch({ onSelect }) {
  const [search, setSearch] = useState("")
  const [results, setResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [showAllTools, setShowAllTools] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState({})
  const searchRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSearch = (value) => {
    setSearch(value)
    if (value.trim() === "") {
      setResults([])
      setShowResults(false)
    } else {
      const filteredTools = testTools.filter(tool =>
        tool.name.toLowerCase().includes(value.toLowerCase())
      )
      setResults(filteredTools)
      setShowResults(true)
    }
  }

  const handleSelect = (tool) => {
    onSelect(tool)
    setSearch("")
    setResults([])
    setShowResults(false)
  }

  const toggleAllTools = () => {
    setShowAllTools(!showAllTools)
    if (!showAllTools) {
      setExpandedCategories({})
    }
  }

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  const groupedTools = testTools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = []
    }
    acc[tool.category].push(tool)
    return acc
  }, {})

  return (
    <div className="mb-4" ref={searchRef}>
      <Label htmlFor="tool-search">Search Test Tools</Label>
      <Input
        id="tool-search"
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Enter tool name"
      />
      {showResults && results.length > 0 && (
        <ul className="mt-2 border rounded-md divide-y">
          {results.map(tool => (
            <li
              key={tool.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(tool)}
            >
              {tool.name} - {tool.serialNumber}
            </li>
          ))}
        </ul>
      )}
      <Button 
        onClick={toggleAllTools} 
        variant="outline" 
        className="mt-2 w-full flex justify-between items-center"
      >
        {showAllTools ? "Hide" : "Show"} All Tools
        {showAllTools ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>
      {showAllTools && (
        <div className="mt-2 border rounded-md p-4">
          {Object.entries(groupedTools).map(([category, tools]) => (
            <div key={category} className="mb-4">
              <Button
                onClick={() => toggleCategory(category)}
                variant="ghost"
                className="w-full flex justify-between items-center mb-2"
              >
                <span className="font-semibold">{category}</span>
                {expandedCategories[category] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              {expandedCategories[category] && (
                <ul className="space-y-1 ml-4">
                  {tools.map(tool => (
                    <li 
                      key={tool.id}
                      className="cursor-pointer hover:bg-gray-100 p-1 rounded"
                      onClick={() => handleSelect(tool)}
                    >
                      {tool.name} - {tool.serialNumber}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}