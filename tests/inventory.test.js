
import test from 'node:test'
import assert from 'node:assert/strict'
import { InventoryManager } from '../src/inventory/inventory-manager.js'

function createInventory(initialStock = 2) {
  let currentTime = 1000

  const inventory = new InventoryManager(
    { 'iphone-15': initialStock },
    {
      reservationTtlMs: 1000,
      now: () => currentTime,
    },
  )

  return {
    inventory,
    setTime(value) {
      currentTime = value
    },
  }
}

test('reserves stock when sufficient inventory is available', () => {
  const { inventory } = createInventory(2)

  const reservation = inventory.reserve('iphone-15', 1)

  assert.equal(reservation.status, 'reserved')
  assert.equal(reservation.productId, 'iphone-15')
  assert.equal(reservation.quantity, 1)
  assert.equal(reservation.expiresAt, 2000)
  assert.equal(inventory.getAvailableStock('iphone-15'), 1)
})

test('rejects insufficient stock without changing inventory', () => {
  const { inventory } = createInventory(1)

  inventory.reserve('iphone-15', 1)

  assert.throws(
    () => inventory.reserve('iphone-15', 1),
    /insufficient stock/i,
  )
  assert.equal(inventory.getAvailableStock('iphone-15'), 0)
})

test('checks out a valid reservation exactly once', () => {
  const { inventory } = createInventory()
  const reservation = inventory.reserve('iphone-15', 1)

  const result = inventory.checkout(reservation.id)

  assert.equal(result.status, 'checked_out')
  assert.equal(inventory.getAvailableStock('iphone-15'), 1)

  assert.throws(
    () => inventory.checkout(reservation.id),
    /cannot checkout/i,
  )
  assert.equal(inventory.getAvailableStock('iphone-15'), 1)
})

test('expires a reservation and releases stock exactly once', () => {
  const { inventory, setTime } = createInventory()
  const reservation = inventory.reserve('iphone-15', 1)

  setTime(2000)

  assert.equal(inventory.expireReservation(reservation.id), true)
  assert.equal(inventory.getReservation(reservation.id).status, 'expired')
  assert.equal(inventory.getAvailableStock('iphone-15'), 2)

  assert.equal(inventory.expireReservation(reservation.id), false)
  assert.equal(inventory.getAvailableStock('iphone-15'), 2)
})

test('rejects checkout at the expiry deadline and releases stock', () => {
  const { inventory, setTime } = createInventory()
  const reservation = inventory.reserve('iphone-15', 1)

  setTime(reservation.expiresAt)

  assert.throws(
    () => inventory.checkout(reservation.id),
    /expired/i,
  )
  assert.equal(inventory.getReservation(reservation.id).status, 'expired')
  assert.equal(inventory.getAvailableStock('iphone-15'), 2)
})

test('prevents competing reservations from overselling stock', () => {
  const { inventory } = createInventory(1)

  const first = inventory.reserve('iphone-15', 1)

  assert.equal(first.status, 'reserved')
  assert.throws(
    () => inventory.reserve('iphone-15', 1),
    /insufficient stock/i,
  )
  assert.equal(inventory.getAvailableStock('iphone-15'), 0)
})

test('does not expire a reservation before its deadline', () => {
  const { inventory, setTime } = createInventory()
  const reservation = inventory.reserve('iphone-15', 1)

  setTime(reservation.expiresAt - 1)

  assert.equal(inventory.expireReservation(reservation.id), false)
  assert.equal(inventory.getReservation(reservation.id).status, 'reserved')
  assert.equal(inventory.getAvailableStock('iphone-15'), 1)
})

test('does not release stock after successful checkout', () => {
  const { inventory, setTime } = createInventory()
  const reservation = inventory.reserve('iphone-15', 1)

  inventory.checkout(reservation.id)
  setTime(reservation.expiresAt + 1)

  assert.equal(inventory.expireReservation(reservation.id), false)
  assert.equal(inventory.getReservation(reservation.id).status, 'checked_out')
  assert.equal(inventory.getAvailableStock('iphone-15'), 1)
})

test('rejects invalid reservation quantities', () => {
  const { inventory } = createInventory(2)

  for (const quantity of [0, -1, 1.5, Number.NaN]) {
    assert.throws(
      () => inventory.reserve('iphone-15', quantity),
      /quantity/i,
    )
  }

  assert.equal(inventory.getAvailableStock('iphone-15'), 2)
})

test('rejects reservations for unknown products', () => {
  const { inventory } = createInventory(2)

  assert.throws(
    () => inventory.reserve('unknown-product', 1),
    /unknown product/i,
  )
})
