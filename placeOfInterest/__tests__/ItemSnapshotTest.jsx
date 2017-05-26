import {PlaceOfInterestItem} from "../components/PlaceOfInterestItem";
import React from "react"
import renderer from "react-test-renderer"

it('renders correctly', () => {
  const props = {
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
  const tree = renderer.create(
      <PlaceOfInterestItem {...props}></PlaceOfInterestItem>
  ).toJSON();
  expect(tree).toMatchSnapshot("WithoutCamera");
});

it('renders correctly', () => {
  const props = {
    name: "Chartwells",
    placeLink: "https://subway.com/home",
    mapLink: "https://maps.google.ca/?q=Chartwells",
    locationId: "E109",
    hoursDescription: "7:30am - 2:00pm",
    hasCamera: true,
    launchMap: jest.fn(),
    launchPlaceDetails: jest.fn(),
    launchCameraView: jest.fn()
  }
  const tree = renderer.create(
      <PlaceOfInterestItem {...props}></PlaceOfInterestItem>
  ).toJSON();
  expect(tree).toMatchSnapshot("WithCamera");
});
