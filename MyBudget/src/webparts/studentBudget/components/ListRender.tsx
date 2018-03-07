import * as React from 'react';
import * as ReactDOM from 'react-dom';


var ListRender = React.createClass({

    
   getDefaultProps(){
    return {
        list: []
    };},


    render: function() {
        return (
            <div>
                {
                    this.props.list.map(function(listValue){
                        return <span style={{display: "block", fontSize:"13"}}><button style={{background: listValue["color"], padding:"4px", border: "none", verticalAlign:"middle"}}></button>{listValue["value"]}</span>;
                    })
                }
            </div>
            );}
    });


export default ListRender;