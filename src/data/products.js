
export const products = [
  {
    id: 'iphone-15',
    name: 'Smartphone Pro 128GB',
    category: 'Điện thoại',
    originalPrice: 24990000,
    salePrice: 18990000,
    discountPercent: 24,
    stock: 12,
    sold: 88,
    image: '📱',
    accent: 'rose',
  },
  {
    id: 'headphones',
    name: 'Wireless Noise-Canceling Headphones',
    category: 'Âm thanh',
    originalPrice: 3990000,
    salePrice: 2490000,
    discountPercent: 38,
    stock: 7,
    sold: 43,
    image: '🎧',
    accent: 'violet',
  },
  {
    id: 'smartwatch',
    name: 'Smartwatch Series 9',
    category: 'Phụ kiện',
    originalPrice: 6990000,
    salePrice: 4290000,
    discountPercent: 39,
    stock: 15,
    sold: 65,
    image: '⌚',
    accent: 'blue',
  },
  {
    id: 'keyboard',
    name: 'Mechanical Gaming Keyboard',
    category: 'Gaming',
    originalPrice: 2190000,
    salePrice: 1290000,
    discountPercent: 41,
    stock: 5,
    sold: 95,
    image: '⌨️',
    accent: 'amber',
  },
]

export function formatVND(amount) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount)
}
