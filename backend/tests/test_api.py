"""
White Box Tests - Test Case 3: API Endpoints
Tests for Flask API endpoints
"""
import unittest
import sys
import os
import json

# Add parent directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app import app, db, AnalysisHistory


class TestAPI(unittest.TestCase):
    """Test cases for API endpoints"""
    
    def setUp(self):
        """Set up test fixtures"""
        self.app = app.test_client()
        self.app.testing = True
        
        # Create test database
        with app.app_context():
            db.create_all()
    
    def tearDown(self):
        """Clean up after tests"""
        with app.app_context():
            db.session.remove()
            db.drop_all()
    
    def test_health_check(self):
        """Test health check endpoint"""
        response = self.app.get('/api/health')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['status'], 'healthy')
    
    def test_analyze_code_success(self):
        """Test code analysis endpoint with valid code"""
        test_code = """
        def hello():
            print("Hello World")
            return True
        """
        response = self.app.post(
            '/api/analyze',
            data=json.dumps({'code': test_code}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertTrue(data['success'])
        self.assertIn('predictions', data)
        self.assertIn('ml_models', data['predictions'])
        self.assertIn('final', data['predictions'])
        self.assertEqual(
            set(data['predictions']['ml_models'].keys()),
            {'random_forest', 'svm', 'logistic_regression'}
        )

        final = data['predictions']['final']
        self.assertGreaterEqual(final['ai_probability'], 0)
        self.assertLessEqual(final['ai_probability'], 1)
        self.assertAlmostEqual(
            final['ai_probability'] + final['human_probability'],
            1.0,
            places=6
        )
    
    def test_analyze_code_empty(self):
        """Test code analysis endpoint with empty code"""
        response = self.app.post(
            '/api/analyze',
            data=json.dumps({'code': ''}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertIn('error', data)

    def test_analyze_code_invalid_json(self):
        """Test code analysis endpoint with invalid JSON body"""
        response = self.app.post(
            '/api/analyze',
            data='not json',
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertIn('error', data)
    
    def test_get_history(self):
        """Test history endpoint"""
        response = self.app.get('/api/history')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertTrue(data['success'])
        self.assertIn('history', data)
        self.assertIsInstance(data['history'], list)
    
    def test_analyze_creates_history(self):
        """Test that analysis creates history entry"""
        test_code = "def test(): return True"
        
        # Make analysis
        self.app.post(
            '/api/analyze',
            data=json.dumps({'code': test_code}),
            content_type='application/json'
        )
        
        # Check history
        response = self.app.get('/api/history')
        data = json.loads(response.data)
        self.assertGreaterEqual(len(data['history']), 1)

    def test_history_detail_returns_full_code(self):
        """Test that detail endpoint does not truncate analyzed code"""
        test_code = "def long_test():\n" + "\n".join(f"    value_{i} = {i}" for i in range(80))

        analyze_response = self.app.post(
            '/api/analyze',
            data=json.dumps({'code': test_code}),
            content_type='application/json'
        )
        history_id = json.loads(analyze_response.data)['history_id']

        response = self.app.get(f'/api/history/{history_id}')
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['entry']['code'], test_code)

    def test_history_detail_missing(self):
        """Test missing history item returns 404"""
        response = self.app.get('/api/history/999999')
        data = json.loads(response.data)

        self.assertEqual(response.status_code, 404)
        self.assertIn('error', data)


if __name__ == '__main__':
    unittest.main()

