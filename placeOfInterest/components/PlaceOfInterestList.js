import React from "react"
import {DetailsList} from "office-ui-fabric-react"
import {PlaceOfInterestItem} from "./PlaceOfInterestItem";

export default class PlaceOfInterestList extends React.Component {
  render () {
    const items = this.props.items;
    return (
        <div>
          { items &&
            <DetailsList items={items} rowRenderer={PlaceOfInterestItem.render}/>
          }
        </div>
    )
  }
}