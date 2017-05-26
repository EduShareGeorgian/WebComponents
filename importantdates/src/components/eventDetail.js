import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import selectEvent from '../actions/selectEvent'


class eventDetail extends Component {
    renderList() {  
        if ( !this.props.activeDates) {
            return (<div></div>);
        }
        return this.props.activeDates.map((activeDate) => {
            return (
                <div className="importantDatesSeparator ms-Grid-row tableLine">
                    <div className="ms-Grid-col ms-u-sm5">{activeDate.date}</div>
                    <div className="ms-Grid-col ms-u-sm7">{activeDate.description}</div>
                </div>
                );
        });
    }

    render() {
        return (
               <div>
                    {this.renderList()}
              </div>
        );
    }
}

//   user: state.activeUser
function mapStateToProps(state) {
    return {
        activeDates: state.activeDates
    };
}


export default connect(mapStateToProps)(eventDetail);
