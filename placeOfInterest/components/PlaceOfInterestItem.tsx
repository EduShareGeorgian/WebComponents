import * as React from 'react';
import {IPlaceOfInterestItemProps} from './IPlaceOfInterestItemProps'

export default class PlaceOfInterestItem extends React.Component<IPlaceOfInterestItemProps, any> {
    constructor(props: IPlaceOfInterestItemProps) {
        super(props);
        this._onMapLinkClick = this._onMapLinkClick.bind(this);
        this._onDetailsLinkClick = this._onDetailsLinkClick.bind(this);
    }

    protected _onMapLinkClick(event: React.MouseEvent<HTMLElement>) {
        event.preventDefault();
        event.stopPropagation();
        let {onMapLinkSelected} = this.props;
        if (onMapLinkSelected && this.props.mapLink) {
            onMapLinkSelected(this.props.mapLink);
        }
    }

    protected _onDetailsLinkClick(event: React.MouseEvent<HTMLElement>) {
        event.preventDefault();
        event.stopPropagation();
        let {onDetailsLinkSelected} = this.props;
        if (onDetailsLinkSelected && this.props.detailsLink) {
            onDetailsLinkSelected(this.props.detailsLink);
        }
    }

    public render() {
        return (
            <li className="placeOfInterestItem ms-Grid-row">
                <div className="ms-Grid-col ms-u-sm3"><a href={this.props.detailsLink && this.props.detailsLink.href} className="detailsLink"
                                                         onClick={this._onDetailsLinkClick}>{this.props.name}</a></div>
                <a target="_blank" href={this.props.mapLink && this.props.mapLink.href} className="mapLink" onClick={this._onMapLinkClick}>
                    {this.props.hasCamera &&
                    <div className="ms-Grid-col ms-u-sm1">
                        <i className="ms-Icon ms-Icon--Camera" aria-hidden="true"></i>
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

export {PlaceOfInterestItem, IPlaceOfInterestItemProps}