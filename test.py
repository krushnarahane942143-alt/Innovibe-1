from collections import Counter
from crowd_prediction import destinations

city_counts = Counter(d["city"] for d in destinations)
print(city_counts.most_common(10))
