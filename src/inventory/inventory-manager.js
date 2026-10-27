
const RESERVATION_STATES = Object.freeze({
  RESERVED: 'reserved',
  CHECKED_OUT: 'checked_out',
  EXPIRED: 'expired',
})

export class InventoryManager {
  #availableStock
  #reservations
  #reservationTtlMs
  #now
  #nextReservationId

  constructor(
    initialStock,
    { reservationTtlMs, now = Date.now } = {},
  ) {
    if (
      initialStock === null ||
      typeof initialStock !== 'object' ||
      Array.isArray(initialStock)
    ) {
      throw new TypeError('Initial stock must be an object')
    }

    if (
      !Number.isSafeInteger(reservationTtlMs) ||
      reservationTtlMs <= 0
    ) {
      throw new RangeError(
        'Reservation TTL must be a positive safe integer',
      )
    }

    if (typeof now !== 'function') {
      throw new TypeError('Clock must be a function')
    }

    this.#availableStock = new Map()
    this.#reservations = new Map()
    this.#reservationTtlMs = reservationTtlMs
    this.#now = now
    this.#nextReservationId = 1

    for (const [productId, quantity] of Object.entries(initialStock)) {
      if (!productId.trim()) {
        throw new TypeError('Product ID must not be empty')
      }

      if (!Number.isSafeInteger(quantity) || quantity < 0) {
        throw new RangeError(
          'Initial stock must be a non-negative safe integer',
        )
      }

      this.#availableStock.set(productId, quantity)
    }
  }

  reserve(productId, quantity = 1) {
    if (!this.#availableStock.has(productId)) {
      throw new Error('Unknown product')
    }

    if (!Number.isSafeInteger(quantity) || quantity <= 0) {
      throw new RangeError(
        'Reservation quantity must be a positive safe integer',
      )
    }

    const available = this.#availableStock.get(productId)

    if (available < quantity) {
      throw new Error('Insufficient stock')
    }

    const now = this.#now()

    if (!Number.isFinite(now)) {
      throw new TypeError('Clock must return a finite timestamp')
    }

    const reservation = {
      id: `reservation-${this.#nextReservationId}`,
      productId,
      quantity,
      status: RESERVATION_STATES.RESERVED,
      expiresAt: now + this.#reservationTtlMs,
    }

    this.#nextReservationId += 1
    this.#availableStock.set(productId, available - quantity)
    this.#reservations.set(reservation.id, reservation)

    return { ...reservation }
  }

  checkout(reservationId) {
    const reservation = this.#getExistingReservation(reservationId)

    if (reservation.status !== RESERVATION_STATES.RESERVED) {
      throw new Error('Cannot checkout a finalized reservation')
    }

    if (this.#now() >= reservation.expiresAt) {
      this.#releaseExpiredReservation(reservation)
      throw new Error('Reservation has expired')
    }

    reservation.status = RESERVATION_STATES.CHECKED_OUT

    return { ...reservation }
  }

  expireReservation(reservationId) {
    const reservation = this.#getExistingReservation(reservationId)

    if (reservation.status !== RESERVATION_STATES.RESERVED) {
      return false
    }

    if (this.#now() < reservation.expiresAt) {
      return false
    }

    this.#releaseExpiredReservation(reservation)

    return true
  }

  getAvailableStock(productId) {
    if (!this.#availableStock.has(productId)) {
      throw new Error('Unknown product')
    }

    return this.#availableStock.get(productId)
  }

  getReservation(reservationId) {
    return { ...this.#getExistingReservation(reservationId) }
  }

  #getExistingReservation(reservationId) {
    const reservation = this.#reservations.get(reservationId)

    if (!reservation) {
      throw new Error('Unknown reservation')
    }

    return reservation
  }

  #releaseExpiredReservation(reservation) {
    if (reservation.status !== RESERVATION_STATES.RESERVED) {
      return false
    }

    const available = this.#availableStock.get(reservation.productId)

    this.#availableStock.set(
      reservation.productId,
      available + reservation.quantity,
    )
    reservation.status = RESERVATION_STATES.EXPIRED

    return true
  }
}
