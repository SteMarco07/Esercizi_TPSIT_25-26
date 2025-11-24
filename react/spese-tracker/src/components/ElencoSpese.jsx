import React from 'react'
import Elemento from './Elemento'

function AggiungiSpese({ list }) {
    return list.map((element, pos) => (
        <Elemento
            key={pos}
            titolo={element.titolo}
            descrizione={element.descrizione}
            data={element.data}
            costo={element.importo}
            id={element.id}
        />
    ));


}

export default function ElencoSpese({ id, className, listaSpese }) {
    return (
        <section id="elenco_section" className={`panel panel-elenco ${className || ''}`} aria-labelledby="elenco_title">
            <h2 id="elenco_title">Elenco Spese</h2>
            <div className="panel-body" aria-live="polite">
                <AggiungiSpese list={listaSpese} />
            </div>
        </section>
    )
}
