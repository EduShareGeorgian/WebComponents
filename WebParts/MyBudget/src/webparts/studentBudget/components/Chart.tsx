
import * as ReactDOM from 'react-dom';
import * as React from 'react';
var LineChart = require("react-chartjs");
const Chart = LineChart["Doughnut"];

var DoughnutChart = React.createClass({

   getDefaultProps(){
    return {
        JSON: []
    }},
    
  dataSet(json) {
        var items = Array.prototype.slice.call(arguments[0]);
        var results = [];
        json.forEach(element => {
            var prop = Object.keys(element)[0];
             results.push({ color: element["color"], value: ""+element["value"] , label: element["label"]});
        });
          return results;
  },

  render: function() {
  
   var json = this.props.JSON;
    return <Chart  data={ this.dataSet(json) } width="180" height="250" style={{float:"right"}}/>;
  }
});

export default DoughnutChart;