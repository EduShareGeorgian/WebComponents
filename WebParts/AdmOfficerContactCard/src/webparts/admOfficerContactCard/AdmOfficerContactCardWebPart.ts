import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'AdmOfficerContactCardWebPartStrings';
import AdmOfficerContactCard from './components/AdmOfficerContactCard';
import { IAdmOfficerContactCardProps } from './components/IAdmOfficerContactCardProps';
import { IAdmOfficerContactCardWebPartProps } from './IAdmOfficerContactCardWebPartProps';

export default class AdmOfficerContactCardWebPart extends BaseClientSideWebPart<IAdmOfficerContactCardWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IAdmOfficerContactCardProps > = React.createElement(
      AdmOfficerContactCard,
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
