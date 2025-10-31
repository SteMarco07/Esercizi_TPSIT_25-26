import "./style.css"
import PocketBase from 'pocketbase';

var map = L.map('map').setView([41.9028, 12.4964], 6);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const response = await fetch("http://127.0.0.1:8090/api/collections/prova/records")
const data = await response.json()

const items = data.items

items.map(i => {

    var circle = L.circle([i.Position.lon, i.Position.lat], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 10000
    })
    circle.bindPopup(
        i.Name + '<br>' +
        'Longitudine: ' + i.Position.lon + '<br>' +
        'Latitudine: ' + i.Position.lat
    )
    circle.addTo(map)

})

console.log(items)

