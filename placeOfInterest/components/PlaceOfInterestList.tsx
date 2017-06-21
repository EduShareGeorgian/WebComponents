import * as React from 'react';
import {DetailsList, IDetailsRowProps} from "office-ui-fabric-react"
import {PlaceOfInterestItem} from "./PlaceOfInterestItem";
import {IPlaceOfInterestItemProps} from './IPlaceOfInterestItemProps'
import {IPlaceOfInterestListProps} from "./IPlaceOfInterestListProps";

class PlaceOfInterestList extends React.Component<IPlaceOfInterestListProps, void> {
  constructor(props:IPlaceOfInterestListProps){
    super(props)
  }

  onRenderRow(props:IDetailsRowProps) {
    const item = props.item
    const itemProps : IPlaceOfInterestItemProps = {
      name : item.name,
      type: item.type,
      locationId: item.locationId,
      hoursDescription: item.hoursDescription,
      hasCamera: item.hasCamera,
    }
    return new PlaceOfInterestItem(itemProps).render()
  }

  render () {
    const items = this.props.items;
    return (
        <div>
          { items &&
            <DetailsList items={items} onRenderRow={this.onRenderRow}/>
          }
        </div>
    )
  }
}

export { PlaceOfInterestList, IPlaceOfInterestListProps}