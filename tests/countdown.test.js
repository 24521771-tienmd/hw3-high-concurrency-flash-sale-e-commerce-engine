
import test from 'node:test'
import assert from 'node:assert/strict'
import { getRemainingTime } from '../src/utils/countdown.js'

test('calculates hours, minutes, seconds and milliseconds', () => {
  const result = getRemainingTime(3_723_456, 0)

  assert.deepEqual(result, {
    total: 3_723_456,
    hours: 1,
    minutes: 2,
    seconds: 3,
    milliseconds: 456,
    isExpired: false,
  })
})

test('returns zero when the deadline has been reached', () => {
  const result = getRemainingTime(5_000, 5_000)

  assert.equal(result.total, 0)
  assert.equal(result.isExpired, true)
})

test('never returns negative remaining time after expiry', () => {
  const result = getRemainingTime(5_000, 7_500)

  assert.equal(result.total, 0)
  assert.equal(result.hours, 0)
  assert.equal(result.minutes, 0)
  assert.equal(result.seconds, 0)
  assert.equal(result.milliseconds, 0)
  assert.equal(result.isExpired, true)
})

test('recalculates from the current time instead of accumulating tick drift', () => {
  const deadline = 100_000

  const first = getRemainingTime(deadline, 10_000)
  const delayed = getRemainingTime(deadline, 12_500)

  assert.equal(first.total, 90_000)
  assert.equal(delayed.total, 87_500)
})
