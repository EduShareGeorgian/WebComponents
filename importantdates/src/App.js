import React, { Component } from 'react';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import { PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import {connect} from 'react-redux';
import EventDetail from './components/eventDetail'
import EventType from './components/eventType'
import CurrentEventApi from './api/selectEventApi'
import thunk from 'redux-thunk'
import {bindActionCreators} from 'redux';
import {selectEvent} from './actions/selectEvent'
import {localize} from 'react-localize-redux';
import './App.css'

class App extends Component {   
constructor(props) {
    super(props);
    var importantDateDefaultKey = 121;
    this.state = { 
        activeDates: null,
        importantDateDefaultKey: importantDateDefaultKey
    };
}

 componentDidMount() {
    const { dispatch, selectEvent} = this.props
    selectEvent({key: this.state.importantDateDefaultKey});
}

render() {
    return (       
    <div className="importantDates-webpart">                                    
      <div className="Header App">
          <div className="importantDates-img">
          <h2>{ this.props.translate('importantDates') }</h2>
          </div>
      </div>
       <div className="App">
          <EventType events = {this.props.events}/>
        </div>
        
        <div className="App">
          <Dropdown 
              label={ this.props.translate('selectEvent') }
              id='importantDates'
              class="ms-Dropdown-select"
              options = {this.props.events}
              onChanged = {this.props.selectEvent.bind(this)}
              defaultSelectedKey= {this.state.importantDateDefaultKey}
          />
        </div>
        <div className="App">
          <EventDetail activeDates= {this.props.activeDates}/>
        </div>

        <div className="App viewEvents">
            <a href= "https://georgianservices.azurewebsites.net/Pages/ImportantDates.aspx?SPHostUrl=https%3a%2f%2fgeorgiancollege.sharepoint.com%2fsites%2fstudent&SPHostTitle=Home&SPAppWebUrl=https%3a%2f%2fgeorgiancollege-ce6491b1a96565.sharepoint.com%2fsites%2fstudent%2fGeorgianServicesAddIn&SPLanguage=en-US&SPClientTag=0&SPProductNumber=16.0.6511.1209&CategoryName=important-dates&TimeSpanMonths=1&SenderId=94792B182&AppContextToken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNzllMmIzNy1lYTg3LTQ3ODktYjNkMC02MDZlMzkyMzk2ZWEvZ2VvcmdpYW5zZXJ2aWNlcy5henVyZXdlYnNpdGVzLm5ldEBkYTlhOTRiNi00NjgxLTQ5YmMtYmQ3Yy1iYWI5ZWFjMGFkM2MiLCJpc3MiOiIwMDAwMDAwMS0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDBAZGE5YTk0YjYtNDY4MS00OWJjLWJkN2MtYmFiOWVhYzBhZDNjIiwiaWF0IjoxNDk1NzQ0NjE5LCJuYmYiOjE0OTU3NDQ2MTksImV4cCI6MTQ5NTc0ODUxOSwiYXBwY3R4Ijoie1wiQ2FjaGVLZXlcIjpcIjRzSUhvY0d0SHJyR2JWY2E0VkFHcEVvNDlaUXdpOU55TkdUc01BdFRyQW89XCIsXCJOZXh0Q2FjaGVLZXlcIjpudWxsLFwiU2VjdXJpdHlUb2tlblNlcnZpY2VVcmlcIjpcImh0dHBzOi8vYWNjb3VudHMuYWNjZXNzY29udHJvbC53aW5kb3dzLm5ldC90b2tlbnMvT0F1dGgvMlwifSIsImFwcGN0eHNlbmRlciI6IjAwMDAwMDAzLTAwMDAtMGZmMS1jZTAwLTAwMDAwMDAwMDAwMEBkYTlhOTRiNi00NjgxLTQ5YmMtYmQ3Yy1iYWI5ZWFjMGFkM2MiLCJpc2Jyb3dzZXJob3N0ZWRhcHAiOiJ0cnVlIiwicmVmcmVzaHRva2VuIjoiSUFBQUFLdHJzT1JXckVUd19UQzRtcDJOejJnSW40V09oOEw3ZXNUWnJDcmFsZDR4TDRkSmlmczJGNGJRQV8zTEFNMEJpSmxORXlRVmZIUG5wZ2o5NTJTUE9neEdlT0drM19FWmI0RzJnczZSdGFFUklTdlFVclZ0dHVUV1VuN3dURXN0Wk9WS1cyZWNYTERYaE0zd2JZMWJscGx4b0NBVllxR3VteDJQRzViOFllUHJrT0NtRmlkWUU5eHNRVmhObU1xVWd1a29Lc2RpSDYwQUtnSF9fUF9Za0tvS3gtLUlDQkxoNkM5U1ZuaVFYT0FQOWlKS2xmRkd1bWpMUXBVZkt5ZnpEWmFzLXZlcnByN2JLT29xZjFYeXBjdkRzaldPYmlMVjVvVmstVEdaaHRVeDZPWEVHZk9NVzZTYlRocURWVk10VXcifQ.UsxTcESzJa_tt7HPofTvXEiL4XeMKQN4N_iaIEPzACc">View all events</a>
        </div>
    </div>

    );
  }
}

function mapStateToProps(state) {
    return {
        events: state.events,
        activeDates: state.activeDates
    };
}
function matchDispatchToProps(dispatch){
    return bindActionCreators({selectEvent: selectEvent}, dispatch);
}

export default localize()(connect(mapStateToProps, matchDispatchToProps)(App)) ;

export {App};

