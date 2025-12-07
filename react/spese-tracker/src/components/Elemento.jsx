import React from 'react'
import './Elemento.css'
import '../App.css'

export default function Elemento({ id, titolo = "Titolo non presente", descrizione = "Descrizione non presente", costo = 0.0, data = null, categoriaNome = '', categoriaColore = '', onRequestDelete, asRow = false }) {

    const formatData = (d) => {
        if (!d) return '—'

        // If it's already a Date instance, show date + time (HH:MM)
        if (d instanceof Date) {
            return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        }

        // If it's a string coming from DB like "2025-11-13T12:00:00.000Z" or with space,
        // prefer to parse ISO timestamps and present them in the browser's local time
        if (typeof d === 'string') {
            const isoLike = d.replace(' ', 'T')

            // If the string contains timezone info (Z or +hh:mm/-hh:mm), parse and
            // display in local time so users see the expected local hour.
            if (/[Zz]|[+-]\d{2}:?\d{2}$/.test(d)) {
                const dt = new Date(isoLike)
                if (!isNaN(dt.getTime())) {
                    return `${dt.toLocaleDateString()} ${dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                }
            }

            // Loose regex to capture date and optional time parts (no timezone)
            const m = d.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?/) 
            if (m) {
                const [, Y, M, D, h, min] = m
                const pad = (n) => String(n).padStart(2, '0')
                const datePart = `${pad(D)}/${pad(M)}/${Y}`
                if (h !== undefined && min !== undefined) {
                    return `${datePart} ${pad(h)}:${pad(min)}`
                }
                return datePart
            }

            // Last resort: try parsing as ISO and display local
            const dt = new Date(isoLike)
            if (!isNaN(dt.getTime())) {
                return `${dt.toLocaleDateString()} ${dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
            }
        }

        // Fallback: just stringify
        return String(d)
    }

    return (
        asRow ? (
            <tr key={id}>
                <td className="truncate" style={{ maxWidth: 220 }}>{titolo}</td>
                <td className="truncate" style={{ maxWidth: 320 }}>{descrizione || '-'}</td>
                <td>{formatData(data)}</td>
                <td>{typeof costo === 'number' ? Number(costo).toFixed(2) : costo}</td>
                <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {categoriaColore ? <span style={{ width: 14, height: 14, borderRadius: 3, display: 'inline-block', backgroundColor: categoriaColore, border: '1px solid rgba(0,0,0,0.1)' }} aria-hidden></span> : null}
                        <span>{categoriaNome || '—'}</span>
                    </div>
                </td>
                <td>
                    <button className="btn btn-sm btn-error" onClick={() => { if (typeof onRequestDelete === 'function') onRequestDelete(id) }}>Elimina</button>
                </td>
            </tr>
        ) : (
            <div className="card bg-base-200 shadow-xl image-full transform hover:-translate-y-2 transition-transform duration-300 carta">
                <div className="card-body">
                    <div className="card-header-row">
                        <h3 className="card-title text-2xl scritta">{titolo}</h3>
                        <div className="meta-group" aria-hidden="true">
                            <div className="dettaglio" aria-label={`Data: ${formatData(data)}`}>{formatData(data)}</div>
                            <div className="dettaglio" aria-label={`Categoria: ${categoriaNome || '—'}`}>{categoriaNome || '—'}</div>
                            <div className="dettaglio" aria-label={`Costo: €${Number(costo).toFixed(2)}`}>€{Number(costo).toFixed(2)}</div>
                        </div>
                    </div>

                    <p className='scritta'>{descrizione}</p>
                    <div className="card-actions justify-end mt-4">
                        <button className="btn btn-ouline btn-error bottone" onClick={() => { if (typeof onRequestDelete === 'function') onRequestDelete(id) }}>Elimina</button>

                    </div>
                </div>
            </div>
        )
    )
}