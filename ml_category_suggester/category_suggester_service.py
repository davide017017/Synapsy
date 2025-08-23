# ─────────────────────────────────────────────────────────────────────────────
# Microservizio: Category Suggester (Flask)
# Endpoints:
#   GET  /health                 -> {status:"ok", tflite:<bool>}
#   POST /predict-category       -> {category:string|null, confidence:number}
# Note:
#   - Preferisce tflite_runtime / tensorflow.lite se disponibili + modello .tflite
#   - Fallback euristico in ITALIANO quando il modello non è disponibile
#   - Porta: 7001 – Host: 0.0.0.0
# ─────────────────────────────────────────────────────────────────────────────

from __future__ import annotations
from flask import Flask, request, jsonify
import os
import logging

# ─────────────────────────────────────────────────────────────────────────────
# Sezione: Import opzionali (numpy e TFLite)
# ─────────────────────────────────────────────────────────────────────────────
try:
    import numpy as np  # opzionale; richiesto solo per inference TFLite/TF
except Exception:  # numpy non installato → ok, useremo le euristiche
    np = None  # type: ignore

Interpreter = None  # type: ignore
try:
    # Preferisci tflite_runtime, se presente
    from tflite_runtime.interpreter import Interpreter as _TflInterpreter  # type: ignore
    Interpreter = _TflInterpreter
except Exception:
    try:
        # In alternativa, tensorflow.lite
        from tensorflow.lite import Interpreter as _TfInterpreter  # type: ignore
        Interpreter = _TfInterpreter
    except Exception:
        Interpreter = None  # nessun runtime TFLite disponibile

# ─────────────────────────────────────────────────────────────────────────────
# Sezione: Config & Logger
# ─────────────────────────────────────────────────────────────────────────────
app = Flask(__name__)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("category_suggester")

MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "category_classifier.tflite")
TFLITE_AVAILABLE = Interpreter is not None and os.path.exists(MODEL_PATH) and np is not None

tflite_interpreter = None
if TFLITE_AVAILABLE:
    try:
        tflite_interpreter = Interpreter(model_path=MODEL_PATH)  # type: ignore[call-arg]
        tflite_interpreter.allocate_tensors()
        logger.info("TFLite model loaded.")
    except Exception as e:
        logger.warning(f"Impossibile inizializzare TFLite: {e}")
        tflite_interpreter = None

MODEL_READY = tflite_interpreter is not None

# ─────────────────────────────────────────────────────────────────────────────
# Sezione: Euristiche ITA
#  - “pizza”, “pasta”                 → "cibo" (0.9)
#  - “tax”, “invoice”, “tassa”, “fattura” → "finanza" (0.8)
#  - “rent”, “affitto”                → "casa" (0.7)
#  - altrimenti                       → None (0.0)
# ─────────────────────────────────────────────────────────────────────────────
def heuristic_category_it(text: str) -> tuple[str | None, float]:
    t = (text or "").strip().lower()

    cibo_kw = {"pizza", "pasta"}
    finanza_kw = {"tax", "invoice", "tassa", "fattura"}
    casa_kw = {"rent", "affitto"}

    # match semplice su substring/word
    def contains_any(keywords: set[str]) -> bool:
        return any(k in t for k in keywords)

    if contains_any(cibo_kw):
        return "cibo", 0.9
    if contains_any(finanza_kw):
        return "finanza", 0.8
    if contains_any(casa_kw):
        return "casa", 0.7
    return None, 0.0

# ─────────────────────────────────────────────────────────────────────────────
# Sezione: Inference con TFLite (facoltativa)
# Nota: Senza specifica del modello/tokenizer, manteniamo l’euristica anche se
#       il modello è caricato. Qui trovi uno scheletro per integrare la tua
#       pipeline quando avrai un vero .tflite e pre-processing definito.
# ─────────────────────────────────────────────────────────────────────────────
def predict_with_tflite(description: str) -> tuple[str | None, float]:
    # Esempio di scheletro; ritorna euristica per ora.
    # Quando avrai I/O del modello:
    #  - usa np per creare l’input (np.array([...], dtype=np.*))
    #  - setta gli input tensor con interpreter.set_tensor(...)
    #  - invoca interpreter.invoke()
    #  - leggi output con interpreter.get_tensor(...)
    return heuristic_category_it(description)

# ─────────────────────────────────────────────────────────────────────────────
# Endpoint: /health
# ─────────────────────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return jsonify({"status": "ok", "tflite": bool(MODEL_READY)}), 200

# ─────────────────────────────────────────────────────────────────────────────
# Endpoint: /predict-category
# Body: { "description": string }
# ─────────────────────────────────────────────────────────────────────────────
@app.post("/predict-category")
def predict_category():
    payload = request.get_json(silent=True) or {}
    description = payload.get("description")

    if not isinstance(description, str) or not description.strip():
        return jsonify({"error": "Campo 'description' mancante o non valido."}), 400

    try:
        if MODEL_READY:
            category, conf = predict_with_tflite(description)
        else:
            category, conf = heuristic_category_it(description)

        return jsonify({"category": category, "confidence": float(conf)}), 200
    except Exception as e:
        logger.exception(f"Errore in predict_category: {e}")
        # fallback finale safe
        return jsonify({"category": None, "confidence": 0.0}), 200

# ─────────────────────────────────────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    # Host 0.0.0.0, Port 7001 (prod = debug False)
    app.run(host="0.0.0.0", port=7001, debug=False)
