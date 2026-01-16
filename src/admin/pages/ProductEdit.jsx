// src/admin/pages/ProductEdit.jsx
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { adminFetch } from '../../services/adminApi'

import ProductForm from '../components/ProductForm'
import {
  emptyProduct,
  normalizeProductData,
  imagesArrayToTextarea,
  textareaToImagesArray,
} from '../utils/productModel'

const CATEGORY_OPTIONS = [
  { value: 'shopping-trolley', label: 'Shopping Trolley' },
  { value: 'utility-trolley', label: 'Utility Trolley' },
  { value: 'camping-wagon', label: 'Camping Wagon' },
  { value: 'outdoor-furniture', label: 'Outdoor Furniture' },
]

const PROFIT_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'mid', label: 'Mid' },
  { value: 'high', label: 'High' },
]

// 主体函数
export default function ProductEdit() {
  const { id } = useParams()
  const productId = id.toLowerCase()


  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false) // 保存中状态
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const [product, setProduct] = useState(() => emptyProduct())

  const pageTitle = useMemo(() => {
    return `${product?.name ? `编辑: ${product.name}` : '编辑产品'} —— 产品id: ${productId}`
  }, [product?.name, productId] )

  // ===== 加载，拉取产品数据 =====
  useEffect(() => {
    let cancelled = false // 防止用户快速切换页面导致的状态更新问题

    async function load() {
      setLoading(true)
      setError('')
      setNotice('')

      try {
        // 1) 优先走 admin GET（如果你还没实现会失败）
        const p1 = await adminFetch(`/api/products/admin/${productId}`)
        if (!cancelled) {
          // 只有在组件还“活着”的时候，才允许更新状态
          setProduct(normalizeProductData(p1))
        }
      } catch {
        try {
          // 2) fallback 走 public GET /:id 或 /:slug
          const p2 = await adminFetch(`/api/products/${encodeURIComponent(productId)}`)
          if (!cancelled) setProduct(normalizeProductData(p2))
        } catch (e2) {
          if (!cancelled) {
            const msg = e2?.message ? `${e2.message} - 加载产品失败` : '加载产品失败'
            setError(msg)
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    } // 清理函数，组件卸载时设置 cancelled 为 true
  }, [productId])

  // ===== 辅助函数：更新字段 =====
  const setField = (key, value) => {
    setProduct((prev) => ({ ...prev, [key]: value }))
  }

  const setSpecsField = (key, value) => {
    setProduct((prev) => ({
      ...prev,
      specs: { ...(prev.specs || {}), [key]: value },
    }))
  }

  // ===== variants的操作 =====
  // index: 想要改的第几个variant, patch: { key: value } 想要改的字段和值
  const updateVariantField = (index, patch) => {
    setProduct((prev) => {
      // Array.isArray 确保 prev.variants 是数组， 如果不是，先创建一个空数组
      const newVariants = Array.isArray(prev.variants) ? [...prev.variants] : []
      // 更新指定 index 的 variant，合并 patch
      newVariants[index] = { ...(newVariants[index] || {}), ...patch }
      return { ...prev, variants: newVariants }
    })
  }

  const addVariant = () => {
    setProduct((prev) => ({
      ...prev,
      variants: [
        ...(Array.isArray(prev.variants) ? prev.variants : []),
        { code: '', label: '', images: [] },
      ],
    }))
  }

  const removeVariant = (index) => {
    setProduct((prev) => {
      const newVariants = Array.isArray(prev.variants) ? [...prev.variants] : []
      newVariants.splice(index, 1) // 删除指定 index 的元素
      return { ...prev, variants: newVariants }
    })
  }

  // ===== 辅助函数：保存前验证，拦截脏数据 =====
  const validateBeforeSave = () => {
    if (!product.id?.trim()) return 'Product id 必须填写'
    if (!product.name?.trim()) return 'Product name 必须填写'
    // if (!product.slug?.trim()) return 'Product slug 必须填写'
    if (!product.category?.trim()) return 'Category 必须选择'

    for (let i = 0; i < (product.variants || []).length; i++) {
      const v = product.variants[i]
      if (!v.code?.trim()) return `变体颜色 #${i + 1}: key 必须填写`
      if (!v.label?.trim()) return `变体颜色 #${i + 1}: label 必须填写`
      if (!Array.isArray(v.images) || !v.images.every((s) => typeof s === 'string')) {
        return `变体颜色 #${i + 1}: images 必须是图片 URL 数组`
        // 后续文件上传改这里
      }
    }
    return ''
  }

  // 辅助函数：转换为整数或 null
  const toIntOrNull = (v) => {
    if (v === null || v === undefined) return null
    const s = String(v).trim()
    if (s === '') return null
    if (!/^\d+$/.test(s)) return null   // 只允许整数（moq/pcsPerCarton 应该是整数）
    return Number(s)
  }

  // ===== 保存产品 =====
  const onSave = async () => {
    setError('')
    setNotice('')

    // 验证，报错
    const msg = validateBeforeSave()
    if (msg) {
      setError(msg)
      return
    }

    setSaving(true)

    try {
      // 后续如果数据结构变化，这里也要改
      const idNormalized = String(product.id || '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-_]/g, '')

      const payload = {
        id: idNormalized,
        name: String(product.name || '').trim(),

        // 如果你现在不打算用 slug：最好别传，避免 null/'' 触发 unique
        // ...(product.slug && String(product.slug).trim()
        //   ? { slug: String(product.slug).trim() }
        //   : {}),

        category: product.category,

        moq: toIntOrNull(product.moq),
        sortOrder: toIntOrNull(product.sortOrder) ?? 0,

        isActive: !!product.isActive,
        isPopular: !!product.isPopular,
        profitMargin: product.profitMargin || 'mid',

        specs: {
          ...(product.specs || {}),
          pcsPerCarton: toIntOrNull(product.specs?.pcsPerCarton) ?? 0,
        },

        variants: (product.variants || []).map((v) => ({
          key: String(v.code || '')
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9-_]/g, ''),

          label: String(v.label || '').trim(),

          images: Array.isArray(v.images)
            ? v.images
              .map((s) => String(s || '').trim())
              .filter(Boolean) // 去掉空行
            : [],
        })),
      }

      await adminFetch(`/api/products/admin/${id}`, {
        method: 'PUT',
        body: payload,
      })

      setNotice('产品保存成功 🎉')
      // 如果你想保存后回列表： navigate('/admin/products')
    } catch (e) {
      console.log('SAVE ERROR raw:', e)
      console.log('SAVE ERROR msg:', e?.message)
      console.log('SAVE ERROR status:', e?.status)
      console.log('SAVE ERROR body:', e?.body || e?.data)

      if (e?.status === 409) {
        // 👉 业务冲突：重复 id / slug
        const field = e?.data?.field
        const value = e?.data?.value

        if (field === 'id') {
          setError(`产品 ID 已存在：${value}`)
        // } else if (field === 'slug') {
        //   setError(`Slug 已存在，请更换`)
        } else {
          setError('产品标识已存在，请检查 ID / Slug')
        }
      } else {
        const msg2 = e?.message ? `${e.message} - 保存产品失败` : '保存产品失败'
        setError(msg2)

      }

    } finally {
      setSaving(false)
    }
  }

  // ===== 注意：渲染必须在组件顶层 return，不要写进 onSave 里！=====
  if (loading) {
    return (
      <div className="p-6">
        <div className="text-sm text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* ===== Header ===== */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">{pageTitle}</h1>
          <div className="text-s text-gray-500 mt-1">
            mongoId: {product.mongoId || '-'} · 产品更新于:{' '}
            {product.updatedAt ? new Date(product.updatedAt).toLocaleString() : '-'}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            className="text-sm px-3 py-2 rounded border hover:bg-gray-50"
            onClick={() => navigate('/admin/products')}
            type="button"
          >
            返回产品列表
          </button>

          <button
            className={`text-sm px-3 py-2 rounded border ${
              saving
                ? 'opacity-60 cursor-not-allowed'
                : 'hover:bg-blue-50 border-blue-500 text-blue-600'
            }`}
            onClick={onSave}
            disabled={saving}
            type="button"
          >
            {saving ? '保存中...' : '保存产品'}
          </button>
        </div>
      </div>

      {/* ===== Alerts ===== */}
      {error ? (
        <div className="border border-red-200 bg-red-50 text-red-700 p-3 rounded text-sm">
          {error}
        </div>
      ) : null}

      {notice ? (
        <div className="border border-green-200 bg-green-50 text-green-700 p-3 rounded text-sm">
          {notice}
        </div>
      ) : null}

      {/* ===== Form Body (拆出来的) ===== */}
      <ProductForm
        product={product}
        setField={setField}
        setSpecsField={setSpecsField}
        updateVariantField={updateVariantField}
        addVariant={addVariant}
        removeVariant={removeVariant}
        CATEGORY_OPTIONS={CATEGORY_OPTIONS}
        PROFIT_OPTIONS={PROFIT_OPTIONS}
        imagesArrayToTextarea={imagesArrayToTextarea}
        textareaToImagesArray={textareaToImagesArray}
      />

      {/* bottom action */}
      <div className="flex gap-2">
        <button
          className="text-sm px-3 py-2 rounded border hover:bg-gray-50"
          onClick={() => navigate('/admin/products')}
          type="button"
        >
          返回产品列表
        </button>

        <button
          className={`text-sm px-3 py-2 rounded border ${
            saving
              ? 'opacity-60 cursor-not-allowed'
              : 'hover:bg-blue-50 border-blue-500 text-blue-600'
          }`}
          onClick={onSave}
          disabled={saving}
          type="button"
        >
          {saving ? '保存中...' : '保存产品'}
        </button>

      </div>

      {/* ===== Alerts ===== */}
      {error ? (
        <div className="border border-red-200 bg-red-50 text-red-700 p-3 rounded text-sm">
          {error}
        </div>
      ) : null}

      {notice ? (
        <div className="border border-green-200 bg-green-50 text-green-700 p-3 rounded text-sm">
          {notice}
        </div>
      ) : null}

    </div>
  )
}
