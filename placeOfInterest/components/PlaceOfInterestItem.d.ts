/// <reference types="react" />
import * as React from 'react';
import { IPlaceOfInterestItemProps } from './IPlaceOfInterestItemProps';
export default class PlaceOfInterestItem extends React.Component<IPlaceOfInterestItemProps, any> {
    constructor(props: IPlaceOfInterestItemProps);
    protected _onMapLinkClick(event: React.MouseEvent<HTMLElement>): void;
    protected _onDetailsLinkClick(event: React.MouseEvent<HTMLElement>): void;
    render(): JSX.Element;
}
export { PlaceOfInterestItem, IPlaceOfInterestItemProps };
