import React, { useMemo } from 'react'
import { ResponsiveCalendar } from '@nivo/calendar'
import { aggregateByDay, computeCalendarHeight } from '../../utils/graphicsUtils'

export default function CalendarChart({ listaSpese = [], formatter }) {
  const { data, from, to } = useMemo(() => aggregateByDay(listaSpese), [listaSpese])
  const height = useMemo(() => computeCalendarHeight(from, to), [from, to])

  return (
    <div style={{ height }}>
      <ResponsiveCalendar
        data={data}
        from={from}
        to={to}
        emptyColor="#eeeeee"
        margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
        yearSpacing={20}
        monthBorderColor="#979797b0"
        dayBorderWidth={2}
        dayBorderColor="#ffffff"
        theme={{ textColor: 'currentColor', labels: { text: { fill: 'currentColor' } } }}
        tooltip={(node) => {
          const day = node?.day ?? node?.data?.day ?? ''
          const raw = node?.value ?? node?.data?.value ?? 0
          const num = Number(raw) || 0
          return (
            <div className="scritta-tooltip">
              <div className="scritta-tooltip-day"><p style={{ fontWeight: 'bold' }}>{day}</p></div>
              <div className="scritta-tooltip-value">{formatter ? formatter.format(num) : num}</div>
            </div>
          )
        }}
      />
    </div>
  )
}
