from flask import Blueprint
from flask import request
from flask import jsonify

from services.constitution_assistant import (
    answer_multiple_questions
)

constitution_bp = Blueprint(
    "constitution",
    __name__
)

@constitution_bp.route(
    "/ask-constitution",
    methods=["POST"]
)
def ask_constitution():

    data = request.json

    question = data["question"]

    answer = answer_multiple_questions(
        question
    )

    return jsonify({
        "answer": answer
    })