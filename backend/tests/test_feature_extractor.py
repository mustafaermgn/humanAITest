"""
White Box Tests - Test Case 2: Feature Extractor Module
Tests for feature extraction functionality
"""
import unittest
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from utils.feature_extractor import FeatureExtractor


class TestFeatureExtractor(unittest.TestCase):
    """Test cases for FeatureExtractor class"""
    
    def setUp(self):
        """Set up test fixtures"""
        self.extractor = FeatureExtractor()
    
    def test_extract_features_returns_list(self):
        """Test that extract_features returns a list"""
        code = "def test(): return True"
        features = self.extractor.extract_features(code)
        self.assertIsInstance(features, list)
        self.assertEqual(len(features), 20)
    
    def test_extract_features_handles_empty_code(self):
        """Test that empty code returns default features"""
        features = self.extractor.extract_features("")
        self.assertIsInstance(features, list)
        self.assertEqual(len(features), 20)
    
    def test_count_functions(self):
        """Test function counting"""
        code = "def func1(): pass\ndef func2(): pass"
        count = self.extractor._count_functions(code)
        self.assertGreaterEqual(count, 1)
    
    def test_count_classes(self):
        """Test class counting"""
        code = "class Test: pass\nclass Test2: pass"
        count = self.extractor._count_classes(code)
        self.assertGreaterEqual(count, 1)
    
    def test_count_imports(self):
        """Test import counting"""
        code = "import os\nfrom sys import path"
        count = self.extractor._count_imports(code)
        self.assertGreaterEqual(count, 1)
    
    def test_entropy_calculation(self):
        """Test entropy calculation"""
        code = "def test(): return True"
        entropy = self.extractor._entropy(code)
        self.assertIsInstance(entropy, float)
        self.assertGreaterEqual(entropy, 0)
    
    def test_keyword_density(self):
        """Test keyword density calculation"""
        code = "def test(): if True: return False"
        density = self.extractor._keyword_density(code)
        self.assertIsInstance(density, float)
        self.assertGreaterEqual(density, 0)
        self.assertLessEqual(density, 1)


if __name__ == '__main__':
    unittest.main()

