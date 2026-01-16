// src/components/HomeRecommendations.jsx
import { useEffect, useMemo, useState } from 'react'
import ProductCard from './ProductCard'

export default function HomeRecommendations() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        setLoading(true)
        setErr('')

        const res = await fetch('/api/products', {
          headers: { Accept: 'application/json' },
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const data = await res.json()
        const list = Array.isArray(data) ? data : data?.items ?? []

        if (!alive) return
        setItems(list)
      } catch (e) {
        console.error('[popular products] fetch failed:', e)
        if (!alive) return
        setErr('Failed to load popular products.')
      } finally {
        if (!alive) return
        setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  const top8 = useMemo(() => {
    const num = (v) => {
      const n = Number(v)
      return Number.isFinite(n) ? n : -Infinity
    }

    return [...items]
      .filter((p) => p?.isActive !== false)
      .sort((a, b) => num(b?.sort) - num(a?.sort))
      .slice(0, 8)
  }, [items])

  const pageSize = 4
  const pages = useMemo(() => {
    const out = []
    for (let i = 0; i < top8.length; i += pageSize) out.push(top8.slice(i, i + pageSize))
    return out
  }, [top8])

  const [page, setPage] = useState(0)
  useEffect(() => {
    if (page > Math.max(0, pages.length - 1)) setPage(0)
  }, [pages.length, page])

  const canSlide = pages.length > 1
  const prev = () => setPage((p) => (p - 1 + pages.length) % pages.length)
  const next = () => setPage((p) => (p + 1) % pages.length)

  return (
    <section className="w-full pt-8 pb-8">
      {/* ✅ 内容对齐到和上面同一条栅格 */}
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-4 py-12">

        {/* Header：左标题，右按钮 */}
        <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
              Popular Products
            </h2>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prev}
              disabled={!canSlide}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full
                         border border-slate-200 bg-white text-slate-700 shadow-sm
                         transition hover:bg-slate-50 hover:border-slate-300
                         disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Previous"
            >
              ←
            </button>
            <button
              type="button"
              onClick={next}
              disabled={!canSlide}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full
                         border border-slate-200 bg-white text-slate-700 shadow-sm
                         transition hover:bg-slate-50 hover:border-slate-300
                         disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Next"
            >
              →
            </button>
          </div>
        </div>

        {/* Body：去掉大盒子边框，改成干净的“内容区” */}
        {loading ? (
          <div className="text-sm text-slate-500">Loading…</div>
        ) : err ? (
          <div className="text-sm text-red-600">{err}</div>
        ) : top8.length === 0 ? (
          <div className="text-sm text-slate-500">No popular products.</div>
        ) : (
          <>
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${page * 100}%)` }}
              >
                {pages.map((group, idx) => (
                  <div key={idx} className="w-full flex-none">
                    {/* ✅ 你要的：4个一排（lg），小屏自动换行 */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
                      {group.map((p) => (
                        <ProductCard key={p.id} product={p} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* dots：更克制一点 */}
            {pages.length > 1 && (
              <div className="mt-6 flex justify-center gap-2">
                {pages.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPage(i)}
                    className={[
                      'h-2 w-2 rounded-full transition',
                      i === page ? 'bg-slate-900' : 'bg-slate-300 hover:bg-slate-400',
                    ].join(' ')}
                    aria-label={`Go to page ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
