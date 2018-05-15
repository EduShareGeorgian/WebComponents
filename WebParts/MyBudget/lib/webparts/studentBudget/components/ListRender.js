"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ListRender = React.createClass({
    getDefaultProps: function () {
        return {
            list: []
        };
    },
    render: function () {
        return (React.createElement("div", null, this.props.list.map(function (listValue) {
            return React.createElement("span", { style: { display: "block", fontSize: "13" } },
                React.createElement("button", { style: { background: listValue["color"], padding: "4px", border: "none", verticalAlign: "middle" } }),
                listValue["value"]);
        })));
    }
});
exports.default = ListRender;

//# sourceMappingURL=ListRender.js.map
