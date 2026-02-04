# CarbonCompass Backend

Production-grade Node.js backend for CarbonCompass - an AI-powered sustainability platform that recommends eco-friendly business locations in Patiala, Punjab.

## Features

- **Location Recommendations**: Get ranked sustainable location recommendations based on business type
- **Green Score Calculation**: Weighted environmental sustainability scoring (0-1 scale)
- **Business Fit Analysis**: Match locations to specific business requirements
- **Environmental Impact**: Calculate carbon reduction and transit usage improvements
- **AI Explanations**: Human-readable explanations for all recommendations
- **Chat Interface**: Conversational API for sustainability questions

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: JavaScript (ES6+)
- **Data**: GeoJSON + in-memory processing
- **Architecture**: Clean separation of concerns (Logic → Services → Controllers → Routes)

## Project Structure

```
server/
├── src/
│   ├── logic/              # Pure business logic functions
│   ├── data/loaders/       # GeoJSON data loaders
│   ├── services/           # Orchestration layer
│   ├── controllers/        # Request handlers
│   ├── routes/             # API route definitions
│   ├── middlewares/        # Express middlewares
│   ├── utils/              # Utilities (distance, logging, errors)
│   ├── config/             # Configuration files
│   ├── app.js              # Express app setup
│   └── index.js            # Server entry point
├── package.json
├── .env
└── README.md
```

## Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev

# Start production server
npm start
```

## Environment Variables

```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
API_PREFIX=/api
LOG_LEVEL=info
```

## API Endpoints

### Health Check

- `GET /api/health` - Basic health check
- `GET /api/health/detailed` - Detailed system status

### Recommendations

- `POST /api/recommend` - Get location recommendations
- `POST /api/recommend/score` - Score a specific location
- `GET /api/recommend/business-types` - List available business types

### Impact

- `POST /api/impact` - Calculate environmental impact
- `POST /api/impact/compare` - Compare two locations

### Chat

- `POST /api/chat` - Ask sustainability questions
- `GET /api/chat/suggestions` - Get suggested questions

## API Examples

### Get Recommendations

```bash
POST /api/recommend
Content-Type: application/json

{
  "businessType": "eco_cafe",
  "limit": 10
}
```

**Response:**

```json
{
  "success": true,
  "businessType": "eco_cafe",
  "count": 10,
  "recommendations": [
    {
      "id": "B12",
      "lat": 30.3398,
      "lng": 76.3869,
      "greenScore": 0.87,
      "businessFitScore": 0.92,
      "rank": 1,
      "tier": "Excellent",
      "explanation": "This location has excellent sustainability (score: 87%). Excellent park access at just 120m away. Outstanding transit connectivity at 95m. Rich environmental amenities with 3 parks and 5 transit stops nearby. Highly suitable for your business type."
    }
  ]
}
```

### Calculate Impact

```bash
POST /api/impact
Content-Type: application/json

{
  "lat": 30.3398,
  "lng": 76.3869,
  "businessType": "eco_cafe"
}
```

**Response:**

```json
{
  "success": true,
  "location": {
    "lat": 30.3398,
    "lng": 76.3869
  },
  "impact": {
    "impactScore": 0.82,
    "carbonReduction": 35.2,
    "transitUsageIncrease": 65,
    "greenSpaceAccess": 85,
    "wellbeingScore": 88,
    "projections": {
      "monthly": {
        "carbonReduction": "35.2",
        "transitUsageIncrease": "65%"
      },
      "yearly": {
        "carbonReduction": "422.4",
        "equivalentTrees": 22
      }
    }
  }
}
```

## Business Types

- `eco_cafe` - Eco-Friendly Café
- `green_office` - Green Office Space
- `sustainable_retail` - Sustainable Retail Store
- `wellness_center` - Wellness Center
- `coworking_space` - Co-working Space

## Green Score Calculation

The green score (0-1) is calculated using weighted metrics:

- **Park Proximity** (35%): Distance to nearest park
- **Transit Access** (30%): Distance to nearest transit stop
- **Park Density** (20%): Number of parks within 2km
- **Transit Density** (15%): Number of transit stops within 1.5km

### Score Tiers

- **Excellent**: 0.8 - 1.0
- **Good**: 0.6 - 0.8
- **Fair**: 0.4 - 0.6
- **Poor**: 0.2 - 0.4
- **Very Poor**: 0.0 - 0.2

## Development

```bash
# Install dependencies
npm install

# Run in development mode with auto-reload
npm run dev

# Run tests (when implemented)
npm test
```

## Data Files

The backend requires GeoJSON files in `src/data/static/`:

- `patiala_buildings.geojson` - Commercial buildings
- `patiala_parks.geojson` - Parks and green spaces
- `patiala_bus_stops.geojson` - Public transit stops

## Error Handling

All errors return a consistent format:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

## Architecture Principles

1. **Pure Functions**: Logic layer has no side effects
2. **Separation of Concerns**: Clear boundaries between layers
3. **Testability**: All functions are unit-testable
4. **Scalability**: Designed to extend to other cities
5. **Production-Ready**: Error handling, logging, validation

## Future Enhancements

- Database integration (PostgreSQL + PostGIS)
- Real-time data updates
- Advanced AI explanations (OpenAI integration)
- User authentication
- Caching layer (Redis)
- Rate limiting
- API documentation (Swagger)

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
