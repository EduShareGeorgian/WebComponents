


export default function (state = null, action) {

    switch (action.type) {

         
        case 'EVENT_SELECTED':

        
alert('LLL');
         console.log("123888:" + action.payload);
            return action.payload;
            break;
    }
    return state;
}
