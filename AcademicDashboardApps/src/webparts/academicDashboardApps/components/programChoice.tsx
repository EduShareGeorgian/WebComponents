
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { Term } from "../utils/enums";
import { Field } from "../utils/strColumns";

require('collapsiblefile.scss');

export interface IProgramChoiceState {
    programChoice: any,
    campus: any,
    semester: any,
    programCode: "",
    programDesc: ""
}


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
        return programchoice._transient.admissionSummary.campusDesc;

    }


    getSemester(programchoice) {
        var term = programchoice.termCode.substr(4, 1);
        switch (term) {

            case Term.Fall.toString(): return ("Fall " + programchoice.termCode.substr(0, 4));
            case Term.Winter.toString(): return ("Winter " + programchoice.termCode.substr(0, 4));
            case Term.Summer.toString(): return ("Summer " + programchoice.termCode.substr(0, 4));
            default: return ("N/A");
        }


    }


    getProgramCode(programchoice) {
        return programchoice._transient.admissionSummary.programCode;

    }

    getProgramDesc(programchoice) {
        return programchoice._transient.admissionSummary.programDesc;

    }



    componentDidMount() {

        var self = this;
        var programchoice = self.props.pchoice;
        var campus = self.getCampus(programchoice);
        var semester = self.getSemester(programchoice);
        var programcode = self.getProgramCode(programchoice);
        var programdesc = self.getProgramDesc(programchoice);

        self.setState({ programChoice: programchoice, campus: campus, semester: semester, programCode: programcode, programDesc: programdesc });

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

                    <div className="program_action">
                        <button className="actionbutton">
                            Pay My Deposit</button>
                    </div>
                </div>

            </div>
        );
    }

}

export default ProgramChoice;