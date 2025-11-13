# Milo - Smart Last-Mile Delivery Route Optimization in AWS Cloud

A modern React + TypeScript frontend for the Milo route optimization application. This application integrates with AWS Lambda, Amazon Location Service, and API Gateway to provide intelligent route planning for last-mile delivery.

## Features

- 🎨 Modern, responsive UI built with React + TypeScript
- 🎯 TailwindCSS for styling
- 🚀 Vite for fast development and optimized builds
- 🗺️ Integration with Amazon Location Service
- 📊 Real-time route optimization
- 🌐 Beautiful landing page showcasing features
- 📱 Fully responsive design

## Prerequisites

- Node.js 18+ and npm
- Deployed AWS infrastructure (SAM template)

## Getting Started

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure AWS Resources

Update the AWS configuration in `src/config/aws-config.ts` with your deployed resources:

```typescript
export const awsConfig = {
  apiGatewayUrl: "YOUR_API_GATEWAY_URL",
  region: "YOUR_AWS_REGION",
  identityPoolId: "YOUR_IDENTITY_POOL_ID",
  mapName: "YOUR_MAP_NAME",
};
```

You can find these values in your CloudFormation stack outputs after deploying the SAM template.

Alternatively, create a `.env` file:

```bash
cp .env.example .env
```

Then edit `.env` with your actual values.

### 3. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

The optimized build will be in the `dist` folder.

### 5. Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── ui/           # Reusable UI components
│   ├── config/           # AWS and app configuration
│   ├── lib/              # Utility functions
│   ├── pages/            # Page components
│   │   ├── Index.tsx     # Landing page
│   │   └── Dashboard.tsx # Route optimization dashboard
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── index.html            # HTML template
└── package.json          # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Integration with AWS Backend

The frontend communicates with your AWS Lambda function through API Gateway:

1. **Route Optimization**: POST requests to the Lambda function with delivery coordinates
2. **Amazon Location Service**: Used for map visualization and geocoding
3. **Cognito**: Handles authentication (configured in AWS infrastructure)

### API Request Format

```typescript
{
  coordinates: number[][];        // Array of [lng, lat] pairs
  travel_mode: string;           // "Car" | "Truck" | "Walking"
  num_vehicles: number;          // 1-10
  max_route_length: number;      // Maximum route length in miles
  balance_route_length: number;  // 0-100 balance factor
  departure_time: string;        // ISO datetime string
}
```

## Deployment Options

### Option 1: AWS Amplify

1. Connect your Git repository to AWS Amplify
2. Set environment variables in Amplify Console
3. Deploy automatically on push

### Option 2: Amazon S3 + CloudFront

```bash
npm run build
aws s3 sync dist/ s3://your-bucket-name
```

### Option 3: Vercel/Netlify

These platforms auto-detect Vite projects and deploy with zero configuration.

## Customization

### Styling

- Modify `src/index.css` for global styles and CSS variables
- Edit `tailwind.config.js` for theme customization
- Component styles use TailwindCSS utility classes

### AWS Configuration

Update `src/config/aws-config.ts` or use environment variables prefixed with `VITE_`.

## Technology Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Lucide React** - Icon library

## License

Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: MIT-0

