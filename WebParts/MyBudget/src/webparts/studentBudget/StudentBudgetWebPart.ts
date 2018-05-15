import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'studentBudgetStrings';
import StudentBudget from './components/StudentBudget';
import { IStudentBudgetProps } from './components/IStudentBudgetProps';
import { IStudentBudgetWebPartProps } from './IStudentBudgetWebPartProps';

export default class StudentBudgetWebPart extends BaseClientSideWebPart<IStudentBudgetWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IStudentBudgetProps > = React.createElement(
      StudentBudget,
      {
        description: this.properties.description,
        spHttpClient: this.context.spHttpClient,
        siteUrl: this.context.pageContext.web.absoluteUrl,
          context: this.context
    //    listName: this.properties.listName
      }
    );

  //  this.domElement.attributes
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
