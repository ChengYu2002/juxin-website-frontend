import { Outlet, NavLink, useSearchParams } from 'react-router-dom'

const CATEGORIES = [
  { key: '', label: 'All Products' },
  { key: 'shopping-trolley', label: 'Shopping Trolley' },
  { key: 'utility-trolley', label: 'Utility Trolley' },
  { key: 'camping-wagon', label: 'Camping Wagon' },
  { key: 'outdoor-furniture', label: 'Outdoor Furniture' },
]

export default function ProductsLayout() {
  const [searchParams] = useSearchParams()
  const active = searchParams.get('category') || ''

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      {/* ✅ Desktop 用 flex：右侧内容不再被 sidebar 推走 */}
      <div className="flex flex-col gap-4 md:flex-row md:gap-0">
        {/* Left nav */}
        <aside className="h-fit md:sticky md:top-6 md:w-0 md:flex-none md:overflow-visible">
          {/* ✅ Mobile: wrap pills (no horizontal cut) */}
          <div className="md:hidden">
            <div className="-mx-6 px-6">
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => {
                  const to = c.key ? `?category=${encodeURIComponent(c.key)}` : ''
                  const isActive = active === c.key

                  return (
                    <NavLink
                      key={c.key || 'all'}
                      to={to}
                      className={[
                        'rounded-full px-4 py-2 text-sm transition',
                        isActive
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                      ].join(' ')}
                    >
                      {c.label}
                    </NavLink>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ✅ Desktop：rail 不占布局宽度（靠 overflow-visible 挂在左侧） */}
          <div className="hidden md:block">
            {/* 关键：这个盒子“挂”到左侧，不推右侧内容 */}
            <div className="w-[160px] -ml-[176px]">
              <nav className="relative">
                {/* rail */}
                <div className="absolute left-0 top-0 h-full w-px bg-gray-200" />

                {CATEGORIES.map((c) => {
                  const to = c.key ? `?category=${encodeURIComponent(c.key)}` : ''
                  const isActive = active === c.key

                  return (
                    <NavLink
                      key={c.key || 'all'}
                      to={to}
                      className={[
                        'group relative block py-2 pl-3 pr-2 text-sm transition',
                        isActive
                          ? 'text-gray-900 font-medium'
                          : 'text-gray-600 hover:text-gray-900',
                      ].join(' ')}
                    >
                      {/* active indicator */}
                      <span
                        className={[
                          'absolute left-0 top-2.5 h-5 w-[2px] rounded-full transition',
                          isActive
                            ? 'bg-gray-900'
                            : 'bg-transparent group-hover:bg-gray-300',
                        ].join(' ')}
                      />
                      {c.label}
                    </NavLink>
                  )
                })}
              </nav>
            </div>
          </div>
        </aside>

        {/* Right content：✅ 基本回到你原来 Products 的对齐 */}
        <section className="min-w-0 flex-1">
          <Outlet />
        </section>
      </div>
    </main>
  )
}
