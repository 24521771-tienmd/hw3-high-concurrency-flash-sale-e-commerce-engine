
import { formatVND } from '../data/products'

export default function ProductCard({ product }) {
  const {
    name,
    category,
    originalPrice,
    salePrice,
    discountPercent,
    stock,
    sold,
    image,
    accent,
  } = product

  return (
    <article className={`product-card accent-${accent}`}>
      <div className="product-image">
        <span className="product-category">{category}</span>
        <span className="product-discount">
          -{discountPercent}%
        </span>

        <span className="product-emoji" aria-hidden="true">
          {image}
        </span>
      </div>

      <div className="product-info">
        <h3 className="product-name">{name}</h3>

        <div className="product-pricing">
          <span className="sale-price">{formatVND(salePrice)}</span>
          <span className="original-price">
            {formatVND(originalPrice)}
          </span>
        </div>

        <div
          className="stock-progress"
          role="progressbar"
          aria-label={`Stock remaining for ${name}`}
          aria-valuemin={0}
          aria-valuemax={stock + sold}
          aria-valuenow={stock}
        >
          <span
            className="stock-progress-fill"
            style={{
              width: `${(sold / (stock + sold)) * 100}%`,
            }}
          />
        </div>

        <p className="stock-caption">
          {stock} left · {sold} sold
        </p>

        <button className="buy-button" type="button">
          Buy now <span aria-hidden="true">→</span>
        </button>
      </div>
    </article>
  )
}
