
import {combineReducers} from 'redux';
import Events from './reducer-events';
import ActiveEvent from './reducer-active-event';
import UserReducer from './reducer-users'
import ActiveUserReducer from './reducer-active-user'

const allReducers = combineReducers({
    events: Events,
    activeDates: ActiveEvent
  })
export default allReducers;