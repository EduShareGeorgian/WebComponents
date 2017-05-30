import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import selectEvent from '../actions/selectEvent'


class eventType extends Component {   
    constructor(props) {
        super(props);
        var importantDateDefaultKey = 121;
        this.state = { 
            importantDateDefaultKey: importantDateDefaultKey
        };
    }

    render() {
       return  (
	       <Dropdown 
              label='Select Type of Event'
              id='importantDates'
              class="ms-Dropdown-select"
              options = {this.props.events}
              onChanged = {this.props.selectEvent.bind(this)}  
              defaultSelectedKey= {this.state.importantDateDefaultKey}          
          />
        );
    }
}

//   user: state.activeUser
function mapStateToProps(state) {
    return {
        activeDates: state.activeDates
    };
}


export default connect(mapStateToProps)(eventType);
