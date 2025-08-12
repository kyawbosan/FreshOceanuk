from flask import Flask, render_template, request, redirect, url_for, flash
from dotenv import load_dotenv
import os
import smtplib
from email.mime.text import MIMEText
from flask_mail import Mail

app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False

mail = Mail(app)

# --- Load env vars ---
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY")

MAIL_SERVER = os.getenv("MAIL_SERVER")
MAIL_PORT = int(os.getenv("MAIL_PORT", 587))
MAIL_USERNAME = os.getenv("MAIL_USERNAME")
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
MAIL_RECIPIENT = os.getenv("MAIL_RECIPIENT")

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

        if not name or not email or not message:
            flash("Please fill in all fields.", "error")
            return redirect(url_for("contact"))

        try:
            # Create email
            subject = f"FreshOcean Contact Form — {name}"
            body = f"Name: {name}\nEmail: {email}\n\nMessage:\n{message}"
            msg = MIMEText(body)
            msg["Subject"] = subject
            msg["From"] = MAIL_USERNAME
            msg["To"] = MAIL_RECIPIENT

            # Send email
            with smtplib.SMTP(MAIL_SERVER, MAIL_PORT) as server:
                server.starttls()
                server.login(MAIL_USERNAME, MAIL_PASSWORD)
                server.send_message(msg)

            flash("Thank you! Your message has been sent successfully.", "success")
        except Exception as e:
            print(f"Error sending email: {e}")
            flash("Oops! There was a problem sending your message. Please try again later.", "error")

        return redirect(url_for("contact"))

    return render_template("contact.html")

# --- Extra pages ---
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
