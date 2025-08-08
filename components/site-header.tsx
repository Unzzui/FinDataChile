"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { FileSpreadsheet, User as UserIcon, Menu, ShoppingCart, ShoppingBag, Package, Home, LogIn, UserPlus, CreditCard, LogOut, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CartWidget } from "@/components/cart/cart-widget"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"

export function SiteHeader() {
  const pathname = usePathname()
  const [user, setUser] = useState<{ email: string; name?: string } | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {}
    try {
      localStorage.removeItem('user')
      localStorage.removeItem('userEmail')
    } catch {}
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cart:updated'))
      window.location.href = '/'
    }
  }

  useEffect(() => {
    let mounted = true
    fetch('/api/auth/me').then(async (r) => {
      if (!mounted) return
      if (r.ok) {
        const data = await r.json()
        if (data?.authenticated) {
          setUser({ email: data.user?.email, name: data.user?.name })
        } else {
          setUser(null)
        }
      }
    }).catch(() => setUser(null))
    // cargar conteo de carrito
    const loadCartCount = async () => {
      try {
        const resp = await fetch('/api/cart/count')
        const data = await resp.json()
        if (data?.success && typeof data.count === 'number') setCartCount(data.count)
      } catch {}
    }
    loadCartCount()
    const onUpdated = () => loadCartCount()
    window.addEventListener('cart:updated', onUpdated as EventListener)
    window.addEventListener('focus', onUpdated as EventListener)
    return () => { mounted = false; window.removeEventListener('cart:updated', onUpdated as EventListener); window.removeEventListener('focus', onUpdated as EventListener) }
  }, [pathname, user?.email])

  const navItem = (href: string, label: string) => {
    const isActive = pathname === href
    return (
      <Link
        href={href}
        className={`text-[15px] md:text-base font-light px-3 py-2 rounded-md transition-colors ${
          isActive
            ? "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200"
            : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
        }`}
      >
        {label}
      </Link>
    )
  }

  return (
    <header className="sticky top-0 z-50 px-6 lg:px-12 h-18 md:h-20 flex items-center border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto grid grid-cols-[auto_1fr_auto] items-center gap-2">
        <Link href="/" className="flex items-center gap-2 md:gap-3 ml-1 md:ml-2 lg:ml-4">
          <img src="/logo-horizontal.svg" alt="FinData Chile" className="h-14 md:h-16 lg:h-20 w-auto" />
        </Link>

        <nav className="hidden sm:flex items-center gap-5 md:gap-8 justify-center">
          {navItem("/", "Inicio")}
          {navItem("/tienda", "Productos")}
          {process.env.NEXT_PUBLIC_SUBSCRIPTIONS_ENABLED === 'true' && navItem("/suscripciones", "Suscripciones")}
          {navItem("/compras", "Mis Compras")}
          {navItem("/preguntas", "Preguntas")}
        </nav>

        <div className="flex items-center justify-end gap-1 sm:gap-2">
          {/* Mobile menu button */}
          <button
            className="sm:hidden inline-flex items-center justify-center h-10 w-10 rounded-md border hover:bg-gray-50"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" />
          </button>
          <CartWidget />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hidden sm:flex items-center gap-2 rounded-full border px-2 py-1 hover:bg-gray-50 max-w-[60vw]">
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarFallback>{(user.name || user.email || '?').charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-sm text-gray-700 max-w-[160px] truncate">{user.name || user.email}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/perfil">Perfil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/compras">Mis Compras</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/login">
                <Button variant="outline" className="bg-transparent text-sm">Login</Button>
              </Link>
              <Link href="/registro" className="hidden sm:block">
                <Button className="bg-blue-600 hover:bg-blue-700 text-sm">Crear cuenta</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sheet Menu */}
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent side="left" className="w-full sm:max-w-xs">
          <SheetHeader>
            <SheetTitle>Menú</SheetTitle>
            <SheetDescription>Navega por el sitio</SheetDescription>
          </SheetHeader>
          <div className="mt-2 space-y-4 px-1">
            {/* Usuario / Auth */}
            <div className="rounded-lg border bg-white/70 p-2 sm:p-3">
              <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{(user?.name || user?.email || '?').charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
                <div className="min-w-0 flex-1">
                {user ? (
                  <>
                    <p className="font-medium truncate">{user.name || user.email}</p>
                    <p className="text-xs text-gray-600 truncate">{user.email}</p>
                  </>
                ) : (
                  <p className="text-sm text-gray-700">Bienvenido(a). Inicia sesión o crea tu cuenta.</p>
                )}
              </div>
                {!user && (
                  <div className="hidden xs:flex gap-2">
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="whitespace-nowrap"><LogIn className="h-4 w-4 mr-1" /> Login</Button>
                    </Link>
                    <Link href="/registro" onClick={() => setIsMenuOpen(false)}>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap"><UserPlus className="h-4 w-4 mr-1" /> Crear</Button>
                    </Link>
                  </div>
                )}
              </div>
               {user ? (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Link href="/perfil" onClick={() => setIsMenuOpen(false)} className="col-span-1">
                    <Button variant="outline" className="w-full justify-center h-10 text-sm"><UserIcon className="h-4 w-4 mr-2" /> Perfil</Button>
                  </Link>
                  <Button variant="outline" onClick={() => { setIsMenuOpen(false); handleLogout() }} className="w-full justify-center h-10 text-sm border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400">
                    <LogOut className="h-4 w-4 mr-2" /> Cerrar sesión
                  </Button>
                </div>
              ) : (
                <div className="mt-2 flex gap-2 sm:hidden">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)} className="flex-1">
                    <Button variant="outline" className="w-full justify-center h-10 text-sm"><LogIn className="h-4 w-4 mr-2" /> Login</Button>
                  </Link>
                  <Link href="/registro" onClick={() => setIsMenuOpen(false)} className="flex-1">
                    <Button className="w-full justify-center h-10 text-sm bg-blue-600 hover:bg-blue-700"><UserPlus className="h-4 w-4 mr-2" /> Crear cuenta</Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Acciones rápidas */}
            <div className="flex flex-col gap-2">
              <Button
                className="w-full justify-center h-10 text-sm bg-white text-slate-800 border border-slate-200 hover:bg-slate-50"
                onClick={() => { setIsMenuOpen(false); window.location.href = '/carrito' }}
              >
                <ShoppingCart className="h-4 w-4 mr-2 text-blue-700" />
                Ver carrito
                {cartCount > 0 && (
                  <span className="ml-2 rounded-full bg-sky-600 text-white text-[11px] px-2 py-0.5">{cartCount}</span>
                )}
              </Button>
              <Button variant="outline" className="w-full justify-center h-10 text-sm" onClick={() => { setIsMenuOpen(false); window.location.href = '/compras' }}>
                <Package className="h-4 w-4 mr-2" />
                Mis Compras
              </Button>
            </div>

            <div className="border-t" />

            {/* Navegación */}
            <nav className="flex flex-col gap-1">
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-sm py-2 mx-1 flex items-center justify-center gap-2 rounded-md hover:bg-gray-50"><Home className="h-4 w-4" /> Inicio</Link>
              <Link href="/tienda" onClick={() => setIsMenuOpen(false)} className="text-sm py-2 mx-1 flex items-center justify-center gap-2 rounded-md hover:bg-gray-50"><ShoppingBag className="h-4 w-4" /> Productos</Link>
              {process.env.NEXT_PUBLIC_SUBSCRIPTIONS_ENABLED === 'true' && (
                <Link href="/suscripciones" onClick={() => setIsMenuOpen(false)} className="text-sm py-2 mx-1 flex items-center justify-center gap-2 rounded-md hover:bg-gray-50"><CreditCard className="h-4 w-4" /> Suscripciones</Link>
              )}
              <Link href="/compras" onClick={() => setIsMenuOpen(false)} className="text-sm py-2 mx-1 flex items-center justify-center gap-2 rounded-md hover:bg-gray-50"><Package className="h-4 w-4" /> Mis Compras</Link>
              <Link href="/preguntas" onClick={() => setIsMenuOpen(false)} className="text-sm py-2 mx-1 flex items-center justify-center gap-2 rounded-md hover:bg-gray-50"><HelpCircle className="h-4 w-4" /> Preguntas</Link>
              {null}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}


