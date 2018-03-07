"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var LineChart = require("react-chartjs");
var Chart = LineChart["Doughnut"];
var DoughnutChart = React.createClass({
    getDefaultProps: function () {
        return {
            JSON: []
        };
    },
    dataSet: function (json) {
        var items = Array.prototype.slice.call(arguments[0]);
        var results = [];
        json.forEach(function (element) {
            var prop = Object.keys(element)[0];
            results.push({ color: element["color"], value: "" + element["value"], label: element["label"] });
        });
        return results;
    },
    render: function () {
        var json = this.props.JSON;
        return React.createElement(Chart, { data: this.dataSet(json), width: "180", height: "250", style: { float: "right" } });
    }
});
exports.default = DoughnutChart;

//# sourceMappingURL=Chart.js.map
