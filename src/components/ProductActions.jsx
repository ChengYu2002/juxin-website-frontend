import { useNavigate } from 'react-router-dom'

export default function ProductActions({ product, selectedVariant }) {
  const navigate = useNavigate()

  const handleContact = () => {
    // 用 querystring 预填 Contact 页
    const params = new URLSearchParams({
      productId: product.id,
      productName: product.name,
      variant: selectedVariant?.label ?? '',
    })

    navigate(`/contact?${params.toString()}`)
  }

  const handleDownload = () => {
    // V1：先占位（后面你可以改成 product.pdfUrl 或从后端拿）
    alert('PDF not ready yet. (V1 placeholder)')
  }

  return (
    <div className="mt-5 flex gap-3">
      <button
        type="button"
        onClick={handleContact}
        className="flex-1 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
      >
        Contact for Quote
      </button>

      <button
        type="button"
        onClick={handleDownload}
        className="rounded-lg border px-4 py-3 text-sm font-semibold hover:bg-gray-50 transition"
      >
        Download PDF
      </button>
    </div>
  )
}