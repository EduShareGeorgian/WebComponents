import { SPHttpClient } from '@microsoft/sp-http';

export interface IAcademicDashboardAppsProps {
  description: string;
  siteurl:string;
  spHttpClient:SPHttpClient;
}
