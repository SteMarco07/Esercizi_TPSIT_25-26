from flask import Flask
from faker import Faker

fake = Faker()

data = []

app = Flask(__name__)


def riempi_dati ():
    data = []
    for _ in range(100):
        persona = {
            "name": fake.name(),
            "address": fake.address(),
            "email": fake.email()
        }
        data.append(persona)
    return data

@app.route("/")
def hello_world():
    out = {
        "message": "Hello, World!",
    }
    return out

@app.route("/data")
def get_data():
    return {"data": riempi_dati()}

app.run("0.0.0.0", port=11000, debug=True)