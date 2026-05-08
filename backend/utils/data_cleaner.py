"""
Data Cleaning Module - User Story 1
Cleans and preprocesses code data for model training and prediction
"""
import re
import string


class DataCleaner:
    """Handles data cleaning and preprocessing"""

    def __init__(self):
        self.patterns_to_remove = [
            (r'#.*', ''),  # Remove comments
            (r'""".*?"""', '', re.DOTALL),  # Remove docstrings
            (r"'''.*?'''", '', re.DOTALL),  # Remove docstrings
            (r'\s+', ' '),  # Normalize whitespace
        ]

    def clean_code(self, code: str) -> str:
        """
        Clean code by removing comments, docstrings, and normalizing whitespace
        
        Args:
            code: Raw code string
            
        Returns:
            Cleaned code string
        """
        if not code or not isinstance(code, str):
            return ""

        cleaned = code.strip()

        # Remove docstrings
        cleaned = re.sub(r'""".*?"""', '', cleaned, flags=re.DOTALL)
        cleaned = re.sub(r"'''.*?'''", '', cleaned, flags=re.DOTALL)

        # Remove single-line comments (but preserve strings)
        lines = cleaned.split('\n')
        cleaned_lines = []
        for line in lines:
            # Simple heuristic: if # is not in a string, remove comment
            if '#' in line:
                in_string = False
                quote_char = None
                new_line = ''
                i = 0
                while i < len(line):
                    char = line[i]
                    if char in ['"', "'"] and (i == 0 or line[i-1] != '\\'):
                        if not in_string:
                            in_string = True
                            quote_char = char
                        elif char == quote_char:
                            in_string = False
                            quote_char = None
                        new_line += char
                    elif char == '#' and not in_string:
                        break
                    else:
                        new_line += char
                    i += 1
                cleaned_lines.append(new_line)
            else:
                cleaned_lines.append(line)

        cleaned = '\n'.join(cleaned_lines)

        # Normalize whitespace (keep newlines for structure)
        cleaned = re.sub(r'[ \t]+', ' ', cleaned)  # Multiple spaces/tabs to single space
        cleaned = re.sub(r'\n\s*\n', '\n', cleaned)  # Multiple newlines to single

        # Remove leading/trailing whitespace from each line
        cleaned = '\n'.join(line.strip() for line in cleaned.split('\n'))

        return cleaned.strip()

    def clean_for_analysis(self, code: str) -> str:
        """
        Prepare code for feature extraction while preserving structural signals.

        Unlike clean_code, this keeps indentation, comments, and docstrings because
        those are useful signals for the ML feature extractor.
        """
        if not code or not isinstance(code, str):
            return ""

        normalized = code.replace('\r\n', '\n').replace('\r', '\n').strip('\n')
        lines = [line.rstrip() for line in normalized.split('\n')]
        normalized = '\n'.join(lines)

        # Collapse very long blank runs without destroying normal spacing.
        normalized = re.sub(r'\n{4,}', '\n\n\n', normalized)
        return normalized.strip()

    def clean_for_training(self, code: str) -> str:
        """
        More aggressive cleaning for training data
        
        Args:
            code: Raw code string
            
        Returns:
            Heavily cleaned code string
        """
        cleaned = self.clean_code(code)
        
        # Remove extra blank lines
        cleaned = re.sub(r'\n{3,}', '\n\n', cleaned)
        
        return cleaned

    def validate_code(self, code: str) -> bool:
        """
        Validate if code is acceptable for analysis
        
        Args:
            code: Code string to validate
            
        Returns:
            True if valid, False otherwise
        """
        if not code or not isinstance(code, str) or len(code.strip()) < 10:
            return False
        
        # Check for minimum code-like content
        stripped = code.strip()
        code_symbols = ['=', '(', ')', '{', '}', '[', ']', ':', ';', '<', '>']
        code_keywords = (
            'def', 'class', 'import', 'from', 'return', 'function', 'const',
            'let', 'var', 'for', 'while', 'if', 'else', 'try', 'catch'
        )

        has_symbol = any(symbol in stripped for symbol in code_symbols)
        has_keyword = re.search(r'\b(' + '|'.join(code_keywords) + r')\b', stripped) is not None

        if not (has_symbol or has_keyword):
            return False
        
        return True

