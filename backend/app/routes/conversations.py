from flask import request
from app.models import Message

from flask import Blueprint, jsonify

from app.extensions import db
from app.models import Conversation

conversations_bp = Blueprint("conversations", __name__)


@conversations_bp.route("/conversations", methods=["POST"])
def create_conversation():
    try:
        conversation = Conversation(title="New Conversation")

        db.session.add(conversation)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Conversation created successfully.",
            "conversation": {
                "id": conversation.id,
                "title": conversation.title,
                "created_at": conversation.created_at.isoformat(),
                "updated_at": conversation.updated_at.isoformat()
            }
        }), 201

    except Exception:
        db.session.rollback()
        return jsonify({
            "status": "error",
            "message": "Could not create conversation."
        }), 500

@conversations_bp.route("/conversations", methods=["GET"])
def get_conversations():
    try:
        conversations = (
            Conversation.query
            .order_by(Conversation.updated_at.desc())
            .all()
        )

        return jsonify({
            "status": "success",
            "conversations": [
                {
                    "id": conversation.id,
                    "title": conversation.title,
                    "created_at": conversation.created_at.isoformat(),
                    "updated_at": conversation.updated_at.isoformat()
                }
                for conversation in conversations
            ]
        }), 200

    except Exception:
        return jsonify({
            "status": "error",
            "message": "Could not retrieve conversations."
        }), 500


@conversations_bp.route(
    "/conversations/<int:conversation_id>/messages",
    methods=["POST"]
)
def add_message(conversation_id):
    try:
        conversation = db.session.get(Conversation, conversation_id)

        if conversation is None:
            return jsonify({
                "status": "error",
                "message": "Conversation not found."
            }), 404

        data = request.get_json(silent=True)

        if not isinstance(data, dict):
            return jsonify({
                "status": "error",
                "message": "Invalid JSON request."
            }), 400

        role = data.get("role")
        content = data.get("content")

        if role not in ["user", "assistant"]:
            return jsonify({
                "status": "error",
                "message": "Invalid message role."
            }), 400

        if not isinstance(content, str) or not content.strip():
            return jsonify({
                "status": "error",
                "message": "Message content cannot be empty."
            }), 400

        message = Message(
            conversation_id=conversation_id,
            role=role,
            content=content.strip()
        )

        db.session.add(message)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Message saved successfully.",
            "data": {
                "id": message.id,
                "conversation_id": message.conversation_id,
                "role": message.role,
                "content": message.content,
                "created_at": message.created_at.isoformat()
            }
        }), 201

    except Exception:
        db.session.rollback()
        return jsonify({
            "status": "error",
            "message": "Could not save message."
        }), 500


@conversations_bp.route(
    "/conversations/<int:conversation_id>/messages",
    methods=["GET"]
)
def get_messages(conversation_id):
    try:
        conversation = db.session.get(Conversation, conversation_id)

        if conversation is None:
            return jsonify({
                "status": "error",
                "message": "Conversation not found."
            }), 404

        messages = (
            Message.query
            .filter_by(conversation_id=conversation_id)
            .order_by(Message.created_at.asc(), Message.id.asc())
            .all()
        )

        return jsonify({
            "status": "success",
            "conversation_id": conversation_id,
            "messages": [
                {
                    "id": message.id,
                    "role": message.role,
                    "content": message.content,
                    "created_at": message.created_at.isoformat()
                }
                for message in messages
            ]
        }), 200

    except Exception:
        return jsonify({
            "status": "error",
            "message": "Could not retrieve messages."
        }), 500
