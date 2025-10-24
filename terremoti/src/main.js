
const response = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson")
const data = await response.json() 

const processedData = data.features.map (feature => {
    const place = feature.properties.place
    const magnitudine = feature.properties.mag
    const latitudine = feature.geometry.coordinates[0]
    const longitudine = feature.geometry.coordinates[1]
    return {
        place,
        magnitudine,
        latitudine,
        longitudine
    }
})

// stampare i terremoti con magnitudo > 6
const grandiTerremoti = processedData.filter(
    d => d.magnitudine > 6
)

//cercare la magnitudine media
const avgMagnitudine = grandiTerremoti.reduce(
    (acc, val) => acc += val.magnitudine,
    0
) / grandiTerremoti.length

console.log(processedData)
console.log(grandiTerremoti)
console.log(avgMagnitudine)