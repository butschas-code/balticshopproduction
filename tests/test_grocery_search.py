"""Logic tests for grocery search: detector, classifier, and search behavior.

Run: python -m pytest tests/test_grocery_search.py -v
"""

from __future__ import annotations

import unittest

from app.services.product_type_detector import detect_product_type
from app.services.product_classifier import detect_product_type_from_title


class TestProductTypeDetector(unittest.TestCase):
    def test_milk(self):
        self.assertEqual(detect_product_type("milk"), "milk")
        self.assertEqual(detect_product_type("Milk"), "milk")
        self.assertEqual(detect_product_type("piens"), "milk")

    def test_avocado(self):
        self.assertEqual(detect_product_type("avocado"), "avocado")
        self.assertEqual(detect_product_type("avokado"), "avocado")

    def test_yogurt(self):
        self.assertEqual(detect_product_type("jogurts"), "yogurt")

    def test_dish_soap(self):
        self.assertEqual(detect_product_type("dish soap"), "dish_soap")
        self.assertEqual(detect_product_type("trauku"), "dish_soap")

    def test_coffee(self):
        self.assertEqual(detect_product_type("coffee"), "coffee")
        self.assertEqual(detect_product_type("kafija"), "coffee")

    def test_unknown_returns_none(self):
        self.assertIsNone(detect_product_type("xyz random"))
        self.assertIsNone(detect_product_type(""))


class TestProductClassifier(unittest.TestCase):
    def test_milk_titles(self):
        self.assertEqual(detect_product_type_from_title("Piens 2.5% 1L"), "milk")
        self.assertEqual(detect_product_type_from_title("Milk UHT 1L"), "milk")

    def test_yogurt_titles(self):
        self.assertEqual(detect_product_type_from_title("Jogurts vaniļas"), "yogurt")
        self.assertEqual(detect_product_type_from_title("Jogurts 400g"), "yogurt")

    def test_avocado_real_fruit(self):
        self.assertEqual(detect_product_type_from_title("Avokado 1kg"), "avocado")
        self.assertEqual(detect_product_type_from_title("Avocado hass"), "avocado")

    def test_milk_must_not_include_chocolate_milk(self):
        """Milk search MUST NOT return chocolate milk."""
        self.assertNotEqual(detect_product_type_from_title("Šokolādes piens 1L"), "milk")
        self.assertNotEqual(detect_product_type_from_title("Chocolate milk"), "milk")

    def test_avocado_must_show_real_avocados_first(self):
        """Avocado oil/salsa must not classify as avocado fruit."""
        self.assertEqual(detect_product_type_from_title("Avokado 2 gab"), "avocado")
        self.assertNotEqual(detect_product_type_from_title("Avocado oil 250ml"), "avocado")
        self.assertNotEqual(detect_product_type_from_title("Avocado salsa"), "avocado")

    def test_dish_soap(self):
        self.assertEqual(detect_product_type_from_title("Trauku mazgāšanas līdzeklis"), "dish_soap")
        self.assertEqual(detect_product_type_from_title("Dish soap Fairy"), "dish_soap")

    def test_coffee(self):
        self.assertEqual(detect_product_type_from_title("Kafija melna"), "coffee")
        self.assertEqual(detect_product_type_from_title("Coffee beans 250g"), "coffee")


if __name__ == "__main__":
    unittest.main()
