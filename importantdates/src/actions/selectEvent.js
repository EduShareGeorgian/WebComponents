
import CurrentEventApi from '../api/selectEventApi'

export const selectEvent = (event) => {
    var dates = CurrentEventApi.fetchCurrentEvent(event.key)
    return {
        type: 'EVENT_SELECTED',
        payload: dates
    }
};




