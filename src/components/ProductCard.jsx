//src/components/ProductCard.jsx
import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="block rounded-lg border border-gray-200 bg-white p-4 hover:shadow-lg transition-shadow duration-200"
    >
      {/* 图片容器：控制比例 */}
      <div className="mb-3 h-56 w-full overflow-hidden rounded bg-white flex items-center justify-center">
        <img
          src={product.variants[0].images[0]}
          alt={product.name}
          className="max-h-full max-w-full object-contain p-4"
        />
      </div>

      {/* 产品名称 */}
      <div className="relative">
        <h3 className="text-center text-base font-semibold text-gray-800 tracking-wide">
          {product.name}
        </h3>
        {/* 下划线动画 */}
        <div className="mx-auto mt-2 h-0.5 w-12 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
      </div>
    </Link>
  )
}
