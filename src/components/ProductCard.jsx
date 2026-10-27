
import { useEffect, useState } from 'react'
import { formatVND } from '../data/products'

export default function ProductCard({
  product,
  inventory,
  onReserve,
  onCheckout,
}) {
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

  const availableStock = inventory?.availableStock ?? stock
  const reservation = inventory?.reservation
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (reservation?.status !== 'reserved') {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      setNow(Date.now())
    }, 250)

    return () => window.clearInterval(intervalId)
  }, [reservation?.status, reservation?.expiresAt])

  const remainingSeconds =
    reservation?.status === 'reserved'
      ? Math.max(0, Math.ceil((reservation.expiresAt - now) / 1000))
      : 0

  const totalStock = stock + sold
  const soldPercent =
    totalStock > 0
      ? ((totalStock - availableStock) / totalStock) * 100
      : 0

  const isReserved = reservation?.status === 'reserved'
  const isPurchased = reservation?.status === 'checked_out'
  const isOutOfStock = availableStock === 0 && !isReserved

  let buttonLabel = 'Buy now'
  let buttonAction = onReserve
  let buttonDisabled = false

  if (isReserved) {
    buttonLabel = `Checkout (${remainingSeconds}s)`
    buttonAction = () => onCheckout(reservation.id)
  } else if (isPurchased) {
    buttonLabel = 'Purchased'
    buttonDisabled = true
  } else if (isOutOfStock) {
    buttonLabel = 'Out of stock'
    buttonDisabled = true
  }

  return (
    <article className={`product-card accent-${accent}`}>
      <div className="product-image">
        <span className="product-category">{category}</span>
        <span className="product-discount">-{discountPercent}%</span>

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
          aria-label={`Stock committed for ${name}`}
          aria-valuemin={0}
          aria-valuemax={totalStock}
          aria-valuenow={totalStock - availableStock}
        >
          <span
            className="stock-progress-fill"
            style={{ width: `${soldPercent}%` }}
          />
        </div>

        <p className="stock-caption">
          {availableStock} left · {sold} sold
        </p>

        {isReserved && (
          <p className="reservation-status" role="status">
            Reserved. Complete checkout before the timer expires.
          </p>
        )}

        {isPurchased && (
          <p className="reservation-status" role="status">
            Checkout completed.
          </p>
        )}

        <button
          className="buy-button"
          type="button"
          onClick={buttonAction}
          disabled={buttonDisabled}
        >
          {buttonLabel}
          {!buttonDisabled && (
            <span aria-hidden="true">
              {isReserved ? ' →' : ' →'}
            </span>
          )}
        </button>
      </div>
    </article>
  )
}
