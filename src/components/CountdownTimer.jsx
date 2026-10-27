
const countdownUnits = [
  { label: 'Hours', value: '08' },
  { label: 'Minutes', value: '42' },
  { label: 'Seconds', value: '16' },
]

export default function CountdownTimer() {
  return (
    <div
      className="countdown-timer"
      aria-label="Flash sale countdown preview"
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
