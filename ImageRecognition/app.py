from flask import Flask, request, jsonify, render_template
import os
from werkzeug.utils import secure_filename
from PIL import Image
import numpy as np
import tensorflow as tf

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'image' not in request.files:
        return jsonify({'message': '未提供圖片'}), 400

    file = request.files['image']
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        result = recognize_image(filepath)
        return jsonify({'message': result})

    return jsonify({'message': '無效的檔案格式'}), 400

def recognize_image(filepath):
    try:
        image = Image.open(filepath).convert('RGB')
        image = image.resize((224, 224))
        image_array = np.array(image) / 255.0
        image_array = np.expand_dims(image_array, axis=0)

        model = tf.keras.models.load_model('your_model.keras')
        predictions = model.predict(image_array)
        label = np.argmax(predictions, axis=1)[0]
        return f"圖片內容是：{label}"
    except Exception as e:
        return f"辨識錯誤: {str(e)}"

if __name__ == '__main__':
    app.run(debug=True)
