from flask import Flask, request
from faker import Faker
from flask_cors import CORS

fake = Faker('it_IT')

data = []

app = Flask(__name__)
CORS(app)


def riempi_dati ():
    data = []
    for i in range(1000):
        persona = {
            "id": i,
            "name": fake.first_name(),
            "last_name": fake.last_name(),
            "address": fake.address(),
            "email": fake.email()
        }
        data.append(persona)
    return data

data = riempi_dati()

@app.route("/")
def hello_world():
    out = {
        "message": "Hello, World!",
    }
    return out

@app.route("/persone")
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


app.run("0.0.0.0", port=11000, debug=True)