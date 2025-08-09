import Component from "../landing-page"
import type { Metadata } from 'next'

export default function Page() {
  return <Component />
}

export const metadata: Metadata = {
  title: 'FinData Chile — Estados Financieros Oficiales en Excel',
  description: 'Compra y descarga estados financieros oficiales CMF de empresas chilenas. Entrega inmediata.',
  alternates: { canonical: '/' },
}
