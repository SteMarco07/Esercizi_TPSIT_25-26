import React, { useMemo } from 'react'
import { ResponsiveCalendar } from '@nivo/calendar'

function formatDateKey(d) {
  if (!d) return null
  try {
    const date = new Date(d)
    if (!isNaN(date)) return date.toISOString().slice(0, 10)
  } catch (e) {
    // fall through
  }
  const m = String(d).match(/(\d{4}-\d{2}-\d{2})/)
  return m ? m[1] : null
}

export default function ElencoGrafici({ id, listaSpese = [], outerTextColor = '#ffffff', innerTextColor = '#111827', textColor }) {
  // backward compatibility: if user still passes `textColor`, treat it as inner text color
  const inner = textColor || innerTextColor
  const formatter = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' })

  // aggregate amounts per day and prepare data for Nivo
  const { data, total, from, to } = useMemo(() => {
    const sums = {}
    let min = null
    let max = null

    listaSpese.forEach(item => {
      const day = formatDateKey(item.data)
      if (!day) return
      const val = Number(item.importo ?? item.costo ?? 0) || 0
      sums[day] = (sums[day] || 0) + val
      if (!min || day < min) min = day
      if (!max || day > max) max = day
    })

    const dataArr = Object.keys(sums).sort().map(day => ({ day, value: sums[day] }))

    // if there is no data, show last 1 year range
    let fromDate = min
    let toDate = max
    if (!fromDate || !toDate) {
      const now = new Date()
      const past = new Date(now)
      past.setFullYear(now.getFullYear() - 1)
      fromDate = past.toISOString().slice(0, 10)
      toDate = now.toISOString().slice(0, 10)
    }

    const totalSum = Object.values(sums).reduce((s, v) => s + v, 0)

    return { data: dataArr, total: totalSum, from: fromDate, to: toDate }
  }, [listaSpese])

  return (
    <section id={id} className="panel panel-grafici" aria-labelledby="grafici_title">
      <h2 id="grafici_title" style={{ color: outerTextColor }}>Analisi grafica delle spese</h2>
      <div className="panel-body" aria-live="polite">
        <p style={{ color: outerTextColor }}><strong>Totale spese:</strong> {formatter.format(total)}</p>

        <div style={{ height: 320 }}>
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
            theme={{
              textColor: inner,
              tooltip: {
                container: {
                  background: '#fff',
                  color: inner,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
                }
              },
              labels: {
                text: {
                  fill: outerTextColor
                }
              }
            }}
            tooltip={({ day, value }) => (
              <div style={{ padding: 8, background: '#fff', border: '1px solid #ddd', color: inner }}>
                <strong>{day}</strong>
                <div>{formatter.format(value || 0)}</div>
              </div>
            )}
          />
        </div>

      </div>
    </section>
  )
}
