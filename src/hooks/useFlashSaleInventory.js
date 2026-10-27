
import { useCallback, useEffect, useState } from 'react'
import { InventoryManager } from '../inventory/inventory-manager'

const RESERVATION_TTL_MS = 30_000
const EXPIRY_CHECK_INTERVAL_MS = 250

function createInventorySnapshot(manager, products, reservationIds) {
  return Object.fromEntries(
    products.map((product) => {
      const reservationId = reservationIds[product.id]
      const reservation = reservationId
        ? manager.getReservation(reservationId)
        : null

      return [
        product.id,
        {
          availableStock: manager.getAvailableStock(product.id),
          reservation,
        },
      ]
    }),
  )
}

function createInitialInventory(products) {
  const initialStock = Object.fromEntries(
    products.map((product) => [product.id, product.stock]),
  )

  return new InventoryManager(initialStock, {
    reservationTtlMs: RESERVATION_TTL_MS,
  })
}

export default function useFlashSaleInventory(products) {
  const [manager] = useState(() => createInitialInventory(products))
  const [reservationIds, setReservationIds] = useState({})
  const [inventory, setInventory] = useState(() =>
    createInventorySnapshot(manager, products, {}),
  )
  const [message, setMessage] = useState('')

  const refreshInventory = useCallback(() => {
    setInventory(
      createInventorySnapshot(manager, products, reservationIds),
    )
  }, [manager, products, reservationIds])

  const reserve = useCallback(
    (productId) => {
      const existingId = reservationIds[productId]

      if (existingId) {
        const existing = manager.getReservation(existingId)

        if (existing.status === 'reserved') {
          setMessage('Bạn đã giữ sản phẩm này rồi.')
          return
        }
      }

      try {
        const reservation = manager.reserve(productId, 1)
        const nextReservationIds = {
          ...reservationIds,
          [productId]: reservation.id,
        }

        setReservationIds(nextReservationIds)
        setInventory(
          createInventorySnapshot(manager, products, nextReservationIds),
        )
        setMessage(
          `Đã giữ sản phẩm trong ${RESERVATION_TTL_MS / 1000} giây.`,
        )
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : 'Không thể giữ sản phẩm. Vui lòng thử lại.',
        )
        refreshInventory()
      }
    },
    [manager, products, refreshInventory, reservationIds],
  )

  const checkout = useCallback(
    (reservationId) => {
      try {
        const reservation = manager.checkout(reservationId)
        setMessage(
          `Checkout thành công cho sản phẩm ${reservation.productId}.`,
        )
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : 'Checkout thất bại. Vui lòng thử lại.',
        )
      }

      refreshInventory()
    },
    [manager, refreshInventory],
  )

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      let changed = false

      for (const reservationId of Object.values(reservationIds)) {
        const reservation = manager.getReservation(reservationId)

        if (
          reservation.status === 'reserved' &&
          manager.expireReservation(reservationId)
        ) {
          changed = true
          setMessage(
            'Thời gian giữ hàng đã hết. Sản phẩm được trả lại kho.',
          )
        }
      }

      if (changed) {
        refreshInventory()
      }
    }, EXPIRY_CHECK_INTERVAL_MS)

    return () => window.clearInterval(intervalId)
  }, [manager, refreshInventory, reservationIds])

  return {
    inventory,
    message,
    reserve,
    checkout,
  }
}
