from flask import Flask, request, jsonify, render_template
import os
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# 確保上傳資料夾存在
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# 確保根路由正確指向 index.html
@app.route('/')
def index():
    return render_template('index.html')

# 確保模板位置正確
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'image' not in request.files:
        return jsonify({'message': '沒有上傳檔案'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'message': '沒有選擇檔案'}), 400

    if file and allowed_file(file.filename):
        try:
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            return jsonify({
                'message': '圖片上傳成功！',
                'success': True
            })
        except Exception as e:
            return jsonify({
                'message': f'處理圖片時發生錯誤: {str(e)}',
                'success': False
            }), 500
    
    return jsonify({'message': '不支援的檔案類型'}), 400

if __name__ == '__main__':
    app.run(debug=True) 