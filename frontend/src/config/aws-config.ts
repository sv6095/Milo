// AWS Configuration - Update these values after deploying your SAM template
// You can find these values in the CloudFormation stack outputs

export const awsConfig = {
  // Using the same API Gateway URL as the original HTML file
  apiGatewayUrl: "https://fs7n3lrcf8.execute-api.us-east-1.amazonaws.com/Prod/",
  
  // Update these with your AWS Location Service resources
  region: "us-east-1",
  identityPoolId: "us-east-1:9085b87b-5654-41eb-b0af-7f4fd77ebd70",
  mapName: "Map",
  placeIndexName: "placeindex",
  routeCalculatorName: "routecalculator",
};

// Helper to update config from environment variables if available
export const getApiUrl = () => {
  return import.meta.env.VITE_API_GATEWAY_URL || awsConfig.apiGatewayUrl;
};

export const getAwsRegion = () => {
  return import.meta.env.VITE_AWS_REGION || awsConfig.region;
};

export const getIdentityPoolId = () => {
  return import.meta.env.VITE_IDENTITY_POOL_ID || awsConfig.identityPoolId;
};

export const getMapName = () => {
  return import.meta.env.VITE_MAP_NAME || awsConfig.mapName;
};

