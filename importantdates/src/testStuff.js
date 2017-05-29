import React from 'react';


class TestStuff extends React.Component {

  render() {
    return (
        <div id="HeaderContainer" class="ms-Grid ms-bgColor-white WebPartOuterContainer">
            <div class="ms-Grid-row">
                <div class="ms-Grid-col ms-u-sm12 WebPartHeading" style="background-image: url('../Images/calendar.svg')">
                    <h2>Important Dates</h2>
                </div>
            </div>             
        </div>                      
    )
  }
}

export {TestStuff}