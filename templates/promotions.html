from flask import Flask, render_template, request, redirect, url_for, flash
from dotenv import load_dotenv
import os
import smtplib
from email.mime.text import MIMEText

# Load env vars first
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
            # Build email
            subject = f"FreshOcean Contact — {name}"
            body = f"Name: {name}\nEmail: {email}\n\nMessage:\n{message}"
            msg = MIMEText(body, "plain", "utf-8")

            # From must be your Zoho mailbox
            msg["From"] = MAIL_USERNAME
            msg["To"] = MAIL_RECIPIENT or MAIL_USERNAME
            msg["Reply-To"] = email
            msg["Subject"] = subject

            with smtplib.SMTP(MAIL_SERVER, MAIL_PORT, timeout=30) as server:
                server.starttls()
                server.login(MAIL_USERNAME, MAIL_PASSWORD)
                server.send_message(msg)

            flash("Thank you! Your message has been sent successfully.", "success")

        except Exception as e:
            print(f"Error sending email: {e}")
            flash("Oops! There was a problem sending your message. Please try again later.", "error")

        return redirect(url_for("contact"))

    return render_template("contact.html")

@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html"), 404

if __name__ == "__main__":
    app.run(debug=True)
