// src/pages/Products.jsx
import products from '../data/products.mock';
import ProductCard from '../components/ProductCard';
import { useSearchParams } from "react-router-dom";

export default function Products() {
  const [SearchParams] = useSearchParams();
  const category = SearchParams.get("category");

  const filteredProducts = category
    ? products.filter((p) => p.category === category)
    : products;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      {/* 标题 */}
      <h1 className="mb-6 text-2xl font-bold">
        {category ? `Products / ${category}` : "All Products"}
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map(p => (
          <ProductCard product={p}/>
          
        ))}
      </div>

    </main>
  )
}
