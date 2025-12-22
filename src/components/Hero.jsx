// src/components/Hero.jsx
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative h-[calc(100vh-64px)] min-h-[560px] w-full overflow-hidden">
      {/* 背景图：铺满 */}
      <img
        src="/images/hero/1.png"
        alt="Warehouse trolleys"
        className="absolute inset-0 h-full w-full object-cover object-[16%_center]"
      />

      {/* 轻压暗 */}
      <div className="absolute inset-0 bg-black/10" />

      {/* 右侧渐变：略宽一点 */}
      <div className="absolute inset-0 bg-gradient-to-l from-black/50 via-black/20 to-transparent" />

      <div className="relative mx-auto h-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid h-full grid-cols-12">
          {/* 左侧产品视觉区：7/12 */}
          <div className="hidden lg:block lg:col-span-7" />

          {/* 右侧文案区：5/12（比 1/3 大） */}
          <div className="col-span-12 lg:col-span-5">
            <div
              className="
                flex h-full
                items-center lg:items-start
                justify-center
                pt-12 sm:pt-16 lg:pt-24
              "
            >
              <div className="w-full max-w-2xl text-center lg:text-left">
                <h1 className="text-4xl font-semibold tracking-tight text-white drop-shadow sm:text-6xl lg:text-7xl">
                  Reliable Trolley
                  <br />
                  Manufacturer
                </h1>

                <p className="mt-6 text-lg text-white/85 sm:text-xl lg:text-2xl">
                  OEM &amp; ODM solutions trusted by global retailers
                </p>

                <div
                  className="
                    mt-10
                    flex flex-col items-center gap-4
                    sm:flex-row sm:justify-center
                    lg:justify-start
                  "
                >
                  <Link
                    to="/products?category=shopping-trolley"
                    className="inline-flex h-12 w-[220px] items-center justify-center rounded-md bg-blue-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500"
                  >
                    View Products
                  </Link>

                  <Link
                    to="/contact"
                    className="inline-flex h-12 w-[240px] items-center justify-center rounded-md bg-white px-6 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-white/90"
                  >
                    Contact for Quote
                  </Link>
                </div>

                <p className="mt-8 text-sm text-white/60">
                  MOQ from 1000 pcs · Export-ready packing · Audited facilities
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
