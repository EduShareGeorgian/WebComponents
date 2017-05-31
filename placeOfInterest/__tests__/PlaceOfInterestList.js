import renderer from "react-test-renderer"
import React from "react"
import PlaceOfInterestList from "../components/PlaceOfInterestList";
import {shallow, mount} from "enzyme"
import {DetailsList} from "office-ui-fabric-react"

describe( "Place of Interest list component", () => {

  describe( "with items", () => {
    const items = () => [
      {key:1,name:"todd"},
      {key:2,name:"Hiles"}
    ];
    it ("should render itself with DetailList (simulated real DOM mount method)", () => {
      const fullyRenderedWrapper = mount(<PlaceOfInterestList items={items()}/>)
      console.log(fullyRenderedWrapper.debug())
      expect(fullyRenderedWrapper.containsMatchingElement(<div><DetailsList items={items()}></DetailsList></div>)).toBe(true)
    })
    it ("should provide the items to the DetailsList", () => {
      const shallowRenderedWrapper = shallow(<PlaceOfInterestList items={items()}/>)
      console.log(shallowRenderedWrapper.debug())
      // Important: The Office Fabric DetailsList acutally renders a WithViewportComponent node NOT a DetailsList node!!!
      const detailsList = shallowRenderedWrapper.find('WithViewportComponent').first()
      console.log(detailsList.debug())
      expect(detailsList.props().items).toEqual(items())
    })
  })
  describe( "without items", () => {
    it ("should render an empty div (shallow React DOM render method)", () => {
      const shallowRenderedWrapper = shallow(
          <PlaceOfInterestList></PlaceOfInterestList>
      )
      expect(shallowRenderedWrapper.containsMatchingElement(<div/>)).toBe(true)
    })
    it ("should render an empty div (React DOM snapshot method)", () => {
      const renderedComponent = renderer.create(
          <PlaceOfInterestList></PlaceOfInterestList>
      ).toJSON()
      expect(renderedComponent).toMatchSnapshot()
    })
  })

})