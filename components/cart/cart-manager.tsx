'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trash2, ShoppingCart, CreditCard } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface CartItem {
  id: number
  product_id: string
  company_name: string
  sector: string
  year_range: string
  price: number
  description: string
  created_at: string
}

interface CartManagerProps {
  userEmail: string
  onCheckout?: (items: CartItem[]) => void
}

export function CartManager({ userEmail, onCheckout }: CartManagerProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const loadCartItems = async () => {
    try {
      const response = await fetch(`/api/cart/items?userEmail=${encodeURIComponent(userEmail)}`)
      const data = await response.json()
      
      if (data.success) {
        setCartItems(data.items)
      }
    } catch (error) {
      console.error('Error cargando carrito:', error)
      toast({
        title: "Error",
        description: "No se pudo cargar el carrito",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = async (productId: string) => {
    try {
      const response = await fetch('/api/cart/remove', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail, productId }),
      })

      const data = await response.json()
      
      if (data.success) {
        setCartItems(prev => prev.filter(item => item.product_id !== productId))
        toast({
          title: "Producto removido",
          description: "El producto fue removido del carrito"
        })
      }
    } catch (error) {
      console.error('Error removiendo del carrito:', error)
      toast({
        title: "Error",
        description: "No se pudo remover el producto",
        variant: "destructive"
      })
    }
  }

  const clearCart = async () => {
    try {
      const response = await fetch('/api/cart/clear', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail }),
      })

      const data = await response.json()
      
      if (data.success) {
        setCartItems([])
        toast({
          title: "Carrito limpiado",
          description: "Todos los productos fueron removidos del carrito"
        })
      }
    } catch (error) {
      console.error('Error limpiando carrito:', error)
      toast({
        title: "Error",
        description: "No se pudo limpiar el carrito",
        variant: "destructive"
      })
    }
  }

  const handleCheckout = () => {
    if (onCheckout && cartItems.length > 0) {
      onCheckout(cartItems)
    }
  }

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0)
  const formatClp = (v: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(v)

  useEffect(() => {
    if (userEmail) {
      loadCartItems()
    }
  }, [userEmail])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Carrito de Compras
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Cargando...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Carrito de Compras
          </div>
          <Badge variant="secondary">
            {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {cartItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Tu carrito está vacío</p>
            <p className="text-sm">Agrega productos para comenzar</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{item.company_name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {item.sector} • {item.year_range}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{formatClp(Number(item.price || 0))}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromCart(item.product_id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium">Total:</span>
                <span className="font-bold text-lg">{formatClp(totalPrice)}</span>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="flex-1"
                >
                  Limpiar Carrito
                </Button>
                <Button
                  onClick={handleCheckout}
                  className="flex-1"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Proceder al Pago
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 