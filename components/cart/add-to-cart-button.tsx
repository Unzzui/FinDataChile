'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Check } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface AddToCartButtonProps {
  productId: string
  userEmail?: string
  onCartUpdated?: () => void
  className?: string
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function AddToCartButton({ 
  productId, 
  userEmail, 
  onCartUpdated,
  className,
  variant = 'default',
  size = 'default'
}: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false)
  const [added, setAdded] = useState(false)
  const { toast } = useToast()

  const handleAddToCart = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail, productId }),
      })

      const data = await response.json()
      
      if (data.success) {
        setAdded(true)
        toast({
          title: "Producto agregado",
          description: data.message
        })
        
        // Notificar que el carrito se actualizó
        if (onCartUpdated) {
          onCartUpdated()
        }
        
        // Reset after 2 seconds
        setTimeout(() => setAdded(false), 2000)
      } else {
        toast({
          title: "Producto ya en carrito",
          description: data.message
        })
      }
    } catch (error) {
      console.error('Error agregando al carrito:', error)
      toast({
        title: "Error",
        description: "No se pudo agregar el producto al carrito",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={loading}
      className={className}
      variant={variant}
      size={size}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
      ) : added ? (
        <Check className="h-4 w-4" />
      ) : (
        <ShoppingCart className="h-4 w-4" />
      )}
      <span className="ml-2">
        {loading ? 'Agregando...' : added ? 'Agregado' : 'Agregar al Carrito'}
      </span>
    </Button>
  )
} 