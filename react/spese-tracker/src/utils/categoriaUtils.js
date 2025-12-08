// Utility helpers to resolve category name and color from various item shapes
// Accepts an expense/item and an optional list of categories to lookup by id
const isObject = (v) => v && typeof v === 'object'

export function resolveCategoriaNome(item, listaCategorie = []) {
  if (!item) return ''
  if (item.categoriaNome) return item.categoriaNome
  if (item.expand && item.expand.categoria && (item.expand.categoria.nome || item.expand.categoria.name)) return item.expand.categoria.nome || item.expand.categoria.name
  if (item.categoria && typeof item.categoria === 'string') return item.categoria
  if (isObject(item.categoria) && (item.categoria.nome || item.categoria.name)) return item.categoria.nome || item.categoria.name
  const id = item.categoriaId || item.categoria || item.categoryId || item.categoria_id || item._categoria
  if (id && Array.isArray(listaCategorie) && listaCategorie.length) {
    const found = listaCategorie.find(c => String(c.id) === String(id) || String(c._id) === String(id))
    if (found) return found.nome || found.name || ''
  }
  return ''
}

export function resolveCategoriaColore(item, listaCategorie = []) {
  if (!item) return ''
  if (item.expand && item.expand.categoria && item.expand.categoria.colore) return item.expand.categoria.colore
  if (isObject(item.categoria) && item.categoria.colore) return item.categoria.colore
  const id = item.categoriaId || item.categoria || item.categoryId || item.categoria_id || item._categoria
  if (id && Array.isArray(listaCategorie) && listaCategorie.length) {
    const found = listaCategorie.find(c => String(c.id) === String(id) || String(c._id) === String(id))
    if (found) return found.colore || ''
  }
  return ''
}

export default { resolveCategoriaNome, resolveCategoriaColore }
