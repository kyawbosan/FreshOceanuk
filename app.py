from flask import Flask, render_template, request, redirect, url_for, flash

app = Flask(__name__)
app.secret_key = "super-secret-key"

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/products")
def products():
    return render_template("products.html")

@app.route("/promotions")
def promotions():
    return render_template("promotions.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/processing")
def processing():
    return render_template("processing.html")

@app.route("/blog")
def blog():
    return render_template("blog.html")

@app.route("/faq")
def faq():
    return render_template("faq.html")

@app.route("/privacy")
def privacy():
    return render_template("privacy.html")

@app.route("/contact", methods=["GET", "POST"])
def contact():
    if request.method == "POST":
        name = request.form.get("name")
        email = request.form.get("email")
        message = request.form.get("message")
        print(f"Contact form submitted: {name} - {email} - {message}")
        flash("Thank you! Your message has been sent.", "success")
        return redirect(url_for("contact"))
    return render_template("contact.html")

# --- Extra pages you already have ---
@app.route("/checkout")
def checkout():
    return render_template("checkout.html")

@app.route("/invoice")
def invoice():
    return render_template("invoice.html")

@app.route("/thank-you")
def thank_you():
    return render_template("thank-you.html")

@app.route("/newsletter", methods=["GET", "POST"])
def newsletter():
    if request.method == "POST":
        email = request.form.get("email")
        print(f"Newsletter signup: {email}")
        flash("Subscribed! Please check your inbox.", "success")
        return redirect(url_for("newsletter"))
    return render_template("newsletter.html")

# --- Errors ---
@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html"), 404

if __name__ == "__main__":
    app.run(debug=True)
