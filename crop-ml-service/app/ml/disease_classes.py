"""
The 38 classes of the "New Plant Diseases Dataset (Augmented)" that
the EfficientNetB0 model was trained on. Order matters: this is the
exact alphabetical order Keras' ImageDataGenerator.flow_from_directory
assigns as class indices (index 0 = first entry here, index 37 =
last), because it sorts subdirectory names alphabetically. Verified
against the training script's own class_names.json output — do not
reorder this list.
"""

DISEASE_CLASSES = [
    "Apple___Apple_scab",
    "Apple___Black_rot",
    "Apple___Cedar_apple_rust",
    "Apple___healthy",
    "Blueberry___healthy",
    "Cherry_(including_sour)___Powdery_mildew",
    "Cherry_(including_sour)___healthy",
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",
    "Corn_(maize)___Common_rust_",
    "Corn_(maize)___Northern_Leaf_Blight",
    "Corn_(maize)___healthy",
    "Grape___Black_rot",
    "Grape___Esca_(Black_Measles)",
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
    "Grape___healthy",
    "Orange___Haunglongbing_(Citrus_greening)",
    "Peach___Bacterial_spot",
    "Peach___healthy",
    "Pepper,_bell___Bacterial_spot",
    "Pepper,_bell___healthy",
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",
    "Raspberry___healthy",
    "Soybean___healthy",
    "Squash___Powdery_mildew",
    "Strawberry___Leaf_scorch",
    "Strawberry___healthy",
    "Tomato___Bacterial_spot",
    "Tomato___Early_blight",
    "Tomato___Late_blight",
    "Tomato___Leaf_Mold",
    "Tomato___Septoria_leaf_spot",
    "Tomato___Spider_mites Two-spotted_spider_mite",
    "Tomato___Target_Spot",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato___Tomato_mosaic_virus",
    "Tomato___healthy",
]


def parse_class_key(class_key: str) -> dict:
    """
    Splits a raw dataset key like "Corn_(maize)___Common_rust_" into a
    display-friendly crop name and condition name. Handles the
    dataset's underscores-as-spaces convention and its handful of
    parenthesised/comma'd crop names.
    """
    crop_raw, _, condition_raw = class_key.partition("___")

    crop = crop_raw.replace("_", " ").replace(",", ",").strip()
    condition = condition_raw.replace("_", " ").strip()
    is_healthy = condition.lower() == "healthy"

    return {
        "crop": crop,
        "condition": "Healthy" if is_healthy else condition,
        "is_healthy": is_healthy,
    }
