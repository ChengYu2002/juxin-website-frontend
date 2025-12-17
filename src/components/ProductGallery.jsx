// src/components/ProductGallery.jsx
import { useState, useEffect } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

/**
 * ProductGallery
 * - 桌面端：hover 局部放大（放大镜）
 * - 移动端：点击打开大图（Lightbox）
 * - 支持左右切换、圆点指示、图片计数
 */
export default function ProductGallery({ images = [] }) {
    // 当前选中该变体下第几张图
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // 当图片数组变化（切换颜色）时，重置到第一张
  useEffect(() => {
    setSelectedImageIndex(0);
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <div className="flex h-96 w-full items-center justify-center rounded-lg border bg-white text-gray-500">
        No image available
      </div>
    );
  }

  // 如果 length=5：
  // 0→1→2→3→4→0 循环
  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  // 向前切换图片（环形轮播）
  // 逻辑说明：
  // 1. prev - 1        → 向前一张
  // 2. + length        → 当 prev === 0 时，避免索引变成 -1
  // 3. % length        → 将索引限制在 [0, length - 1] 范围内，实现首尾循环
  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      {/* ===== 主图区域 ===== */}
      <div className="relative mb-4 h-96 w-full overflow-hidden rounded-lg border bg-white">
        <img
          src={images[selectedImageIndex]}
          alt={`Product image ${selectedImageIndex + 1}`}
          onClick={() => setLightboxOpen(true)}
          className="h-full w-full cursor-zoom-in object-contain"
        />

        {/* ===== 导航按钮 / 指示器（多图才显示） ===== */}
        {images.length > 1 && (
          <>
            {/* 上一张 */}
            <button
              type="button"
              onClick={prevImage}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white"
            >
              ←
            </button>

            {/* 下一张 */}
            <button
              type="button"
              onClick={nextImage}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white"
            >
              →
            </button>

            {/* 圆点指示器 */}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedImageIndex(index)}
                  aria-label={`Go to image ${index + 1}`}
                  className={`h-2 w-2 rounded-full ${
                    index === selectedImageIndex
                      ? "bg-blue-500"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>

            {/* 图片计数 */}
            <div className="absolute right-4 top-4 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
              {selectedImageIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* ===== Lightbox ===== */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={selectedImageIndex}
        slides={images.map((src, index) => ({
          src,
          alt: `Product image ${index + 1}`,
        }))}
        render={{
          buttonPrev: images.length > 1 ? undefined : () => null,
          buttonNext: images.length > 1 ? undefined : () => null,
        }}
      />

      {/* ===== 缩略图 ===== */}
      {images.length > 1 && (
        <div className="mb-6">
          <h3 className="mb-2 text-lg font-medium">Gallery</h3>
          <div className="grid grid-cols-4 gap-2 md:grid-cols-6">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`aspect-square overflow-hidden rounded border p-1 ${
                  index === selectedImageIndex
                    ? "border-blue-500 ring-2 ring-blue-300"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
