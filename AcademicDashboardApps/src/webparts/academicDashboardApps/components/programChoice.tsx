
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { Term } from "../utils/enums";
import { Field } from "../utils/strColumns";
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
    programDesc: ""
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
            programDesc: ""

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



    componentDidMount() {

        
        var programchoice = this.props.pchoice;
        var campus = this.getCampus(programchoice);
        var semester = this.getSemester(programchoice);
        var programcode = this.getProgramCode(programchoice);
        var programdesc = this.getProgramDesc(programchoice);

        this.setState({ programChoice: programchoice, campus: campus, semester: semester, programCode: programcode, programDesc: programdesc });
        this.state = {programChoice: programchoice, campus: campus, semester: semester, programCode: programcode, programDesc: programdesc}; 
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
                        <p>9 days remaining </p>
                    </div>
                    <div className="program_desc">
                        <p><span className="clsDarkLabel">Status:</span> Waitlisted</p>
                        <p>When a team of explorers ventures into the catacombs that lie beneath the streets of Paris, they uncover the dark secret that lies within this city of the dead.</p>
                    </div>

                    <div className="program_action" >
                    
                    <CompoundButton
                    data-automation-id='checkmystatusbutton'
                    disabled={false}
                    checked={false}
                    text={"Check My Application Status"}
                    href='https://georgiancollege.sharepoint.com/sites/go/Pages/BannerAppStatus.aspx'
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