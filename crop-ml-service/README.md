# Crop Recommendation & Disease Detection Service

A standalone FastAPI microservice, separate from the Node/Express
backend, covering two AI features:

1. **Crop recommendation** — a trained RandomForestClassifier
   (~99.3% test accuracy, 22 crops) turns soil + climate readings
   into ranked crop suggestions, with Gemini-generated growing guides.
2. **Disease detection** — an EfficientNetB0 model (38 classes, 14
   crop species) diagnoses a leaf photo, paired with a curated remedy
   database and an optional Gemini-generated deeper treatment plan.

Both share the same Gemini API key, the same `.env`, and run as one
`uvicorn` process on port 8001.

## ⚠️ Python version — read this first

**Disease detection requires TensorFlow, which does not support
Python 3.14 at all right now** (not a pinning issue — there is no
wheel for it at any TensorFlow version, and no known release date).
If you're on Python 3.14:

- Crop recommendation (predict/weather/soil-report/crop-info) works
  fine — nothing in that half of the service needs TensorFlow.
- Disease detection (`/api/disease/*`) will fail to install and, if
  you skip installing `tensorflow`, will run in a degraded mode where
  those two endpoints return a clear 503 instead of crashing the
  whole service.

**To get disease detection working, use Python 3.10, 3.11 or 3.12**
for this project's virtual environment (3.12 recommended — it's had
full wheel coverage across this entire stack for a long time). This
also happens to sidestep every other wheel-availability issue you'd
otherwise hit on 3.14 with scikit-learn, pydantic-core, etc.

On Windows, if you have multiple Python versions installed and the
`py` launcher: `py -3.12 -m venv venv`. Otherwise, install Python 3.12
from python.org first.

## 1. Create and activate a virtual environment

```bash
cd crop-ml-service
python -m venv venv
```

Windows: `venv\Scripts\activate`
macOS/Linux: `source venv/bin/activate`

## 2. Install dependencies

```bash
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
```

This will take a few minutes — TensorFlow is a large download (~300MB).

## 3. Configure environment variables

```bash
cp .env.example .env    # Windows: copy .env.example .env
```

Set `GOOGLE_API_KEY` — get a free one at
https://aistudio.google.com/apikey. It powers soil-report reading,
crop growing guides, AND disease treatment plans. `/api/predict` and
`/api/disease/predict` both work without it; only the Gemini-backed
endpoints need it.

## 4. Run the server

```bash
uvicorn app.main:app --reload --port 8001
```

Visit http://localhost:8001/health. You should see:
```json
{
  "status": "ok",
  "crop_model_loaded": true,
  "disease_model_loaded": true,
  "gemini_configured": true
}
```

If `disease_model_loaded` is `false`, check the server's startup logs
— it prints exactly why (almost always the Python/TensorFlow version
issue above). Interactive API docs: http://localhost:8001/docs.

## API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Service + both models' status |
| POST | `/api/predict` | `{N,P,K,temperature,humidity,ph,rainfall,top_n}` → ranked crops |
| GET | `/api/weather?lat=&lon=` | → `{temperature, humidity, rainfall}` estimate |
| POST | `/api/soil-report/extract` | multipart file upload → `{N,P,K,ph,...}` |
| POST | `/api/crop-info` | `{crop, language}` → full growing guide |
| POST | `/api/disease/predict` | multipart leaf image → top 3 disease matches + remedy info |
| POST | `/api/disease/treatment-plan` | `{class_key, language}` → detailed AI treatment plan |

### Example: `/api/disease/predict`

Request: multipart form with a JPG/PNG/WEBP leaf photo under field `file`.

Response:
```json
{
  "predictions": [
    {
      "class_key": "Tomato___Late_blight",
      "crop": "Tomato",
      "condition": "Late blight",
      "is_healthy": false,
      "confidence": 0.94,
      "info": {
        "disease": "Tomato Late Blight",
        "appearance": "Dark water-soaked spots on leaves...",
        "cause": "Caused by the oomycete Phytophthora infestans...",
        "recommended_solution": "Remove infected foliage...",
        "precautions": "Avoid overhead watering..."
      }
    }
  ],
  "model_name": "EfficientNetB0 (plant disease classifier)",
  "input_size": 224
}
```

### Example: `/api/disease/treatment-plan`

Request:
```json
{ "class_key": "Tomato___Late_blight", "language": "English" }
```

Returns a fuller plan: `overview`, `organic_treatment`,
`chemical_treatment`, `application_tips`, `prevention_schedule`,
`when_to_seek_help`. Chemical treatment options are deliberately
described in general terms (no specific dosages or mixing ratios) —
farmers are pointed to the product label or a local agricultural
extension officer for exact application rates.

## Troubleshooting

**`pip install` tries to compile a package from source and fails
(Meson/Cython/Rust/Cargo/linker errors)**

This is a **Python version problem, not specific to any one package.**
See "Python version" above. The `requirements.txt` here uses ranges,
not exact pins, so pip can pick whichever release actually has a
wheel for your Python version — but TensorFlow specifically has no
3.14 wheel at any version, so no range fixes that one. Switch to
Python 3.12 for this project.

**`tensorflow` installs but the server logs
"Disease detection model NOT loaded" on startup**

Almost always one of:
1. A Python version issue as above — check `python --version`.
2. A stale `venv` from before you fixed the Python version — delete
   `venv/` and recreate it with the correct Python.
3. A genuine version mismatch loading the `.keras` file — the model
   was saved with Keras 3.13.2 (bundled in a recent TensorFlow 2.x).
   If you see a deserialization error mentioning specific layers,
   try pinning `tensorflow` closer to `2.19` or `2.20` explicitly.

**Disease predictions look randomly wrong / low confidence on everything**

Check that the uploaded photo is a reasonably clear, well-lit photo of
a single leaf, similar in framing to the training dataset (leaf fills
most of the frame, plain background). The model was trained on the
"New Plant Diseases Dataset (Augmented)" (PlantVillage-based), which
covers 14 crop species — see `app/ml/disease_classes.py` for the full
list. A leaf from a crop outside that list will always be
misclassified as the closest visual match; there is no "unknown crop"
class.

## Design notes

- **Why a separate Python service instead of adding Python to the
  Node backend?** Node can't run scikit-learn or TensorFlow models
  natively. Keeping ML in its own FastAPI service also means you can
  redeploy or scale it independently of the main API.
- **Why Gemini for soil reports instead of a dedicated OCR library?**
  Gemini has native image and PDF understanding, so it reads a soil
  health card directly — no Tesseract, no poppler, no extra system
  install.
- **Why a static disease-info database AND a Gemini treatment plan?**
  The static database (extracted from the training notebook, reviewed
  content) gives an instant, free, always-available baseline the
  moment a prediction comes back. The Gemini-powered treatment plan is
  an optional deeper dive the user can request — organic vs. chemical
  options, application tips, a prevention schedule — without making
  every single prediction wait on an API call.
- **Why no specific pesticide dosages anywhere?** Exact application
  rates depend on the specific product formulation and local
  regulations. Both the static database and the Gemini prompt
  deliberately stay at "use a locally registered fungicide" /
  "consult the product label" level rather than inventing numbers
  that could be wrong for the farmer's actual product.
- **Why Open-Meteo for weather instead of a Google weather API?**
  Google doesn't offer a simple consumer weather API. Open-Meteo is
  free and keyless.
- **Rainfall is an estimate.** The crop model's "rainfall" feature is
  a season-scale total, not a single reading, so the service
  approximates it from the last 30 days of actual precipitation. The
  field stays editable in the UI on purpose.
