import React, { useMemo } from 'react'
import { ResponsiveCalendar } from '@nivo/calendar'
import { ResponsiveFunnel } from '@nivo/funnel'
import '../App.css'
import './Elemento.css'

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

export default function ElencoGrafici({ id, listaSpese = [] }) {

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

  // compute a suggested calendar height based on date range (number of weeks)
  const calendarHeight = useMemo(() => {
    try {
      const start = new Date(from)
      const end = new Date(to)
      const msPerDay = 24 * 60 * 60 * 1000
      const days = Math.max(1, Math.ceil((end - start) / msPerDay))
      const weeks = Math.max(1, Math.ceil(days / 7))

      // Derive height: base + per-week increment. Clamp to sensible limits.
      const base = 100
      const perWeek = 5 // pixels per week to make rows larger with more weeks
      const height = Math.min(Math.max(base + weeks * perWeek, 240), 500)
      return height
    } catch (err) {
      return 320
    }
  }, [from, to])

  // aggregate amounts per hour (0-23) for the funnel chart
  const hourData = useMemo(() => {
    const sums = new Array(24).fill(0)

    listaSpese.forEach(item => {
      const raw = item.data
      const d = new Date(raw)
      if (isNaN(d)) return
      const hour = d.getUTCHours()
      const val = Number(item.importo ?? item.costo ?? 0) || 0
      sums[hour] += val
    })

    // map to objects with { id, value, label } and keep only hours with value > 0
    return sums
      .map((v, i) => ({ id: `hour_${String(i).padStart(2, '0')}`, value: Math.round(v * 100) / 100, label: `${String(i).padStart(2, '0')}:00` }))
      .filter(x => x.value > 0)
  }, [listaSpese])

  return (
    <section id={id} className="panel panel-grafici" aria-labelledby="grafici_title">
      <h2 id="grafici_title">Analisi grafica delle spese</h2>
      <div className="panel-body" aria-live="polite">
        <h3><strong>Totale spese:</strong></h3>
        <p>{formatter.format(total)}</p>



        <div className="card bg-base-200 shadow-xl image-full scritta carta p-5" style={{ height: calendarHeight }}>
          <h3 >Calendario delle spese</h3>
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
              textColor: 'currentColor',
              labels: {
                text: {
                  fill: 'currentColor'
                }
              }
            }}
            tooltip={({ day, value, color }) => (
              <div className="scritta-tooltip">
                <div className="scritta-tooltip-day">{day}</div>
                <div className="scritta-tooltip-value">{formatter.format(value || 0)}</div>
              </div>
            )}

          />
        </div>


        <div className="card bg-base-200 shadow-xl image-full scritta carta p-5">
          {/* Funnel: total spent per hour */}
          {hourData && hourData.length > 0 ? (
            <div style={{ height: 260, margin: 20 }}>
              <h3 style={{ margin: '0 0 8px 0' }}>Spesa totale per ora</h3>
              <ResponsiveFunnel
                data={hourData}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                valueFormat=">-.4s"
                colors={{ scheme: 'spectral' }}
                borderWidth={20}
                labelColor={{ from: 'color', modifiers: [['darker', 3]] }}
                beforeSeparatorLength={100}
                beforeSeparatorOffset={20}
                afterSeparatorLength={100}
                afterSeparatorOffset={20}
                currentPartSizeExtension={10}
                currentBorderWidth={40}
                tooltip={(node) => {
                  // prefer formattedValue from node.data if available
                  const d = node?.data ?? node
                  const label = d?.label ?? d?.id ?? ''
                  const formatted = d?.formattedValue ?? d?.formatted ?? null
                  const raw = d?.value ?? d?.rawValue ?? 0
                  const display = (formatted !== null && formatted !== undefined)
                    ? formatted
                    : formatter.format(Number(raw) || 0)
                  return (
                    <div className="scritta-tooltip funnel-tooltip">
                      <div className="scritta-tooltip-day">{label}</div>
                      <div className="scritta-tooltip-value">{display}</div>
                    </div>
                  )
                }}

              />
            </div>
          ) : (
            <p style={{ marginTop: 12 }}>Nessuna spesa registrata per ora</p>
          )}
        </div>

      </div>
    </section>
  )
}
