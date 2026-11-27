import React from 'react'

const SUMMON_SPARKS = Array.from({ length: 18 }).map((_, idx) => ({
  angle: `${idx * 20}deg`,
  dist: `${-(130 + (idx % 3) * 44)}px`,
  color: idx % 3 === 0 ? '#93c5fd' : '#e2e8f0',
  size: idx % 2 === 0 ? 6 : 4,
}))

interface SummonBurstProps {
  burstKey: number
}

export const SummonBurst: React.FC<SummonBurstProps> = ({ burstKey }) => {
  if (burstKey <= 0) return null

  return (
    <div
      key={burstKey}
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 z-0 flex h-[min(540px,130vw)] w-[min(540px,130vw)] -translate-x-1/2 -translate-y-1/2 items-center justify-center"
    >
      <div className="summon-flash absolute inset-12 rounded-full" />
      <div className="summon-rays absolute inset-0 rounded-full" />
      <div className="summon-ring absolute h-[52%] w-[52%] rounded-full" />
      {SUMMON_SPARKS.map((spark, i) => (
        <span
          key={i}
          className="summon-spark absolute rounded-full"
          style={
            {
              width: `${spark.size}px`,
              height: `${spark.size}px`,
              backgroundColor: spark.color,
              boxShadow: `0 0 10px ${spark.color}`,
              '--spark-angle': spark.angle,
              '--spark-dist': spark.dist,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}
