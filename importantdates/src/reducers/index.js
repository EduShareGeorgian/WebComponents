
import {combineReducers} from 'redux';
import Events from './reducer-events';
import ActiveEvent from './reducer-active-event';
import { localeReducer } from 'react-localize-redux';

const allReducers = combineReducers({
    events: Events,
    activeDates: ActiveEvent,
    locale: localeReducer
  })
export default allReducers;