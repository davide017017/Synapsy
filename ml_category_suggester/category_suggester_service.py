#!/usr/bin/env python3
"""
Flask microservice providing smart category suggestions via TFLite model
or heuristic fallback.
"""

# ─────────────────────────────────────────────────────────────────────────────
# Sezione: Import
# Dettagli: librerie standard e ML
# ─────────────────────────────────────────────────────────────────────────────
from __future__ import annotations

import os
from typing import Optional

import numpy as np
from flask import Flask, jsonify, request

try:  # Prefer tflite-runtime when available
    import tflite_runtime.interpreter as tflite  # type: ignore
except Exception:  # pragma: no cover - Fallback to TensorFlow
    try:
        import tensorflow.lite as tflite  # type: ignore
    except Exception:
        tflite = None  # type: ignore

# ─────────────────────────────────────────────────────────────────────────────
# Sezione: Caricamento modello
# Dettagli: prova a caricare il modello TFLite se presente
# ─────────────────────────────────────────────────────────────────────────────
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'models', 'category_classifier.tflite')
INTERPRETER: Optional["tflite.Interpreter"] = None

if tflite and os.path.exists(MODEL_PATH):
    try:
        INTERPRETER = tflite.Interpreter(model_path=MODEL_PATH)
        INTERPRETER.allocate_tensors()
    except Exception:
        INTERPRETER = None

# ─────────────────────────────────────────────────────────────────────────────
# Sezione: App Flask
# Dettagli: definizione degli endpoint
# ─────────────────────────────────────────────────────────────────────────────
app = Flask(__name__)


# -----------------------------------------------------------------------------
# Endpoint: /health
# Dettagli: verifica stato servizio e disponibilità modello
# -----------------------------------------------------------------------------
@app.get('/health')
def health() -> tuple[dict, int]:
    return {"status": "ok", "tflite": INTERPRETER is not None}, 200


# -----------------------------------------------------------------------------
# Funzione: heuristic_predict
# Dettagli: semplice fallback basato su keyword in lingua italiana/inglese
# -----------------------------------------------------------------------------
def heuristic_predict(description: str) -> tuple[Optional[str], float]:
    description = description.lower()
    if "pizza" in description or "pasta" in description:
        return "cibo", 0.9
    if any(word in description for word in ["tax", "invoice", "tassa", "fattura"]):
        return "finanza", 0.8
    if "rent" in description or "affitto" in description:
        return "casa", 0.7
    return None, 0.0


# -----------------------------------------------------------------------------
# Endpoint: /predict-category
# Dettagli: restituisce categoria suggerita
# -----------------------------------------------------------------------------
@app.post('/predict-category')
def predict_category() -> tuple[dict, int]:
    payload = request.get_json(silent=True) or {}
    description = str(payload.get('description', '')).strip()

    if not description:
        return {"category": None, "confidence": 0.0}, 200

    category, confidence = heuristic_predict(description)
    return {"category": category, "confidence": confidence}, 200


# ─────────────────────────────────────────────────────────────────────────────
# Sezione: Main
# Dettagli: avvia il server Flask
# ─────────────────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=7001)
