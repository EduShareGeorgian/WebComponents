"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var CanvasComponent = React.createClass({
    componentDidMount: function () {
        this.updateCanvas();
    },
    updateCanvas: function () {
        var ctx = this.refs.canvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 100);
        ctx.stroke();
        ctx.fillStyle = "green";
        ctx.fillRect(0, 20, 100, 50);
    },
    render: function () {
        return (React.createElement("div", { style: { paddingLeft: "60px", paddingTop: "40px" } },
            React.createElement("canvas", { ref: "canvas", width: 150, height: 150 })));
    }
});
exports.default = CanvasComponent;

//# sourceMappingURL=Bar.js.map
