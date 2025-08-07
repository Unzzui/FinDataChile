"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Clock } from "lucide-react"

interface FileStatusIndicatorProps {
  filePath: string
  productName: string
  isQuarterly?: boolean
}

export function FileStatusIndicator({ filePath, productName, isQuarterly }: FileStatusIndicatorProps) {
  const [status, setStatus] = useState<'checking' | 'available' | 'unavailable'>('checking')

  useEffect(() => {
    const checkFileStatus = async () => {
      try {
        const response = await fetch('/api/check-file', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ filePath }),
        })

        if (response.ok) {
          setStatus('available')
        } else {
          setStatus('unavailable')
        }
      } catch (error) {
        setStatus('unavailable')
      }
    }

    checkFileStatus()
  }, [filePath])

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'available':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'unavailable':
        return <AlertCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'checking':
        return 'Verificando...'
      case 'available':
        return isQuarterly ? 'Trimestral ✓' : 'Anual ✓'
      case 'unavailable':
        return 'No disponible'
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'checking':
        return 'bg-yellow-100 text-yellow-800'
      case 'available':
        return 'bg-green-100 text-green-800'
      case 'unavailable':
        return 'bg-red-100 text-red-800'
    }
  }

  return (
    <Badge className={`flex items-center gap-1 ${getStatusColor()}`}>
      {getStatusIcon()}
      {getStatusText()}
    </Badge>
  )
} 