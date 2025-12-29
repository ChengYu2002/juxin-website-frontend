// src/pages/Products.jsx
import { useEffect } from 'react'
import products from '../data/products.mock'
import ProductCard from '../components/ProductCard'
import { useSearchParams } from 'react-router-dom'

export default function Products() {
  const [SearchParams] = useSearchParams()
  const category = SearchParams.get('category')

  const filteredProducts = category
    ? products.filter((p) => p.category === category)
    : products

  // 初始化: 打开页面永远滚动到顶部
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      {/* 标题 */}
      <h1 className="mb-6 text-2xl font-bold">
        {category ? `Products / ${category}` : 'All Products'}
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map(p => (
          <ProductCard key={p.id} product={p}/>

        ))}
      </div>

    </main>
  )
}
