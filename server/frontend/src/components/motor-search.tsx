"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

// Mock data for electric motors
const electricMotors = [
  { id: 1, model: "EM100", serialNumber: "EM001", power: 5, voltage: 220, category: "AC Induction" },
  { id: 2, model: "EM200", serialNumber: "EM002", power: 10, voltage: 380, category: "AC Induction" },
  { id: 3, model: "EM300", serialNumber: "EM003", power: 15, voltage: 440, category: "AC Induction" },
  { id: 4, model: "DC100", serialNumber: "DC001", power: 3, voltage: 24, category: "DC Motor" },
  { id: 5, model: "DC200", serialNumber: "DC002", power: 7, voltage: 48, category: "DC Motor" },
  { id: 6, model: "SM100", serialNumber: "SM001", power: 20, voltage: 480, category: "Synchronous" },
]

export function MotorSearch({ onSelect }) {
  const [search, setSearch] = useState("")
  const [results, setResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [showAllMotors, setShowAllMotors] = useState(false)
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
      const filteredMotors = electricMotors.filter(motor =>
        motor.model.toLowerCase().includes(value.toLowerCase()) ||
        motor.serialNumber.toLowerCase().includes(value.toLowerCase())
      )
      setResults(filteredMotors)
      setShowResults(true)
    }
  }

  const handleSelect = (motor) => {
    onSelect(motor)
    setSearch("")
    setResults([])
    setShowResults(false)
  }

  const toggleAllMotors = () => {
    setShowAllMotors(!showAllMotors)
    if (!showAllMotors) {
      setExpandedCategories({})
    }
  }

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  const groupedMotors = electricMotors.reduce((acc, motor) => {
    if (!acc[motor.category]) {
      acc[motor.category] = []
    }
    acc[motor.category].push(motor)
    return acc
  }, {})

  return (
    <div className="mb-4" ref={searchRef}>
      <Label htmlFor="motor-search">Search Electric Motors</Label>
      <Input
        id="motor-search"
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Enter motor model or serial number"
      />
      {showResults && results.length > 0 && (
        <ul className="mt-2 border rounded-md divide-y">
          {results.map(motor => (
            <li
              key={motor.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(motor)}
            >
              {motor.model} - {motor.serialNumber}
            </li>
          ))}
        </ul>
      )}
      <Button 
        onClick={toggleAllMotors} 
        variant="outline" 
        className="mt-2 w-full flex justify-between items-center"
      >
        {showAllMotors ? "Hide" : "Show"} All Motors
        {showAllMotors ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>
      {showAllMotors && (
        <div className="mt-2 border rounded-md p-4">
          {Object.entries(groupedMotors).map(([category, motors]) => (
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
                  {motors.map(motor => (
                    <li 
                      key={motor.id}
                      className="cursor-pointer hover:bg-gray-100 p-1 rounded"
                      onClick={() => handleSelect(motor)}
                    >
                      {motor.model} - {motor.serialNumber} ({motor.power} kW, {motor.voltage} V)
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