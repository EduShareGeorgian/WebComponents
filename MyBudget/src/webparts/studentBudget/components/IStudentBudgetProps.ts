import { SPHttpClient } from '@microsoft/sp-http';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  IWebPartContext
} from '@microsoft/sp-webpart-base';



export interface IStudentBudgetProps {
  description: string;
  spHttpClient: SPHttpClient;
  siteUrl: string;
  context: IWebPartContext
}
