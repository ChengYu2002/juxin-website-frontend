// src/components/PartnersMarquee.jsx
import { useMemo } from 'react'

export default function PartnersMarquee() {
  const partners = useMemo(
    () => [
      { name: 'ALDI', src: '/images/partners/aldi.svg', scale: 1.5 },
      { name: 'Carrefour', src: '/images/partners/carrefour.svg', scale: 1.5 },
      { name: 'Heineken', src: '/images/partners/heineken.svg', scale: 0.8 },
      { name: 'DAISO', src: '/images/partners/daiso.svg', scale: 0.8 },
      { name: 'Lee Kum Kee', src: '/images/partners/lee-kum-kee.svg', scale: 3 },
      { name: 'Woolworth', src: '/images/partners/woolworth.svg', scale: 2.2 },
    ],
    []
  )

  const track = [...partners, ...partners]

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-screen-2xl px-4 py-12 sm:px-6 sm:py-14 lg:px-10">
        {/* 标题区 */}
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Our Partners & Customers
          </h2>
        </div>

        {/* Marquee */}
        <div className="relative mt-8 overflow-hidden sm:mt-10">
          {/* 渐隐遮罩：手机端更窄一点，避免遮太多内容 */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white via-white/70 to-transparent sm:w-16" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white via-white/70 to-transparent sm:w-16" />

          <div className="group">
            <div className="flex w-max animate-marquee items-center gap-6 py-5 group-hover:[animation-play-state:paused] sm:gap-12 sm:py-6">
              {track.map((p, idx) => (
                <div
                  key={`${p.name}-${idx}`}
                  className="
                    flex items-center justify-center
                    h-32 sm:h-32
                    min-w-[200px] sm:min-w-[220px]
                    rounded-2xl bg-white
                    px-8
                    shadow-[0_12px_40px_rgba(15,23,42,0.08)]
                    transition
                    hover:shadow-[0_18px_60px_rgba(15,23,42,0.12)]
                    "
                  title={p.name}
                >
                  {/* 手机端 logo 高度小一点，避免显得“顶满” */}
                  <div className="flex h-10 items-center justify-center sm:h-14">
                    <img
                      src={p.src}
                      alt={p.name}
                      loading="lazy"
                      draggable="false"
                      className="h-10 w-auto object-contain sm:h-14"
                      style={{
                        transform: `scale(${p.scale ?? 1})`,
                        transformOrigin: 'center',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 可选：手机端提示可滑动（不想要就删掉） */}
          <div className="mt-3 text-xs text-slate-400 sm:hidden">
            Swipe to explore →
          </div>
        </div>
      </div>
    </section>
  )
}
