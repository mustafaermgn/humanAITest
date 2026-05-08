"""
CodeTest - Ana Flask Uygulaması
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone
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

MODEL_WEIGHTS = {
    'random_forest': 0.6,
    'svm': 0.3,
    'logistic_regression': 0.1
}


def weighted_ai_probability(predictions):
    """Calculate the final AI probability from per-model probabilities."""
    total_weight = sum(MODEL_WEIGHTS.values())
    return sum(predictions[name] * MODEL_WEIGHTS[name] for name in MODEL_WEIGHTS) / total_weight


# Database Models
class AnalysisHistory(db.Model):
    """Model for storing analysis history"""
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    ml_rf_prediction = db.Column(db.Float)
    ml_svm_prediction = db.Column(db.Float)
    ml_lr_prediction = db.Column(db.Float)
    final_ai_probability = db.Column(db.Float)
    final_human_probability = db.Column(db.Float)

    def to_dict(self, preview=True):
        code = self.code[:200] + '...' if preview and len(self.code) > 200 else self.code
        return {
            'id': self.id,
            'code': code,
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
        data = request.get_json(silent=True) or {}
        code = data.get('code', '')

        if not code:
            return jsonify({'error': 'Code is required'}), 400

        if not data_cleaner.validate_code(code):
            return jsonify({'error': 'Valid code is required'}), 400

        # Preserve structural signals for the feature extractor.
        cleaned_code = data_cleaner.clean_for_analysis(code)

        # Extract features for ML models
        features = feature_extractor.extract_features(cleaned_code)

        # Get predictions from ML models
        ml_rf_pred = ml_manager.predict_rf(features)
        ml_svm_pred = ml_manager.predict_svm(features)
        ml_lr_pred = ml_manager.predict_lr(features)

        # Calculate final probability from 3 ML models (weighted average)
        model_predictions = {
            'random_forest': ml_rf_pred,
            'svm': ml_svm_pred,
            'logistic_regression': ml_lr_pred
        }

        final_ai_probability = weighted_ai_probability(model_predictions)
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
                        'human_probability': 1 - ml_rf_pred,
                        'prediction': 'AI' if ml_rf_pred > 0.5 else 'Human'
                    },
                    'svm': {
                        'ai_probability': ml_svm_pred,
                        'human_probability': 1 - ml_svm_pred,
                        'prediction': 'AI' if ml_svm_pred > 0.5 else 'Human'
                    },
                    'logistic_regression': {
                        'ai_probability': ml_lr_pred,
                        'human_probability': 1 - ml_lr_pred,
                        'prediction': 'AI' if ml_lr_pred > 0.5 else 'Human'
                    }
                },
                'final': {
                    'ai_probability': final_ai_probability,
                    'human_probability': final_human_probability,
                    'prediction': 'AI' if final_ai_probability > 0.5 else 'Human',
                    'model_weights': MODEL_WEIGHTS
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
        entry = db.session.get(AnalysisHistory, history_id)
        if entry is None:
            return jsonify({'error': 'History item not found'}), 404
        return jsonify({
            'success': True,
            'entry': entry.to_dict(preview=False)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/history/clear', methods=['POST'])
def clear_history():
    """Clear all analysis history"""
    try:
        AnalysisHistory.query.delete()
        db.session.commit()
        return jsonify({
            'success': True,
            'message': 'Tüm geçmiş temizlendi'
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/train', methods=['POST'])
def train_models():
    """Train ML models (admin endpoint)"""
    try:
        # Train ML models
        results = ml_manager.train_models()
        
        return jsonify({
            'success': True,
            'message': 'ML models trained successfully',
            'metrics': results
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

