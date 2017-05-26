import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

class eventDetail extends Component {
    renderList() {  
        if ( !this.props.activeDates) {
            return (<div></div>);
        }
        return this.props.activeDates.map((activeDate) => {
            return (
                <tr>
                    <td>{activeDate.date}</td>
                    <td>{activeDate.description}</td>
                </tr>
                );
        });
    }

    render() {
        return (
            <table ClassName="table">
                <tbody>
                    {this.renderList()}
                </tbody>
            </table>
        );
    }
}
function mapStateToProps(state) {
    return {
    };
}

function matchDispatchToProps(dispatch){
 
}
export default connect(mapStateToProps, matchDispatchToProps)(eventDetail);
