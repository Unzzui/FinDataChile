"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface LogoutButtonProps {
  onLogout: () => void
}

export function LogoutButton({ onLogout }: LogoutButtonProps) {
  const { toast } = useToast()

  const handleLogout = () => {
    // Limpiar localStorage
    localStorage.removeItem('adminAuthenticated')
    
    toast({
      title: "Sesión cerrada",
      description: "Has salido del panel de administración",
    })
    
    onLogout()
  }

  return (
    <Button
      onClick={handleLogout}
      variant="outline"
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
    >
      <LogOut className="h-4 w-4 mr-2" />
      Cerrar Sesión
    </Button>
  )
} 