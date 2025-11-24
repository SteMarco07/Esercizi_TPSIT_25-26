import React from 'react'
import './Elemento.css'

export default function Elemento({ id, titolo = "Titolo non presente", descrizione = "Descrizione non presente", costo = 0.0, data = null }) {
    const formatData = (d) => {
        if (!d) return '—'

        // If it's already a Date instance, show date + time (HH:MM)
        if (d instanceof Date) {
            return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        }

        // Recognize DB datetime format: YYYY-MM-DD[ T]HH:MM:SS
        if (typeof d === 'string') {
            const m = d.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}):(\d{2}))?$/)
            if (m) {
                const [, Y, M, D, h = '0', min = '0', s = '0'] = m
                const dt = new Date(Number(Y), Number(M) - 1, Number(D), Number(h), Number(min), Number(s))
                return `${dt.toLocaleDateString()} ${dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
            }
        }

        // Fallback: just stringify
        return String(d)
    }

    return (
        <div className="card bg-base-200 shadow-xl image-full transform hover:-translate-y-2 transition-transform duration-300 carta">
            <div className="card-body">
                <div className="card-header-row">
                    <h3 className="card-title text-2xl">{titolo}</h3>
                    <div className="meta-group" aria-hidden="true">
                        <div className="dettaglio" aria-label={`Data: ${formatData(data)}`}>{formatData(data)}</div>
                        <div className="dettaglio" aria-label={`Costo: €${Number(costo).toFixed(2)}`}>€{Number(costo).toFixed(2)}</div>
                    </div>
                </div>

                <p>{descrizione}</p>
                <div className="card-actions justify-end mt-4">
                    <button className="btn btn-primary">Dettagli</button>
                </div>
            </div>
        </div>
    )
}