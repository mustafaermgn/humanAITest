"""
Feature Extraction Module
Extracts features from code for ML model training and prediction
"""
import re
import math


class FeatureExtractor:
    """Extracts statistical and structural features from code"""

    def __init__(self):
        self.keywords = {
            'python': ['def', 'class', 'import', 'from', 'if', 'else', 'elif', 'for', 'while', 
                      'try', 'except', 'return', 'yield', 'async', 'await', 'lambda', 'with'],
            'general': ['function', 'var', 'let', 'const', 'if', 'else', 'for', 'while', 
                       'return', 'class', 'import', 'export']
        }

    def extract_features(self, code: str) -> list:
        """
        Extract comprehensive features from code
        
        Args:
            code: Code string
            
        Returns:
            List of feature values
        """
        if not code:
            return [0.0] * 20

        features = []

        # Basic statistics
        features.append(len(code))  # Total length
        features.append(len(code.split()))  # Word count
        features.append(len(code.split('\n')))  # Line count
        features.append(len([c for c in code if c.isupper()]))  # Uppercase count
        features.append(len([c for c in code if c.islower()]))  # Lowercase count
        features.append(len([c for c in code if c.isdigit()]))  # Digit count
        features.append(len([c for c in code if c in '(){}[]']))  # Bracket count

        # Complexity features
        features.append(self._count_functions(code))
        features.append(self._count_classes(code))
        features.append(self._count_imports(code))
        features.append(self._count_comments(code))
        features.append(self._avg_line_length(code))
        features.append(self._max_line_length(code))
        features.append(self._indentation_depth(code))

        # Pattern features
        features.append(self._count_strings(code))
        features.append(self._count_numbers(code))
        features.append(self._count_operators(code))
        features.append(self._keyword_density(code))
        features.append(self._entropy(code))
        features.append(self._comment_ratio(code))

        return features

    def _count_functions(self, code: str) -> int:
        """Count function definitions"""
        return len(re.findall(r'\bdef\s+\w+|function\s+\w+', code))

    def _count_classes(self, code: str) -> int:
        """Count class definitions"""
        return len(re.findall(r'\bclass\s+\w+', code))

    def _count_imports(self, code: str) -> int:
        """Count import statements"""
        return len(re.findall(r'\bimport\s+|from\s+\w+\s+import', code))

    def _count_comments(self, code: str) -> int:
        """Count comment lines"""
        lines = code.split('\n')
        return sum(1 for line in lines if line.strip().startswith('#') or '//' in line)

    def _avg_line_length(self, code: str) -> float:
        """Calculate average line length"""
        lines = [line for line in code.split('\n') if line.strip()]
        return sum(len(line) for line in lines) / len(lines) if lines else 0.0

    def _max_line_length(self, code: str) -> int:
        """Get maximum line length"""
        lines = code.split('\n')
        return max(len(line) for line in lines) if lines else 0

    def _indentation_depth(self, code: str) -> float:
        """Calculate average indentation depth"""
        lines = [line for line in code.split('\n') if line.strip()]
        if not lines:
            return 0.0
        
        depths = []
        for line in lines:
            depth = 0
            for char in line:
                if char == ' ':
                    depth += 1
                elif char == '\t':
                    depth += 4
                else:
                    break
            depths.append(depth)
        
        return sum(depths) / len(depths) if depths else 0.0

    def _count_strings(self, code: str) -> int:
        """Count string literals"""
        return len(re.findall(r'["\']([^"\']*)["\']', code))

    def _count_numbers(self, code: str) -> int:
        """Count numeric literals"""
        return len(re.findall(r'\b\d+\.?\d*\b', code))

    def _count_operators(self, code: str) -> int:
        """Count operators"""
        operators = ['+', '-', '*', '/', '=', '==', '!=', '<', '>', '<=', '>=', '&&', '||']
        return sum(code.count(op) for op in operators)

    def _keyword_density(self, code: str) -> float:
        """Calculate keyword density"""
        all_keywords = self.keywords['python'] + self.keywords['general']
        words = code.split()
        if not words:
            return 0.0
        keyword_count = sum(1 for word in words if word in all_keywords)
        return keyword_count / len(words) if words else 0.0

    def _entropy(self, code: str) -> float:
        """Calculate Shannon entropy"""
        if not code:
            return 0.0
        
        char_counts = {}
        for char in code:
            char_counts[char] = char_counts.get(char, 0) + 1
        
        entropy = 0.0
        length = len(code)
        for count in char_counts.values():
            probability = count / length
            if probability > 0:
                entropy -= probability * math.log2(probability)
        
        return entropy

    def _comment_ratio(self, code: str) -> float:
        """Calculate comment to code ratio"""
        lines = code.split('\n')
        if not lines:
            return 0.0
        
        comment_lines = sum(1 for line in lines if line.strip().startswith('#') or '//' in line)
        return comment_lines / len(lines) if lines else 0.0

