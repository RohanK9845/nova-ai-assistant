
from flask import Blueprint, request, jsonify, current_app

from app.ai.gemini_service import generate_response
from app.extensions import db
from app.models import Conversation, Message

chat_bp = Blueprint("chat", __name__)


@chat_bp.route("/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "status": "error",
            "message": "Invalid JSON request."
        }), 400

    message = data.get("message")
    conversation_id = data.get("conversation_id")

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

    if (
        isinstance(conversation_id, bool)
        or not isinstance(conversation_id, int)
        or conversation_id <= 0
    ):
        return jsonify({
            "status": "error",
            "message": "A valid conversation ID is required."
        }), 400

    conversation = db.session.get(Conversation, conversation_id)

    if conversation is None:
        return jsonify({
            "status": "error",
            "message": "Conversation not found."
        }), 404

    try:
        cleaned_message = message.strip()

        # Check whether this is the first user message
        first_user_message = Message.query.filter_by(
            conversation_id=conversation_id,
            role="user"
        ).first()

        if first_user_message is None:
            # Use the first message as the conversation title
            title = cleaned_message

            if len(title) > 60:
                title = title[:57].rstrip() + "..."

            conversation.title = title

        # Save the user's message before calling Gemini
        user_message = Message(
            conversation_id=conversation_id,
            role="user",
            content=cleaned_message
        )

        db.session.add(user_message)
        conversation.updated_at = db.func.now()
        db.session.commit()

    except Exception:
        db.session.rollback()

        current_app.logger.exception(
            "Could not save user message"
        )

        return jsonify({
            "status": "error",
            "message": "Could not save your message."
        }), 500

    # Generate Gemini response
    try:
        reply = generate_response(cleaned_message)

    except Exception:
        current_app.logger.exception(
            "Gemini response generation failed"
        )

        return jsonify({
            "status": "error",
            "message": "NOVA could not generate a response. Your message has been saved. Please try again."
        }), 502

    try:
        # Save NOVA's response
        assistant_message = Message(
            conversation_id=conversation_id,
            role="assistant",
            content=reply
        )

        db.session.add(assistant_message)
        conversation.updated_at = db.func.now()
        db.session.commit()

        return jsonify({
            "status": "success",
            "conversation_id": conversation_id,
            "reply": reply,
            "messages": {
                "user": user_message.id,
                "assistant": assistant_message.id
            }
        }), 200

    except Exception:
        db.session.rollback()

        current_app.logger.exception(
            "Could not save assistant response"
        )

        return jsonify({
            "status": "error",
            "message": "NOVA generated a response but could not save it."
        }), 500
