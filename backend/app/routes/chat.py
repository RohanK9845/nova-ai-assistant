
from flask import Blueprint, request, jsonify, current_app

from app.ai.gemini_service import generate_response

chat_bp = Blueprint("chat", __name__)


@chat_bp.route("/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True)

    if not data or not isinstance(data, dict):
        return jsonify({
            "status": "error",
            "message": "Invalid JSON request."
        }), 400

    message = data.get("message")

    if not isinstance(message, str) or not message.strip():
        return jsonify({
            "status": "error",
            "message": "Please provide a valid message."
        }), 400

    if len(message) > 10000:
        return jsonify({
            "status": "error",
            "message": "Message is too long. Maximum 10,000 characters."
        }), 400

    try:
        reply = generate_response(message.strip())

        return jsonify({
            "status": "success",
            "reply": reply
        }), 200

    except Exception:
        current_app.logger.exception("Gemini chat request failed")

        return jsonify({
            "status": "error",
            "message": "NOVA could not generate a response. Please try again."
        }), 500
