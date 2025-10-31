import "./style.css"

const map = L.map("map").setView([45.5135, 10.1165], 2)


L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const response = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
const data = await response.json()

function financial(x) {
  // Restituisce una stringa con due decimali per i valori numerici
  return Number.parseFloat(x).toFixed(2);
}

const processedData = data.features.map(feature => {
    const place = feature.properties.place
    const magnitudine = feature.properties.mag
    const latitudine = feature.geometry.coordinates[1]
    const longitudine = feature.geometry.coordinates[0]
    const time = feature.properties.time // timestamp in ms
    // converto in stringa leggibile
    const dateStr = time ? new Date(time).toLocaleString() : ""
    return {
        place,
        magnitudine,
        latitudine,
        longitudine,
        time: dateStr
    }
})

// Raggruppa i dati dei terremoti per magnitudine intera
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

// Crea una checkbox per filtrare i terremoti per magnitudine
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

// Crea tutti i filtri di magnitudine e li aggiunge al form
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

creaFiltri(categorie)

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
    const minRadius = 100; // raggio minimo visibile
    const computedRadius = 500 * Math.pow(2.5, d.magnitudine);
    // Colore dinamico in base alla magnitudine (da verde a rosso)
    const minMag = 0;
    const maxMag = Math.max(...processedData.map(d => d.magnitudine));
    const percent = Math.min(1, Math.max(0, (d.magnitudine - minMag) / (maxMag - minMag)));
    // Da 120 (verde) a 0 (rosso) nella scala HSL
    const hue = 120 - 120 * percent;
    const color = `hsl(${hue}, 100%, 40%)`;
    const fillColor = `hsl(${hue}, 100%, 80%)`;
    const circle = L.circle([d.latitudine, d.longitudine], {
        color: color,
        fillColor: fillColor,
        fillOpacity: 0.5,
        radius: Math.max(minRadius, computedRadius)
    }).bindPopup(
        d.place + '<br>' +
        'Longitudine: ' + financial(d.longitudine) + '<br>' +
        'Latitudine: ' + financial(d.latitudine) + '<br>' +
        'Orario: ' + d.time
    )
    if (!markersByMag[key]) markersByMag[key] = []
    markersByMag[key].push(circle)
})

// Gestisce la visualizzazione dei marker sulla mappa in base ai filtri selezionati
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

// Gestisce il reset dei filtri, rimuovendo tutti i marker dalla mappa
form.addEventListener('reset', () => {
    setTimeout(() => {
        Object.values(markersByMag).flat().forEach(c => map.removeLayer(c))
        form.dispatchEvent(new Event('change'))
    }, 0)
})

// applica lo stato iniziale dei filtri (mostra i cerchi corrispondenti ai checkbox selezionati di default)
form.dispatchEvent(new Event('change'))

// Gestione click sul menu
const showFiltersMenu = document.getElementById('showFiltersMenu');
const showListMenu = document.getElementById('showListMenu');
const filtersView = document.getElementById('filtersView');
const listView = document.getElementById('listView');


// Funzioni per salvataggio/ripristino filtri
function saveFiltersToLocalStorage() {
    // Salva lo stato dei filtri di magnitudine su localStorage
    const form = document.getElementById('magFilterForm');
    if (!form) return;
    const filters = Array.from(form.querySelectorAll('input[name="magnitude"]')).map(cb => ({
        value: cb.value,
        checked: cb.checked
    }));
    localStorage.setItem('magFilters', JSON.stringify(filters));
}

function restoreFiltersFromLocalStorage() {
    // Ripristina lo stato dei filtri di magnitudine da localStorage
    const form = document.getElementById('magFilterForm');
    if (!form) return;
    const filters = JSON.parse(localStorage.getItem('magFilters') || 'null');
    if (!filters) return;
    filters.forEach(f => {
        const cb = form.querySelector(`input[name="magnitude"][value="${f.value}"]`);
        if (cb) cb.checked = f.checked;
    });
    form.dispatchEvent(new Event('change'));
}


showFiltersMenu.addEventListener('click', () => {
    filtersView.style.display = '';
    listView.style.display = 'none';
    const cardTitle = document.querySelector('.card-title');
    if (cardTitle) cardTitle.textContent = 'Filtri Magnitudine';
});

showListMenu.addEventListener('click', () => {
    filtersView.style.display = 'none';
    listView.style.display = '';
    const cardTitle = document.querySelector('.card-title');
    if (cardTitle) cardTitle.textContent = 'Elenco terremoti';
    
    saveFiltersToLocalStorage();

    renderTerritoriList();
});



// Genera l'elenco dei terremoti nella schermata elenco
function renderTerritoriList() {
    const listView = document.getElementById('listView');
    if (!listView) return;
    listView.innerHTML = '';
    const ul = document.createElement('ul');
    ul.className = 'menu bg-base-100 rounded-box mt-4';
    processedData.forEach((d, idx) => {
        const li = document.createElement('li');
        li.innerHTML = `<div style="cursor:pointer"><strong>${d.place}</strong><br>
            Magnitudine: ${financial(d.magnitudine)}<br>
            Latitudine: ${financial(d.latitudine)}<br>
            Longitudine: ${financial(d.longitudine)}<br>
            Orario: ${d.time}</div>`;
        li.addEventListener('click', () => {
            map.setView([d.latitudine, d.longitudine], 8, { animate: true });
        });
        ul.appendChild(li);
    });
    listView.appendChild(ul);
}

document.addEventListener('DOMContentLoaded', function () {
    const showFiltersMenu = document.getElementById('showFiltersMenu');
    const showListMenu = document.getElementById('showListMenu');
    const filtersView = document.getElementById('filtersView');
    const listView = document.getElementById('listView');
    showFiltersMenu.addEventListener('click', function () {
        filtersView.style.display = 'block';
        listView.style.display = 'none';
        showFiltersMenu.classList.add('active');
        showListMenu.classList.remove('active');
    });
    showListMenu.addEventListener('click', function () {
        filtersView.style.display = 'none';
        listView.style.display = 'block';
        showListMenu.classList.add('active');
        showFiltersMenu.classList.remove('active');
    });
    // Stato iniziale: mostra filtri
    showFiltersMenu.classList.add('active');
    filtersView.style.display = 'block';
    listView.style.display = 'none';

    // Ripristina i filtri salvati solo una volta all'apertura della pagina
    restoreFiltersFromLocalStorage();
});

console.log(processedData)
console.log(grandiTerremoti)
console.log(avgMagnitudine)