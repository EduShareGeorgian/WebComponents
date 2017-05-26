import {PlaceOfInterestItem} from "../components/PlaceOfInterestItem";
import React from "react"
import renderer from "react-test-renderer"


describe('components', () => {
  describe('PlaceOfInterestItem', () => {
    const defaultProps = () => {
      return {
        name: "Chartwells",
        placeLink: "https://subway.com/home",
        mapLink: "https://maps.google.ca/?q=Chartwells",
        locationId: "E109",
        hoursDescription: "7:30am - 2:00pm",
        hasCamera: false,
        launchMap: jest.fn(),
        launchPlaceDetails: jest.fn(),
        launchCameraView: jest.fn()
      }
    };
    it('renders correctly without Camera Icon', () => {
      const tree = renderer.create(
          <PlaceOfInterestItem {...defaultProps()}></PlaceOfInterestItem>
      ).toJSON();
      expect(tree).toMatchSnapshot("WithoutCamera");
    })
    it('renders correctly with Camera Icon', () => {
      const props = defaultProps();
      props.hasCamera = true;
      const tree = renderer.create(
          <PlaceOfInterestItem {...props}></PlaceOfInterestItem>
      ).toJSON();
      expect(tree).toMatchSnapshot("WithCamera");
    });
  });
});
