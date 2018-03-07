
import * as ReactDataGrid from 'react-data-grid';

import * as React from 'react';



import ReactDataGridPlugins from 'react-data-grid-addons';

import { ContextMenu, MenuItem, ContextMenuTrigger, SubMenu } from "react-contextmenu";





const Tt = React.createClass({
  getInitialState() {
    this._columns = [
      { key: 'id', name: 'ID' },
      { key: 'title', name: 'Title' },
      { key: 'count', name: 'Count' }
    ];

    let rows = [];
    for (let i = 1; i < 1000; i++) {
      rows.push({
        id: i,
        title: 'Title ' + i,
        count: i * 1000
      });
    }

    return { rows };
  },

  rowGetter(rowIdx) {
    return this.state.rows[rowIdx];
  },

  deleteRow(e, { rowIdx }) {
    this.state.rows.splice(rowIdx, 1);
    this.setState({rows: this.state.rows});
  },

  insertRowAbove(e, { rowIdx }) {
    this.insertRow(rowIdx);
  },

  insertRowBelow(e, { rowIdx }) {
    this.insertRow(rowIdx + 1);
  },

  insertRow(rowIdx) {
    const newRow = {
      id: 0,
      title: 'New at ' + (rowIdx + 1),
      count: 0
    };

    let rows = [...this.state.rows];
    rows.splice(rowIdx, 0, newRow);

    this.setState({ rows });
  },

  render() {
    return (
      <ReactDataGrid
        contextMenu={<MyContextMenu  />}
        columns={this._columns}
        rowGetter={this.rowGetter}
        rowsCount={this.state.rows.length}
        minHeight={500} />
    );
  }
});

// Create the context menu.
// Use this.props.rowIdx and this.props.idx to get the row/column where the menu is shown.
const MyContextMenu = React.createClass({
  propTypes: {
    onRowDelete: React.PropTypes.func.isRequired,
    onRowInsertAbove: React.PropTypes.func.isRequired,
    onRowInsertBelow: React.PropTypes.func.isRequired,
    rowIdx: React.PropTypes.string.isRequired,
    idx: React.PropTypes.string.isRequired
  },

  onRowDelete(e, data) {
    if (typeof(this.props.onRowDelete) === 'function') {
      this.props.onRowDelete(e, data);
    }
  },

  onRowInsertAbove(e, data) {
    if (typeof(this.props.onRowInsertAbove) === 'function') {
      this.props.onRowInsertAbove(e, data);
    }
  },

  onRowInsertBelow(e, data) {
    if (typeof(this.props.onRowInsertBelow) === 'function') {
      this.props.onRowInsertBelow(e, data);
    }
  },

  render() {
    return (
      <ContextMenu id="123">
        <MenuItem data={{rowIdx: this.props.rowIdx, idx: this.props.idx}} onClick={this.onRowDelete}>Delete Row</MenuItem>
       
      </ContextMenu>
    );
  }
});


export {Tt}