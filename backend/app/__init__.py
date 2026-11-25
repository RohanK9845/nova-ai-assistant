
import os
from pathlib import Path

from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from sqlalchemy import URL

from app.extensions import db


def create_app():
    app = Flask(__name__)

    # Load environment variables from backend/.env
    BASE_DIR = Path(__file__).resolve().parents[1]
    load_dotenv(BASE_DIR / ".env")

    # PostgreSQL connection configuration
    database_url = URL.create(
        drivername="postgresql+psycopg",
        username=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=int(os.getenv("DB_PORT", "5432")),
        database=os.getenv("DB_NAME"),
    )

    app.config["SQLALCHEMY_DATABASE_URI"] = database_url
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Initialize database
    db.init_app(app)
    from app import models

    CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

    from app.routes.health import health_bp
    from app.routes.chat import chat_bp
    from app.routes.conversations import conversations_bp

    app.register_blueprint(health_bp, url_prefix="/api")
    app.register_blueprint(chat_bp, url_prefix="/api")
    app.register_blueprint(conversations_bp, url_prefix="/api")

    return app
