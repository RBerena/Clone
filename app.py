from flask import Flask, request, jsonify
from PIL import Image, ImageDraw, ImageFont
import io
import base64
import numpy as np
import cv2
from ultralytics import YOLO
 
app = Flask(__name__)
model = YOLO(r"C:\Users\rjay2\OneDrive\Documents\GitHub\Erthyn-Corp\Yolo_model.pt")
# model = YOLO(r"C:\BIT\ACE SPACE\best2.pt")
PIXEL_TO_CM = 0.1
 
class_names = [
    "African Violet (Saintpaulia ionantha)",
    "Aloe Vera",
    "Anthurium",
    "Areca Palm (Dypsis lutescens)",
    "Asparagus Fern (Asparagus setaceus)",
    "Begonia (Begonia spp.)",
    "Bird of Paradise (Strelitzia reginae)",
    "Birds Nest Fern (Asplenium nidus)",
    "Boston Fern (Nephrolepis exaltata)",
    "Calathea",
    "Cast Iron Plant (Aspidistra elatior)",
    "Chinese Money Plant (Pilea peperomioides)",
    "Chinese evergreen (Aglaonema)",
    "Christmas Cactus (Schlumbergera bridgesii)",
    "Chrysanthemum",
    "Ctenanthe",
    "Daffodils (Narcissus spp.)",
    "Dracaena",
    "Dumb Cane (Dieffenbachia spp.)",
    "Elephant Ear (Alocasia spp.)",
    "English Ivy (Hedera helix)",
    "Hyacinth (Hyacinthus orientalis)",
    "Iron Cross begonia (Begonia masoniana)",
    "Jade plant (Crassula ovata)",
    "Kalanchoe",
    "Lilium (Hemerocallis)",
    "Lily of the valley (Convallaria majalis)",
    "Money Tree (Pachira aquatica)",
    "Monstera Deliciosa (Monstera deliciosa)",
    "Orchid",
    "Parlor Palm (Chamaedorea elegans)",
    "Peace lily",
    "Poinsettia (Euphorbia pulcherrima)",
    "Polka Dot Plant (Hypoestes phyllostachya)",
    "Ponytail Palm (Beaucarnea recurvata)",
    "Pothos (Ivy arum)",
    "Prayer Plant (Maranta leuconeura)",
    "Rattlesnake Plant (Calathea lancifolia)",
    "Rubber Plant (Ficus elastica)",
    "Sago Palm (Cycas revoluta)",
    "Schefflera",
    "Snake plant (Sansevieria)",
    "Tradescantia",
    "Tulip",
    "Venus Flytrap",
    "Yucca",
    "ZZ Plant (Zamioculcas zamiifolia)"
]
 
def predict_plant(image_pil: Image.Image):
    img_bgr = cv2.cvtColor(np.array(image_pil), cv2.COLOR_RGB2BGR)
    results = model(img_bgr)[0]
 
    if len(results.boxes) == 0:
        return {"error": "No plant detected, try taking another picture."}
 
    best_score = -1
    best_box = None
    for box in results.boxes:
        conf = float(box.conf[0].item())
        x1, y1, x2, y2 = box.xyxy[0]
        area = (x2 - x1) * (y2 - y1)
        score = conf * area
        if score > best_score:
            best_score = score
            best_box = box
 
    conf = float(best_box.conf[0].item())
    cls_id = int(best_box.cls[0].item())
    species = class_names[cls_id]
 
    x1, y1, x2, y2 = map(float, best_box.xyxy[0])
    width_cm = (x2 - x1) * PIXEL_TO_CM
    height_cm = (y2 - y1) * PIXEL_TO_CM
    co2 = round(width_cm * height_cm * 0.02 * 24, 2)  # g per day
 
    draw = ImageDraw.Draw(image_pil)
    draw.rectangle([x1, y1, x2, y2], outline="green", width=3)
    font = ImageFont.load_default()
    label = f"{species} {conf*100:.1f}%\n{width_cm:.1f}cm x {height_cm:.1f}cm\nCO₂: {co2} g/day"
    draw.text((x1, max(y1 - 30, 0)), label, fill="green", font=font)
 
    buffer = io.BytesIO()
    image_pil.save(buffer, format="JPEG")
    img_str = base64.b64encode(buffer.getvalue()).decode()
 
    return {
        "species": species,
        "confidence": round(conf * 100, 1),
        "size_cm": f"{width_cm:.1f} x {height_cm:.1f}",
        "co2_g_per_day": co2,
        "image_with_box": f"data:image/jpeg;base64,{img_str}"
    }
 
@app.route("/")
def index():
    return jsonify({"message": "Plant Detection API is running"})
 
@app.route("/predict", methods=["POST"])
def predict():
    if "plant_image" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
 
    file = request.files["plant_image"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400
 
    try:
        img_bytes = file.read()
        img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        result = predict_plant(img)
        if "error" in result:
            return jsonify(result), 400
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
 
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
 