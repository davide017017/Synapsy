# ML Category Suggester

Microservizio Python che fornisce suggerimenti di categoria basati su un modello TFLite o su una semplice euristica.

## Avvio rapido

```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python category_suggester_service.py
```

Il servizio espone gli endpoint su `http://localhost:7001`.

- **GET** `/health`
- **POST** `/predict-category` con body `{ "description": "test" }`

Il modello `models/category_classifier.tflite` è opzionale.
