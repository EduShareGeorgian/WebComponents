export default function (state = null, action) {
    switch (action.type) {
        case 'EVENT_SELECTED':
            return action.payload;
        case 'RECEIVE_POSTS':
            return action.payload;
    }
    return state;
}
