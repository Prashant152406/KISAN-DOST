"""
The trained crop-recommendation model outputs raw dataset labels like
"kidneybeans" and "mothbeans". This maps each one to a human-readable
name for display, and for building a sensible prompt to Gemini.
"""

CROP_DISPLAY_NAMES = {
    "rice": "Rice",
    "maize": "Maize",
    "chickpea": "Chickpea",
    "kidneybeans": "Kidney Beans",
    "pigeonpeas": "Pigeon Peas",
    "mothbeans": "Moth Beans",
    "mungbean": "Mung Bean",
    "blackgram": "Black Gram",
    "lentil": "Lentil",
    "pomegranate": "Pomegranate",
    "banana": "Banana",
    "mango": "Mango",
    "grapes": "Grapes",
    "watermelon": "Watermelon",
    "muskmelon": "Muskmelon",
    "apple": "Apple",
    "orange": "Orange",
    "papaya": "Papaya",
    "coconut": "Coconut",
    "cotton": "Cotton",
    "jute": "Jute",
    "coffee": "Coffee",
}
