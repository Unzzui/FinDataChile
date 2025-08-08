"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, Eye, EyeOff, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const { user } = await response.json()
        
        // Guardar datos del usuario en localStorage
        localStorage.setItem("user", JSON.stringify(user))
        
        toast({
          title: "Login exitoso",
          description: `Bienvenido, ${user.name}`,
        })
        
        router.push("/perfil")
      } else {
        const { error } = await response.json()
        setError(error || "Credenciales inválidas")
        toast({
          title: "Error de login",
          description: error || "Credenciales inválidas",
          variant: "destructive",
        })
      }
    } catch (error) {
      setError("Error de conexión")
      toast({
        title: "Error",
        description: "Error de conexión",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
            <Lock className="h-6 w-6 text-gray-600" />
          </div>
          <h2 className="mt-6 text-3xl font-light text-gray-900">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-sm text-gray-600 font-light">
            Accede a tu cuenta para ver tus compras
          </p>
        </div>

        <Card className="rounded-xl border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-center font-light text-gray-900">Acceso a tu cuenta</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-light text-gray-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="rounded-lg border-gray-200"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="font-light text-gray-700">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tu contraseña"
                    className="pr-10 rounded-lg border-gray-200"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="rounded-lg">
                  <AlertDescription className="font-light">{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-gray-900 hover:bg-gray-800 font-light rounded-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 font-light">
                ¿No tienes cuenta?{" "}
                <Link href="/registro" className="text-gray-900 hover:text-gray-700 font-light hover:underline">
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link href="/">
            <Button variant="outline" size="sm" className="font-light rounded-lg border-gray-200 text-gray-700 hover:bg-gray-50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 