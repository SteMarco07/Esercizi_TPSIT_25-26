import React, { useMemo } from 'react'
import { ResponsiveBar } from '@nivo/bar'
import { aggregateYearCategory } from '../../utils/graphicsUtils'

export default function CategoryYearBar({ listaSpese = [], formatter }) {
  const { data, keys } = useMemo(() => aggregateYearCategory(listaSpese), [listaSpese])

  return (
    <div style={{ height: 320, margin: 20 }}>
      <ResponsiveBar
        data={data}
        keys={keys}
        indexBy="anno"
        // reduce right margin and remove bottom legend to save space
        margin={{ top: 20, right: 40, bottom: 30, left: 60 }}
        theme={{
          textColor: 'currentColor',
          labels: { text: { fill: 'currentColor' } },
          axis: {
            ticks: { text: { fill: 'currentColor' } },
            legend: { text: { fill: 'currentColor' } }
          }
        }}
        padding={0.3}
        colors={{ scheme: 'set2' }}
        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        axisTop={null}
        axisRight={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: '',
          legendPosition: 'middle',
          legendOffset: 0
        }}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Anno',
          legendPosition: 'middle',
          legendOffset: 32
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Spesa',
          legendPosition: 'middle',
          legendOffset: -50
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor="currentColor"
        animate={true}
        motionStiffness={90}
        motionDamping={15}
        tooltip={({ id, value, indexValue }) => (
          <div className="scritta-tooltip">
            <div className="scritta-tooltip-day"><p style={{ fontWeight: 'bold' }}>{indexValue} — {id}</p></div>
            <div className="scritta-tooltip-value">{formatter ? formatter.format(Number(value) || 0) : value}</div>
          </div>
        )}
        role="application"
        ariaLabel="Grafico spesa per categoria e anno"
      />
    </div>
  )
}
