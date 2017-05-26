import React from 'react'
import {shallow, ShallowWrapper} from 'enzyme'
import {PlaceOfInterestItem} from '../components/PlaceOfInterestItem'
import ReactMatchers from 'jasmine-react-matchers'

var sharedSetup

function setup() {
  const props = {
    name: "Chartwells",
    placeLink: "https://subway.com/home",
    mapLink: "https://maps.google.ca/?q=Chartwells",
    locationId: "E109",
    launchMap: jest.fn(),
    launchPlaceDetails: jest.fn(),
    launchCameraView: jest.fn()
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
            `expected element with className '${received.className}' and type '${received.type()}' not to have class ${argument}`
        ),
        pass: true
      }
    } else {
      return {
        message: () => (
            `expected element with className '${received.className}' and type '${received.type()}' to have class ${argument}`
        ),
        pass: false
      }
    }
  }
});

beforeEach(() => {
  sharedSetup = setup();
});

describe('components', () => {
  beforeEach(()=> {
    // Add here
    jasmine.addMatchers(ReactMatchers)
  })
  describe('PlaceOfInterestItem', () => {
    it('should render self', () => {
      const {enzymeWrapper, props} = sharedSetup
      const element = enzymeWrapper.find('li')
      expect(element.hasClass('placeOfInterestItem')).toBe(true)
      expect(element.hasClass('ms-Grid-row')).toBe(true)
      expect(element.children().length).toBe(2)
    })
    it('should render self with first child being a div with place name and link', () => {
      const {enzymeWrapper, props} = sharedSetup
      const element = enzymeWrapper.find('li')
      const placeElement = element.childAt(0)
      expect(placeElement.type()).toBe('div')
      expect(placeElement).toHaveClass('ms-Grid-col')
      expect(placeElement).toHaveClass('ms-u-sm3')
      const placeLink = placeElement.childAt(0)
      expect(placeLink.type()).toBe('a')
      expect(placeLink.text()).toEqual(props.name)
      expect(placeLink.props().href).toBe(props.placeLink)
    })
    it('Style #1: should render self with second child being a nicely formatted map link', () => {
      const {enzymeWrapper, props} = sharedSetup
      const element = enzymeWrapper.find('li')

      expect(element.children().length).toBe(2)

      //mapLink
      const mapLink = element.childAt(1)
      expect(mapLink.children().length).toBe(3)

      expect(mapLink.type()).toBe('a')
      expect(mapLink.props().href).toEqual(props.mapLink)
      expect(mapLink.props().target).toEqual("_blank")
      expect(mapLink).toHaveClass('mapLink')

      const spacerElement = mapLink.childAt(0)
      expect(spacerElement.type()).toBe('div')
      expect(spacerElement).toHaveClass("ms-Grid-col")
      expect(spacerElement).toHaveClass("ms-u-sm1")
      expect(spacerElement.text()).toBe(" ")

      const iconDivElement = mapLink.childAt(1)
      expect(iconDivElement.type()).toBe('div')
      expect(iconDivElement).toHaveClass("ms-Grid-col")
      expect(iconDivElement).toHaveClass("ms-u-sm1")
      const iconElement = iconDivElement.childAt(0)
      expect(iconElement.type()).toBe('i')
      expect(iconElement).toHaveClass('ms-Icon')
      expect(iconElement).toHaveClass('ms-Icon--POI')

      const locationIdElement = mapLink.childAt(2)
      expect(locationIdElement.type()).toBe('div')
      expect(locationIdElement).toHaveClass('ms-Grid-col')
      expect(locationIdElement).toHaveClass('ms-u-sm2')
    })
    it('Style #2 : should render self with second child being a nicely formatted map link', () => {
      const {enzymeWrapper, props} = sharedSetup
      const element = enzymeWrapper.find('li')
      const locationLink = element.childAt(1)
      expect(locationLink.childAt(0).containsMatchingElement(
          <div className="ms-Grid-col ms-u-sm1">&nbsp;</div>
      )).toBe(true)
      expect(locationLink.childAt(1).containsMatchingElement(
          <div className="ms-Grid-col ms-u-sm1">
            <i className="ms-Icon ms-Icon--POI"></i>
          </div>
      )).toBe(true)
      expect(locationLink.childAt(2).containsMatchingElement(
          <div className="ms-Grid-col ms-u-sm2">{props.locationId}</div>
      )).toBe(true)
      expect(locationLink.containsMatchingElement(
          <a target="_blank" className="mapLink"
             href={props.mapLink}>
            <div className="ms-Grid-col ms-u-sm1">&nbsp;</div>
            <div className="ms-Grid-col ms-u-sm1">
              <i className="ms-Icon ms-Icon--POI"></i>
            </div>
            <div className="ms-Grid-col ms-u-sm2">{props.locationId}</div>
          </a>)).toBe(true)
    })
    it('Style #3 : should render self with second child being a nicely formatted map link', () => {
      const {enzymeWrapper, props} = sharedSetup
      const element = enzymeWrapper.find('li')
      const locationLink = element.childAt(1)
      const actual = <a target="_blank" className="mapLink" href={props.mapLink}></a>
      const expected =           <a target="_blank" className="mapLink"
                                    href={props.mapLink}>
        <div className="ms-Grid-col ms-u-sm1">&nbsp;</div>
        <div className="ms-Grid-col ms-u-sm1">
          <i className="ms-Icon ms-Icon--POI"></i>
        </div>
        <div className="ms-Grid-col ms-u-sm2">{props.locationId}</div>
      </a>
      expect(actual).toEqualElement(expected)
      expect(locationLink).toEqualElement(
          <a target="_blank" className="mapLink"
             href={props.mapLink}>
            <div className="ms-Grid-col ms-u-sm1">&nbsp;</div>
            <div className="ms-Grid-col ms-u-sm1">
              <i className="ms-Icon ms-Icon--POI"></i>
            </div>
            <div className="ms-Grid-col ms-u-sm2">{props.locationId}</div>
          </a>)
    })

      // it('should call addTodo if length of text is greater than 0', () => {
    //   const {enzymeWrapper, props} = setup()
    //   const input = enzymeWrapper.find('TodoTextInput')
    //   input.props().onSave('')
    //   expect(props.addTodo.mock.calls.length).toBe(0)
    //   input.props().onSave('Use Redux')
    //   expect(props.addTodo.mock.calls.length).toBe(1)
    // })
  })
})