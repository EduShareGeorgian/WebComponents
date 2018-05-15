import * as React from 'react';
import {
  BaseComponent,
  autobind,
  assign,
  css
} from 'office-ui-fabric-react/lib/Utilities';
import {
  IGroupedList,
  IGroupedListProps,
  IGroup
} from 'office-ui-fabric-react/lib/components/GroupedList/GroupedList.types';
// import {
//   GroupedListSection
// } from 'office-ui-fabric-react/lib/components/GroupedList/GroupedListSection';

import {
    GroupedListSection
  } from './GroupedListSection';

import {
  List
} from 'office-ui-fabric-react/lib/List';
import {
  SelectionMode
} from 'office-ui-fabric-react/lib/utilities/selection/index';
import * as stylesImport from 'office-ui-fabric-react/lib/components/GroupedList/GroupedList.scss';
const styles: any = stylesImport;

export interface IGroupedListState {
  lastWidth?: number;
  lastSelectionMode?: SelectionMode;
  groups?: IGroup[];
}

export class GroupedList extends BaseComponent<IGroupedListProps, IGroupedListState> implements IGroupedList {
  public static defaultProps = {
    selectionMode: SelectionMode.multiple,
    isHeaderVisible: true,
    groupProps: {}
  };

  public refs: {
    [key: string]: React.ReactInstance,
    root: HTMLElement,
    list: List
  };

  private _isSomeGroupExpanded: boolean;

  constructor(props: IGroupedListProps) {
    super(props);

    this._isSomeGroupExpanded = this._computeIsSomeGroupExpanded(props.groups);

    this.state = {
      lastWidth: 0,
      groups: props.groups
    };
  }

  public scrollToIndex(index: number, measureItem?: (itemIndex: number) => number): void {
    this.refs.list && this.refs.list.scrollToIndex(index, measureItem);
  }

  public componentWillReceiveProps(newProps: IGroupedListProps) {
    let {
      groups,
      selectionMode
    } = this.props;
    let shouldForceUpdates = false;

    if (newProps.groups !== groups) {
      this.setState({ groups: newProps.groups });
      shouldForceUpdates = true;
    }

    if (newProps.selectionMode !== selectionMode) {
      shouldForceUpdates = true;
    }

    if (shouldForceUpdates) {
      this._forceListUpdates();
    }
  }

  public render() {
    let {
      className,
      usePageCache,
      onShouldVirtualize
    } = this.props;
    let {
      groups
    } = this.state;

    return (
      <div
        ref='root'
        className={ css('ms-GroupedList', styles.root, className) }
        data-automationid='GroupedList'
        data-is-scrollable='false'
        role='presentation'
        
      >
        { !groups ?
          this._renderGroup(null, 0) : (
            <List
              ref='list'
              items={ groups }
              onRenderCell={ this._renderGroup }
              getItemCountForPage={ this._returnOne }
              usePageCache={ usePageCache }
              onShouldVirtualize={ onShouldVirtualize }
              
              
            />
          )
        }
      </div>
    );
  }

  public forceUpdate() {
    super.forceUpdate();
    this._forceListUpdates();
  }

  public toggleCollapseAll(allCollapsed: boolean) {
    let { groups } = this.state;
    let { groupProps } = this.props;
    let onToggleCollapseAll = groupProps && groupProps.onToggleCollapseAll;

    if (groups) {
      if (onToggleCollapseAll) {
        onToggleCollapseAll(allCollapsed);
      }

      for (let groupIndex = 0; groupIndex < groups.length; groupIndex++) {
        groups[groupIndex].isCollapsed = allCollapsed;
      }

      this._updateIsSomeGroupExpanded();

      this.forceUpdate();
    }
  }

  @autobind
  private _renderGroup(group: any, groupIndex: number) {
    let {
      dragDropEvents,
      dragDropHelper,
      eventsToRegister,
      groupProps,
      items,
      listProps,
      onRenderCell,
      selectionMode,
      selection,
      viewport
    } = this.props;

    // override group header/footer props as needed
    let dividerProps = {
      onToggleSelectGroup: this._onToggleSelectGroup,
      onToggleCollapse: this._onToggleCollapse,
      onToggleSummarize: this._onToggleSummarize
    };

    let headerProps = assign({}, groupProps!.headerProps, dividerProps);
    let showAllProps = assign({}, groupProps!.showAllProps, dividerProps);
    let footerProps = assign({}, groupProps!.footerProps, dividerProps);
    let groupNestingDepth = this._getGroupNestingDepth();

    if (!groupProps!.showEmptyGroups && group && group.count === 0) {
      return null;
    }

    return (
      <GroupedListSection
        ref={ 'group_' + groupIndex }
        key={ this._getGroupKey(group, groupIndex) }
        dragDropEvents={ dragDropEvents }
        dragDropHelper={ dragDropHelper }
        eventsToRegister={ eventsToRegister }
        footerProps={ footerProps }
        getGroupItemLimit={ groupProps && groupProps.getGroupItemLimit }
        group={ group }
        groupIndex={ groupIndex }
        groupNestingDepth={ groupNestingDepth }
        headerProps={ headerProps }
        listProps={ listProps }
        items={ items }
        onRenderCell={ onRenderCell }
        onRenderGroupHeader={ groupProps!.onRenderHeader }
        onRenderGroupShowAll={ groupProps!.onRenderShowAll }
        onRenderGroupFooter={ groupProps!.onRenderFooter }
        selectionMode={ selectionMode }
        selection={ selection }
        showAllProps={ showAllProps }
        viewport={ viewport }
        
      />
    );
  }

  private _returnOne(): number {
    return 1;
  }

  private _getGroupKey(group: IGroup, index: number): string {
    return 'group-' + ((group && group.key) ? group.key : String(index));
  }

  private _getGroupNestingDepth(): number {
    let { groups } = this.state;
    let level = 0;
    let groupsInLevel = groups;

    while (groupsInLevel && groupsInLevel.length > 0) {
      level++;
      groupsInLevel = groupsInLevel[0].children;
    }

    return level;
  }

  @autobind
  private _onToggleCollapse(group: IGroup) {
    let { groupProps } = this.props;
    let onToggleCollapse = groupProps && groupProps.headerProps && groupProps.headerProps.onToggleCollapse;

    if (group) {
      if (onToggleCollapse) {
        onToggleCollapse(group);
      }

      group.isCollapsed = !group.isCollapsed;
      this._updateIsSomeGroupExpanded();
      this.forceUpdate();
    }
  }

  @autobind
  private _onToggleSelectGroup(group: IGroup) {
    if (group) {
      this.props.selection!.toggleRangeSelected(group.startIndex, group.count);
    }
  }

  private _forceListUpdates(groups?: IGroup[]) {
    groups = groups || this.state.groups;

    let groupCount = groups ? groups.length : 1;

    if (this.refs.list) {
      this.refs.list.forceUpdate();

      for (let i = 0; i < groupCount; i++) {
        let group = this.refs.list.refs['group_' + String(i)] as GroupedListSection;
        if (group) {
          group.forceListUpdate();
        }
      }
    } else {
      let group = this.refs['group_' + String(0)] as GroupedListSection;
      if (group) {
        group.forceListUpdate();
      }
    }
  }

  @autobind
  private _onToggleSummarize(group: IGroup) {
    let { groupProps } = this.props;
    let onToggleSummarize = groupProps && groupProps.showAllProps && groupProps.showAllProps.onToggleSummarize;

    if (onToggleSummarize) {
      onToggleSummarize(group);
    } else {
      if (group) {
        group.isShowingAll = !group.isShowingAll;
      }

      this.forceUpdate();
    }
  }

  private _computeIsSomeGroupExpanded(groups: IGroup[] | undefined): boolean {
    return !!(groups && groups.some(group => group.children ? this._computeIsSomeGroupExpanded(group.children) : !group.isCollapsed));
  }

  private _updateIsSomeGroupExpanded() {
    let { groups } = this.state;
    let { onGroupExpandStateChanged } = this.props;

    let newIsSomeGroupExpanded = this._computeIsSomeGroupExpanded(groups);
    if (this._isSomeGroupExpanded !== newIsSomeGroupExpanded) {
      if (onGroupExpandStateChanged) {
        onGroupExpandStateChanged(newIsSomeGroupExpanded);
      }
      this._isSomeGroupExpanded = newIsSomeGroupExpanded;
    }
  }
}