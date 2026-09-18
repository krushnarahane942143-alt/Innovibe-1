# SmartTour frontend contract

The frontend uses local mock data when `VITE_API_BASE_URL` is empty. To connect a backend, copy `.env.example` to `.env`, set the API base URL, and implement these endpoints:

| Method | Endpoint | Request | Response |
| --- | --- | --- | --- |
| GET | `/destinations` | None | Destination array |
| POST | `/recommend` | Preferences object | Ranked destination array |
| GET | `/crowd/:destinationId` | None | `{ "destinationId": "lonavala", "status": "HIGH" }` |
| GET | `/alternatives/:destinationId` | None | `{ "destinationId": "lonavala", "alternative": Destination }` |
| POST | `/generate-itinerary` | Preferences plus optional `destinationId` | Itinerary object |
| GET | `/businesses` | None | Business array |

## Stable request fields

```json
{
  "destination": "Maharashtra",
  "days": 3,
  "budget": 15000,
  "travelers": 4,
  "travelType": "Family",
  "interests": ["Nature", "History"],
  "season": "Winter"
}
```

Use numbers, not currency-formatted strings, for `days`, `budget`, `travelers`, `rating`, `estimatedCost`, and itinerary costs. The frontend formats currency for display.

## Stable response fields

Destinations use `id`, `name`, `state`, `image`, `description`, `category`, `interests`, `estimatedCost`, `crowd`, `matchScore`, `bestTime`, `distance`, `attractions`, `tags`, and `alternative`. Crowd must be `LOW`, `MEDIUM`, or `HIGH`.

Businesses use `id`, `name`, `category`, `rating`, `priceRange`, `location`, `image`, and `description`. Categories are `Hotel`, `Restaurant`, `Local Guide`, `Homestay`, and `Local Experience`.

Itineraries use `destination`, `summary` with `accommodation`, `food`, `transport`, `activities`, and `total`, plus `days[]` with `day`, `time`, `activity`, `cost`, and `location`.

The frontend normalizes backend responses in `src/services/dataContract.js`, so small type differences such as numeric strings are tolerated, but field names should remain stable.