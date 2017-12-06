
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { Term,StatusQueue,ActionLabel,ActionLink,Message } from "../utils/enums";
import { Field,Status } from "../utils/strColumns";
import {
    IButtonProps,
    CompoundButton,
    PrimaryButton
  } from 'office-ui-fabric-react/lib/Button';
  import {
    FocusZone
  } from 'office-ui-fabric-react/lib/FocusZone';
require('collapsiblefile.scss');

export interface IProgramChoiceState {
    programChoice: any,
    campus: any,
    semester: any,
    programCode: "",
    programDesc: "",
    status : any,
    actionLabel:any,
    actionLink:any,
    daysRemaining:any,
    message:any,
    IsActionButtonEnabled:any
}

//var self = this;


class ProgramChoice extends React.Component<any, IProgramChoiceState>{
    public constructor(props: any, state: IProgramChoiceState) {
        super(props);
        this.state = {
            programChoice: "",
            campus: "",
            semester: "",
            programCode: "",
            programDesc: "",
            status :"",
            actionLabel:"",
            actionLink:"",
            daysRemaining:0,
            message:"",
            IsActionButtonEnabled:true

        };
    }




    getDefaultProps() {
        return {

            pchoice: ""
        };
    }


    getCampus(programchoice) {
        var campus = programchoice._transient.admissionSummary.campusDesc;
        if (campus != "" && campus != null && campus != undefined) {
        return campus;
        }
        return "N/A";
    }


    getSemester(programchoice) {
        var termcode = programchoice.termCode;
        if (termcode != "" && termcode != null && termcode != undefined) {
            var term = termcode.substr(4, 1);
            switch (term) {

                case Term.Fall.toString(): return ("Fall " + (parseInt(termcode.substr(0, 4),10) - 1)).toString();
                case Term.Winter.toString(): return ("Winter " + termcode.substr(0, 4));
                case Term.Summer.toString(): return ("Summer " + termcode.substr(0, 4));
                default: return ("N/A");
            }
        }
        else {
            return "N/A";
        }

    }


    getProgramCode(programchoice) {
        
        var code = programchoice._transient.admissionSummary.programCode;
        if (code != "" && code != null && code != undefined) {
        return code;
        }
        return "N/A";


    }

    getProgramDesc(programchoice) {
       

        var desc = programchoice._transient.admissionSummary.programDesc;
        if (desc != "" && desc != null && desc != undefined) {
        return desc;
        }
        return "N/A";


    }

   
     processStatus(programchoice) {
        
         var processstatus = {status:Status.NotAvailable,action:{actionlable:ActionLabel.CheckMyStatus,actionlink:ActionLink.Banner,daysremaining:0,message:Message.None,IsActionButtonEnabled:true}};
         var statusQ = programchoice._transient.admissionSummary.currentQueueType;
         var offerExpiryDate = programchoice._transient.admissionSummary.offerExpiryDate;
         var refusedOffered = programchoice._transient.admissionSummary._transient.processState.reOffered;
         var offerAccepted = programchoice._transient.admissionSummary._transient.processState.offerAccepted


         if (statusQ != "" && statusQ != null && statusQ != undefined) {

            switch(statusQ){

                case StatusQueue.O.toString() : {
                    var curDateTime = new Date();
                   
                    if(refusedOffered==true)//if student has refused the offer (Refused by applicant)
                    {
                        processstatus.status = Status.RefusedByApplicant;
                        processstatus.action.actionlable = ActionLabel.NoAction;
                        processstatus.action.actionlink = ActionLink.None;
                        processstatus.action.daysremaining = 0;
                        processstatus.action.message = Message.None;
                        processstatus.action.IsActionButtonEnabled = false;
                        
                    }
                    if(offerAccepted==true)//if student has accepted the offer (Confirmed)
                    {
                        processstatus.status = Status.Confirmed;
                        processstatus.action.actionlable = ActionLabel.PayMyDeposit;
                        processstatus.action.actionlink = ActionLink.Banner;
                        processstatus.action.daysremaining = 0;
                        processstatus.action.message = Message.None;
                        processstatus.action.IsActionButtonEnabled = true;
                        
                    }  
                    if( curDateTime > new Date(offerExpiryDate))//if offer expiry date has passed (Offer expired)
                    {
                        processstatus.status = Status.OfferExpired;
                        processstatus.action.actionlable = ActionLabel.ContactAdmissionOfficer;
                        processstatus.action.actionlink = ActionLink.Banner;
                        processstatus.action.daysremaining = 0;
                        processstatus.action.message = Message.msgAdmissionOfficer;
                        processstatus.action.IsActionButtonEnabled = false;
                        
                    }
                    break;
                }
                case StatusQueue.R.toString() :
                {
                    processstatus.status = Status.Refused
                    processstatus.action.actionlable =  ActionLabel.NoAction;
                    processstatus.action.actionlink = ActionLink.None;
                    processstatus.action.daysremaining = 0;
                    processstatus.action.message = Message.None;
                    processstatus.action.IsActionButtonEnabled = false;
                    break;
                    
                }
                case StatusQueue.W.toString() :
                {
                    processstatus.status = Status.Waitlisted
                    processstatus.action.actionlable =  ActionLabel.NoAction;
                    processstatus.action.actionlink = ActionLink.None;
                    processstatus.action.daysremaining = 0;
                    processstatus.action.message = Message.None;
                    processstatus.action.IsActionButtonEnabled = false;
                    break;
                    
                }
                case StatusQueue.NQ.toString() :
                {
                    processstatus.status = (Status.NotAvailable + "/" + Status.NoDecision)
                    processstatus.action.actionlable =  ActionLabel.CheckMyStatus;
                    processstatus.action.actionlink = ActionLink.Banner;
                    processstatus.action.daysremaining = 0;
                    processstatus.action.message = Message.None;
                    processstatus.action.IsActionButtonEnabled = true;
                    break;
                    
                }
            }
         
         }
         return processstatus;
 
 
     }





    componentDidMount() {
       
        var programchoice = this.props.pchoice;
        var campus = this.getCampus(programchoice);
        var semester = this.getSemester(programchoice);
        var programcode = this.getProgramCode(programchoice);
        var programdesc = this.getProgramDesc(programchoice);
        var action = this.processStatus(programchoice);
        this.setState({ programChoice: programchoice, campus: campus, semester: semester, programCode: programcode, programDesc: programdesc,status:action.status,actionLabel:action.action.actionlable,actionLink:action.action.actionlink,daysRemaining:action.action.daysremaining,message:action.action.message,IsActionButtonEnabled:action.action.IsActionButtonEnabled});
        this.state = {programChoice: programchoice, campus: campus, semester: semester, programCode: programcode, programDesc: programdesc ,status:action.status,actionLabel:action.action.actionlable,actionLink:action.action.actionlink,daysRemaining:action.action.daysremaining,message:action.action.message,IsActionButtonEnabled:action.action.IsActionButtonEnabled}; 
    }









    render() {



        return (
            <div className="card">


                <div className="about_program">
                    <h4><span className="clsDarkLabel">{this.state.programCode}</span> : {this.state.programDesc}</h4>
                    <hr />
                    <div className="program_info">
                        <p><span className="clsDarkLabel">Campus:</span> {this.state.campus}</p>
                        <p><span className="clsDarkLabel">Semester:</span> {this.state.semester}</p>
                        <p>{this.state.daysRemaining} Days Remaining</p>
                    </div>
                    <div className="program_desc">
                        <p><span className="clsDarkLabel">Status:</span> {this.state.status}</p>
                        <p>{this.state.message}</p>
                    </div>

                    <div className="program_action" >
                    
                    <CompoundButton
                    data-automation-id='checkmystatusbutton'
                    disabled={!this.state.IsActionButtonEnabled}
                    checked={false}
                    text={this.state.actionLabel}
                    href={this.state.actionLink}
                    target='_blank'
                    className="clsActionButton">
                    
                    
                </CompoundButton>
                
                    </div>
                </div>

            </div>
        );
    }

}

export default ProgramChoice;