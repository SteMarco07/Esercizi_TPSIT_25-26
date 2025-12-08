import React, { useMemo, useState } from 'react'
import { ResponsiveLine } from '@nivo/line'

function formatDate(d) {
    const dt = new Date(d)
    if (isNaN(dt)) return null
    return dt.toISOString().slice(0, 10)
}

export default function TimeSeriesLine({ listaSpese = [], formatter, rangeOverride = null, height = 320 }) {
    const [range, setRange] = useState('week') // 'day' | 'week' | 'month'

    const series = useMemo(() => {
        const items = Array.isArray(listaSpese) ? listaSpese : (listaSpese && typeof listaSpese === 'object' ? Object.values(listaSpese) : [])
        const now = new Date()

        const effectiveRange = rangeOverride || range

        if (effectiveRange === 'day') {
            // last 24 hours, hourly buckets
            const hours = new Array(24).fill(0)
            items.forEach(it => {
                const d = new Date(it?.data)
                if (isNaN(d)) return
                const diff = Math.floor((now - d) / (1000 * 60 * 60))
                if (diff >= 0 && diff < 24) {
                    const idx = 23 - diff // reverse so oldest first
                    const val = Number(it?.importo ?? it?.costo ?? 0) || 0
                    hours[idx] += val
                }
            })
            const data = hours.map((v, i) => ({ x: `${String((now.getHours() + i + 1) % 24).padStart(2, '0')}:00`, y: Math.round(v * 100) / 100 }))
            return [{ id: 'Spese', data }]
        }

        // week -> last 7 days; month -> last 30 days
        const days = effectiveRange === 'week' ? 7 : 30
        const buckets = {}
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date(now)
            d.setDate(now.getDate() - i)
            const k = d.toISOString().slice(0, 10)
            buckets[k] = 0
        }

        items.forEach(it => {
            const key = formatDate(it?.data)
            if (!key) return
            if (Object.prototype.hasOwnProperty.call(buckets, key)) {
                const val = Number(it?.importo ?? it?.costo ?? 0) || 0
                buckets[key] += val
            }
        })

        const data = Object.keys(buckets).map(k => ({ x: k, y: Math.round((buckets[k] || 0) * 100) / 100 }))
        return [{ id: 'Spese', data }]
    }, [listaSpese, range, rangeOverride])

    return (
        <div className="p-3" style={{ height }}>
            {!rangeOverride && (
                <div className="mb-3 flex gap-2 mt-5">
                    <button className={`btn btn-sm ${range === 'day' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setRange('day')}>Giorno</button>
                    <button className={`btn btn-sm ${range === 'week' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setRange('week')}>Settimana</button>
                    <button className={`btn btn-sm ${range === 'month' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setRange('month')}>Mese</button>
                </div>
            )}

            <ResponsiveLine
                data={series}
                margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
                axisBottom={{
                    orient: 'bottom',
                    tickRotation: -45,
                    tickSize: 5,
                    tickPadding: 5,
                    legend: '',
                    legendOffset: 36,
                    tickFormat: v => {
                        // for hourly labels we keep HH:00, for date labels we remove the year
                        if (typeof v === 'string' && v.match(/^\d{2}:00$/)) return v
                        try {
                            const d = new Date(v)
                            if (isNaN(d)) return v
                            const day = String(d.getDate()).padStart(2, '0')
                            const month = String(d.getMonth() + 1).padStart(2, '0')
                            return `${day}/${month}`
                        } catch (err) {
                            return v
                        }
                    }
                }}
                axisLeft={{ legend: 'Spesa', legendOffset: -40 }}
                pointSize={10}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'seriesColor' }}
                pointLabelYOffset={-12}
                enableTouchCrosshair={true}
                useMesh={true}
                theme={{
                    textColor: 'currentColor',
                    labels: { text: { fill: 'currentColor' } },
                    axis: {
                        ticks: { text: { fill: 'currentColor' } },
                        legend: { text: { fill: 'currentColor' } }
                    }
                }}
                tooltip={({ point }) => {
                    const y = point.data.y
                    const x = point.data.x
                    return (
                        <div className="scritta-tooltip">
                            <div className="scritta-tooltip-day"><strong>{x}</strong></div>
                            <div className="scritta-tooltip-value">{formatter ? formatter.format(Number(y) || 0) : y}</div>
                        </div>
                    )
                }}
            />
        </div>
    )
}
