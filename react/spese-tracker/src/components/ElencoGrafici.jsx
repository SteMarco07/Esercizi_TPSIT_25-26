import React, { useMemo } from 'react'
import { ResponsiveCalendar } from '@nivo/calendar'
import { ResponsiveFunnel } from '@nivo/funnel'
import { ResponsiveBar } from '@nivo/bar'
import '../App.css'
import './Elemento.css'

function formatDateKey(d) {
  if (!d) return null
  // try Date parsing first, then a simple yyyy-mm-dd match
  const dt = new Date(d)
  if (!isNaN(dt)) return dt.toISOString().slice(0, 10)
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
      const days = Math.max(1, Math.ceil((end - start) / (24 * 60 * 60 * 1000)))
      const weeks = Math.max(1, Math.ceil(days / 7))
      const base = 160
      const perWeek = 12
      return Math.min(Math.max(base + weeks * perWeek, 240), 700)
    } catch (err) {
      return 320
    }
  }, [from, to])

  // aggregate amounts per hour (0-23) for the funnel chart
  const hourData = useMemo(() => {
    const sums = new Array(24).fill(0)
    listaSpese.forEach(item => {
      const d = new Date(item.data)
      if (isNaN(d)) return
      const h = d.getUTCHours()
      sums[h] += Number(item.importo ?? item.costo ?? 0) || 0
    })
    return sums
      .map((v, i) => ({ id: `hour_${String(i).padStart(2, '0')}`, value: Math.round(v * 100) / 100, label: `${String(i).padStart(2, '0')}:00` }))
      .filter(x => x.value > 0)
  }, [listaSpese])

  // Prepare data for category x year stacked bar chart
  const barData = useMemo(() => {
    // map categoryName -> { year -> sum }
    const map = new Map()
    const yearsSet = new Set()

    listaSpese.forEach(item => {
      const val = Number(item.importo ?? item.costo ?? 0) || 0
      if (!val) return

      // get category name (prefer categoriaNome, fallback to categoria or id)
      const category = item.categoriaNome || item.categoria?.nome || item.categoria || item.categoriaId || '—'

      // get year
      let year = null
      try {
        const d = new Date(item.data)
        if (!isNaN(d)) year = String(d.getFullYear())
      } catch (err) {
        // ignore
      }
      if (!year) {
        // try to parse YYYY from string
        const m = String(item.data || '').match(/(\d{4})/)
        year = m ? m[1] : 'unknown'
      }

      yearsSet.add(year)

      if (!map.has(category)) map.set(category, {})
      const obj = map.get(category)
      obj[year] = (obj[year] || 0) + val
    })

    const years = Array.from(yearsSet).sort()

    const epsilon = 0.01 // small positive value to allow plotting on log scale
    const data = Array.from(map.entries()).map(([category, sums]) => {
      const base = { category }
      years.forEach(y => {
        const raw = Math.round((sums[y] || 0) * 100) / 100
        base[`${y}_raw`] = raw
        base[y] = raw > 0 ? raw : epsilon
      })
      return base
    })

    return { data, keys: years }
  }, [listaSpese])

  return (
    <section id={id} className="panel panel-grafici" aria-labelledby="grafici_title">
      <h2 id="grafici_title">Analisi grafica delle spese</h2>
      <div className="panel-body" aria-live="polite">

        <div className="card bg-base-200 shadow-xl image-full scritta carta p-5 mb-5">
          <h3><strong>Totale spese:</strong></h3>
          <p style={{ marginTop: 40 }}>{formatter.format(total)}</p>
        </div>



        <div className="card bg-base-200 shadow-xl image-full scritta carta p-5">
          <h3>Calendario delle spese</h3>
          <div>

          </div>
          {data && data.length > 0 ? (

            <div style={{ height: calendarHeight }}>
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
                      <div className="scritta-tooltip-day">{day}</div>
                      <div className="scritta-tooltip-value">{formatter.format(num)}</div>
                    </div>
                  )
                }}
              />
            </div>

          ) : (
            <div style={{ marginTop: 30 }}>
              <p>Nessun dato disponibile per i grafici</p>
            </div>
          )}
        </div>


        <div className="card bg-base-200 shadow-xl image-full scritta carta p-5" style={{ marginTop: 12 }}>
          <h3 style={{ margin: '0 0 8px 0' }}>Spesa totale per ora</h3>
          {/* Funnel: total spent per hour */}
          {hourData && hourData.length > 0 ? (
            <div style={{ height: 260, margin: 20 }}>
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
                  const d = node?.data ?? node
                  const label = d?.label ?? d?.id ?? ''
                  const formatted = d?.formattedValue ?? d?.formatted ?? null
                  const raw = d?.value ?? d?.rawValue ?? 0
                  const display = (formatted !== null && formatted !== undefined) ? String(formatted) : formatter.format(Number(raw) || 0)
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
            <p style={{ marginTop: 30 }}>Nessuna spesa registrata per ora</p>
          )}
        </div>

        <div className="card bg-base-200 shadow-xl image-full scritta carta p-5" style={{ marginTop: 12 }}>
          <h3 style={{ margin: '0 0 8px 0' }}>Spesa per categoria e anno</h3>
          {barData && barData.data && barData.data.length > 0 ? (
            <div style={{ height: 420 }}>
              <ResponsiveBar
                data={barData.data}
                keys={barData.keys}
                indexBy="category"
                margin={{ top: 50, right: 130, bottom: 80, left: 80 }}
                padding={0.2}
                groupMode="stacked"
                valueScale={{ type: 'linear' }}
                indexScale={{ type: 'band', round: true }}
                colors={{ scheme: 'nivo' }}
                borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: -45,
                  legend: 'Categoria',
                  legendPosition: 'middle',
                  legendOffset: 60
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'Totale (EUR)',
                  legendPosition: 'middle',
                  legendOffset: -60
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                legends={[
                  {
                    dataFrom: 'keys',
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 120,
                    translateY: 0,
                    itemsSpacing: 2,
                    itemWidth: 100,
                    itemHeight: 20,
                    itemDirection: 'left-to-right',
                    itemOpacity: 0.85,
                    symbolSize: 12,
                    effects: [
                      {
                        on: 'hover',
                        style: {
                          itemOpacity: 1
                        }
                      }
                    ]
                  }
                ]}
                tooltip={({ id, value, color, indexValue }) => (
                  <div className="scritta-tooltip">
                    <div style={{ fontWeight: 'bold' }}>{indexValue}</div>
                    <div>{String(id)}: {formatter.format(Number(value) || 0)}</div>
                  </div>
                )}
                role="application"
                ariaLabel="Grafico spesa per categoria e anno"
              />
            </div>
          ) : (
            <p style={{ marginTop: 30 }}>Nessun dato disponibile per il grafico a barre</p>
          )}
        </div>

      </div>
    </section>
  )
}
