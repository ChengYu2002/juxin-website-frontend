// src/components/Header.jsx
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const categories = [
  { key: "shopping-trolley", label: "Shopping Trolley" },
  { key: "utility-trolley", label: "Utility Trolley" },
  { key: "camping-wagon", label: "Camping Wagon" },
  { key: "outdoor-furniture", label: "Outdoor Furniture" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const itemBase =
    "h-9 px-3 inline-flex items-center rounded-md text-sm font-semibold tracking-wide text-white/80 hover:text-white hover:bg-white/5 transition";
  const itemActive = "bg-white/10 text-white";

  return (
    <header className="relative z-50 bg-neutral-950 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <NavLink to="/" className="text-xl font-bold tracking-tight text-white">
          Juxin
        </NavLink>

        <nav className="flex items-center gap-2">
          {/* isActive：当前链接是否激活, 如果激活，style：itemBase + itemActive */}
          <NavLink to="/" end className={({ isActive }) => `${itemBase} ${isActive ? itemActive : ""}`}>
            HOME
          </NavLink>

          <NavLink to="/about" className={({ isActive }) => `${itemBase} ${isActive ? itemActive : ""}`}>
            ABOUT
          </NavLink>

          {/* PRODUCTS */}
          <div
            className="relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <button
              type="button"
              onClick={() => setOpen(true)}
              className={`${itemBase} ${open ? itemActive : ""}`}
            >
              PRODUCTS <span className="ml-1 text-white/60">▾</span>
              {/* 多加了span ▾ */}
            </button>

            {open && (
              <div
                className="
                  absolute left-1/2 top-full -mt-1 -translate-x-1/2
                  w-[calc(100vw-2rem)] max-w-[760px]
                  rounded-xl border border-white/10 bg-neutral-900/95 backdrop-blur shadow-2xl
                "
              >
                <div className="p-6">
                  <div className="mb-4 text-xs font-semibold tracking-widest text-white/50 uppercase">
                    Products
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                    {categories.map((c) => (
                      <button
                        key={c.key}
                        type="button"
                        onClick={() => navigate(`/products?category=${encodeURIComponent(c.key)}`)}
                        className="group rounded-xl p-4 text-left hover:bg-white/5 transition"
                      >
                        {/* <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 group-hover:bg-white/15 transition">
                          <span className="text-lg">▦</span>
                        </div> */}
                        <div className="text-sm font-semibold text-white/90 group-hover:text-white transition">
                          {c.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <NavLink to="/contact" className={({ isActive }) => `${itemBase} ${isActive ? itemActive : ""}`}>
            CONTACT
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
