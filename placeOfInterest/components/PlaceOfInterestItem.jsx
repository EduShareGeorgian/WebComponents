"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var PlaceOfInterestItem = (function (_super) {
    __extends(PlaceOfInterestItem, _super);
    function PlaceOfInterestItem(props) {
        return _super.call(this, props) || this;
    }
    PlaceOfInterestItem.prototype.render = function () {
        return (<li className="placeOfInterestItem ms-Grid-row">
          <div className="ms-Grid-col ms-u-sm3"><a href={this.props.placeLink.href}>{this.props.name}</a></div>
          <a target="_blank" href={this.props.mapLink.href} className="mapLink" onClick={this.props.launchMap.bind(this)}>
            {this.props.hasCamera &&
            <div className="ms-Grid-col ms-u-sm1">
                <i className="ms-Icon ms-Icon--Camera" aria-hidden="true"></i>
              </div>}
            <div className="ms-Grid-col ms-u-sm1" aria-hidden="true">&nbsp;</div>
            <div className="ms-Grid-col ms-u-sm1">
              <i className="ms-Icon ms-Icon--POI" aria-hidden="true"></i>
            </div>
            <div className="ms-Grid-col ms-u-sm2">{this.props.locationId}</div>
          </a>
          <div className="ms-Grid-col ms-u-sm5">{this.props.hoursDescription}</div>
        </li>);
    };
    return PlaceOfInterestItem;
}(React.Component));
exports.PlaceOfInterestItem = PlaceOfInterestItem;
