from flask import Flask, request
from faker import Faker
from flask_cors import CORS
from faker import Faker
from faker_books import BookProvider

data = []

fake = Faker('it_IT')

app = Flask(__name__)
# Abilita CORS solo per le API e permette le origini usate in sviluppo
CORS(app)


# Funzione per creare un libro mediante faker
def crea_libro():
    
    libro = {
        "id": fake.uuid4(),
        "titolo": BookProvider(fake).book_title(),
        "autore": fake.name(),
        "isbn": fake.isbn13(),
        "genere": BookProvider(fake).book_genre(),
        "anno": fake.year(),
        "editore": fake.company()
    }
    return libro

# Funzione per creare una lista di libri
def riempi_dati (volte=100):
    data = []
    for _ in range(volte):
        data.append(crea_libro())
    return data

data = riempi_dati()

# Endpoint per ottenere tutti i libri
@app.route("/api/libri")
def get_data():
    return data

@app.route("/api/libri/generate/<int:count>")
def generate_libri(count):
    if not count:
        count = 100
    global data
    nuovi_libri = riempi_dati(count)
    data.extend(nuovi_libri)
    return {"message": f"{count} libri generati con successo.", "nuovi_libri": nuovi_libri}, 200

# Endpoint per ottenere un libro specifico mediante dei filtri
@app.route("/api/libri/search")
def search_libri():
    id = request.args.get('id')
    titolo = request.args.get('titolo')
    autore = request.args.get('autore')
    editore = request.args.get('editore')
    genere = request.args.get('genere')
    anno = request.args.get('anno')
    isbn = request.args.get('isbn')

    # Verifica se il libro corrisponde ad uno o più filtri dei filtri
    def matches(libro):
        if id and id.lower() != libro.get('id', '').lower():
            return False
        if titolo and titolo.lower() not in libro.get('titolo', '').lower():
            return False
        if autore and autore.lower() not in libro.get('autore', '').lower():
            return False
        if genere and genere.lower() not in libro.get('genere', '').lower():
            return False
        if editore and editore.lower() not in libro.get('editore', '').lower():
            return False
        # support both generated 'anno' and POST 'anno'
        lib_anno = str(libro.get('anno') or libro.get('anno', ''))
        if anno and anno != lib_anno:
            return False
        if isbn and isbn != libro.get('isbn', ''):
            return False
        return True

    filtered = [l for l in data if matches(l)]

    if not filtered:
        return {"message": "Nessun risultato trovato."}, 404

    return filtered


# Endpoint per aggiungere un nuovo libro
@app.route("/api/libri", methods=['POST'])
def add_libro():
    if not request.is_json:
        return {"error": "Richiesta deve essere in formato JSON"}, 400
    
    new_libro = request.get_json()

    libro = {
        "id": fake.uuid4(),
        "titolo": new_libro["titolo"],
        "anno": new_libro["anno"],
        "autore": new_libro["autore"],
        "genere": new_libro["genere"],
        "isbn": new_libro["isbn"],
        "editore": new_libro["editore"]
    }
    
    data.append(libro)
    
    return {"message": "Libro aggiunto con successo", "libro": libro}, 201

# Endpoint per eliminare tutti i libri
@app.route("/api/libri", methods=['DELETE'])
def delete_libri():
    data.clear()
    return {"message": "Tutti i libri sono stati eliminati con successo", "libri":[]}, 200

# Endpoint per eliminare un libro specifico mediante l'id
@app.route("/api/libri/<id>", methods=['DELETE'])
def delete_libro(id):
    for libro in data:
        if libro["id"] == id:
            data.remove(libro)
            return {"message": "Libro eliminato con successo", "libro": libro}, 200
    return {"message": "Libro non trovato"}, 404

@app.route("/api/libri/modify", methods=['PATCH'])
def modify_libro():
    if not request.is_json:
        return {"error": "Richiesta deve essere in formato JSON"}, 400
    
    modified_libro = request.get_json()
    libro_id = modified_libro.get("id")
    print(modified_libro)

    for libro in data:
        if libro["id"] == libro_id:
            for key, val in modified_libro.items():
                if key != "id":
                    libro[key] = val
            print("tutti i libri:", data)
            return {"message": "Libro modificato con successo", "libro": libro}, 200

    return {"message": "Libro non trovato"}, 404

app.run("0.0.0.0", port=11000, debug=True)  