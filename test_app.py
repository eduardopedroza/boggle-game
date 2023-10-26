
from unittest import TestCase
from app import app
from flask import session

class FlaskTestCase(TestCase):

    def test_index_route(self):
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Enter your guess:', response.data) 

    def test_check_word_route(self):
        with app.test_request_context('/?name=Peter'):
            response = self.app.get('/check-word', query_string={'word': 'TEST'})
            self.assertEqual(response.status_code, 200)
            self.assertIn(b'"result":', response.data)
    
    def test_update_score_route(self):
        response = self.app.post('/update-score', json={'score': 5})
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'"status": "success"', response.data)
        
    def test_get_new_board_route(self):
        response = self.app.get('/get-new-board')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'"board":', response.data)



