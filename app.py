import os
import uuid
import asyncio
import aiohttp
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
from image_processing import upscale_image
from image_analysis import analyze_image

app = Flask(__name__)
CORS(app, resources={r'/*': {'origins': '*'}})
app.config['UPLOAD_FOLDER'] = 'static/temp'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max-limit

if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

@app.route('/')
def home():
    return "Welcome to Centaurion Slidr - AI-Powered Image Upscaling and Analysis"

@app.route('/upload', methods=['POST'])
def upload_files():
    if 'files' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    files = request.files.getlist('files')
    if not files or files[0].filename == '':
        return jsonify({'error': 'No selected files'}), 400
    
    uploaded_files = []
    for file in files:
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4()}_{filename}"
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(file_path)
        uploaded_files.append(unique_filename)
    
    return jsonify({'filenames': uploaded_files}), 200

async def process_image(filename, input_path, output_path):
    try:
        await asyncio.to_thread(upscale_image, input_path, output_path)
        return output_path
    except Exception as e:
        print(f"Error processing {filename}: {str(e)}")
        return None

@app.route('/upscale', methods=['POST'])
async def upscale():
    data = request.json
    filenames = data.get('filenames')
    if not filenames:
        return jsonify({'error': 'No filenames provided'}), 400
    
    upscaled_files = []
    tasks = []
    for filename in filenames:
        input_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        if not os.path.exists(input_path):
            return jsonify({'error': f'File not found: {filename}'}), 404
        
        output_filename = f"upscaled_{filename}"
        output_path = os.path.join(app.config['UPLOAD_FOLDER'], output_filename)
        
        task = asyncio.create_task(process_image(filename, input_path, output_path))
        tasks.append(task)
    
    results = await asyncio.gather(*tasks)
    upscaled_files = [os.path.basename(path) for path in results if path]
    
    return jsonify({'upscaled_filenames': upscaled_files}), 200

async def analyze_image_async(original_path, upscaled_path):
    try:
        result = await asyncio.to_thread(analyze_image, original_path, upscaled_path)
        return result
    except Exception as e:
        print(f"Error analyzing {original_path} and {upscaled_path}: {str(e)}")
        return None

@app.route('/analyze', methods=['POST'])
async def analyze():
    data = request.json
    original_filenames = data.get('original_filenames')
    upscaled_filenames = data.get('upscaled_filenames')
    
    if not original_filenames or not upscaled_filenames or len(original_filenames) != len(upscaled_filenames):
        return jsonify({'error': 'Invalid filenames provided'}), 400
    
    analysis_results = []
    tasks = []
    for original_filename, upscaled_filename in zip(original_filenames, upscaled_filenames):
        original_path = os.path.join(app.config['UPLOAD_FOLDER'], original_filename)
        upscaled_path = os.path.join(app.config['UPLOAD_FOLDER'], upscaled_filename)
        
        if not os.path.exists(original_path) or not os.path.exists(upscaled_path):
            return jsonify({'error': f'One or both files not found: {original_filename}, {upscaled_filename}'}), 404
        
        task = asyncio.create_task(analyze_image_async(original_path, upscaled_path))
        tasks.append((original_filename, upscaled_filename, task))
    
    for original_filename, upscaled_filename, task in tasks:
        result = await task
        if result:
            analysis_results.append({
                'original_filename': original_filename,
                'upscaled_filename': upscaled_filename,
                'analysis': result
            })
    
    return jsonify(analysis_results), 200

@app.route('/image/<filename>')
def get_image(filename):
    return send_file(os.path.join(app.config['UPLOAD_FOLDER'], filename))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
