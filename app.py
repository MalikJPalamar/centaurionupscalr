import os
import uuid
from flask import Flask, request, jsonify, send_file
from werkzeug.utils import secure_filename
from image_processing import upscale_image
from image_analysis import analyze_image

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/temp'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max-limit

if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

@app.route('/')
def home():
    return "Welcome to Centaurion Slidr - AI-Powered Image Upscaling and Analysis"

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file:
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4()}_{filename}"
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(file_path)
        return jsonify({'filename': unique_filename}), 200

@app.route('/upscale', methods=['POST'])
def upscale():
    data = request.json
    filename = data.get('filename')
    if not filename:
        return jsonify({'error': 'No filename provided'}), 400
    
    input_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    if not os.path.exists(input_path):
        return jsonify({'error': 'File not found'}), 404
    
    output_filename = f"upscaled_{filename}"
    output_path = os.path.join(app.config['UPLOAD_FOLDER'], output_filename)
    
    try:
        upscale_image(input_path, output_path)
        return jsonify({'upscaled_filename': output_filename}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    original_filename = data.get('original_filename')
    upscaled_filename = data.get('upscaled_filename')
    
    if not original_filename or not upscaled_filename:
        return jsonify({'error': 'Both original and upscaled filenames are required'}), 400
    
    original_path = os.path.join(app.config['UPLOAD_FOLDER'], original_filename)
    upscaled_path = os.path.join(app.config['UPLOAD_FOLDER'], upscaled_filename)
    
    if not os.path.exists(original_path) or not os.path.exists(upscaled_path):
        return jsonify({'error': 'One or both files not found'}), 404
    
    try:
        analysis_results = analyze_image(original_path, upscaled_path)
        return jsonify(analysis_results), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/image/<filename>')
def get_image(filename):
    return send_file(os.path.join(app.config['UPLOAD_FOLDER'], filename))

@app.after_request
def add_header(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Methods'] = 'OPTIONS,HEAD,GET,POST'
    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
