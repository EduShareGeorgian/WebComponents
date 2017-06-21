import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import { PlaceOfInterestItem } from '../dist/PlaceOfInterestItem'
import { default as toJson, shallowToJson } from 'enzyme-to-json'


function setup() {
  const props = {
    name: "Chartwells",
    detailsLink: new URL("https://subway.com/home"),
    mapLink: new URL("https://maps.google.ca/?q=Chartwells"),
    locationId: "E109",
    hoursDescription: "7:30am - 2:30pm",
    onMapLinkSelected: jest.fn(),
    onDetailsLinkSelected: jest.fn(),
    onCameraLinkSelected: jest.fn()
  }

  const enzymeWrapper = shallow(<PlaceOfInterestItem {...props} />)

  return {
    props,
    enzymeWrapper
  }
}

expect.extend({
  toHaveClass(received, argument) {
    if (! (received instanceof ShallowWrapper)) {
      return {
        message: () => (
            `expected value to be instance of 'ShallowWrapper' but instead received '${typeof received}'`
        ),
        pass: false
      }
    }
    const pass = received.hasClass(argument)
    if (pass) {
      return {
        message: () => (
            `expected element '${toJson(received)}' , '${shallowToJson(received)}' not to have class ${argument}`
        ),
        pass: true
      }
    } else {
      return {
        message: () => (
            `expected element '${toJson(received)}' , '${shallowToJson(received)}' to have class ${argument}`
        ),
        pass: false
      }
    }
  }
});


describe('components', () => {
  describe('PlaceOfInterestItem', () => {
    it('should render self', () => {
      const {enzymeWrapper, props} = setup()
      const element = enzymeWrapper.find('li')
      expect(element.hasClass('placeOfInterestItem')).toBe(true)
      expect(element.hasClass('ms-Grid-row')).toBe(true)
      expect(element.children().length).toBe(3)
    })
    it('should render self with first child being a div with place name and link', () => {
      const {enzymeWrapper, props} = setup()
      const element = enzymeWrapper.find('li')
      const placeElement = element.childAt(0)
      expect(placeElement.type()).toBe('div')
      expect(placeElement).toHaveClass('ms-Grid-col')
      expect(placeElement).toHaveClass('ms-u-sm3')
      const placeLink = placeElement.childAt(0)
      expect(placeLink.type()).toBe('a')
      expect(placeLink.text()).toEqual(props.name)
      expect(placeLink.props().href).toBe(props.detailsLink.href)
    })
    it('Style #1: should render self with second child being a nicely formatted map link', () => {
      const {enzymeWrapper, props} = setup()
      const element = enzymeWrapper.find('li')

      expect(element.children().length).toBe(3)

      // place
      const placeElement = element.childAt(0)
      expect(placeElement.type()).toBe('div')
      expect(placeElement).toHaveClass('ms-Grid-col')
      expect(placeElement).toHaveClass('ms-u-sm3')
      const placeLink = placeElement.childAt(0)
      expect(placeLink.type()).toBe('a')
      expect(placeLink.text()).toEqual(props.name)
      expect(placeLink.props().href).toBe(props.detailsLink.href)

      //mapLink
      const mapLink = element.childAt(1)
      expect(mapLink.children().length).toBe(3)

      expect(mapLink.type()).toBe('a')
      expect(mapLink.props().href).toEqual(props.mapLink.href)
      expect(mapLink.props().target).toEqual("_blank")
      expect(mapLink).toHaveClass('mapLink')

      const mapLinkSpacerElement = mapLink.childAt(0)
      expect(mapLinkSpacerElement.type()).toBe('div')
      expect(mapLinkSpacerElement).toHaveClass("ms-Grid-col")
      expect(mapLinkSpacerElement).toHaveClass("ms-u-sm1")
      expect(mapLinkSpacerElement.text()).toBe(" ")

      const mapLinkIconDivElement = mapLink.childAt(1)
      expect(mapLinkIconDivElement.type()).toBe('div')
      expect(mapLinkIconDivElement).toHaveClass("ms-Grid-col")
      expect(mapLinkIconDivElement).toHaveClass("ms-u-sm1")
      const mapLinkIconElement = mapLinkIconDivElement.childAt(0)
      expect(mapLinkIconElement.type()).toBe('i')
      expect(mapLinkIconElement).toHaveClass('ms-Icon')
      expect(mapLinkIconElement).toHaveClass('ms-Icon--POI')

      const mapLinkLocationIdElement = mapLink.childAt(2)
      expect(mapLinkLocationIdElement.type()).toBe('div')
      expect(mapLinkLocationIdElement).toHaveClass('ms-Grid-col')
      expect(mapLinkLocationIdElement).toHaveClass('ms-u-sm2')

      //hours
      const hoursElement = element.childAt(2)
      expect(hoursElement.type()).toBe('div')
      expect(hoursElement.text()).toBe('7:30am - 2:30pm')
    })
    it('Style #2 : should render self with second child being a nicely formatted map link', () => {
      const {enzymeWrapper, props} = setup()
      const element = enzymeWrapper.find('li')
      const mapLink = element.childAt(1)
      expect(mapLink.childAt(0).containsMatchingElement(
          <div className="ms-Grid-col ms-u-sm1">&nbsp;</div>
      )).toBe(true)
      expect(mapLink.childAt(1).equals(
          <div className="ms-Grid-col ms-u-sm1">
            <i className="ms-Icon ms-Icon--POI" aria-hidden="true"></i>
          </div>
      )).toBe(true)
      expect(mapLink.childAt(2).containsMatchingElement(
          <div className="ms-Grid-col ms-u-sm2">{props.locationId}</div>
      )).toBe(true)
      expect(mapLink.containsMatchingElement(
          <a target="_blank" className="mapLink"
             href={props.mapLink.href}>
            <div className="ms-Grid-col ms-u-sm1">&nbsp;</div>
            <div className="ms-Grid-col ms-u-sm1">
              <i className="ms-Icon ms-Icon--POI" aria-hidden="true"></i>
            </div>
            <div className="ms-Grid-col ms-u-sm2">{props.locationId}</div>
          </a>)).toBe(true)
    })

    it('should call launchMap when the mapLink is clicked', () => {
      const {enzymeWrapper, props} = setup()
      const element = enzymeWrapper.find('li')
      const mapLink = element.childAt(1)
      const eventSpy = { preventDefault: jest.fn(), stopPropagation: jest.fn() };
      mapLink.simulate('click', eventSpy)
      expect(eventSpy.preventDefault).toBeCalled()
      expect(eventSpy.stopPropagation).toBeCalled()
      expect(props.onMapLinkSelected).toBeCalled()
    })
  })
})