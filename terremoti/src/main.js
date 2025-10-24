import "./style.css"

const map = L.map("map").setView([45.5135, 10.1165], 2)

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const response = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
const data = await response.json()

const processedData = data.features.map(feature => {
    const place = feature.properties.place
    const magnitudine = feature.properties.mag
    const latitudine = feature.geometry.coordinates[1]
    const longitudine = feature.geometry.coordinates[0]
    return {
        place,
        magnitudine,
        latitudine,
        longitudine
    }
})

const creaCategorie = (data) => {
    const categories = {}
    data.forEach(d => {
        const key = Math.trunc(d.magnitudine)

        if (!categories[key]) categories[key] = []

        categories[key].push(d)
    })
    return categories
}

const categorie = creaCategorie(processedData)
console.log(categorie)

const creaFiltro = (form, key) => {
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.className = 'btn'
    checkbox.name = 'magnitude'
    checkbox.value = key
    checkbox.setAttribute('aria-label', key)
    checkbox.style = "margin: 5px; width: 50px"
    checkbox.checked = true // selezionato di default

    form.appendChild(checkbox)
}

const creaFiltri = (data) => {
    const form = document.getElementById("magFilterForm")
    form.innerHTML = ""

    // checkbox per selezionare tutti i filtri con label testuale
    const selectAll = document.createElement('input')
    selectAll.type = 'checkbox'
    selectAll.className = 'btn btn-square'
    selectAll.id = 'selectAll'
    selectAll.style = "margin: 5px; width: 80px"
    selectAll.setAttribute('aria-label', 'Seleziona tutti')
    selectAll.checked = true // selezionato di default

    // creare una label che contiene la checkbox e il testo
    const labelSelectAll = document.createElement('label')
    labelSelectAll.htmlFor = 'selectAll'
    labelSelectAll.appendChild(selectAll)

    // quando cambia, imposta tutti i checkbox magnitude allo stesso stato
    selectAll.addEventListener('change', () => {
        const boxes = form.querySelectorAll('input[name="magnitude"]')
        boxes.forEach(b => b.checked = selectAll.checked)
        // trigger change per applicare la visibilità
        form.dispatchEvent(new Event('change'))
    })

    form.appendChild(labelSelectAll)

    const keys = Object.keys(data)
    keys.forEach(key => {
        creaFiltro(form, key)
    })

    //creare il tasto per cancellare i filtri
    const checkbox = document.createElement('input')
    checkbox.type = 'reset'
    checkbox.className = 'btn btn-square'
    checkbox.style = "margin: 5px; width: 50px"

    form.appendChild(checkbox)



    return keys
}

const magFiltri = creaFiltri(categorie)

// non scatenare l'evento qui: i marker e i listener non sono ancora pronti

// stampare i terremoti con magnitudo > 6
const grandiTerremoti = processedData.filter(
    d => d.magnitudine > 6
)

//cercare la magnitudine media
const avgMagnitudine = grandiTerremoti.reduce(
    (acc, val) => acc += val.magnitudine,
    0
) / grandiTerremoti.length


// creare i circle ma non aggiungerli subito alla mappa; raggrupparli per magnitudine
const markersByMag = {}
processedData.forEach(d => {
    const key = String(Math.trunc(d.magnitudine))
    const circle = L.circle([d.latitudine, d.longitudine], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 500 * Math.pow(2.5, d.magnitudine)
    })

    if (!markersByMag[key]) markersByMag[key] = []
    markersByMag[key].push(circle)
})

// intercettare le modifiche alle checkbox: mostrare solo le magnitudini selezionate
const form = document.getElementById('magFilterForm')
form.addEventListener('change', () => {
    const checked = new Set(
        Array.from(form.querySelectorAll('input[name="magnitude"]:checked')).map(b => b.value)
    )

    Object.entries(markersByMag).forEach(([mag, circles]) => {
        const shouldShow = checked.has(mag) // se vuoto => nessuno mostrato
        circles.forEach(c => {
            if (shouldShow) c.addTo(map)
            else map.removeLayer(c)
        })
    })
})

// gestire il reset del form: dopo il reset non mostrare nulla
form.addEventListener('reset', () => {
    setTimeout(() => {
        Object.values(markersByMag).flat().forEach(c => map.removeLayer(c))
        // opzionale: triggerare change per aggiornare eventuali comportamenti collegati
        form.dispatchEvent(new Event('change'))
    }, 0)
})

// applica lo stato iniziale dei filtri (mostra i cerchi corrispondenti ai checkbox selezionati di default)
form.dispatchEvent(new Event('change'))

console.log(processedData)
console.log(grandiTerremoti)
console.log(avgMagnitudine)