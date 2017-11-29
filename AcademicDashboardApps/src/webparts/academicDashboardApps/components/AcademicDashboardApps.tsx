import * as React from 'react';
import styles from './AcademicDashboardApps.module.scss';
import ProgramChoice from './programChoice';
import { IAcademicDashboardAppsProps } from './IAcademicDashboardAppsProps';
import { escape } from '@microsoft/sp-lodash-subset';
//import Collapsible from 'react-collapsible';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

import { BaseCollapse, AltCollapse, Collapse } from 'pivotal-ui/react/collapse';
import {
  GroupedList,
  IGroup,
  IGroupDividerProps
} from 'office-ui-fabric-react/lib/components/GroupedList/index';
import { IColumn, IDetailsRowProps, IDetailsRowCheckProps } from 'office-ui-fabric-react/lib/DetailsList';
import { DetailsRow } from 'office-ui-fabric-react/lib/components/DetailsList/DetailsRow';
import {
  FocusZone
} from 'office-ui-fabric-react/lib/FocusZone';
import {
  Selection,
  SelectionMode,
  SelectionZone
} from 'office-ui-fabric-react/lib/utilities/selection/index';

import {
  createListItems,
  createGroups
} from '@uifabric/example-app-base';
import {
  IButtonProps,
  CompoundButton,
  PrimaryButton
} from 'office-ui-fabric-react/lib/Button';
import { Term } from "../utils/enums";
import { Field } from "../utils/strColumns";




let _items: any[] = [];
let _groups: IGroup[] = [];
let _columns: IColumn[] = [];



var applications = [];



export interface IAcademicDashboardAppsState {
  academicStatusJson: "",
  Applications: any,
  programChoices: any,
  groupCount: any

}





export default class AcademicDashboardApps extends React.Component<IAcademicDashboardAppsProps, IAcademicDashboardAppsState> {

  private _selection: Selection;


  public constructor(props: IAcademicDashboardAppsProps, state: IAcademicDashboardAppsState) {
    super(props);

    this.state = {
      academicStatusJson: "",
      Applications: [],
      programChoices: [],
      groupCount: 0
    };

    this._onRenderCell = this._onRenderCell.bind(this);
    //this.onRenderItemColumn = this._onRenderCheck.bind(this);
    this._selection = new Selection;
  }



  getCurUser(): Promise<any> {

    return new Promise((resolve) => {

      this.props.spHttpClient.get(`${this.props.siteurl}/_api/Web/CurrentUser`,

        SPHttpClient.configurations.v1,
        {
          headers: {
            'Accept': 'application/json;odata=nometadata',
            'odata-version': ''
          }
        })
        .then((response: SPHttpClientResponse): Promise<{ value: any }> => {
          //console.log(response.json());
          return response.json();
        })
        .then((response: { value: any }): void => {
          //console.log(response["Id"]);

          return resolve(response["Id"]);
        })

    });
  }

  getMyJson(AuthorId): Promise<string> {

    return new Promise((resolve) => {

      this.props.spHttpClient.get(`${this.props.siteurl}/_api/web/lists/getbytitle('Student Academic Status')/items?$filter=AuthorId eq ` + "'" + AuthorId + "'",

        SPHttpClient.configurations.v1,
        {
          headers: {
            'Accept': 'application/json;odata=nometadata',
            'odata-version': ''
          }
        })
        .then((response: SPHttpClientResponse): Promise<{ value: any }> => {
          return response.json();
        })
        .then((response: { value: any }): void => {
          return resolve(response.value[0]["AcademicStatusJson"]);
        })

    });
  }


  componentDidMount() {


    var self = this, result;
    this.getCurUser().then(val => this.getMyJson(val)).then(function (val) {
      result = val;

      applications = JSON.parse(result)._transient.ocasApplications;
      var programchoices = "";



      //_items = _items || createListItems(Math.pow(groupCount, groupDepth + 1));//applications;
      //_groups = _groups || createGroups(groupCount, groupDepth, 0, groupCount);//applications[0];


      applications.map((item, index) => (item._embedded.programChoices.map((subitem, subindex) => (_items.push(subitem)))));
      self._selection.setItems(_items);

      applications.map((item, index) => (

        _groups.push({
          count: item._embedded.programChoices.length,
          key: item.applicationNumber,
          level: 0,
          name: "Application #: " + item.applicationNumber + "-" + item.year,
          startIndex: calcStartIndex(item, index),
          isCollapsed: true
        })));



      function calcStartIndex(Mitem, Mindex) {
        if (Mindex <= 0)
          return 0 * Mitem._embedded.programChoices.length;
        if (Mindex > 0)
          return 1 * applications[Mindex - 1]._embedded.programChoices.length;


      }


      // _columns = [
      //   {
      //     key: Field.programCode,
      //     name: Field.programCode,
      //     fieldName: Field.programCode,
      //     maxWidth: 500,
      //     minWidth: 500,
      //     isMultiline: true
      //   },
      //   {
      //     key: Field.programDesc,
      //     name: Field.programDesc,
      //     fieldName: Field.programDesc,
      //     maxWidth: 500,
      //     minWidth: 500,
      //     isMultiline: true
      //   },
      //   {
      //     key: Field.termCode,
      //     name: Field.termCode,
      //     fieldName: Field.termCode,
      //     maxWidth: 500,
      //     minWidth: 500,
      //     isMultiline: true
      //   },
      //   {
      //     key: Field.banAdmInd,
      //     name: Field.banAdmInd,
      //     fieldName: Field.banAdmInd,
      //     maxWidth: 500,
      //     minWidth: 500,
      //     isMultiline: true
      //   }

      // ]

      self.setState({ academicStatusJson: result, Applications: applications, programChoices: programchoices });
    });

  }


  public render(): React.ReactElement<IAcademicDashboardAppsProps> {


    return (
      <div className={styles.academicDashboardApps}>
        
        {/* <AltCollapse header="Application 16B9951 - 2015">
          <p>Content!</p>
          <p>Content!</p>
          <p>Content!</p>
          <p>Content!</p>
          <p>Content!</p>
        </AltCollapse>

        <AltCollapse header="Application 16B7654 - 2016">
          <p>Content!</p>
          <p>Content!</p>
          <p>Content!</p>
          <p>Content!</p>
          <p>Content!</p>
        </AltCollapse>

        <AltCollapse header="Application 16B7677 - 2017" defaultExpanded={true} >
          <p>Content!</p>
          <p>Content!</p>
          <p>Content!</p>
          <p>Content!</p>
          <p>Content!</p>
        </AltCollapse> */}


        {/* <FocusZone> */}
          {/* <SelectionZone
          selection={ this._selection }
          selectionMode={ SelectionMode.multiple }
        > */}
          <GroupedList

            items={_items}
            onRenderCell={this._onRenderCell}
            selection={this._selection}
            selectionMode={SelectionMode.multiple}
            groups={_groups}


          />
         
          {/* </SelectionZone> */}
        {/* </FocusZone> */}

      </div>
    );
  }





  private _onRenderCell(nestingDepth: number, item: any, itemIndex: number) {
    let {
      _selection: selection
    } = this;    
    
    return (
      
        
      /* <DetailsRow
        columns={
          _columns
           Object.keys(item).slice(0, 3).map((value): IColumn => {
            return {
              key: value,
              name: value,
              fieldName: value,
              minWidth: 300
            };
          }) 
        }
        groupNestingDepth={nestingDepth}
        item={item}
        itemIndex={itemIndex}
        selection={selection}
        selectionMode={SelectionMode.multiple}
        onRenderItemColumn={this._onRenderCheck}
      /> */  
    
      <ProgramChoice pchoice={item} />

    );
  }


  // private _onRenderCheck(item: any, index: number, column: IColumn) {

  //   if (column.key === Field.banAdmInd) {
  //     return (
  //       <div>
  //       <CompoundButton
  //         href={"www.google.com"}
  //         text={item[Field.oprgCode]}
  //         disabled={false}
  //         checked={true}
  //         className='clsActionButton'
  //         target="_blank"
  //         tabIndex={3}
  //       />
  //       <div>this is just test</div>
  //       </div>
  //     );
  //   }
  //   if (column.key === Field.termCode) {
  //     var term = item[Field.termCode].substr(4, 1);
  //     switch (term) {

  //       case Term.Fall.toString(): return ("Fall " + item[Field.termCode].substr(0, 4));
  //       case Term.Winter.toString(): return ("Winter " + item[Field.termCode].substr(0, 4));
  //       case Term.Summer.toString(): return ("Summer " + item[Field.termCode].substr(0, 4));
  //       default: return ("None " + item[Field.termCode].substr(0, 4));
  //     }

  //   }
  //   return item._transient.admissionSummary[column.key];
  // }



}
