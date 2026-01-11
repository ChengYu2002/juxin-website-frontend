// src/pages/Products.jsx
import { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { useSearchParams } from 'react-router-dom'

export default function Products() {
  const [searchParams] = useSearchParams()
  const category = searchParams.get('category')

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // 初始化: 打开页面永远滚动到顶部
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  // 拉产品列表（随 category 变化）
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      setError('')

      try {
        const qs = category ? `?category=${encodeURIComponent(category)}` : ''
        const res = await fetch(`/api/products${qs}`)

        // 先尽量把后端错误信息读出来（如果有）
        if (!res.ok) {
          let msg = 'Failed to load products'
          try {
            const errData = await res.json()
            msg = errData?.message || msg
          } catch {
            // ignore json parse error
          }
          throw new Error(msg)
        }

        const data = await res.json()

        // 兼容三种常见返回：[] / {items:[]} / {products:[]}
        const list = Array.isArray(data)
          ? data
          : (Array.isArray(data?.items) ? data.items : Array.isArray(data?.products) ? data.products : [])

        setProducts(list)
      } catch (e) {
        setError(e?.message || 'Failed to load products')
        setProducts([]) // 出错时清空，避免显示旧数据
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [category])

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-bold">
        {category ? `Products / ${category}` : 'All Products'}
      </h1>

      {/* Loading */}
      {loading && (
        <div className="rounded border bg-white p-4 text-sm text-gray-600">
          Loading products...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && products.length === 0 && (
        <div className="rounded border bg-white p-4 text-sm text-gray-600">
          No products found{category ? ` for category "${category}"` : ''}.
        </div>
      )}

      {/* List */}
      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard
              key={p.id || p._id || p.slug}
              product={p}
            />
          ))}
        </div>
      )}
    </main>
  )
}
