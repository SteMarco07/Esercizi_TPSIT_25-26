import PocketBase from 'pocketbase'

// Singleton instance of PocketBase client
const pb = new PocketBase('http://127.0.0.1:8090')

// Function to get all spese with expanded categoria
export const getSpese = async () => {
  try {
    const listSpese = await pb.collection('spese').getFullList({ expand: 'categoria' })
    // Enrich each record with categoriaNome
    const enriched = listSpese.map(s => ({
      ...s,
      categoriaNome: s.expand?.categoria?.nome || s.categoria || ''
    }))
    return enriched
  } catch (error) {
    console.error('Errore nel caricamento delle spese:', error)
    throw error
  }
}

// Function to get all categorie
export const getCategorie = async () => {
  try {
    const listCategorie = await pb.collection('spese_categorie').getFullList()
    return listCategorie
  } catch (error) {
    console.error('Errore nel caricamento delle categorie:', error)
    throw error
  }
}

// Function to add a new spesa
export const addSpesa = async (newItem) => {
  try {
    const record = {
      titolo: newItem.titolo,
      descrizione: newItem.descrizione || '',
      importo: newItem.importo,
      data: newItem.data,
    }

    if (newItem.categoriaId) {
      record.categoria = newItem.categoriaId
    }

    const created = await pb.collection('spese').create(record)
    // Fetch with expand
    const createdExpanded = await pb.collection('spese').getOne(created.id, { expand: 'categoria' })
    const enriched = {
      ...createdExpanded,
      categoriaNome: createdExpanded.expand?.categoria?.nome || createdExpanded.categoria || ''
    }
    return enriched
  } catch (error) {
    console.error('Errore nella creazione della spesa:', error)
    throw error
  }
}

// Function to delete a spesa
export const deleteSpesa = async (id) => {
  try {
    await pb.collection('spese').delete(id)
  } catch (error) {
    console.error('Errore durante l\'eliminazione della spesa:', error)
    throw error
  }
}

// Function to add a new categoria
export const addCategoria = async (categoriaData) => {
  try {
    const record = {
      nome: categoriaData.nome,
      descrizione: categoriaData.descrizione || '',
    }
    const created = await pb.collection('spese_categorie').create(record)
    return created
  } catch (error) {
    console.error('Errore nella creazione della categoria:', error)
    throw error
  }
}

// Function to delete a categoria
export const deleteCategoria = async (id) => {
  try {
    await pb.collection('spese_categorie').delete(id)
  } catch (error) {
    console.error('Errore durante l\'eliminazione della categoria:', error)
    throw error
  }
}

// Export the client if needed elsewhere
export { pb }
