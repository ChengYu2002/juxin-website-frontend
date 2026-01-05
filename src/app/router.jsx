// src/app/router.jsx
import { Routes, Route } from 'react-router-dom'

// public pages
import Home from '../pages/Home'
import Products from '../pages/Products'
import Product from '../pages/Product'
import About from '../pages/About'
import Contact from '../pages/Contact'
import NotFound from '../pages/NotFound'

// admin pages
import AdminLogin from '../admin/pages/Login'
import AdminDashboard from '../admin/pages/Dashboard'
import AdminProducts from '../admin/pages/Products'
import AdminInquiries from '../admin/pages/Inquiries'
import AdminProtected from '../admin/AdminProtected'
import AdminLayout from '../admin/AdminLayout'

export default function AppRouter() {
  return (
    <Routes>
      {/* ===== Public ===== */}
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<Product />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      {/* ===== Admin Login（不需要保护） ===== */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* ===== Admin Protected Area ===== */}
      <Route path="/admin" element={<AdminProtected />}>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="inquiries" element={<AdminInquiries />} />
        </Route>
      </Route>

      {/* ===== Fallback ===== */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  )
}