"""
CodeTest - Ana Flask Uygulaması
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os
from dotenv import load_dotenv

from models.ml_models import MLModelManager
from utils.data_cleaner import DataCleaner
from utils.feature_extractor import FeatureExtractor

load_dotenv()

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///code_analysis.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Initialize managers
ml_manager = MLModelManager()
data_cleaner = DataCleaner()
feature_extractor = FeatureExtractor()


# Database Models
class AnalysisHistory(db.Model):
    """Model for storing analysis history"""
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    ml_rf_prediction = db.Column(db.Float)
    ml_svm_prediction = db.Column(db.Float)
    ml_lr_prediction = db.Column(db.Float)
    final_ai_probability = db.Column(db.Float)
    final_human_probability = db.Column(db.Float)

    def to_dict(self):
        return {
            'id': self.id,
            'code': self.code[:200] + '...' if len(self.code) > 200 else self.code,
            'timestamp': self.timestamp.isoformat(),
            'ml_rf_prediction': self.ml_rf_prediction,
            'ml_svm_prediction': self.ml_svm_prediction,
            'ml_lr_prediction': self.ml_lr_prediction,
            'final_ai_probability': self.final_ai_probability,
            'final_human_probability': self.final_human_probability
        }


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'API is running'})


@app.route('/api/analyze', methods=['POST'])
def analyze_code():
    """
    Analyze code to determine if it's AI or Human generated
    Returns predictions from 3 ML models (Random Forest, SVM, Logistic Regression)
    """
    try:
        data = request.get_json()
        code = data.get('code', '')

        if not code:
            return jsonify({'error': 'Code is required'}), 400

        # Clean the code
        cleaned_code = data_cleaner.clean_code(code)

        # Extract features for ML models
        features = feature_extractor.extract_features(cleaned_code)

        # Get predictions from ML models
        ml_rf_pred = ml_manager.predict_rf(features)
        ml_svm_pred = ml_manager.predict_svm(features)
        ml_lr_pred = ml_manager.predict_lr(features)

        # Calculate final probability from 3 ML models (weighted average)
        predictions = [
            ml_rf_pred,
            ml_svm_pred,
            ml_lr_pred
        ]
        
        final_ai_probability = sum(predictions) / len(predictions)
        final_human_probability = 1 - final_ai_probability

        # Save to history
        history_entry = AnalysisHistory(
            code=code,
            ml_rf_prediction=ml_rf_pred,
            ml_svm_prediction=ml_svm_pred,
            ml_lr_prediction=ml_lr_pred,
            final_ai_probability=final_ai_probability,
            final_human_probability=final_human_probability
        )
        db.session.add(history_entry)
        db.session.commit()

        return jsonify({
            'success': True,
            'predictions': {
                'ml_models': {
                    'random_forest': {
                        'ai_probability': ml_rf_pred,
                        'human_probability': 1 - ml_rf_pred
                    },
                    'svm': {
                        'ai_probability': ml_svm_pred,
                        'human_probability': 1 - ml_svm_pred
                    },
                    'logistic_regression': {
                        'ai_probability': ml_lr_pred,
                        'human_probability': 1 - ml_lr_pred
                    }
                },
                'final': {
                    'ai_probability': final_ai_probability,
                    'human_probability': final_human_probability
                }
            },
            'history_id': history_entry.id
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/history', methods=['GET'])
def get_history():
    """Get analysis history"""
    try:
        limit = request.args.get('limit', 50, type=int)
        history = AnalysisHistory.query.order_by(
            AnalysisHistory.timestamp.desc()
        ).limit(limit).all()
        
        return jsonify({
            'success': True,
            'history': [entry.to_dict() for entry in history],
            'count': len(history)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/history/<int:history_id>', methods=['GET'])
def get_history_item(history_id):
    """Get specific history item"""
    try:
        entry = AnalysisHistory.query.get_or_404(history_id)
        return jsonify({
            'success': True,
            'entry': entry.to_dict()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/train', methods=['POST'])
def train_models():
    """Train ML models (admin endpoint)"""
    try:
        # Train ML models
        ml_manager.train_models()
        
        return jsonify({
            'success': True,
            'message': 'ML models trained successfully'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


def create_tables():
    """Create database tables"""
    with app.app_context():
        db.create_all()


if __name__ == '__main__':
    create_tables()
    app.run(debug=True, host='0.0.0.0', port=5000)

