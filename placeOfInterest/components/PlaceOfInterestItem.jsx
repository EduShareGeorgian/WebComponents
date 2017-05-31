import React from 'react';


class PlaceOfInterestItem extends React.Component {

  render() {
    return (
        <li className="placeOfInterestItem ms-Grid-row">
          <div className="ms-Grid-col ms-u-sm3"><a href={this.props.placeLink}>{this.props.name}</a></div>
          <a target="_blank" href={this.props.mapLink} className="mapLink" onClick={this.props.launchMap.bind(this)}>
            {this.props.hasCamera &&
              <div class="foodServicesHoursRestaurant ms-Grid-col ms-u-sm1">
                <i class="ms-Icon ms-Icon--Camera" aria-hidden="true"></i>
              </div>
            }
            <div className="ms-Grid-col ms-u-sm1" aria-hidden="true">&nbsp;</div>
            <div className="ms-Grid-col ms-u-sm1">
              <i className="ms-Icon ms-Icon--POI" aria-hidden="true"></i>
            </div>
            <div className="ms-Grid-col ms-u-sm2">{this.props.locationId}</div>
          </a>
          <div className="ms-Grid-col ms-u-sm5">{this.props.hoursDescription}</div>
        </li>)
  }

}

export {PlaceOfInterestItem}