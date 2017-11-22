import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'AdmissionsOfficerWebPartStrings';
import AdmissionsOfficer from './components/AdmissionsOfficer';
import { IAdmissionsOfficerProps } from './components/IAdmissionsOfficerProps';
import { IAdmissionsOfficerWebPartProps } from './IAdmissionsOfficerWebPartProps';

export default class AdmissionsOfficerWebPart extends BaseClientSideWebPart<IAdmissionsOfficerWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IAdmissionsOfficerProps > = React.createElement(
      AdmissionsOfficer,
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
