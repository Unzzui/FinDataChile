"use client"

import { useEffect, useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Link from 'next/link'

type Company = {
  id: number
  razon_social: string
  rut?: string | null
  rut_numero?: number | null
  rut_dv?: string | null
  ticker?: string | null
  descripcion_empresa?: string | null
  sitio_empresa?: string | null
}

export default function CompanyManager() {
  const [query, setQuery] = useState('')
  const [items, setItems] = useState<Company[]>([])
  const [loading, setLoading] = useState(false)
  const [savingId, setSavingId] = useState<number | null>(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 50
  const [sort, setSort] = useState<'name_asc' | 'name_desc' | 'updated_desc' | 'updated_asc'>('name_asc')
  const [onlyMissingTicker, setOnlyMissingTicker] = useState(false)
  const [onlyMissingDescription, setOnlyMissingDescription] = useState(false)
  const [onlyWithProducts, setOnlyWithProducts] = useState(false)
  const [editing, setEditing] = useState<Record<number, boolean>>({})
  const [drafts, setDrafts] = useState<Record<number, { ticker: string; sitio_empresa: string; descripcion_empresa: string }>>({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalCompany, setModalCompany] = useState<Company | null>(null)
  const [modalDraft, setModalDraft] = useState<{ ticker: string; sitio_empresa: string; descripcion_empresa: string }>({ ticker: '', sitio_empresa: '', descripcion_empresa: '' })
  const [debouncedQuery, setDebouncedQuery] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('q', debouncedQuery)
      params.set('limit', String(pageSize))
      params.set('offset', String((page-1)*pageSize))
      params.set('sort', sort)
      if (onlyMissingTicker) params.set('missingTicker', '1')
      if (onlyMissingDescription) params.set('missingDescription', '1')
      if (onlyWithProducts) params.set('hasProducts', '1')
      const r = await fetch(`/api/admin/companies?${params.toString()}`)
      const j = await r.json()
      if (j?.success) { setItems(j.items); setTotal(j.total || 0) }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const h = setTimeout(() => {
      setDebouncedQuery(query)
      setPage(1)
    }, 350)
    return () => clearTimeout(h)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sort, onlyMissingTicker, onlyMissingDescription, onlyWithProducts, debouncedQuery])

  const filtered = useMemo(() => items, [items])

  const normalizeSite = (val: string | null | undefined): string | null => {
    const v = (val || '').trim()
    if (!v) return null
    const withScheme = /^https?:\/\//i.test(v) ? v : `https://${v}`
    try {
      // Validar URL básica
      const u = new URL(withScheme)
      return u.href
    } catch {
      return withScheme
    }
  }

  const save = async (c: Company, updates: Partial<Company>) => {
    setSavingId(c.id)
    try {
      if (Object.prototype.hasOwnProperty.call(updates, 'sitio_empresa')) {
        updates.sitio_empresa = normalizeSite(updates.sitio_empresa as any)
      }
      const r = await fetch('/api/admin/companies/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: c.id, ...updates })
      })
      const j = await r.json()
      if (j?.success) {
        setItems(prev => prev.map(it => it.id === c.id ? { ...it, ...updates } : it))
        setEditing(prev => ({ ...prev, [c.id]: false }))
        setDrafts(prev => { const { [c.id]: _, ...rest } = prev; return rest })
      }
    } catch (e) {
      console.error(e)
    } finally {
      setSavingId(null)
    }
  }

  const startEdit = (c: Company) => {
    setModalCompany(c)
    setModalDraft({
      ticker: c.ticker || '',
      sitio_empresa: c.sitio_empresa || '',
      descripcion_empresa: c.descripcion_empresa || '',
    })
    setIsModalOpen(true)
  }

  const cancelEdit = () => {
    setIsModalOpen(false)
    setModalCompany(null)
  }

  const saveModal = async () => {
    if (!modalCompany) return
    const payload = {
      ticker: modalDraft.ticker.trim() || null,
      sitio_empresa: modalDraft.sitio_empresa.trim() || null,
      descripcion_empresa: modalDraft.descripcion_empresa.trim() || null,
    }
    await save(modalCompany, payload)
    setIsModalOpen(false)
    setModalCompany(null)
  }

  const truncate = (s: string, n: number) => (s.length > n ? `${s.slice(0, n)}…` : s)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Empresas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Input placeholder="Buscar por razón social o ticker" value={query} onChange={e => setQuery(e.target.value)} className="w-full md:w-80" />
          <Button onClick={() => { setDebouncedQuery(query); setPage(1); load() }} disabled={loading}>{loading ? 'Buscando…' : 'Buscar'}</Button>
          <select className="border rounded p-2 text-sm" value={sort} onChange={e => { setPage(1); setSort(e.target.value as any) }}>
            <option value="name_asc">Nombre A-Z</option>
            <option value="name_desc">Nombre Z-A</option>
            <option value="updated_desc">Actualizado reciente</option>
            <option value="updated_asc">Actualizado antiguo</option>
          </select>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={onlyMissingTicker} onChange={e => { setPage(1); setOnlyMissingTicker(e.target.checked) }} />
            Sin ticker
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={onlyMissingDescription} onChange={e => { setPage(1); setOnlyMissingDescription(e.target.checked) }} />
            Sin descripción
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={onlyWithProducts} onChange={e => { setPage(1); setOnlyWithProducts(e.target.checked) }} />
            Tiene producto activo
          </label>
          <div className="ml-auto text-sm text-slate-600">{total} empresas</div>
        </div>

        <div className="overflow-auto rounded border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[260px]">Razón Social</TableHead>
                <TableHead className="min-w-[130px]">RUT</TableHead>
                <TableHead className="min-w-[120px]">Ticker</TableHead>
                <TableHead className="min-w-[220px]">Sitio Empresa</TableHead>
                <TableHead className="min-w-[360px]">Descripción</TableHead>
                <TableHead className="w-[200px] text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(c => {
                const isEditing = false
                const d = undefined
                const rutText = c.rut || (c.rut_numero && c.rut_dv ? `${c.rut_numero}-${c.rut_dv}` : '')
                const fullDesc = c.descripcion_empresa || ''
                const descShort = fullDesc.length > 20 ? `${fullDesc.slice(0, 20)}…` : fullDesc
                const siteHref = c.sitio_empresa ? (/^https?:\/\//i.test(c.sitio_empresa) ? c.sitio_empresa : `https://${c.sitio_empresa}`) : ''
                const siteShort = c.sitio_empresa ? truncate(c.sitio_empresa.replace(/^https?:\/\//i, ''), 24) : ''
                return (
                  <TableRow key={c.id} className="cursor-pointer hover:bg-slate-50" onClick={() => startEdit(c)}>
                    <TableCell title={c.razon_social} className="max-w-[320px] truncate">{c.razon_social}</TableCell>
                    <TableCell className="text-xs text-slate-600">{rutText}</TableCell>
                    <TableCell>
                      <span className="text-sm">{c.ticker || <span className="text-slate-400">—</span>}</span>
                    </TableCell>
                    <TableCell>
                      {c.sitio_empresa ? <a href={siteHref} target="_blank" rel="noreferrer noopener" className="text-blue-600 hover:underline break-all" title={c.sitio_empresa}>{siteShort}</a> : <span className="text-slate-400">—</span>}
                    </TableCell>
                    <TableCell className="align-top" title={fullDesc}>
                      <span className="text-sm text-slate-700 break-words">{descShort || <span className="text-slate-400">—</span>}</span>
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => { e.stopPropagation(); }}>
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/empresa/${encodeURIComponent(c.razon_social.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/&/g,'-').replace(/[^a-z0-9]+/g,'-').replace(/-s-a(?:-[a-z0-9]+)*/g,'').replace(/^-+|-+$/g,''))}`} className="text-blue-600 text-sm hover:underline">Ver</Link>
                        <Button variant="outline" size="sm" onClick={() => startEdit(c)}>Editar</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar empresa</DialogTitle>
              <DialogDescription>{modalCompany?.razon_social}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-3">
              <div>
                <label className="text-xs text-slate-600">Ticker</label>
                <Input value={modalDraft.ticker} onChange={e => setModalDraft(prev => ({ ...prev, ticker: e.target.value }))} placeholder="Ej: CENCOSUD" />
              </div>
              <div>
                <label className="text-xs text-slate-600">Sitio Empresa</label>
                <Input value={modalDraft.sitio_empresa} onChange={e => setModalDraft(prev => ({ ...prev, sitio_empresa: e.target.value }))} placeholder="https://…" />
              </div>
              <div>
                <label className="text-xs text-slate-600">Descripción</label>
                <Textarea rows={5} value={modalDraft.descripcion_empresa} onChange={e => setModalDraft(prev => ({ ...prev, descripcion_empresa: e.target.value }))} />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => cancelEdit()}>Cancelar</Button>
              <Button onClick={saveModal} disabled={savingId === modalCompany?.id}>{savingId === modalCompany?.id ? 'Guardando…' : 'Guardar'}</Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-500">Página {page} de {Math.max(1, Math.ceil(total / pageSize))}</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1 || loading} onClick={() => setPage(p => Math.max(1, p-1))}>Anterior</Button>
            <Button variant="outline" size="sm" disabled={(page * pageSize) >= total || loading} onClick={() => setPage(p => p+1)}>Siguiente</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


