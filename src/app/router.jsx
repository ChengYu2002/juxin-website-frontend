// src/app/router.jsx
import { Routes, Route } from 'react-router-dom';

import Home from '../pages/Home';
import Products from '../pages/Products';
import Product from '../pages/Product';
import About from '../pages/About';
import Contact from '../pages/Contact';
import NotFound from '../pages/NotFound';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<Product />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}