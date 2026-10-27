
import { useEffect, useState } from 'react'
import { getRemainingTime } from '../utils/countdown'

const SALE_DURATION_MS = 8 * 60 * 60 * 1000

function pad(value) {
  return String(value).padStart(2, '0')
}

export default function CountdownTimer() {
  const [deadline] = useState(() => Date.now() + SALE_DURATION_MS)
  const [remaining, setRemaining] = useState(() =>
    getRemainingTime(deadline),
  )

  useEffect(() => {
    let animationFrameId

    function updateCountdown() {
      const nextRemaining = getRemainingTime(deadline)

      setRemaining((current) => {
        if (
          current.hours === nextRemaining.hours &&
          current.minutes === nextRemaining.minutes &&
          current.seconds === nextRemaining.seconds &&
          current.isExpired === nextRemaining.isExpired
        ) {
          return current
        }

        return nextRemaining
      })

      if (!nextRemaining.isExpired) {
        animationFrameId = requestAnimationFrame(updateCountdown)
      }
    }

    updateCountdown()

    return () => {
      if (animationFrameId !== undefined) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [deadline])

  const countdownUnits = [
    { label: 'Hours', value: pad(remaining.hours) },
    { label: 'Minutes', value: pad(remaining.minutes) },
    { label: 'Seconds', value: pad(remaining.seconds) },
  ]

  return (
    <div
      className="countdown-timer"
      role="timer"
      aria-label={`Flash sale time remaining: ${remaining.hours} hours, ${remaining.minutes} minutes, ${remaining.seconds} seconds`}
    >
      {countdownUnits.map((unit) => (
        <div className="countdown-unit" key={unit.label}>
          <span className="countdown-value">{unit.value}</span>
          <span className="countdown-label">{unit.label}</span>
        </div>
      ))}
    </div>
  )
}
