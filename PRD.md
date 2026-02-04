# Product Requirements Document (PRD)
## CarbonCompass – Sustainable Location Intelligence (Patiala Edition)

---

## 1. Product Overview

### Product Name
**CarbonCompass**

### Product Tagline
*See your business footprint before you leave it.*

### Product Description
CarbonCompass is a web-based decision-support platform that helps entrepreneurs in **Patiala, Punjab** identify environmentally sustainable locations for their businesses. The platform combines geospatial intelligence, transparent sustainability scoring, and AI-generated explanations to help founders balance **business viability and environmental responsibility** before committing to a location.

---

## 2. Problem Statement

Entrepreneurs in Indian cities typically select business locations based on rent, visibility, and foot traffic. Environmental impact is often ignored due to:

- Lack of accessible sustainability data
- Fragmented or non-existent municipal APIs
- Technical complexity of environmental metrics
- No city-level decision tools for Indian contexts

As a result, businesses unintentionally contribute to increased emissions, waste generation, traffic congestion, and inefficient resource usage.

---

## 3. Goals and Objectives

### Primary Goals (v1)
- Enable users to discover **2–3 sustainable locations** for a business idea in Patiala
- Provide a **transparent, explainable Green Score (0–100)** for each location
- Visualize sustainability insights on an **interactive map**
- Explain sustainability trade-offs using **AI-generated natural language reasoning**

### Secondary Goals
- Educate founders on sustainability concepts through visual and textual cues
- Create a foundation for future city-scale sustainability tools

---

## 4. Non-Goals (Explicitly Out of Scope)

- Real-time carbon emissions tracking
- Exact or legally binding environmental compliance checks
- LiDAR, thermal imaging, or infrared analysis
- Multi-city or nationwide support
- Regulatory enforcement or certification

---

## 5. Target Users

### Primary Users
- Small business owners (cafés, retail stores, offices)
- Early-stage entrepreneurs
- Local startups operating in Patiala

### Secondary Users (Future)
- Urban planners
- Sustainability researchers
- Municipal and civic bodies

---

## 6. User Experience & Flow

### Primary User Flow
1. User opens CarbonCompass
2. User enters a short business description (e.g., “eco café”)
3. System analyzes Patiala’s geospatial and proxy environmental data
4. Recommended locations are highlighted on the map
5. User clicks a location to view:
   - Green Score and factor breakdown
   - Sustainability insights
   - AI-generated explanation
6. User compares locations and makes an informed decision

---

## 7. Core Features

### 7.1 Interactive Map
- Built using Mapbox GL JS
- Displays Patiala city boundary
- Shows buildings or zones as markers or polygons
- Color-coded by sustainability score:
  - Green: Recommended
  - Red: Less sustainable
- Supports zoom, pan, and click interactions

---

### 7.2 Green Score System

A deterministic, transparent sustainability score ranging from **0 to 100**.

#### Scoring Factors (Proxy-Based)
- **Walkability:** Road density, pedestrian-friendly areas
- **Transit Access:** Bus stop proximity, major roads
- **Green Cover:** Distance to parks and open spaces
- **Commercial Density:** Waste generation proxy
- **Land Use / Zoning:** Residential vs mixed-use vs commercial

Each factor is normalized and weighted to ensure interpretability.

> Note: All scores are estimates based on proxy data, not exact measurements.

---

### 7.3 AI Explanation Layer

AI is used strictly for **interpretation and explanation**, not for decision-making.

AI Responsibilities:
- Interpret business intent
- Explain why certain locations were recommended
- Summarize sustainability trade-offs in simple language

AI Limitations:
- Does not compute scores
- Does not rank locations independently
- Does not generate exact emissions figures

---

### 7.4 Location Detail Panel
For each recommended location:
- Green Score and breakdown
- Sustainability highlights
- Business viability indicators (qualitative)
- Clear disclaimer on data assumptions

---

## 8. Data Sources & Handling

### Data Sources
- **OpenStreetMap (OSM)**
  - Buildings
  - Roads
  - Parks and green areas
  - Bus stops
  - Commercial POIs

### Data Format
- GeoJSON (standardized)

### Data Processing
- Offline preprocessing using Node.js scripts
- Normalization of OSM properties
- Proxy metric computation
- Precomputed or on-request scoring

---

## 9. Technical Architecture

### Frontend
- Next.js (App Router)
- TypeScript
- TailwindCSS
- Mapbox GL JS

### Backend
- Cloudflare Workers (serverless REST APIs)

### Storage
- Cloudflare D1 (session data, chat memory)
- Cloudflare R2 (GeoJSON datasets, processed data)

### AI
- Gemini / OpenAI / Llama
- Prompt-engineered explanation generation only

---

## 10. System Components

### Frontend Components
- MapView
- Chat input
- Location popup
- Green Score breakdown UI

### Backend Services
- Recommendation service
- Scoring service
- AI explanation service

### Data Pipeline
1. Fetch raw OSM data
2. Normalize and clean data
3. Compute proxy metrics
4. Calculate Green Score
5. Serve data via APIs

---

## 11. Transparency & Ethics

CarbonCompass prioritizes transparency:
- All sustainability scores are proxy-based estimates
- Data limitations are clearly disclosed
- The product supports decisions but does not enforce policy

This ensures credibility and responsible usage.

---

## 12. Success Metrics

### Product Metrics
- Users can identify sustainable locations in under 2 minutes
- Clear differentiation between recommended and non-recommended areas
- High clarity and comprehension of AI explanations

### Technical Metrics
- Smooth map performance
- Consistent and reproducible scores
- Stable API response times

---

## 13. Risks & Mitigations

| Risk | Mitigation |
|----|----|
| Incomplete city data | Use proxy indicators |
| AI hallucinations | Limit AI to explanations only |
| User overtrust | Clear disclaimers and transparency |
| Performance issues | Precompute scores |

---

## 14. Future Roadmap

- Multi-city expansion
- Ward-level sustainability benchmarking
- ML-based score optimization
- Exportable Sustainability Briefs
- Integration with municipal datasets
- Advanced 3D visualization

---

## 15. Key Takeaway

CarbonCompass is not a dashboard or analytics tool.  
It is a **decision-support product** designed to help founders answer:

> *Where should I open my business so it succeeds without harming the environment?*

---

*End of PRD*
