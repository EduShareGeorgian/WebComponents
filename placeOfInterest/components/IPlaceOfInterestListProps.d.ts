export interface IPlaceOfInterestListProps {
    items: any[];
    onDetailsLinkSelected?: (url: URL) => void;
    onCameraLinkSelected?: (url: URL) => void;
    /** Callback for when an items Map link is selected/clicked */
    onMapLinkSelected?: (url: URL) => void;
}