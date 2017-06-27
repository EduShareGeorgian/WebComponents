/// <reference types="react" />
import * as React from 'react';
import { IDetailsRowProps } from "office-ui-fabric-react";
import { IPlaceOfInterestListProps } from "./IPlaceOfInterestListProps";
export default class PlaceOfInterestList extends React.Component<IPlaceOfInterestListProps, void> {
    constructor(props: IPlaceOfInterestListProps);
    onRenderRow(props: IDetailsRowProps): JSX.Element;
    render(): JSX.Element;
}
export { PlaceOfInterestList, IPlaceOfInterestListProps };
