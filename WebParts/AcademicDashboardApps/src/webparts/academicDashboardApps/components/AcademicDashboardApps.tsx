import * as React from 'react';
import styles from './AcademicDashboardApps.module.scss';
import ProgramChoice from './programChoice';
import { IAcademicDashboardAppsProps } from './IAcademicDashboardAppsProps';
import { escape } from '@microsoft/sp-lodash-subset';
//import Collapsible from 'react-collapsible';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

//import { BaseCollapse, AltCollapse, Collapse } from 'pivotal-ui/react/collapse';
import {
  
  
  IGroup,
  IGroupDividerProps
} from 'office-ui-fabric-react/lib/components/GroupedList/index';
import {GroupedList} from './GroupedList';
//import { GroupHeader } from 'office-ui-fabric-react/lib/components/GroupedList/GroupHeader';
import { GroupHeader } from './GroupHeader';


import { IColumn, IDetailsRowProps, IDetailsRowCheckProps } from 'office-ui-fabric-react/lib/DetailsList';
//import { DetailsRow } from 'office-ui-fabric-react/lib/components/DetailsList/DetailsRow';
import {
  FocusZone,FocusZoneDirection
} from 'office-ui-fabric-react/lib/FocusZone';
import {
  Selection,
  SelectionMode,
  SelectionZone
} from 'office-ui-fabric-react/lib/utilities/selection/index';

// import {
//   createListItems,
//   createGroups
// } from '@uifabric/example-app-base';


import { MessageBar} from 'office-ui-fabric-react/lib/MessageBar';




let _items: any[] = [];
let _groups: IGroup[] = [];
let _columns: IColumn[] = [];



var applications = [];



export interface IAcademicDashboardAppsState {
  academicStatusJson: "",
  Applications: any,
  programChoices: any,
  groupCount: any,
  isAlreadyExpanded:any

}





export default class AcademicDashboardApps extends React.Component<IAcademicDashboardAppsProps, IAcademicDashboardAppsState> {

  private _selection: Selection;


  public constructor(props: IAcademicDashboardAppsProps, state: IAcademicDashboardAppsState) {
    super(props);

    this.state = {
      academicStatusJson: "",
      Applications: [],
      programChoices: [],
      groupCount: 0,
      isAlreadyExpanded:false
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
        }).catch(() => console.log("no record found"))

    });
  }


  componentDidMount() {


    var self = this, result;
    var curyear = new Date().getFullYear();
    this.getCurUser().then(val => this.getMyJson(val)).then(function (val) {
      result = val;
      applications = JSON.parse(result)._transient.ocasApplications;
      
      //_items = _items || createListItems(Math.pow(groupCount, groupDepth + 1));//applications;
      //_groups = _groups || createGroups(groupCount, groupDepth, 0, groupCount);//applications[0];

      applications.slice(0).reverse().map((item, index) => (item._embedded.programChoices.map((subitem, subindex) => (_items.push(subitem)))));
      self._selection.setItems(_items);
     
      var returnedYear = getFirstElmentBiggerOrEqualToCurYear(applications);
      
      applications.slice(0).reverse().map((item, index) => {

        //do the defaulting here;
        
        _groups.push({
          count: item._embedded.programChoices.length,
          key: item.applicationNumber,
          level: 0,
          name: item.year + "-" + item.applicationNumber,
          startIndex: calcStartIndex(item, index),
          isCollapsed: calcIsExpanded(item, index)        
         })

       }
      );
      
     
      function getFirstElmentBiggerOrEqualToCurYear(applications)
      {
        var futureYearExist = applications.filter(function(item){
          return item.year >= curyear;
        })
        return futureYearExist.length > 0 ? futureYearExist[0].year : applications[applications.length-1].year
     
      }


      function calcIsExpanded(itemm,indexm){
         
         if(itemm.year == returnedYear && !self.state.isAlreadyExpanded)
         {
           self.setState({isAlreadyExpanded:true});
           //this.state.isAlreadyExpanded = true;
           return false;
         }
        

        return true;
      }


      function calcStartIndex(Mitem, Mindex) {
        var resultcount = 0;
        if (Mindex <= 0){
          return 0 * Mitem._embedded.programChoices.length;
        }
        if (Mindex > 0){
          for(Mindex;Mindex>0;Mindex--)
          {
            resultcount = resultcount + applications.slice(0).reverse()[Mindex - 1]._embedded.programChoices.length;
          }
          
          return resultcount ;
        }

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

      self.setState({ academicStatusJson: result, Applications: applications });
    }).catch(() => console.log("no applications found"));

  }


  public render(): React.ReactElement<IAcademicDashboardAppsProps> {

    var emptymarkup = applications.length <= 0 ? <MessageBar>You have no applications in your profile. </MessageBar> : "";
    return (
      <div className={styles.academicDashboardApps}>
        {emptymarkup}
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
        
        <FocusZone direction={FocusZoneDirection.bidirectional}>
          
        
          <GroupedList
            
            items={_items}
            onRenderCell={this._onRenderCell}
            //selection={this._selection}
            //selectionMode={SelectionMode.multiple}
            groups={_groups}
            //onGroupHeaderClick={(e)=>alert(e);}
            
            


          />
         
          
          </FocusZone >

      </div>
    );
  }





  private _onRenderCell(nestingDepth: number, item: any, itemIndex: number) {
    // let {
    //   _selection: selection
    // } = this;    
    
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
