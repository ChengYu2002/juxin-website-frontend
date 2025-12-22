// src/pages/Product.jsx
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import products from '../data/products.mock'

import VariantSelector from '../components/VariantSelector'
import ProductGallery from '../components/ProductGallery'
import ProductActions from '../components/ProductActions'
import ProductSpecs from '../components/ProductSpecs'
import ProductRecommendations from '../components/ProductRecommendations'

export default function Product() {
  const { id } = useParams()
  const product = products.find((p) => p.id === id)

  // 初始化状态，选择第一个变体和第一张图片
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0)
  // 当前选中第几个颜色变体

  const variants = product?.variants ?? []

  // 获取当前选中的变体
  const selectedVariant = product?.variants?.[selectedVariantIndex]

  // 当切换产品时重置变体
  useEffect(() => {
    setSelectedVariantIndex(0)
  }, [id])

  if (!product) {
    return (
      <main className="mx-auto max-w-4xl px-5 py-8">
        <h2 className="text-lg font-semibold">Product not found</h2>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-4xl px-5 py-8">
      {/* 上半部分：两栏 */}
      <div className="grid gap-10 lg:grid-cols-5">
        {/* 左：图片区 */}
        <section className="lg:col-span-3">

          <div className="mb-5">
            {/* 避免了 length=0 时 % 0 这种危险情况 */}
            <VariantSelector
              variants={variants}
              selectedIndex={selectedVariantIndex}
              onChange={setSelectedVariantIndex}
            />
          </div>

          {/* 主图片区域 如果没有images则传空数组*/ }
          <ProductGallery images={selectedVariant?.images || []} />
        </section>

        {/* 右：信息区 */}
        <aside className="lg:col-span-2 lg:sticky lg:top-6 self-start">
          <h1 className="text-4xl font-semibold tracking-wide">
            {product.name}
          </h1>
          {/* 产品信息 */}
          <div className="mt-3 text-lg text-gray-800">
            <span className="font-medium">MOQ:</span> {product.moq} pcs
          </div>
          <div className="mt-3 text-lg text-gray-800">
            <span className="font-medium">Color:</span> {selectedVariant?.label}
          </div>

          <ProductActions product={product} selectedVariant={selectedVariant} />

          {/* 规格信息 */}
          <ProductSpecs specs={product.specs} />
        </aside>

      </div>

      {/* 推荐产品部分 */}
      <ProductRecommendations
        currentProductId={product.id}
        allProducts={products}
      />

    </main>
  )
}