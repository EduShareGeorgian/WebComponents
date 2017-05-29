import renderer from "react-test-renderer"
import React from "react"

describe( "Place of Interest list component", () => {
  it ("should render itself with an Office Fabric DetailsList component", () => {
    const renderedComponent = renderer.create(
        <div></div>
    ).toJSON()
    expect(renderedComponent).toMatchSnapshot()
  })
})