import json
import os

class DataLoader:
    def __init__(self, data_dir="app/data"):
        self.data_dir = data_dir

    def _load_json(self, filename):
        path = os.path.join(self.data_dir, filename)
        try:
            with open(path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"Error: File not found at {path}")
            return []
        except json.JSONDecodeError:
            print(f"Error: Failed to decode JSON from {path}")
            return []

    def get_destinations(self):
        return self._load_json("destinations.json")

    def get_businesses(self):
        return self._load_json("businesses.json")

    def get_itineraries(self):
        return self._load_json("itineraries.json")

if __name__ == "__main__":
    # Simple test to verify loading
    loader = DataLoader()
    print("Destinations:", len(loader.get_destinations()))
    print("Businesses:", len(loader.get_businesses()))
    print("Itineraries:", len(loader.get_itineraries()))

data_loader = DataLoader()
