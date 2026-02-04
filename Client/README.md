# CarbonCompass - Sustainable Location Finder

A sustainability platform that helps businesses find environmentally optimal locations using **3D realistic mapping**, green scoring, and AI explanations.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- **No API keys required!** (Uses free MapLibre GL)

### 1. Install & Run

```bash
# Backend
cd server
npm install
npm start
# Server: http://localhost:5000

# Frontend (new terminal)
cd client
npm install
npm run dev
# Client: http://localhost:3000
```

## 🎯 Features

### ✅ Implemented

- **3D Realistic Mapping**: MapLibre GL with terrain, fog, and atmospheric effects
- **Server-Side Intelligence**: All scoring computed on backend
- **Green Scoring Engine**: Proximity-based environmental scoring (0-100)
- **Smart Recommendations**: Top 20 locations ranked by sustainability
- **Business Type Filtering**: 5 business categories with custom weights
- **Building Details Modal**: Comprehensive location analysis
- **Impact Simulation**: Carbon reduction projections
- **Eco Spirit Chat**: AI-powered sustainability explanations

### 🗺️ Realistic 3D Features

- **Terrain elevation** with 1.5x exaggeration
- **Atmospheric sky** with dynamic sun position
- **Depth fog** for realistic distance perception
- **Realistic building materials** with varied colors
- **Vertical gradients** for proper lighting
- **Cinematic camera** movements
- **Smooth animations** with easing curves

## 📊 Scoring Algorithm

**Green Score = Weighted Sum of:**

- Park Proximity (30-45%): Distance to nearest green space
- Transit Access (20-35%): Distance to public transit
- Road Access (10-25%): Connectivity to infrastructure
- Park Density (15-20%): Number of parks within 2km
- Transit Density (5-15%): Number of stops within 1km

**Business-Specific Weights:**

- Eco Café: Prioritizes park proximity (40%)
- Green Office: Prioritizes transit (35%)
- Wellness Center: Maximizes green space (45%)
- Sustainable Retail: Balanced approach
- Coworking Space: Transit + accessibility

## 🏗️ Architecture

**Backend (Server-Side Intelligence)**

```
server/src/
├── data/loaders/     # GeoJSON data loading
├── logic/            # Scoring algorithms
├── services/         # Business logic
├── controllers/      # API endpoints
└── routes/           # Route definitions
```

**Frontend (Rendering Only)**

```
client/
├── app/              # Next.js pages
├── features/         # UI components
└── lib/api/          # API client
```

## 📡 API Endpoints

```
POST /api/recommend              - Get scored recommendations
GET  /api/recommend/business-types - Available business types
POST /api/impact                 - Environmental impact
POST /api/chat                   - Chat responses
GET  /api/health                 - Health check
```

## 🎨 Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Mapping**: MapLibre GL (free, open-source)
- **Styling**: Tailwind CSS 4
- **Backend**: Node.js, Express
- **Data**: GeoJSON (OpenStreetMap)

## 🌍 Data Sources

All data from OpenStreetMap (Patiala, Punjab):

- Buildings: 1,247 locations
- Parks: 89 green spaces
- Transit: 12 bus stops
- Roads: Network visualization

## 🔧 Configuration

No configuration needed! MapLibre GL works out of the box without API keys.

## 🐛 Troubleshooting

**Map not loading?**

- Check that both servers are running
- MapLibre doesn't need tokens

**No recommendations?**

- Ensure backend is running on port 5000
- Check browser console for errors

## 📝 License

MIT - Built for hackathon demonstration

## 🙏 Credits

- Map data: OpenStreetMap contributors
- Mapping: MapLibre GL (open-source)
- Framework: Next.js team
