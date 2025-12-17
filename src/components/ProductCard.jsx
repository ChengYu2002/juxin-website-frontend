//src/components/ProductCard.jsx    
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <div className="rounded-md border border-gray-200 bg-white p-4">
      {/* 图片容器：控制比例 */}
      <div className="mb-3 h-56 w-full overflow-hidden rounded bg-white flex items-center justify-center">
        <img
          src={product.variants[0].images[0]}
          alt={product.name}
          className="max-h-full max-w-full object-contain p-4"
        />
      </div>

      <h3 className="text-sm font-medium">{product.name}</h3>
      {/* <p className="mt-1 text-sm text-gray-600">{product.priceRange}</p>
      <p className="text-xs text-gray-500">MOQ: {product.moq}</p> */}

      <Link
        to={`/products/${product.id}`}
        className="mt-2 inline-block text-sm text-blue-600 hover:underline"
      >
        View Details
      </Link>
    </div>
  );
}
