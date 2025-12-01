import PocketBase from 'pocketbase'

// Cambia l'URL se il tuo PocketBase gira su host/porta diversi
const pb = new PocketBase('http://127.0.0.1:8090')

export default pb
