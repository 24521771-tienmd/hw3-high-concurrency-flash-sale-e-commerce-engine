
const MILLISECONDS_PER_SECOND = 1000
const SECONDS_PER_MINUTE = 60
const MINUTES_PER_HOUR = 60
const MILLISECONDS_PER_MINUTE =
  MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE
const MILLISECONDS_PER_HOUR =
  MILLISECONDS_PER_MINUTE * MINUTES_PER_HOUR

export function getRemainingTime(deadline, now = Date.now()) {
  const remaining = Math.max(0, deadline - now)

  const hours = Math.floor(remaining / MILLISECONDS_PER_HOUR)
  const minutes = Math.floor(
    (remaining % MILLISECONDS_PER_HOUR) / MILLISECONDS_PER_MINUTE,
  )
  const seconds = Math.floor(
    (remaining % MILLISECONDS_PER_MINUTE) / MILLISECONDS_PER_SECOND,
  )
  const milliseconds = remaining % MILLISECONDS_PER_SECOND

  return {
    total: remaining,
    hours,
    minutes,
    seconds,
    milliseconds,
    isExpired: remaining === 0,
  }
}
