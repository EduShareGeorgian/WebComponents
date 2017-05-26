import React from 'react';


class PlaceOfInterestItem extends React.Component {

  render() {
    return (
        <li className="placeOfInterestItem ms-Grid-row">
          <div className="ms-Grid-col ms-u-sm3"><a href={this.props.placeLink}>{this.props.name}</a></div>
          <a target="_blank" href={this.props.mapLink} className="mapLink">
            <div className="ms-Grid-col ms-u-sm1">&nbsp;</div>
            <div className="ms-Grid-col ms-u-sm1">
              <i className="ms-Icon ms-Icon--POI"></i>
            </div>
            <div className="ms-Grid-col ms-u-sm2">{this.props.locationId}</div>
          </a>
        </li>)
  }

}

PlaceOfInterestItem.PropTypes = {

}

export {PlaceOfInterestItem}