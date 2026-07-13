import os
import tempfile
import unittest
from datetime import date, timedelta

from fastapi.testclient import TestClient
import main


class ReservationTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        main.DB_FILE = os.path.join(self.temp.name, "test.db")
        main.init_db()
        self.client = TestClient(main.app)
        self.valid = {"name": "林风", "phone": "138-0000-0000", "date": date.today().isoformat(), "time": "14:00", "guests": 2, "notes": "靠窗"}

    def tearDown(self):
        self.temp.cleanup()

    def test_valid_reservation(self):
        response = self.client.post("/api/reservations", json=self.valid)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "success")

    def test_invalid_inputs_return_422(self):
        cases = [
            {"name": "   "}, {"phone": "12"},
            {"date": (date.today() - timedelta(days=1)).isoformat()},
            {"time": "10:59"}, {"time": "18:31"}, {"guests": 0}, {"guests": 21},
        ]
        for change in cases:
            with self.subTest(change=change):
                response = self.client.post("/api/reservations", json={**self.valid, **change})
                self.assertEqual(response.status_code, 422)


if __name__ == "__main__":
    unittest.main(verbosity=2)
