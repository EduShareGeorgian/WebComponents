export interface IPlaceOfInterestItemProps {
    name: string,
    placeLink?: URL,
    mapLink?: URL,
    locationId: string,
    hoursDescription: string,
    hasCamera: boolean,
    launchMap?: Function,
    launchPlaceDetails?: Function,
    launchCameraView?: Function
}