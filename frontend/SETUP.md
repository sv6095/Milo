# Quick Setup Guide for Milo Frontend

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🗺️ Map Features Fixed

✅ **Interactive Map**: Click anywhere on the map to add delivery locations
✅ **Visual Markers**: Blue depot marker (D) and red delivery markers (numbered)
✅ **Route Visualization**: Optimized routes displayed with different colors per vehicle
✅ **Real-time Updates**: Map updates when you add/remove locations or optimize routes

## 🎯 How to Use

1. **Landing Page**: Visit `/` to see the beautiful Milo landing page
2. **Dashboard**: Click "Get Started" or visit `/dashboard` to access the route optimization tool
3. **Add Locations**: 
   - Click "Add Sample Locations" for quick testing
   - Or click directly on the map to add custom locations
4. **Configure Settings**: Adjust travel mode, fleet size, route length, etc.
5. **Optimize Routes**: Click "Optimize Routes" to get AI-powered route planning
6. **View Results**: See optimized routes on the map and statistics in the sidebar

## 🔧 Configuration

Update `src/config/aws-config.ts` with your AWS resources:
- API Gateway URL
- AWS Region  
- Identity Pool ID
- Map Name

## 📦 Build for Production

```bash
npm run build
```

The optimized build will be in the `dist` folder.

## 🎨 Features

- **Modern UI**: Built with React + TypeScript + TailwindCSS
- **Responsive Design**: Works on desktop and mobile
- **Interactive Map**: MapLibre GL with OpenStreetMap tiles
- **Route Optimization**: Integrates with your AWS Lambda backend
- **Real-time Updates**: Live map updates and route visualization

## 🚨 Troubleshooting

If the map doesn't load:
1. Check browser console for errors
2. Ensure MapLibre GL CSS is loaded
3. Verify internet connection for map tiles
4. Check that all dependencies are installed

The map now uses OpenStreetMap tiles for development, which should work without AWS authentication.
