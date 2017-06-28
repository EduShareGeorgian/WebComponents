export interface IPlaceOfInterestItemProps {
    name: string
    type: string
    detailsLink?: URL
    mapLink?: URL
    locationId: string
    hoursDescription: string
    hasCamera: boolean
    onDetailsLinkSelected?: (url: URL) => void;
    onCameraLinkSelected?: (url: URL) => void;
    /** Callback for when an items Map link is selected/clicked */
    onMapLinkSelected?: (url: URL) => void;
}