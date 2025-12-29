// src/components/ProductCard.jsx
import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="group block rounded-xl border border-slate-200 bg-white
                 p-3 sm:p-4
                 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* 图片容器：手机端更紧 */}
      <div className="mb-3 sm:mb-4
                      flex h-64 sm:h-72 w-full items-center justify-center
                      overflow-hidden rounded-lg bg-white">
        <img
          src={product.variants[0].images[0]}
          alt={product.name}
          className="max-h-full max-w-full object-contain
                     p-1.5 sm:p-2
                     transition-transform duration-300
                     group-hover:scale-[1.06]"
        />
      </div>

      {/* 产品名称 */}
      <div className="text-center">
        <h3 className="text-sm font-semibold tracking-wide text-slate-800">
          {product.name}
        </h3>

        {/* 极轻强调线 */}
        <div
          className="mx-auto mt-1.5 sm:mt-2
                     h-0.5 w-10 rounded-full
                     bg-slate-300 opacity-0
                     transition-opacity duration-300
                     group-hover:opacity-100"
        />
      </div>
    </Link>
  )
}
