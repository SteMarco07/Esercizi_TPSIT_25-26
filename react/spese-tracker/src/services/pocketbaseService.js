import PocketBase from 'pocketbase'

// Singleton instance of PocketBase client
const pb = new PocketBase('http://127.0.0.1:8090')

// Function to get all spese with expanded categoria
export const getSpese = async () => {
  try {
    // If user is authenticated, try to fetch only their records (assumes a relation field `user` exists on the records)
    const userId = pb.authStore?.model?.id
    const filter = userId ? `user = \"${userId}\"` : undefined
    const opts = { expand: 'categoria' }
    if (filter) opts.filter = filter
    const listSpese = await pb.collection('spese').getFullList(opts)
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
    // If user logged in, prefer categories owned by the user; otherwise return all
    const userId = pb.authStore?.model?.id
    const opts = {}
    if (userId) opts.filter = `user = \"${userId}\"`
    const listCategorie = await pb.collection('spese_categorie').getFullList(opts)
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

    // Attach current authenticated user id if available (common field name `user`)
    const currentUserId = pb.authStore?.model?.id
    if (currentUserId) {
      record.user = currentUserId
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
    // Verify ownership if possible
    const currentUserId = pb.authStore?.model?.id
    if (currentUserId) {
      try {
        const rec = await pb.collection('spese').getOne(id)
        // if record has user field and differs from current user, block deletion
        if (rec && rec.user && String(rec.user) !== String(currentUserId)) {
          throw new Error('Unauthorized: you are not the owner of this record')
        }
      } catch (err) {
        // if fetching the record fails, proceed to attempt deletion (server-side rules may apply)
      }
    }
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
      // optional color field
      ...(categoriaData.colore ? { colore: categoriaData.colore } : {}),
    }
    // Attach current user id to category if available
    const currentUserId = pb.authStore?.model?.id
    if (currentUserId) record.user = currentUserId
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
    // Optional ownership check
    const currentUserId = pb.authStore?.model?.id
    if (currentUserId) {
      try {
        const rec = await pb.collection('spese_categorie').getOne(id)
        if (rec && rec.user && String(rec.user) !== String(currentUserId)) {
          throw new Error('Unauthorized: you are not the owner of this category')
        }
      } catch (err) {
        // ignore fetch errors and try delete (server rules may apply)
      }
    }
    await pb.collection('spese_categorie').delete(id)
  } catch (error) {
    console.error('Errore durante l\'eliminazione della categoria:', error)
    throw error
  }
}

// Export the client if needed elsewhere
export { pb }

// --- Authentication helpers ---

// Register a new user (PocketBase default users collection)
export const signUpUser = async ({ email, password, passwordConfirm, name }) => {
  try {
    const payload = { email, password, passwordConfirm }
    if (name) payload.name = name
    const created = await pb.collection('users').create(payload)
    // authenticate after creating
    await pb.collection('users').authWithPassword(email, password)
    return pb.authStore.model
  } catch (error) {
    console.error('Errore nella registrazione utente:', error)
    throw error
  }
}

export const loginUser = async (email, password) => {
  try {
    const auth = await pb.collection('users').authWithPassword(email, password)
    return auth
  } catch (error) {
    console.error('Login fallito:', error)
    throw error
  }
}

export const logoutUser = async () => {
  try {
    pb.authStore.clear()
  } catch (error) {
    console.error('Logout fallito:', error)
    throw error
  }
}

export const getCurrentUser = () => {
  return pb.authStore.model || null
}

export const isAuthenticated = () => {
  return !!pb.authStore.isValid
}

export default pb
