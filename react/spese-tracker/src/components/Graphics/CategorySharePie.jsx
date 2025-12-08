import React, { useMemo } from 'react'
import { ResponsivePie } from '@nivo/pie'
import { aggregateCategoryShare } from '../../utils/graphicsUtils'

export default function CategorySharePie({ listaSpese = [], formatter }) {
  const data = useMemo(() => aggregateCategoryShare(listaSpese), [listaSpese])

  return (
    <div style={{ height: 320, margin: 12 }}>
      <ResponsivePie
        data={data}
        margin={{ top: 40, right: 80, bottom: 40, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        colors={{ scheme: 'set2' }}
        borderWidth={1}
        borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
        radialLabelsSkipAngle={10}
        radialLabelsTextColor="currentColor"
        radialLabelsLinkColor={{ from: 'color' }}
        sliceLabelsSkipAngle={10}
        sliceLabelsTextColor="currentColor"
        theme={{
          textColor: 'currentColor',
          labels: { text: { fill: 'currentColor' } }
        }}
        tooltip={({ datum }) => (
          <div className="scritta-tooltip">
            <div className="scritta-tooltip-day"><strong>{datum.id}</strong></div>
            <div className="scritta-tooltip-value">{formatter ? formatter.format(datum.value) : datum.value}</div>
          </div>
        )}
      />
    </div>
  )
}
