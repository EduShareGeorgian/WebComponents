import renderer from "react-test-renderer"
import React from "react"
import {DetailsList} from "office-ui-fabric-react"

describe( "Place of Interest list component", () => {
  it ("should render itself with an Office Fabric DetailsList component", () => {
    const renderedComponent = renderer.create(
        <DetailsList></DetailsList>
    ).toJSON()
    expect(renderedComponent).toMatchSnapshot()
  })
})