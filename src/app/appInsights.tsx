import { ApplicationInsights } from "@microsoft/applicationinsights-web";

const appInsights = new ApplicationInsights({
  config: {
    connectionString: process.env.NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING, // Use the connection string from Azure Application Insights
    enableAutoRouteTracking: true, // Automatically track page views
  },
});

appInsights.loadAppInsights();

export default appInsights;
