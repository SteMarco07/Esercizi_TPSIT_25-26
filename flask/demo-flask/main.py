from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello_world():
    out = {
        "message": "Hello, World!"
    }
    return out

app.run("0.0.0.0", port=11000, debug=True)