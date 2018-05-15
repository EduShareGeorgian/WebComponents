import * as React from 'react';
import styles from './AdmOfficerContactCard.module.scss';
import { IAdmOfficerContactCardProps } from './IAdmOfficerContactCardProps';
import { escape } from '@microsoft/sp-lodash-subset';



//import {SomeClass, max} from './test'
//import * as React from 'react';
//import * as jquery from 'jquery';
//import { IAdmissionsOfficerProps } from './IAdmissionsOfficerProps';
//import { escape } from '@microsoft/sp-lodash-subset';
import * as Fomat from 'dateformat';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { Tabs, Tab, TabPanel, TabList } from 'react-tabs';
require("boot.css");
require("fabric.component.min.css");
require("dashboard.css");
//import styles from './AdmissionsOfficer.module.scss';




var result;
var defaultContactCard = {
  firstname : "Office",
  lastname : "of the Registrar",
  phoneArea : "705",
  phoneNumber: "7221511",
  phoneExt: "Option 5",
  email:"registrar@georgiancollege.ca"
 


};
var title = defaultContactCard.firstname + " " + defaultContactCard.lastname,email=defaultContactCard.email,workPhone= "(" + defaultContactCard.phoneArea + ") " + defaultContactCard.phoneNumber.substr(0,3) + "-" + defaultContactCard.phoneNumber.substr(3,4) +  " " + defaultContactCard.phoneExt;



export interface IAdmOfficerContactCardState {
  academicStatusJson: "",
  studentId: "",
  deadline: "",
  selectedApplication: {},

  isAccepted: any,
  title:any,
  email:any,
  workPhone:any
  //load: false
}





export default class AdmOfficerContactCard extends React.Component<IAdmOfficerContactCardProps, IAdmOfficerContactCardState> {


  public constructor(props: IAdmOfficerContactCardProps, state: IAdmOfficerContactCardState) {
    super(props);

    this.state = {
      academicStatusJson: "",
      studentId: "",
      deadline: "",
      selectedApplication: {},
      isAccepted: false,
      title:title,
      email:defaultContactCard.email,
      workPhone:workPhone
    };
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
          //console.log(response.value[0]["AcademicStatusJson"]);

          debugger;

          return resolve(response.value[0]["AcademicStatusJson"]);
        })

    });
  }



  componentDidMount() {
    //var client = new SomeClass();
    //alert(client.getName());
    var self = this;
    var defContact = {
      _transient: {
    
        administratorAssignment: {
    
          _transient: {
            primaryContact: {
              firstName: defaultContactCard.firstname,
              lastName: defaultContactCard.lastname,
              _transient: {
                employeeSummary: {
                  email: defaultContactCard.email,
                  _transient: {
    
                    workTelephone: {
    
                      phoneArea: defaultContactCard.phoneArea,
                      phoneNumber: defaultContactCard.phoneNumber,
                      phoneExt: defaultContactCard.phoneExt
                    }
    
                  }
    
                }
    
              }
    
            }
    
          }
        }
      }
    };
    var lodashDefaultsdeep = require("lodash.defaultsdeep");



    this.getCurUser().then(val => this.getMyJson(val)).then(function (val) {
      result = val;
      var applications = JSON.parse(result)._transient.ocasApplications;
      var processState = applications.forEach(function (item) {
        item._embedded.programChoices.forEach(function (item) { console.log(item._transient.admissionSummary._transient.processState.depositAcknowledged) })
      });
      var application = self.getMax(applications, "year");
      lodashDefaultsdeep(application,defContact);
      self.setState({ academicStatusJson: result, selectedApplication: application});
      var isAccepted = "programChoices" in application._embedded ? application._embedded.programChoices.filter(function (subitem) { return (subitem._transient.admissionSummary._transient.processState.offerAccepted == "true") }) : ""
      
      if (self.state.academicStatusJson != "") {
        title = self.state.selectedApplication["_transient"]["administratorAssignment"]["_transient"]["primaryContact"]["firstName"] + " " + self.state.selectedApplication["_transient"]["administratorAssignment"]["_transient"]["primaryContact"]["lastName"];
        email = self.state.selectedApplication["_transient"]["administratorAssignment"]["_transient"]["primaryContact"]["_transient"]["employeeSummary"]["email"];
        var phoneArea = self.state.selectedApplication["_transient"]["administratorAssignment"]["_transient"]["primaryContact"]["_transient"]["employeeSummary"]["_transient"]["workTelephone"]["phoneArea"];
        var phoneNumber = self.state.selectedApplication["_transient"]["administratorAssignment"]["_transient"]["primaryContact"]["_transient"]["employeeSummary"]["_transient"]["workTelephone"]["phoneNumber"];
        var phoneExt = self.state.selectedApplication["_transient"]["administratorAssignment"]["_transient"]["primaryContact"]["_transient"]["employeeSummary"]["_transient"]["workTelephone"]["phoneExt"];
               
        //handling different scenarios for extensions
        if(phoneExt == defaultContactCard.phoneExt)
        {
          if(phoneExt == defaultContactCard.phoneExt && phoneArea == defaultContactCard.phoneArea && phoneNumber == defaultContactCard.phoneNumber)
          {
            phoneExt = " " + phoneExt;
          }
          else
          {
            phoneExt = "";
          }
        }
        else
        {
          if(phoneExt=="")
          phoneExt = "";
          else
          phoneExt = " x" + phoneExt;
        }
        
        
        //handling empty values because _.defaultsdeep doesnt handle empty values
        if(phoneArea == "" || phoneNumber=="")
        {workPhone = "(" + defaultContactCard.phoneArea + ") " + defaultContactCard.phoneNumber.substr(0,3) + "-" + defaultContactCard.phoneNumber.substr(3,4) +  " " + defaultContactCard.phoneExt;}
        else
        {workPhone = "(" + phoneArea + ")" + " " + phoneNumber.substr(0,3) + "-" + phoneNumber.substr(3, 4) + phoneExt;}
         
        if(email==""){email=defaultContactCard.email;}
        if(title==""){title=defaultContactCard.firstname + " " + defaultContactCard.lastname;}
      }

      
      self.setState({ isAccepted: isAccepted,title:title,email:email,workPhone:workPhone });
    });
  }


  getMax(arr, prop) {
    var max;

    for (var i = 0; i < arr.length; i++) {
      if (!max || parseInt(arr[i][prop]) > parseInt(max[prop]))
        max = arr[i];
    }
    return max;
  }




  public render(): React.ReactElement<IAdmOfficerContactCardProps> {

    var emptymsg = null, self = this;
    
    



    function displayEmptyMessage() {
      if (this.state.academicStatusJson != "") {
        if (JSON.parse(this.state.academicStatusJson)._transient.ocasApplications.length <= 0) {
          emptymsg = <tr><td><div className={styles.noApplicationsMsg}>There are no applications to show</div></td></tr>;
        }
      }
      return emptymsg;
    }

   

    return (
      <div className={styles.admissionsOfficer}>
        <div className={styles.tiles} id='tiles'>
          <div className="Persona-details">
            <div className="Persona-primaryText" id="AdmissionsOfficerTitle">
              <span title="Admissions Officer">Admissions Officer</span>
            </div>

            <div id="officerName" title="" className="Persona-primaryText">
              <a href="">{/*self.state.selectedApplication["_transient"] != undefined && */this.state.title} </a>
            </div>

            <div id="officerEmail" className="Persona-secondaryText" >Email:
            <a href="mailto:" > {/*self.state.selectedApplication["_transient"] != undefined && */this.state.email}</a>
            </div>

            <div id="officerPhone" className="Persona-secondaryText">Work: <a href="tel:">
              {/*self.state.selectedApplication["_transient"] != undefined && */this.state.workPhone}</a>
            </div>



            <div id="webSite" className="Persona-secondaryText">Website:
            <a href="https://my.georgiancollege.ca/Registrar/Pages/default.aspx"> Office of the Registrar </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
