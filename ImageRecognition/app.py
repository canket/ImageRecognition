from flask import Flask, request, jsonify, render_template
import os
from werkzeug.utils import secure_filename
import logging
from datetime import datetime
import imghdr

# 配置常數
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'webp','raw','dng','svg'}
MAX_CONTENT_LENGTH = 32 * 1024 * 1024  # 調整為 32MB 限制

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH

# 設置日誌
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# 確保上傳資料夾存在
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def verify_image(file_stream):
    """驗證檔案是否為有效的圖片"""
    file_stream.seek(0)
    image_type = imghdr.what(file_stream)
    return image_type in ['jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp','raw','dng','svg','heic','heif','avif']

def generate_unique_filename(original_filename):
    """生成唯一的檔案名"""
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    name, ext = os.path.splitext(secure_filename(original_filename))
    return f"{timestamp}_{name}{ext}"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        if 'image' not in request.files:
            logger.warning("沒有檔案被上傳")
            return jsonify({'success': False, 'message': '沒有上傳檔案'}), 400

        file = request.files['image']
        
        if file.filename == '':
            logger.warning("空檔名")
            return jsonify({'success': False, 'message': '沒有選擇檔案'}), 400

        if not allowed_file(file.filename):
            logger.warning(f"不支援的檔案類型: {file.filename}")
            return jsonify({'success': False, 'message': '不支援的檔案類型'}), 400

        if not verify_image(file):
            logger.warning(f"無效的圖片檔案: {file.filename}")
            return jsonify({'success': False, 'message': '無效的圖片檔案'}), 400

        filename = generate_unique_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        file.seek(0)
        file.save(filepath)
        logger.info(f"成功上傳檔案: {filename}")
        
        return jsonify({
            'success': True, 
            'message': '圖片上傳成功',
            'filename': filename
        })

    except Exception as e:
        logger.error(f"上傳檔案時發生錯誤: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'處理檔案時發生錯誤: {str(e)}'
        }), 500

@app.route('/delete', methods=['POST'])
def delete_file():
    try:
        data = request.json
        if not data or 'filename' not in data:
            logger.warning("刪除請求中未提供檔名")
            return jsonify({'success': False, 'message': '未提供檔名'}), 400

        filename = secure_filename(data['filename'])
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)

        if not os.path.exists(filepath):
            logger.warning(f"要刪除的檔案不存在: {filename}")
            return jsonify({'success': False, 'message': '檔案不存在'}), 404

        os.remove(filepath)
        logger.info(f"成功刪除檔案: {filename}")

        return jsonify({'success': True, 'message': '檔案已刪除'})

    except Exception as e:
        logger.error(f"刪除檔案時發生錯誤: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'刪除檔案時發生錯誤: {str(e)}'
        }), 500

@app.errorhandler(413)
def too_large(e):
    logger.warning("上傳檔案超過大小限制")
    return jsonify({
        'success': False,
        'message': '檔案太大！最大限制為 32MB'
    }), 413

@app.errorhandler(500)
def server_error(e):
    logger.error(f"伺服器錯誤: {str(e)}")
    return jsonify({
        'success': False,
        'message': '伺服器錯誤！'
    }), 500

if __name__ == '__main__':
    app.run(debug=True) 
