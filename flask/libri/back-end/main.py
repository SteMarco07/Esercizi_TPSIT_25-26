from flask import Flask, request
from faker import Faker
from flask_cors import CORS

data = []

fake = Faker('it_IT')

app = Flask(__name__)
CORS(app)

def crea_libro():
    generi = [
        'Romanzo', 'Giallo', 'Fantascienza', 'Fantasy', 
        'Saggio', 'Biografia', 'Storico', 'Horror'
    ]
    
    libro = {
        "titolo": fake.sentence(nb_words=4).replace('.', '').title(),
        "autore": fake.name(),
        "isbn": fake.isbn13(),
        "genere": fake.word(ext_word_list=generi),
        "data_pubblicazione": fake.date_between(start_date='-30y', end_date='today').strftime('%Y-%m-%d'),
        "editore": fake.company()
    }
    return libro


def riempi_dati ():
    data = []
    for i in range(100):
        data.append(crea_libro())
    return data

data = riempi_dati()

@app.route("/")
def hello_world():
    out = {
        "message": "Hello, World!",
    }
    return out

@app.route("/api/libri")
def get_data():
    return {"data": data}

@app.route("/persone/search")
def search_persone():
    name = request.args.get('name')
    last_name = request.args.get('last_name')
    email = request.args.get('email')
    address = request.args.get('address')
    
    filtered = [p for p in data if
                (not name or name.lower() in p['name'].lower()) and
                (not last_name or last_name.lower() in p['last_name'].lower()) and
                (not email or email.lower() in p['email'].lower()) and
                (not address or address.lower() in p['address'].lower())]
    
    if filtered == []:
        return {"message": "Nessun risultato trovato."}, 404
    
    return {"data": filtered}

@app.route("/persone", methods=['POST'])
def add_persona():
    if not request.is_json:
        return {"error": "Richiesta deve essere in formato JSON"}, 400
    
    new_persona = request.get_json()
    
    # Creazione del nuovo ID
    new_id = len(data)
    
    persona = {
        "id": new_id,
        "name": new_persona['name'],
        "last_name": new_persona['last_name'],
        "address": new_persona['address'],
        "email": new_persona['email']
    }
    
    data.append(persona)
    
    return {"message": "Persona aggiunta con successo", "persona": persona}, 201

@app.route("/libri/search")
def search_libri():
    titolo = request.args.get('titolo')
    autore = request.args.get('autore')
    genere = request.args.get('genere')
    anno = request.args.get('anno')
    
    filtered = [l for l in data if
                (not titolo or titolo.lower() in l['titolo'].lower()) and
                (not autore or autore.lower() in l['autore'].lower()) and
                (not genere or genere.lower() in l['genere'].lower()) and
                (not anno or anno == l['anno'])]
    
    if filtered == []:
        return {"message": "Nessun risultato trovato."}, 404
    
    return {"data": filtered}

@app.route("/libri", methods=['POST'])
def add_libro():
    if not request.is_json:
        return {"error": "Richiesta deve essere in formato JSON"}, 400
    
    new_libro = request.get_json()
    
    # Creazione del nuovo ID
    new_id = len(data) + 1
    
    libro = {
        "id": new_id,
        "titolo": new_libro['titolo'],
        "anno": new_libro['anno'],
        "autore": new_libro['autore'],
        "genere": new_libro['genere']
    }
    
    data.append(libro)
    
    return {"message": "Libro aggiunto con successo", "libro": libro}, 201

app.run("0.0.0.0", port=11000, debug=True)