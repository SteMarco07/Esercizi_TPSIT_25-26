// Utility helpers for graphics data aggregation

const EPSILON = 0.01

function toArray(items) {
  if (!items) return []
  if (Array.isArray(items)) return items
  if (typeof items === 'object') return Object.values(items)
  return []
}

function formatDateKey(d) {
  if (!d) return null
  const dt = new Date(d)
  if (!isNaN(dt)) return dt.toISOString().slice(0, 10)
  const m = String(d).match(/(\d{4}-\d{2}-\d{2})/)
  return m ? m[1] : null
}

/**
 * Aggregate total per day.
 * Returns { data: [{day, value}], total, from, to }
 */
export function aggregateByDay(listaSpese = []) {
  const items = toArray(listaSpese)
  const sums = {}
  let min = null
  let max = null

  items.forEach(it => {
    const day = formatDateKey(it?.data)
    if (!day) return
    const val = Number(it?.importo ?? it?.costo ?? 0) || 0
    sums[day] = (sums[day] || 0) + val
    if (!min || day < min) min = day
    if (!max || day > max) max = day
  })

  const data = Object.keys(sums).sort().map(day => ({ day, value: Math.round(sums[day] * 100) / 100 }))

  let from = min
  let to = max
  if (!from || !to) {
    const now = new Date()
    const past = new Date(now)
    past.setFullYear(now.getFullYear() - 1)
    from = past.toISOString().slice(0, 10)
    to = now.toISOString().slice(0, 10)
  }

  const total = Object.values(sums).reduce((s, v) => s + v, 0)
  return { data, total: Math.round(total * 100) / 100, from, to }
}

/**
 * Aggregate totals per hour (0..23). Returns array of { id, value, label }.
 */
export function aggregateByHour(listaSpese = []) {
  const items = toArray(listaSpese)
  const sums = new Array(24).fill(0)
  items.forEach(it => {
    const d = new Date(it?.data)
    if (isNaN(d)) return
    const hour = d.getHours()
    const val = Number(it?.importo ?? it?.costo ?? 0) || 0
    sums[hour] += val
  })
  return sums.map((v, i) => ({ id: `hour_${String(i).padStart(2, '0')}`, value: Math.round(v * 100) / 100, label: `${String(i).padStart(2, '0')}:00` }))
}

/**
 * Aggregate sums per category and year (category primary).
 * Kept for backward compatibility with older components.
 * Returns { data: [{ category, <year>: value, ... }], keys: [years] }
 */
export function aggregateCategoryYear(listaSpese = []) {
  const items = toArray(listaSpese)
  const map = new Map()
  const years = new Set()

  items.forEach(it => {
    const val = Number(it?.importo ?? it?.costo ?? 0) || 0
    if (!val) return
    const category = it?.categoriaNome || it?.categoria?.nome || it?.categoria || it?.categoriaId || '—'
    let year = null
    const d = new Date(it?.data)
    if (!isNaN(d)) year = String(d.getFullYear())
    if (!year) {
      const m = String(it?.data || '').match(/(\d{4})/)
      year = m ? m[1] : 'unknown'
    }

    years.add(year)
    if (!map.has(category)) map.set(category, {})
    const obj = map.get(category)
    obj[year] = (obj[year] || 0) + val
  })

  const yearsArr = Array.from(years).sort()
  const data = Array.from(map.entries()).map(([category, sums]) => {
    const base = { category }
    yearsArr.forEach(y => {
      const raw = Math.round((sums[y] || 0) * 100) / 100
      base[y] = raw > 0 ? raw : EPSILON
    })
    return base
  })

  return { data, keys: yearsArr }
}

/**
 * Aggregate sums per category (flat) for pie/donut.
 * Returns [{ id, value }]
 */
export function aggregateCategoryShare(listaSpese = []) {
  const items = toArray(listaSpese)
  const map = new Map()
  items.forEach(it => {
    const val = Number(it?.importo ?? it?.costo ?? 0) || 0
    if (!val) return
    const category = it?.categoriaNome || it?.categoria?.nome || it?.categoria || it?.categoriaId || '—'
    map.set(category, (map.get(category) || 0) + val)
  })
  const data = Array.from(map.entries()).map(([id, value]) => ({ id, value: Math.round(value * 100) / 100 }))
  data.sort((a, b) => b.value - a.value)
  return data
}

/**
 * Aggregate data by year with categories as keys (year primary).
 * Returns { data: [{ anno: '2025', CatA: val, ... }], keys: [categories] }
 */
export function aggregateYearCategory(listaSpese = []) {
  const items = toArray(listaSpese)
  const yearsMap = new Map()
  const categoriesSet = new Set()

  items.forEach(it => {
    const val = Number(it?.importo ?? it?.costo ?? 0) || 0
    if (!val) return
    const category = it?.categoriaNome || it?.categoria?.nome || it?.categoria || it?.categoriaId || '—'
    let year = null
    const d = new Date(it?.data)
    if (!isNaN(d)) year = String(d.getFullYear())
    if (!year) {
      const m = String(it?.data || '').match(/(\d{4})/)
      year = m ? m[1] : 'unknown'
    }

    categoriesSet.add(category)
    if (!yearsMap.has(year)) yearsMap.set(year, new Map())
    const catMap = yearsMap.get(year)
    catMap.set(category, (catMap.get(category) || 0) + val)
  })

  const years = Array.from(yearsMap.keys()).sort()
  const categories = Array.from(categoriesSet).sort()

  const data = years.map(y => {
    const obj = { anno: y }
    const catMap = yearsMap.get(y) || new Map()
    categories.forEach(cat => {
      const raw = Math.round((catMap.get(cat) || 0) * 100) / 100
      obj[cat] = raw > 0 ? raw : EPSILON
    })
    return obj
  })

  return { data, keys: categories }
}

/**
 * Compute a suggested calendar height based on date range.
 */
export function computeCalendarHeight(from, to) {
  try {
    const start = new Date(from)
    const end = new Date(to)
    const days = Math.max(1, Math.ceil((end - start) / (24 * 60 * 60 * 1000)))
    const weeks = Math.max(1, Math.ceil(days / 7))
    const base = 160
    const perWeek = 12
    return Math.min(Math.max(base + weeks * perWeek, 240), 700)
  } catch (err) {
    return 320
  }
}
