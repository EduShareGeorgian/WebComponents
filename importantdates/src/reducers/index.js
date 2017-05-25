
import {combineReducers} from 'redux';
import Events from './reducer-events';
import ActiveEvent from './reducer-active-event';


const allReducers = combineReducers({
    events: Events,
    activeDates: ActiveEvent
  })
export default allReducers;