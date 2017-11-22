import * as React from 'react';
//import * as jquery from 'jquery';
import { IAdmissionsOfficerProps } from './IAdmissionsOfficerProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as Fomat from 'dateformat';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { Tabs, Tab, TabPanel, TabList } from 'react-tabs';
require("boot.css");
//require("fabric.component.min.css");
require("dashboard.css");
import styles from './AdmissionsOfficer.module.scss';
import {
  IButtonProps,

  CompoundButton,
  DefaultButton
} from 'office-ui-fabric-react/lib/Button';
import {
  Label
} from 'office-ui-fabric-react/lib/Label';

import { IconButton } from 'office-ui-fabric-react/lib/Button';

import { Icon, IconType } from 'office-ui-fabric-react/lib/Icon';

import { TestImages } from 'office-ui-fabric-react/lib/common/TestImages';
require('office-ui-fabric-react/src/components/Icon/examples/IconExample.css');




var result;
var enablePayButton = false, enableAcceptOfferButton = false;



export interface IAdmissionsOfficerState {
  academicStatusJson: "",
  studentId: "",
  deadline: "",
  selectedApplication: {},
  isAccepted: any,
  isPaid: any,
  show: any,
  isOffered: any,
  isAppStatusChecked:any
}



export default class AdmissionsOfficer extends React.Component<IAdmissionsOfficerProps, IAdmissionsOfficerState> {
  public constructor(props: IAdmissionsOfficerProps, state: IAdmissionsOfficerState) {
    super(props);

    this.state = {
      academicStatusJson: "",
      studentId: "",
      deadline: "",
      selectedApplication: {},
      isAccepted: false,
      isPaid: false,
      show: "none",
      isOffered: false,
      isAppStatusChecked:false
    };


    this.updateApplicationStatus = this.updateApplicationStatus.bind(this);
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

  isOfferAccepted(applications) {
    var self = this;
    var unAccepted = applications.filter(function (item) {
      var unOfferAccepted = item._embedded.programChoices.filter(
        function (item) {
          return item._transient.admissionSummary._transient.processState.offerAccepted == "true"
        })
      return unOfferAccepted.length > 0 ? true : false
    });

    return unAccepted.length > 0 ? true : false
  }


  isOffered(applications) {
    var self = this;
    var offered = applications.filter(function (item) {
      var programOffered = item._embedded.programChoices.filter(
        function (item) {
          return item._transient.admissionSummary._transient.processState.offered == "true"
        })
      return programOffered.length > 0 ? true : false
    });

    return offered.length > 0 ? true : false
  }


  isDepositPaid(applications) {
    var self = this;
    var isPaid = applications.filter(function (item) {
      var unPay = item._embedded.programChoices.filter(
        function (item) {
          return item._transient.admissionSummary._transient.processState.depositAcknowledged === "true"
        })
      return unPay.length > 0
    });

    return isPaid.length > 0 ? true : false
  }

 

  componentDidMount() {
    var self = this;
    this.getCurUser().then(val => this.getMyJson(val)).then(function (val) {
      result = val;

      var applications = JSON.parse(result)._transient.ocasApplications;
      var isPaid = self.isDepositPaid(applications);
      var showDeposit = !isPaid ? "normal" : "none";
      var offerAccepted = self.isOfferAccepted(applications);
      var application = self.getMaxValue(applications, "year");
      var offer = self.isOffered(applications);
      
      //var isAccepted1 =   "programChoices" in application._embedded ? application._embedded.programChoices.filter(function (subitem) { return (subitem._transient.admissionSummary._transient.processState.offerAccepted == "true") }) : "" 
      self.setState({ academicStatusJson: result, selectedApplication: application, isAccepted: offerAccepted, show: showDeposit, isPaid: isPaid, isOffered: offer });
    });
  }


  getMaxValue(arr, prop) {
    var max;
    for (var i = 0; i < arr.length; i++) {
      if (!max || parseInt(arr[i][prop]) > parseInt(max[prop]))
        max = arr[i];
    }
    return max;
  }

updateApplicationStatus()
  {
    
        var self= this;        
        self.setState({isAppStatusChecked:true});
      }
 

  public render(): React.ReactElement<IAdmissionsOfficerProps> {

    var self = this, emptymsg = null ;
    
    function displayEmptyMessage() {
      if (self.state.academicStatusJson != "") {
        if (JSON.parse(self.state.academicStatusJson)._transient.ocasApplications.length <= 0) {
          emptymsg = <tr><td><div className={styles.noApplicationsMsg}>There are no applications to show</div></td></tr>;
        }
      }
      return emptymsg;
    }
    

    return (
      <div className={styles.admissionsOfficer}>
        <div className={styles.actionButtonGap}>
          <CompoundButton
            data-automation-id='checkmystatusbutton'
            disabled={false}
            checked={false}
            href='https://georgiancollege.sharepoint.com/sites/go/Pages/BannerAppStatus.aspx'
            target='_blank'
            //onClick={this.updateApplicationStatus}
            className="dashboardWidget infoPanel infoPanelBlue infoPanelButton dashboardConfirm cls-prod">
            <table style={{ width: '100%', height: '60px' }}>
              <tr>
                {/* <td style={{ minWidth: '100px' }}>
                  {this.state.isAppStatusChecked == true ? <Icon className='ms-Icon ms-Icon--Accept ms-IconExample _clsIcon' /> : ""}
                </td> */}
                <td style={{ width: '100%', textAlign: 'center' }}>
                  <span className='buttonText'>1. Check my application status</span>
                </td>
              </tr>
            </table>
            
        </CompoundButton>
        </div>

        <div className={styles.actionButtonGap}>
          <CompoundButton
            data-automation-id='acceptofferbutton'
            disabled={!this.state.isOffered }//|| this.state.isAccepted
            checked={false}

            href='http://www.ontariocolleges.ca'
            target='_blank'
            className="dashboardWidget infoPanel infoPanelBlue infoPanelButton dashboardConfirm cls-prod">
            <table style={{ width: '100%', height: '60px' }}>
              <tr>
                <td style={{ minWidth: '100px' }}>
                  {this.state.isAccepted == true ? <Icon style={{fontFamily : 'FabricMDL2Icons !important'}} className='ms-Icon ms-Icon--Accept ms-IconExample _clsIcon' /> : ""}
                </td>
                <td style={{ width: '90%', borderLeft: '1px solid', textAlign: 'center' }}>
                  <span className='buttonText'>2. Accept my offer</span>
                </td>
              </tr>
            </table>
          </CompoundButton>
        </div>

        <div className={styles.actionButtonGap}>
          <CompoundButton
            data-automation-id='paybutton'
            disabled={!this.state.isAccepted }//|| this.state.isPaid
            checked={false}
            
            href='https://georgiancollege.sharepoint.com/sites/go/Pages/BannerMakePayment.aspx'
            target='_blank'
            
            className="dashboardWidget infoPanel infoPanelBlue infoPanelButton dashboardConfirm cls-prod">
            <table style={{ width: '100%', height: '60px' }}>
            <tr>
              <td style={{ minWidth: '100px' }}>
                {this.state.isPaid == true ? <Icon style={{fontFamily : 'FabricMDL2Icons !important'}} className='ms-Icon ms-Icon--Accept ms-IconExample _clsIcon' /> : ""}
              </td>
              <td style={{ width: '90%', borderLeft: '1px solid', textAlign: 'center' }}>
                <span className='buttonText'>3. Pay my deposit</span>
              </td>
            </tr>
          </table>
          </CompoundButton></div>


      </div>
    );
  }


}
