import * as React from 'react';
import * as ReactDOM from 'react-dom';

const CanvasComponent = React.createClass({

    componentDidMount() {
        this.updateCanvas();
    },
    updateCanvas() {
        const ctx = this.refs.canvas.getContext('2d');
          
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 100);
        ctx.stroke();
        ctx.fillStyle = "green";
        ctx.fillRect(0,20, 100, 50);
    },
    render() {
        return (
            <div style={{paddingLeft:"60px", paddingTop:"40px"}}>
                <canvas ref="canvas" width={150} height={150} />            
            </div>
        );
    }

});

export default CanvasComponent;