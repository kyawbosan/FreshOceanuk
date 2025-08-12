# app.py
import os, smtplib, ssl
from email.mime.text import MIMEText
from flask import Flask, render_template, request, redirect, url_for, flash
from dotenv import load_dotenv

# ---------- load environment ----------
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY", "change-me")

MAIL_SERVER    = os.getenv("MAIL_SERVER")          # e.g. smtp.zoho.eu
MAIL_PORT      = int(os.getenv("MAIL_PORT", "587"))# 587 for STARTTLS
MAIL_USERNAME  = os.getenv("MAIL_USERNAME")        # info@freshocean.co.uk (Zoho mailbox)
MAIL_PASSWORD  = os.getenv("MAIL_PASSWORD")        # Zoho app password
MAIL_RECIPIENT = os.getenv("MAIL_RECIPIENT", MAIL_USERNAME)  # where you want to receive

# ---------- helpers ----------
def send_email(subject: str, body: str) -> bool:
    """Send a plain-text email. Returns True on success, False on failure."""
    try:
        msg = MIMEText(body, _charset="utf-8")
        msg["Subject"] = subject
        msg["From"] = MAIL_USERNAME
        msg["To"] = MAIL_RECIPIENT

        with smtplib.SMTP(MAIL_SERVER, MAIL_PORT, timeout=20) as server:
            server.starttls()
            server.login(MAIL_USERNAME, MAIL_PASSWORD)
            server.send_message(msg)
        return True
    except Exception as e:
        print(f"[MAIL ERROR] {e}")
        return False

# ---------- routes ----------
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
        name    = (request.form.get("name") or "").strip()
        email   = (request.form.get("email") or "").strip()
        message = (request.form.get("message") or "").strip()

        if not name or not email or not message:
            flash("Please fill in all fields.", "error")
            return redirect(url_for("contact"))

        # Build the email
        subject = f"FreshOcean Contact — {name}"
        body = f"Name: {name}\nEmail: {email}\n\nMessage:\n{message}"
        msg = MIMEText(body, "plain", "utf-8")
        msg["Subject"] = subject
        msg["From"] = MAIL_USERNAME            # must be your authenticated mailbox
        msg["To"] = MAIL_RECIPIENT
        msg["Reply-To"] = email                # replies go to the customer

        # Send with STARTTLS
        try:
            context = ssl.create_default_context()
            with smtplib.SMTP(MAIL_SERVER, MAIL_PORT, timeout=20) as server:
                server.ehlo()
                server.starttls(context=context)
                server.ehlo()
                server.login(MAIL_USERNAME, MAIL_PASSWORD)
                server.sendmail(MAIL_USERNAME, [MAIL_RECIPIENT], msg.as_string())

            flash("Thank you! Your message has been sent successfully.", "success")
        except Exception as e:
            # This prints to your Render logs for debugging
            print(f"[SMTP ERROR] {type(e).__name__}: {e}")
            flash("Oops! There was a problem sending your message. Please try again later.", "error")

        return redirect(url_for("contact"))

    return render_template("contact.html")
# Extras
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
        email = (request.form.get("email") or "").strip()
        print(f"[NEWSLETTER] {email}")
        flash("Subscribed! Please check your inbox.", "success")
        return redirect(url_for("newsletter"))
    return render_template("newsletter.html")

# Errors
@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html"), 404

if __name__ == "__main__":
    app.run(debug=True)
