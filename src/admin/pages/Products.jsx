// src/admin/pages/Products.jsx

import { useEffect, useMemo, useState } from 'react'
import { adminFetch } from '../../services/adminApi'
import { useNavigate } from 'react-router-dom'

// 筛选语义映射
const FILTER_MAP = {
  'create-time': { sort: 'default' }, // sortOrder + createAt
  active: { isActive: true },
  inactive: { isActive: false },

  'shopping-trolley': { category: 'shopping-trolley' },
  'utility-trolley': { category: 'utility-trolley' },
  'camping-wagon': { category: 'camping-wagon' },
  'outdoor-furniture': { category: 'outdoor-furniture' },
}

// 统一拿到“可用的 id”，避免你现在 key 用 mongoId、请求用 product.id 的混乱
const getPid = (p) => p.id || p._id || p.mongoId

export default function AdminProducts() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // 筛选条件
  const [filter, setFilter] = useState('create-time')

  // pagination
  const PAGE_SIZE = 20
  const [currentPage, setCurrentPage] = useState(1)

  // ===== 拉取产品 =====
  const loadProducts = async () => {
    setLoading(true)
    setError('')

    try {
      const data = await adminFetch('/api/products/admin') // admin token 控制
      const list = Array.isArray(data) ? data : (data.items || [])

      setProducts(list)
    } catch (err) {
      setError((err?.message ? `${err.message} - ` : '') + '获取产品列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  // ===== 过滤 + 排序（前端本地）=====
  // useMemo 在render期间缓存计算结果，依赖 products 和 filter 改变时重新计算
  const filteredAndSorted = useMemo(() => {
    const config = FILTER_MAP[filter] || {}

    let list = [...products]

    // 过滤: 状态
    // isActive 如果有定义为boolean，而不是undefined或者null，则过滤
    if (typeof config.isActive === 'boolean') {
      list = list.filter(p => !!p.isActive === config.isActive)
      // !! 确保 p.isActive 一定是 boolean, 防止 undefined/null (具体看！！的用法)
    }

    // 过滤: 分类
    if (config.category) {
      list = list.filter(p => p.category === config.category)
    }

    // 排序: 默认按 sortOrder 降序、time 降序
    list.sort((a, b) => {
      const aSort = Number(a.sortOrder || 0)
      const bSort = Number(b.sortOrder || 0)
      if (bSort !== aSort) {
        return bSort - aSort
      }

      // 次级排序：按时间降序 - create优先
      const aTime = new Date(a.createdAt || a.updatedAt || 0).getTime()
      const bTime = new Date(b.createdAt || b.updatedAt || 0).getTime()

      return bTime - aTime
    })

    return list

  }, [products, filter])

  // filter 改变时：回到第 1 页
  useEffect(() => {
    setCurrentPage(1)
  }, [filter])

  // ===== 分页 =====
  const totalPages = Math.ceil(filteredAndSorted.length / PAGE_SIZE)

  const pagedProducts = filteredAndSorted.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  // ===== currentPage 超出 totalPages 时，调整 currentPage =====
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1)
    }
  }, [totalPages, currentPage])

  // ===== 上下架 toggle =====
  const toggleActive = async (product) => {
    const next = !product.isActive
    const pid = getPid(product)

    try {
      await adminFetch(`/api/products/admin/${pid}`, {
        method: 'PUT',
        body: { isActive: next },
      })

      await loadProducts()

    } catch (err) {
      alert(err?.message ? `${err.message} - 更新产品状态失败` : '更新产品状态失败')
    }
  }

  // ===== 删除 =====
  const deleteProduct = async (product) => {
    const ok = window.confirm(
      `确定要删除产品 "${product.name}" 吗？\n此操作不可撤销 !`
    )
    if (!ok) return

    const pid = getPid(product)
    try {
      await adminFetch(`/api/products/admin/${pid}`, {
        method: 'DELETE',
      })

      await loadProducts()
    } catch (err) {
      alert(err?.message ? `${err.message} \n 删除产品失败` : '删除产品失败')
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Products 产品管理</h2>

        <div className="flex items-center gap-2">
          {/* 新增产品按钮 */}
          <button
            onClick={() => navigate('/admin/products-create')}
            className="text-sm px-4 py-2 rounded border border-indigo-300 text-indigo-600 hover:bg-indigo-50"
          >
            + 新增产品
          </button>

          {/* 原来的筛选 */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">筛选</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm border rounded px-2 py-1"
            >
              <optgroup label="排序">
                <option value="create-time">最新更新（默认）</option>
              </optgroup>
              <optgroup label="产品状态">
                <option value="active">仅已上架</option>
                <option value="inactive">仅未上架</option>
              </optgroup>
              <optgroup label="分类">
                <option value="shopping-trolley">Shopping Trolley</option>
                <option value="utility-trolley">Utility Trolley</option>
                <option value="camping-wagon">Camping Wagon</option>
                <option value="outdoor-furniture">Outdoor Furniture</option>
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      {/* 结果统计 */}
      {!loading && !error && (
        <div className="text-xs text-gray-500 mb-2">
          共 {filteredAndSorted.length} 条（原始 {products.length} 条）
        </div>
      )}

      {loading && (
        <div className="text-sm text-gray-600">Loading...</div>
      )}

      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}

      {!loading && !error && filteredAndSorted.length === 0 && (
        <div className="text-sm text-gray-600">暂无符合筛选条件的产品</div>
      )}

      {!loading && !error && filteredAndSorted.length > 0 && (
        <>
          <ul className="space-y-2">
            {pagedProducts.map(p => {
              const pid = getPid(p) //
              return (
                <li
                  key={pid}
                  className={`border rounded-lg p-4 text-base ${
                    !p.isActive ? 'bg-gray-50 text-gray-400' : ''
                  }`}
                >
                  <div className="flex justify-between items-start gap-6">
                    {/* 左侧：核心信息 */}
                    <div className="space-y-1">
                      <div className="font-semibold text-base">
                        {p.name}
                        <span className="ml-3 text-sm text-gray-500">
                          产品类型: {p.category}
                        </span>
                      </div>

                      <div className="text-sm text-gray-500">
                        {/* slug: {p.slug} ·  */}
                        排名权重 sort: {p.sortOrder}
                      </div>
                    </div>

                    {/* 右侧：操作 */}
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => navigate(`/admin/products/${pid}`)}
                        className="text-sm px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                      >
                        编辑 ⚙️
                      </button>

                      <button
                        onClick={() => toggleActive(p)}
                        className={`text-sm px-3 py-1.5 rounded-md border ${
                          p.isActive
                            ? 'border-blue-500 text-blue-600 hover:bg-blue-100'
                            : 'border-gray-300 text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        {p.isActive ? '下架' : '上架'}
                      </button>

                      <button
                        onClick={() => deleteProduct(p)}
                        className="text-sm px-3 py-1.5 rounded-md border border-red-500 text-red-600 hover:bg-red-50"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>

          {/* 分页 */}
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 border rounded disabled:opacity-50"
              >
                上一页
              </button>
              <span className="text-sm">
                第 {currentPage} 页 / 共 {totalPages} 页
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-2 py-1 border rounded disabled:opacity-50"
              >
                下一页
              </button>
            </div>
          )}
        </>
      )}
    </>
  )
}
