// // src/admin/pages/ProductEdit.jsx
// import { useEffect, useMemo, useState } from 'react'
// import { useNavigate, useParams } from 'react-router-dom'
// import { adminFetch } from '../../services/adminApi'

// const CATEGORY_OPTIONS = [
//   { value: 'shopping-trolley', label: 'Shopping Trolley' },
//   { value: 'utility-trolley', label: 'Utility Trolley' },
//   { value: 'camping-wagon', label: 'Camping Wagon' },
//   { value: 'outdoor-furniture', label: 'Outdoor Furniture' },
// ]

// const PROFIT_OPTIONS = [
//   { value: 'low', label: 'Low' },
//   { value: 'mid', label: 'Mid' },
//   { value: 'high', label: 'High' },
// ]

// // 生成一个安全的默认产品结构，避免 uncontrolled/undefined
// function emptyProduct() {
//   return {
//     id: '',
//     name: '',
//     slug: '',
//     category: 'shopping-trolley',
//     moq: 0,
//     sortOrder: 0,
//     isActive: true,
//     isPopular: false,
//     profitMargin: 'mid',
//     specs: {
//       maxSize: '',
//       foldedSize: '',
//       cartonSize: '',
//       pcsPerCarton: 0,
//       netWeight: '',
//       grossWeight: '',
//       wheelSize: '',
//       containerLoad: '',
//     },
//     variants: [],
//     mongoId: '',
//     createdAt: '',
//     updatedAt: '',
//   }
// }

// function normalizeProduct(p) {
//   const base = emptyProduct()
//   const merged = {
//     ...base,
//     ...p,
//     specs: { ...base.specs, ...(p?.specs || {}) },
//     variants: Array.isArray(p?.variants) ? p.variants : [],
//   }

//   // 兜底类型修正（避免 input number 报错/怪行为）
//   merged.moq = Number.isFinite(Number(merged.moq)) ? Number(merged.moq) : 0
//   merged.sortOrder = Number.isFinite(Number(merged.sortOrder)) ? Number(merged.sortOrder) : 0
//   merged.specs.pcsPerCarton = Number.isFinite(Number(merged.specs.pcsPerCarton))
//     ? Number(merged.specs.pcsPerCarton)
//     : 0

//   return merged
// }

// function imagesToTextarea(images) {
//   if (!Array.isArray(images)) return ''
//   return images.join('\n')
// }

// function textareaToImages(text) {
//   return String(text || '')
//     .split('\n')
//     .map((s) => s.trim())
//     .filter(Boolean)
// }

// export default function ProductEdit() {
//   const { id } = useParams() // 路由里的 :id
//   const navigate = useNavigate()

//   const [loading, setLoading] = useState(true)
//   const [saving, setSaving] = useState(false)
//   const [error, setError] = useState('')
//   const [notice, setNotice] = useState('')

//   const [product, setProduct] = useState(() => emptyProduct())

//   const pageTitle = useMemo(() => {
//     return product?.name ? `Edit: ${product.name}` : 'Edit Product'
//   }, [product?.name])

//   useEffect(() => {
//     let cancelled = false

//     async function load() {
//       setLoading(true)
//       setError('')
//       setNotice('')

//       try {
//         // 1) 优先走 admin GET（如果你还没实现会失败）
//         const p1 = await adminFetch(`/api/products/admin/${id}`)
//         if (!cancelled) setProduct(normalizeProduct(p1))
//       } catch (e1) {
//         try {
//           // 2) fallback 走 public GET /:idorSlug
//           const p2 = await adminFetch(`/api/products/${id}`)
//           if (!cancelled) setProduct(normalizeProduct(p2))
//         } catch (e2) {
//           if (!cancelled) setError(e2?.message || 'Failed to load product')
//         }
//       } finally {
//         if (!cancelled) setLoading(false)
//       }
//     }

//     load()
//     return () => {
//       cancelled = true
//     }
//   }, [id])

//   const setField = (key, value) => {
//     setProduct((prev) => ({ ...prev, [key]: value }))
//   }

//   const setSpecsField = (key, value) => {
//     setProduct((prev) => ({
//       ...prev,
//       specs: { ...(prev.specs || {}), [key]: value },
//     }))
//   }

//   const updateVariant = (index, patch) => {
//     setProduct((prev) => {
//       const next = Array.isArray(prev.variants) ? [...prev.variants] : []
//       next[index] = { ...(next[index] || {}), ...patch }
//       return { ...prev, variants: next }
//     })
//   }

//   const addVariant = () => {
//     setProduct((prev) => ({
//       ...prev,
//       variants: [
//         ...(Array.isArray(prev.variants) ? prev.variants : []),
//         { key: '', label: '', images: [] },
//       ],
//     }))
//   }

//   const removeVariant = (index) => {
//     setProduct((prev) => {
//       const next = [...(prev.variants || [])]
//       next.splice(index, 1)
//       return { ...prev, variants: next }
//     })
//   }

//   const validateBeforeSave = () => {
//     if (!product.id?.trim()) return 'Product id is required'
//     if (!product.name?.trim()) return 'Product name is required'
//     if (!product.slug?.trim()) return 'Product slug is required'
//     if (!product.category?.trim()) return 'Category is required'

//     // variants 校验：images 必须字符串数组
//     for (let i = 0; i < (product.variants || []).length; i++) {
//       const v = product.variants[i]
//       if (!v.key?.trim()) return `Variant #${i + 1}: key is required`
//       if (!v.label?.trim()) return `Variant #${i + 1}: label is required`
//       if (!Array.isArray(v.images) || !v.images.every((s) => typeof s === 'string')) {
//         return `Variant #${i + 1}: images must be string array`
//       }
//     }
//     return ''
//   }

//   const onSave = async () => {
//     setError('')
//     setNotice('')

//     const msg = validateBeforeSave()
//     if (msg) {
//       setError(msg)
//       return
//     }

//     setSaving(true)
//     try {
//       // 只提交你 schema 里的字段（避免带上 mongoId/createdAt 等）
//       const payload = {
//         id: product.id.trim(),
//         name: product.name.trim(),
//         slug: product.slug.trim(),
//         category: product.category,
//         moq: Number(product.moq) || 0,
//         sortOrder: Number(product.sortOrder) || 0,
//         isActive: !!product.isActive,
//         isPopular: !!product.isPopular,
//         profitMargin: product.profitMargin || 'mid',
//         specs: {
//           ...product.specs,
//           pcsPerCarton: Number(product.specs?.pcsPerCarton) || 0,
//         },
//         variants: (product.variants || []).map((v) => ({
//           key: String(v.key || '').trim(),
//           label: String(v.label || '').trim(),
//           images: Array.isArray(v.images) ? v.images.map((s) => String(s)) : [],
//         })),
//       }

//       await adminFetch(`/api/products/admin/${id}`, {
//         method: 'PUT',
//         body: JSON.stringify(payload),
//       })

//       setNotice('Saved ✅')
//       // 如果你想保存后回列表：
//       // navigate('/admin/products')
//     } catch (e) {
//       setError(e?.message || 'Save failed')
//     } finally {
//       setSaving(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="p-6">
//         <div className="text-sm text-gray-600">Loading...</div>
//       </div>
//     )
//   }

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex items-start justify-between gap-4">
//         <div>
//           <h1 className="text-xl font-semibold">{pageTitle}</h1>
//           <div className="text-xs text-gray-500 mt-1">
//             mongoId: {product.mongoId || '-'} · updated: {product.updatedAt ? new Date(product.updatedAt).toLocaleString() : '-'}
//           </div>
//         </div>

//         <div className="flex gap-2">
//           <button
//             className="text-sm px-3 py-2 rounded border hover:bg-gray-50"
//             onClick={() => navigate('/admin/products')}
//           >
//             Back
//           </button>

//           <button
//             className={`text-sm px-3 py-2 rounded border ${
//               saving ? 'opacity-60 cursor-not-allowed' : 'hover:bg-blue-50 border-blue-500 text-blue-600'
//             }`}
//             onClick={onSave}
//             disabled={saving}
//           >
//             {saving ? 'Saving...' : 'Save'}
//           </button>
//         </div>
//       </div>

//       {error ? (
//         <div className="border border-red-200 bg-red-50 text-red-700 p-3 rounded text-sm">
//           {error}
//         </div>
//       ) : null}

//       {notice ? (
//         <div className="border border-green-200 bg-green-50 text-green-700 p-3 rounded text-sm">
//           {notice}
//         </div>
//       ) : null}

//       {/* ===== Basic Fields ===== */}
//       <div className="border rounded p-4 space-y-4">
//         <div className="font-semibold">Basic</div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <label className="space-y-1">
//             <div className="text-sm text-gray-700">Product ID</div>
//             <input
//               className="w-full border rounded p-2 text-sm"
//               value={product.id}
//               onChange={(e) => setField('id', e.target.value)}
//               placeholder="e.g. JX-L5"
//             />
//           </label>

//           <label className="space-y-1">
//             <div className="text-sm text-gray-700">Name</div>
//             <input
//               className="w-full border rounded p-2 text-sm"
//               value={product.name}
//               onChange={(e) => setField('name', e.target.value)}
//               placeholder="e.g. Heavy Duty Shopping Trolley"
//             />
//           </label>

//           <label className="space-y-1">
//             <div className="text-sm text-gray-700">Slug</div>
//             <input
//               className="w-full border rounded p-2 text-sm"
//               value={product.slug}
//               onChange={(e) => setField('slug', e.target.value)}
//               placeholder="e.g. jx-l5-heavy-duty"
//             />
//           </label>

//           <label className="space-y-1">
//             <div className="text-sm text-gray-700">Category</div>
//             <select
//               className="w-full border rounded p-2 text-sm"
//               value={product.category}
//               onChange={(e) => setField('category', e.target.value)}
//             >
//               {CATEGORY_OPTIONS.map((o) => (
//                 <option key={o.value} value={o.value}>
//                   {o.label}
//                 </option>
//               ))}
//             </select>
//           </label>

//           <label className="space-y-1">
//             <div className="text-sm text-gray-700">MOQ</div>
//             <input
//               className="w-full border rounded p-2 text-sm"
//               type="number"
//               min="0"
//               value={product.moq}
//               onChange={(e) => setField('moq', e.target.value)}
//             />
//           </label>

//           <label className="space-y-1">
//             <div className="text-sm text-gray-700">Sort Order (bigger = higher)</div>
//             <input
//               className="w-full border rounded p-2 text-sm"
//               type="number"
//               value={product.sortOrder}
//               onChange={(e) => setField('sortOrder', e.target.value)}
//             />
//           </label>

//           <label className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               checked={!!product.isActive}
//               onChange={(e) => setField('isActive', e.target.checked)}
//             />
//             <span className="text-sm text-gray-700">Active (on shelf)</span>
//           </label>

//           <label className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               checked={!!product.isPopular}
//               onChange={(e) => setField('isPopular', e.target.checked)}
//             />
//             <span className="text-sm text-gray-700">Popular</span>
//           </label>

//           <label className="space-y-1">
//             <div className="text-sm text-gray-700">Profit Margin</div>
//             <select
//               className="w-full border rounded p-2 text-sm"
//               value={product.profitMargin}
//               onChange={(e) => setField('profitMargin', e.target.value)}
//             >
//               {PROFIT_OPTIONS.map((o) => (
//                 <option key={o.value} value={o.value}>
//                   {o.label}
//                 </option>
//               ))}
//             </select>
//           </label>
//         </div>
//       </div>

//       {/* ===== Specs ===== */}
//       <div className="border rounded p-4 space-y-4">
//         <div className="font-semibold">Specs</div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <label className="space-y-1">
//             <div className="text-sm text-gray-700">Max Size</div>
//             <input
//               className="w-full border rounded p-2 text-sm"
//               value={product.specs?.maxSize || ''}
//               onChange={(e) => setSpecsField('maxSize', e.target.value)}
//               placeholder='e.g. "56 x 41 x 92 cm"'
//             />
//           </label>

//           <label className="space-y-1">
//             <div className="text-sm text-gray-700">Folded Size</div>
//             <input
//               className="w-full border rounded p-2 text-sm"
//               value={product.specs?.foldedSize || ''}
//               onChange={(e) => setSpecsField('foldedSize', e.target.value)}
//             />
//           </label>

//           <label className="space-y-1">
//             <div className="text-sm text-gray-700">Carton Size</div>
//             <input
//               className="w-full border rounded p-2 text-sm"
//               value={product.specs?.cartonSize || ''}
//               onChange={(e) => setSpecsField('cartonSize', e.target.value)}
//             />
//           </label>

//           <label className="space-y-1">
//             <div className="text-sm text-gray-700">PCS / Carton</div>
//             <input
//               className="w-full border rounded p-2 text-sm"
//               type="number"
//               min="0"
//               value={product.specs?.pcsPerCarton ?? 0}
//               onChange={(e) => setSpecsField('pcsPerCarton', e.target.value)}
//             />
//           </label>

//           <label className="space-y-1">
//             <div className="text-sm text-gray-700">Net Weight</div>
//             <input
//               className="w-full border rounded p-2 text-sm"
//               value={product.specs?.netWeight || ''}
//               onChange={(e) => setSpecsField('netWeight', e.target.value)}
//               placeholder='e.g. "17.5 kg"'
//             />
//           </label>

//           <label className="space-y-1">
//             <div className="text-sm text-gray-700">Gross Weight</div>
//             <input
//               className="w-full border rounded p-2 text-sm"
//               value={product.specs?.grossWeight || ''}
//               onChange={(e) => setSpecsField('grossWeight', e.target.value)}
//             />
//           </label>

//           <label className="space-y-1">
//             <div className="text-sm text-gray-700">Wheel Size</div>
//             <input
//               className="w-full border rounded p-2 text-sm"
//               value={product.specs?.wheelSize || ''}
//               onChange={(e) => setSpecsField('wheelSize', e.target.value)}
//               placeholder='e.g. "90 mm"'
//             />
//           </label>

//           <label className="space-y-1 md:col-span-2">
//             <div className="text-sm text-gray-700">Container Load</div>
//             <textarea
//               className="w-full border rounded p-2 text-sm min-h-[120px]"
//               value={product.specs?.containerLoad || ''}
//               onChange={(e) => setSpecsField('containerLoad', e.target.value)}
//               placeholder={'20GP: 1242 pcs\n40GP: 2574 pcs\n40HQ: 3018 pcs'}
//             />
//           </label>
//         </div>
//       </div>

//       {/* ===== Variants ===== */}
//       <div className="border rounded p-4 space-y-4">
//         <div className="flex items-center justify-between">
//           <div className="font-semibold">Variants</div>
//           <button
//             className="text-sm px-3 py-2 rounded border border-gray-300 hover:bg-gray-50"
//             onClick={addVariant}
//             type="button"
//           >
//             + Add Variant
//           </button>
//         </div>

//         {(product.variants || []).length === 0 ? (
//           <div className="text-sm text-gray-500">No variants yet.</div>
//         ) : null}

//         <div className="space-y-4">
//           {(product.variants || []).map((v, idx) => (
//             <div key={`${v.key || 'variant'}-${idx}`} className="border rounded p-3 space-y-3">
//               <div className="flex items-center justify-between gap-3">
//                 <div className="text-sm font-medium">
//                   Variant #{idx + 1}
//                 </div>
//                 <button
//                   className="text-xs px-2 py-1 rounded border border-red-500 text-red-600 hover:bg-red-50"
//                   onClick={() => removeVariant(idx)}
//                   type="button"
//                 >
//                   Remove
//                 </button>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                 <label className="space-y-1">
//                   <div className="text-sm text-gray-700">Key</div>
//                   <input
//                     className="w-full border rounded p-2 text-sm"
//                     value={v.key || ''}
//                     onChange={(e) => updateVariant(idx, { key: e.target.value })}
//                     placeholder="e.g. black"
//                   />
//                 </label>

//                 <label className="space-y-1">
//                   <div className="text-sm text-gray-700">Label</div>
//                   <input
//                     className="w-full border rounded p-2 text-sm"
//                     value={v.label || ''}
//                     onChange={(e) => updateVariant(idx, { label: e.target.value })}
//                     placeholder="e.g. Black"
//                   />
//                 </label>

//                 <label className="space-y-1 md:col-span-2">
//                   <div className="text-sm text-gray-700">Images (one URL per line)</div>
//                   <textarea
//                     className="w-full border rounded p-2 text-sm min-h-[110px]"
//                     value={imagesToTextarea(v.images)}
//                     onChange={(e) => updateVariant(idx, { images: textareaToImages(e.target.value) })}
//                     placeholder={'/images/jx-l5/black/1.jpg\n/images/jx-l5/black/2.jpg'}
//                   />
//                   <div className="text-xs text-gray-500 mt-1">
//                     Count: {Array.isArray(v.images) ? v.images.length : 0}
//                   </div>
//                 </label>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* bottom action */}
//       <div className="flex gap-2">
//         <button
//           className="text-sm px-3 py-2 rounded border hover:bg-gray-50"
//           onClick={() => navigate('/admin/products')}
//         >
//           Back to list
//         </button>

//         <button
//           className={`text-sm px-3 py-2 rounded border ${
//             saving ? 'opacity-60 cursor-not-allowed' : 'hover:bg-blue-50 border-blue-500 text-blue-600'
//           }`}
//           onClick={onSave}
//           disabled={saving}
//         >
//           {saving ? 'Saving...' : 'Save'}
//         </button>
//       </div>
//     </div>
//   )
// }

export default function ProductEdit() {
  return <div>ProductEdit</div>


}

