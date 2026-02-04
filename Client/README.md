# CarbonCompass - Sustainable Location Finder

A hackathon-grade sustainability platform that helps businesses find environmentally optimal locations using 3D mapping, green scoring, and AI explanations.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Mapbox account (free tier works)

### 1. Get Mapbox Token

1. Sign up at [mapbox.com](https://account.mapbox.com/)
2. Copy your default public token
3. Create `client/.env.local`:

```env
NEXT_PUBLIC_MAPBOX_TOKEN=your_token_here
```

### 2. Install & Run

```bash
# Install dependencies
cd client
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🎯 Features

### ✅ Implemented

- **3D Mapbox Integration**: Interactive 3D city view with building extrusions
- **GeoJSON Layers**: Parks (green), bus stops (blue), buildings (scored)
- **Green Scoring Engine**: Proximity-based environmental scoring (0-100)
- **Smart Recommendations**: Top 20 locations ranked by sustainability
- **Business Type Filtering**: 5 business categories with custom weights
- **Building Details Modal**: Comprehensive location analysis
- **Impact Simulation**: Carbon reduction and wellbeing projections
- **Eco Spirit Chat**: AI-powered sustainability explanations

### 📊 Scoring Algorithm

**Green Score = Weighted Sum of:**

- Park Proximity (30%): Distance to nearest green space
- Transit Access (25%): Distance to public transit
- Road Access (15%): Connectivity to infrastructure
- Park Density (20%): Number of parks within 2km
- Transit Density (10%): Number of stops within 1km

**Business-Specific Weights:**

- Eco Café: Prioritizes park proximity (40%)
- Green Office: Prioritizes transit (35%)
- Wellness Center: Maximizes green space (45%)
- Sustainable Retail: Balanced approach
- Coworking Space: Transit + accessibility

## 🗂️ Project Structure

```
client/
├── app/
│   ├── layout.tsx          # Global layout
│   └── page.tsx            # Main application
├── features/
│   ├── map/                # 3D Mapbox components
│   ├── business-select/    # Business type selector
│   ├── recommendations/    # Ranked location list
│   ├── building-details/   # Modal with tabs
│   ├── impact/             # Environmental impact
│   ├── chat/               # AI chat interface
│   └── ui/                 # Shared components
├── lib/
│   ├── geo/                # Distance & proximity
│   ├── scoring/            # Green score engine
│   ├── ai/                 # Explanation generation
│   ├── api/                # API client
│   └── types/              # TypeScript types
└── public/data/            # GeoJSON datasets
```

## 🧪 How It Works

1. **Data Loading**: GeoJSON files loaded from `/public/data/`
2. **Proximity Calculation**: Haversine formula for distances
3. **Score Normalization**: Exponential decay for distance metrics
4. **Weighted Scoring**: Business-type-specific weights applied
5. **Ranking**: Top 20 locations sorted by green score
6. **Visualization**: Markers color-coded by tier (Excellent/Good/Fair/Low)
7. **Explanation**: Human-readable insights generated

## 📦 Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Mapping**: Mapbox GL JS 3.1
- **Styling**: Tailwind CSS 4
- **Data**: GeoJSON (OSM format)

## 🎨 UI Flow

1. Select business type → Filters compatible buildings
2. Map shows scored locations → Color-coded markers
3. Click marker/card → Opens building modal
4. View details → Green score breakdown, impact metrics
5. Ask questions → Chat explains recommendations

## 📍 Data Sources

All data from OpenStreetMap (Patiala, Punjab):

- `patiala_buildings.geojson`: ~50 buildings
- `patiala_parks.geojson`: Green spaces and farmland
- `patiala_bus_stops.geojson`: Public transit stops
- `patiala_roads.geojson`: Road network (visualization only)

## 🔧 Configuration

### Mapbox Settings

Edit `features/map/map.config.ts`:

```typescript
export const MAPBOX_CONFIG = {
  center: [76.3869, 30.3398], // Patiala coordinates
  zoom: 13,
  style: "mapbox://styles/mapbox/light-v11",
};
```

### Scoring Weights

Edit `lib/scoring/weights.ts`:

```typescript
export const SCORING_WEIGHTS = {
  parkProximity: 0.3,
  transitProximity: 0.25,
  // ...
};
```

## 🐛 Troubleshooting

**Map not loading?**

- Check Mapbox token in `.env.local`
- Ensure token has proper scopes

**No recommendations?**

- GeoJSON files must be in `public/data/`
- Check browser console for errors

**Scoring seems off?**

- Adjust weights in `lib/scoring/weights.ts`
- Modify normalization in `lib/scoring/normalize.ts`

## 📝 License

MIT - Built for hackathon demonstration

## 🙏 Credits

- Map data: OpenStreetMap contributors
- Mapping: Mapbox GL JS
- Framework: Next.js team
