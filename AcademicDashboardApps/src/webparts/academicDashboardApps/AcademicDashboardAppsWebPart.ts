import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'AcademicDashboardAppsWebPartStrings';
import AcademicDashboardApps from './components/AcademicDashboardApps';
import { IAcademicDashboardAppsProps } from './components/IAcademicDashboardAppsProps';
import { IAcademicDashboardAppsWebPartProps } from './IAcademicDashboardAppsWebPartProps';

export default class AcademicDashboardAppsWebPart extends BaseClientSideWebPart<IAcademicDashboardAppsWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IAcademicDashboardAppsProps > = React.createElement(
      AcademicDashboardApps,
      {
        description: this.properties.description,
        siteurl:this.context.pageContext.web.absoluteUrl,
        spHttpClient:this.context.spHttpClient,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
