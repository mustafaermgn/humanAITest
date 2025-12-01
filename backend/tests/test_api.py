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
        self.assertIn('transfer_learning', data['predictions'])
        self.assertIn('final', data['predictions'])
    
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


if __name__ == '__main__':
    unittest.main()

