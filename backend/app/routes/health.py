
from flask import Blueprint, jsonify

health_bp = Blueprint("health", __name__)


@health_bp.route("/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "success",
        "message": "NOVA backend is running!",
        "application": "NOVA AI Assistant"
    }), 200
