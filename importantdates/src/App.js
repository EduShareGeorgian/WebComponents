import React, { Component } from 'react';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import { PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import {connect} from 'react-redux';
import EventDetail from './components/eventDetail'
import CurrentEventApi from './api/selectEventApi'
import UserDetails from './containers/user-detail'
import UserList from './containers/user-list'

import {bindActionCreators} from 'redux';


import {selectEvent} from './actions/selectEvent'

import './App.css'

class App extends Component {

constructor(props) {
  super(props);
  this.state = { activeDates: null };
}
render() {
  function selectEvent(event){
    
    var dates = CurrentEventApi.fetchCurrentEvent(event.key)
    this.setState({activeDates: dates})
   }
    return (
    <div>
       <div className="App">
          <Dropdown 
              label='Select Type of Event'
              id='importanDates'
              class="ms-Dropdown-select"
              options = {this.props.events}
              onChanged = {selectEvent.bind(this)}
              max-height= '600px'
          />
        </div>
        <EventDetail activeDates= {this.state.activeDates}/>
    </div>
    );
  }
}

function mapStateToProps(state) {
    return {
        events: state.events
    };
}
function matchDispatchToProps(dispatch){
 
}

export default connect(mapStateToProps, matchDispatchToProps)(App);

