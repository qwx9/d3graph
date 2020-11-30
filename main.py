import re
from flask import Flask, render_template, request, redirect

app = Flask(__name__)

@app.route("/")
def index():
	return render_template("index.html")

@app.route("/submit", methods=["POST"])
def submit():
	res = "Received config:<br>"
	res += request.form["bpp"].replace("\n", "<br>")
	res += "<br>"
	# .files alements are werkzeug FileStorage objects
	for k in request.files:
		res += f"<br>File: {k} {request.files[k].filename}"
	return res

if __name__ == "__main__":
	app.run(debug=True)
