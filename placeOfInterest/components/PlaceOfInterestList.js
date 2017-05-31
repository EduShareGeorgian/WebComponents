import React from "react"
import {DetailsList} from "office-ui-fabric-react"
import {PlaceOfInterestItem} from "./PlaceOfInterestItem";

export default class PlaceOfInterestList extends React.Component {
  constructor(props){
    super(props)
    this.rowRenderer = new PlaceOfInterestItem()
  }

  render () {
    const items = this.props.items;
    return (
        <div>
          { items &&
            <DetailsList items={items} rowRenderer={this.rowRenderer.render}/>
          }
        </div>
    )
  }
}