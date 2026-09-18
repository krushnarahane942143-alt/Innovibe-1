import csv
import json

def csv_to_json(csv_path, json_path):
    destinations = []
    with open(csv_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            destinations.append({
                "name": row["name"].strip(),
                "city": row["city"].strip(),
                "tags": [t.strip() for t in row["tags"].split("|") if t.strip()],
                "rating": float(row["rating"]),
                "crowd_pattern": row["crowd_pattern"].strip(),
            })

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(destinations, f, indent=2)

    print(f"Converted {len(destinations)} destinations → {json_path}")

if __name__ == "__main__":
    csv_to_json("Smart_Tourism_Dataset_300_Locations.csv", "Smart_Tourism_Dataset_300_Locations.json")