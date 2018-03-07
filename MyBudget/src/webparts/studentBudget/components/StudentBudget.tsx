import * as React from 'react';
import styles from './StudentBudget.module.scss';
import { IStudentBudgetProps } from './IStudentBudgetProps';
import { escape } from '@microsoft/sp-lodash-subset';
import Slider from 'rc-slider';
import { MyBudget } from './Budget';
import { IListItem } from './IListItem';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';


const Range = Slider["Range"];

export default class StudentBudget extends React.Component<IStudentBudgetProps, any> {
 private listItemEntityTypeName: string = undefined;
  constructor(props) {
    super(props);   
    this.state = {
    status: ''
   
    };
  }
  

 private getListItemEntityTypeName(): Promise<string> {
    return new Promise<string>((resolve: (listItemEntityTypeName: string) => void, reject: (error: any) => void): void => {
      if (this.listItemEntityTypeName) {
        resolve(this.listItemEntityTypeName);
        return;
      }

      this.props.spHttpClient.get(`${this.props.siteUrl}/_api/web/lists/getbytitle('Tasks')?$select=ListItemEntityTypeFullName`,
        SPHttpClient.configurations.v1,
        {
          headers: {
            'Accept': 'application/json;odata=nometadata',
            'odata-version': ''
          }
        })
        .then((response: SPHttpClientResponse): Promise<{ ListItemEntityTypeFullName: string }> => {
          return response.json();
        }, (error: any): void => {
          reject(error);
        })
        .then((response: { ListItemEntityTypeFullName: string }): void => {
          this.listItemEntityTypeName = response.ListItemEntityTypeFullName;
          resolve(this.listItemEntityTypeName);
        });
    });
  }
   private createItem(): void {


    this.getListItemEntityTypeName()
      .then((listItemEntityTypeName: string): Promise<SPHttpClientResponse> => {

     
        const body: string = JSON.stringify({
          '__metadata': {
            'type': listItemEntityTypeName
          },
          'Title': `Item ${new Date()}`,
          'Budget': 'ok111'
        });
        return this.props.spHttpClient.post(`${this.props.siteUrl}/_api/web/lists/getbytitle('Tasks')/items`,
          SPHttpClient.configurations.v1,
          {
            headers: {
              'Accept': 'application/json;odata=nometadata',
              'Content-type': 'application/json;odata=verbose',
              'odata-version': ''
            },
            body: body
          });
      })
      .then((response: SPHttpClientResponse): Promise<IListItem> => {
        return response.json();
      })
       .then((item: IListItem): void => {
        this.setState({
        //  status: `Item '${item.Title}' (ID: ${item.Id}) successfully created`
       
        });
      });
     
  }


  public render(): React.ReactElement<IStudentBudgetProps> {


    return (
      <div className={styles.studentBudget} style={{ width:"1300px", paddingLeft: "10px" }}>
        < MyBudget  spHttpClient = {this.props.spHttpClient} siteUrl = {this.props.siteUrl} context ={this.props.context}/>
      </div>
    );
  }
}
