import React, { useMemo } from 'react'
import { aggregateByDay } from '../../utils/graphicsUtils'

export default function SummaryCard({ listaSpese = [], formatter }) {
  const total = useMemo(() => {
    const agg = aggregateByDay(listaSpese)
    return agg.total || 0
  }, [listaSpese])

  return (
    <div className="card bg-base-200 shadow-xl image-full scritta carta p-5 mb-5">
      <h3><strong>Totale spese:</strong></h3>
      <p style={{ marginTop: 40 }}>{formatter ? formatter.format(total) : total}</p>
    </div>
  )
}
