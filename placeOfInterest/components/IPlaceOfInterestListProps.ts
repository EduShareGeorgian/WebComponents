export interface IPlaceOfInterestListProps {
    items: any[];
    onDetailsLinkSelected?: (item?: any, index?: number, ev?: React.MouseEvent<HTMLElement>) => void;
    onCameraLinkSelected?: (item?: any, index?: number, ev?: React.MouseEvent<HTMLElement>) => void;
    /** Callback for when an items Map link is selected/clicked */
    onMapLinkSelected?: (item?: any, index?: number, ev?: React.MouseEvent<HTMLElement>) => void;
}