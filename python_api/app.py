from flask import Flask, request, jsonify
import pandas as pd
import os

app = Flask(__name__)

@app.route('/process', methods=['POST'])
def process_csv():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400

        file = request.files['file']

        # Read the CSV file
        df = pd.read_csv(file)

        # Example processing: Add a new column with dummy data
        df['processed_column'] = df.sum(axis=1)

        # Save the processed CSV file
        output_filename = "processed_output.csv"
        output_path = os.path.join('backend/python_api/processed/', output_filename)
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        df.to_csv(output_path, index=False)

        return jsonify({"message": "File processed successfully", "output_filename": output_filename})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
