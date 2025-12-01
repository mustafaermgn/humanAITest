"""
White Box Tests - Test Case 1: Data Cleaner Module
Tests for data cleaning functionality
"""
import unittest
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from utils.data_cleaner import DataCleaner


class TestDataCleaner(unittest.TestCase):
    """Test cases for DataCleaner class"""
    
    def setUp(self):
        """Set up test fixtures"""
        self.cleaner = DataCleaner()
    
    def test_clean_code_removes_comments(self):
        """Test that comments are removed from code"""
        code = """
        def hello():
            # This is a comment
            print("Hello World")
            return True
        """
        cleaned = self.cleaner.clean_code(code)
        self.assertNotIn('# This is a comment', cleaned)
        self.assertIn('print("Hello World")', cleaned)
    
    def test_clean_code_removes_docstrings(self):
        """Test that docstrings are removed"""
        code = '''
        def function():
            """This is a docstring"""
            return True
        '''
        cleaned = self.cleaner.clean_code(code)
        self.assertNotIn('This is a docstring', cleaned)
    
    def test_clean_code_normalizes_whitespace(self):
        """Test that whitespace is normalized"""
        code = "def    test():    return    True"
        cleaned = self.cleaner.clean_code(code)
        # Should have normalized spaces
        self.assertIsInstance(cleaned, str)
    
    def test_validate_code_accepts_valid_code(self):
        """Test that valid code passes validation"""
        valid_code = "def test(): return True"
        self.assertTrue(self.cleaner.validate_code(valid_code))
    
    def test_validate_code_rejects_empty_code(self):
        """Test that empty code is rejected"""
        self.assertFalse(self.cleaner.validate_code(""))
        self.assertFalse(self.cleaner.validate_code("   "))
    
    def test_validate_code_rejects_too_short(self):
        """Test that code that's too short is rejected"""
        self.assertFalse(self.cleaner.validate_code("abc"))
    
    def test_clean_for_training(self):
        """Test training-specific cleaning"""
        code = """
        def test():
            # Comment
            return True
        
        
        
        """
        cleaned = self.cleaner.clean_for_training(code)
        self.assertIsInstance(cleaned, str)
        self.assertNotIn('# Comment', cleaned)


if __name__ == '__main__':
    unittest.main()

