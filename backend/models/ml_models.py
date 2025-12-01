"""
Machine Learning Models - User Story 2
Three different ML algorithms: Random Forest, SVM, Logistic Regression
"""
import os
import json
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, classification_report, confusion_matrix
import joblib

from utils.data_cleaner import DataCleaner
from utils.feature_extractor import FeatureExtractor


class MLModelManager:
    """Manages three ML models: Random Forest, SVM, Logistic Regression"""

    def __init__(self):
        self.data_cleaner = DataCleaner()
        self.feature_extractor = FeatureExtractor()
        self.scaler = StandardScaler()
        
        # Models with improved hyperparameters
        self.rf_model = RandomForestClassifier(
            n_estimators=200, 
            random_state=42, 
            max_depth=25,
            min_samples_split=5,
            min_samples_leaf=2,
            class_weight='balanced',
            n_jobs=-1
        )
        self.svm_model = SVC(
            probability=True, 
            random_state=42, 
            kernel='rbf',
            C=1.0,
            gamma='scale',
            class_weight='balanced'
        )
        self.lr_model = LogisticRegression(
            random_state=42,
            max_iter=1000,
            class_weight='balanced',
            solver='lbfgs',
            C=1.0,
            n_jobs=-1
        )
        
        # Model paths
        self.model_dir = os.path.join(os.path.dirname(__file__), 'saved_models')
        os.makedirs(self.model_dir, exist_ok=True)
        
        # Try to load existing models
        self._load_models()

    def _load_data(self, max_samples_per_class=None):
        """Load and prepare training data from Data folder"""
        print("Loading training data...")
        
        ai_files = []
        human_files = []
        
        # Load AI files - use more data for better training
        ai_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'Data', 'ai')
        if os.path.exists(ai_dir):
            ai_file_list = [f for f in os.listdir(ai_dir) if f.endswith('.json')]
            if max_samples_per_class:
                ai_file_list = ai_file_list[:max_samples_per_class]
            
            for filename in ai_file_list:
                try:
                    with open(os.path.join(ai_dir, filename), 'r', encoding='utf-8') as f:
                        data = json.load(f)
                        if 'code' in data:
                            code = data['code']
                            if self.data_cleaner.validate_code(code):
                                ai_files.append(code)
                except Exception as e:
                    continue
        
        # Load Human files - use more data for better training
        human_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'Data', 'human')
        if os.path.exists(human_dir):
            human_file_list = [f for f in os.listdir(human_dir) if f.endswith('.json')]
            if max_samples_per_class:
                human_file_list = human_file_list[:max_samples_per_class]
            
            for filename in human_file_list:
                try:
                    with open(os.path.join(human_dir, filename), 'r', encoding='utf-8') as f:
                        data = json.load(f)
                        if 'code' in data:
                            code = data['code']
                            if self.data_cleaner.validate_code(code):
                                human_files.append(code)
                except Exception as e:
                    continue
        
        print(f"Loaded {len(ai_files)} AI samples and {len(human_files)} Human samples")
        
        # Balance dataset - use minimum of both classes to prevent imbalance
        min_samples = min(len(ai_files), len(human_files))
        if min_samples == 0:
            print("Warning: No valid samples found in one or both classes!")
            return np.array([]), np.array([])
        
        # Sample equally from both classes if needed
        if len(ai_files) > min_samples:
            import random
            ai_files = random.sample(ai_files, min_samples)
        if len(human_files) > min_samples:
            import random
            human_files = random.sample(human_files, min_samples)
        
        print(f"Using {len(ai_files)} AI samples and {len(human_files)} Human samples (balanced)")
        
        # Prepare data
        all_codes = ai_files + human_files
        labels = [1] * len(ai_files) + [0] * len(human_files)  # 1 = AI, 0 = Human
        
        # Clean and extract features
        features = []
        valid_indices = []
        
        print("Extracting features...")
        for i, code in enumerate(all_codes):
            try:
                cleaned = self.data_cleaner.clean_for_training(code)
                if cleaned and len(cleaned) > 10:
                    feature_vector = self.feature_extractor.extract_features(cleaned)
                    if feature_vector and len(feature_vector) > 0:
                        features.append(feature_vector)
                        valid_indices.append(i)
            except Exception as e:
                continue
        
        # Filter labels
        labels = [labels[i] for i in valid_indices]
        
        X = np.array(features)
        y = np.array(labels)
        
        print(f"Valid samples after feature extraction: {len(X)}")
        if len(X) == 0:
            print("Error: No valid samples after feature extraction!")
            return X, y
        
        # Check for NaN or Inf values
        if np.isnan(X).any() or np.isinf(X).any():
            print("Warning: Found NaN or Inf values in features. Replacing with 0...")
            X = np.nan_to_num(X, nan=0.0, posinf=0.0, neginf=0.0)
        
        return X, y

    def train_models(self, max_samples_per_class=2000):
        """Train all three ML models with improved evaluation"""
        print("=" * 60)
        print("TRAINING ML MODELS")
        print("=" * 60)
        
        # Load data - use more samples
        X, y = self._load_data(max_samples_per_class=max_samples_per_class)
        
        if len(X) == 0:
            print("No valid training data found!")
            return
        
        # Check class distribution
        unique, counts = np.unique(y, return_counts=True)
        print(f"\nClass distribution: {dict(zip(['Human', 'AI'], counts))}")
        
        # Split data with stratification
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        print(f"Training set size: {len(X_train)}, Test set size: {len(X_test)}")
        
        # Scale features
        print("\nScaling features...")
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train and evaluate models
        models = {
            'Random Forest': self.rf_model,
            'SVM': self.svm_model,
            'Logistic Regression': self.lr_model
        }
        
        results = {}
        
        for model_name, model in models.items():
            print(f"\n{'=' * 60}")
            print(f"Training {model_name}...")
            print(f"{'=' * 60}")
            
            # Train model
            model.fit(X_train_scaled, y_train)
            
            # Predictions
            y_pred = model.predict(X_test_scaled)
            y_pred_proba = model.predict_proba(X_test_scaled)[:, 1]
            
            # Calculate metrics
            accuracy = accuracy_score(y_test, y_pred)
            precision = precision_score(y_test, y_pred, zero_division=0)
            recall = recall_score(y_test, y_pred, zero_division=0)
            f1 = f1_score(y_test, y_pred, zero_division=0)
            
            results[model_name] = {
                'accuracy': accuracy,
                'precision': precision,
                'recall': recall,
                'f1': f1
            }
            
            print(f"Accuracy:  {accuracy:.4f}")
            print(f"Precision: {precision:.4f}")
            print(f"Recall:    {recall:.4f}")
            print(f"F1-Score:  {f1:.4f}")
            
            # Cross-validation
            print(f"\nPerforming 5-fold cross-validation...")
            cv_scores = cross_val_score(model, X_train_scaled, y_train, cv=5, scoring='accuracy')
            print(f"CV Accuracy: {cv_scores.mean():.4f} (+/- {cv_scores.std() * 2:.4f})")
            
            results[model_name]['cv_mean'] = cv_scores.mean()
            results[model_name]['cv_std'] = cv_scores.std()
        
        # Print summary
        print(f"\n{'=' * 60}")
        print("TRAINING SUMMARY")
        print(f"{'=' * 60}")
        print(f"{'Model':<20} {'Accuracy':<10} {'Precision':<10} {'Recall':<10} {'F1-Score':<10}")
        print("-" * 60)
        for model_name, metrics in results.items():
            print(f"{model_name:<20} {metrics['accuracy']:<10.4f} {metrics['precision']:<10.4f} {metrics['recall']:<10.4f} {metrics['f1']:<10.4f}")
        
        # Save models
        print(f"\nSaving models...")
        self._save_models()
        print("✅ Models trained and saved successfully!")

    def _save_models(self):
        """Save trained models"""
        joblib.dump(self.rf_model, os.path.join(self.model_dir, 'rf_model.pkl'))
        joblib.dump(self.svm_model, os.path.join(self.model_dir, 'svm_model.pkl'))
        joblib.dump(self.lr_model, os.path.join(self.model_dir, 'lr_model.pkl'))
        joblib.dump(self.scaler, os.path.join(self.model_dir, 'scaler.pkl'))

    def _load_models(self):
        """Load saved models if they exist"""
        try:
            if os.path.exists(os.path.join(self.model_dir, 'rf_model.pkl')):
                self.rf_model = joblib.load(os.path.join(self.model_dir, 'rf_model.pkl'))
                print("✅ Loaded Random Forest model")
            
            if os.path.exists(os.path.join(self.model_dir, 'svm_model.pkl')):
                self.svm_model = joblib.load(os.path.join(self.model_dir, 'svm_model.pkl'))
                print("✅ Loaded SVM model")
            
            if os.path.exists(os.path.join(self.model_dir, 'lr_model.pkl')):
                self.lr_model = joblib.load(os.path.join(self.model_dir, 'lr_model.pkl'))
                print("✅ Loaded Logistic Regression model")
            
            if os.path.exists(os.path.join(self.model_dir, 'scaler.pkl')):
                self.scaler = joblib.load(os.path.join(self.model_dir, 'scaler.pkl'))
                print("✅ Loaded scaler")
        except Exception as e:
            print(f"Error loading models: {e}")
            print("Models will be trained on first use")

    def predict_rf(self, features: list) -> float:
        """Predict using Random Forest"""
        try:
            features_array = np.array(features).reshape(1, -1)
            features_scaled = self.scaler.transform(features_array)
            proba = self.rf_model.predict_proba(features_scaled)[0]
            return float(proba[1])  # Return AI probability
        except:
            # If model not trained, return default
            return 0.5

    def predict_svm(self, features: list) -> float:
        """Predict using SVM"""
        try:
            features_array = np.array(features).reshape(1, -1)
            features_scaled = self.scaler.transform(features_array)
            proba = self.svm_model.predict_proba(features_scaled)[0]
            return float(proba[1])  # Return AI probability
        except:
            return 0.5

    def predict_lr(self, features: list) -> float:
        """Predict using Logistic Regression"""
        try:
            features_array = np.array(features).reshape(1, -1)
            features_scaled = self.scaler.transform(features_array)
            proba = self.lr_model.predict_proba(features_scaled)[0]
            return float(proba[1])  # Return AI probability
        except Exception as e:
            print(f"Error in Logistic Regression prediction: {e}")
            return 0.5

