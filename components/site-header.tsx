"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CartWidget } from "@/components/cart/cart-widget"

export function SiteHeader() {
  const pathname = usePathname()

  const navItem = (href: string, label: string) => {
    const isActive = pathname === href
    return (
      <Link
        href={href}
        className={`text-sm font-medium transition-colors ${
          isActive ? "text-green-700" : "text-gray-600 hover:text-green-600"
        }`}
      >
        {label}
      </Link>
    )
  }

  return (
    <header className="sticky top-0 z-50 px-4 lg:px-6 h-16 flex items-center border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <FileSpreadsheet className="h-6 w-6 md:h-7 md:w-7 text-green-600" />
          <span className="font-bold text-lg md:text-xl text-gray-900">FinData Chile</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navItem("/", "Inicio")}
          {navItem("/tienda", "Productos")}
          {navItem("/suscripciones", "Suscripciones")}
          {navItem("/compras", "Mis Compras")}
        </nav>

        <div className="flex items-center gap-2">
          <CartWidget />
          <Link href="/login">
            <Button variant="outline" className="bg-transparent text-sm">Login</Button>
          </Link>
          <Link href="/registro" className="hidden sm:block">
            <Button className="bg-green-600 hover:bg-green-700 text-sm">Crear cuenta</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}


