
import * as ReactDataGrid from 'react-data-grid';


import { Editors, Toolbar, Formatters } from 'react-data-grid-addons';


import { Menu }  from 'react-data-grid-addons';

//import {update} from 'react-addons-update';//

//var update = require('react-addons-update')

import * as update from 'immutability-helper';



require ('!style-loader!css-loader!../../../../src/examples.css');

//import update from 'react-addons-update';
//const React = require('react');

import * as React from 'react';


//import update from 'react-dom';

const Example = React.createClass({
  getInitialState() {

 this._columns1 = [
     
      {
        key: 'Jan1',
        name: 'MONTHLY INCOME',
        width: 300,
        editable: true
      },
      {
        key: 'Feb1',
        name: 'Feb',
        editable: true
      },
      {
        key: 'Mar1',
        name: 'Mar',
        editable: true
      },
      {
        key: 'Apr',
        name: 'Apr',
        editable: true
      },
      {
        key: 'May',
        name: 'May',
        editable: true
      },
      {
        key: 'June',
        name: 'June',
        editable: true
      },
      {
        key: 'July',
        name: 'July',
        editable: true
      },
      {
        key: 'Aug',
        name: 'Aug',
        editable: true
      },
      {
        key: 'Sep',
        name: 'Sep',
        editable: true
      },
       {
        key: 'Oct',
        name: 'Oct',
        editable: true
      }
      
    ];


    this._columns = [
     
      {
        key: 'Jan',
        name: 'MONTHLY INCOME',
        width: 300,
        editable: true
      },
      {
        key: 'Feb',
        name: 'Feb',
        editable: true
      },
      {
        key: 'Mar',
        name: 'Mar',
        editable: true
      },
      {
        key: 'Apr',
        name: 'Apr',
        editable: true
      },
      {
        key: 'May',
        name: 'May',
        editable: true
      },
      {
        key: 'June',
        name: 'June',
        editable: true
      },
      {
        key: 'July',
        name: 'July',
        editable: true
      },
      {
        key: 'Aug',
        name: 'Aug',
        editable: true
      },
      {
        key: 'Sep',
        name: 'Sep',
        editable: true
      },
       {
        key: 'Oct',
        name: 'Oct',
        editable: true
      }
      // {
      //   key: 'Nov',
      //   name: 'Nov',
      //   editable: true
      // },
      // {
      //   key: 'Dec',
      //   name: 'Dec',
      //   editable: false
      // },
    ];

    return { rows: this.createRows(6) };
  },

  getRandomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toLocaleDateString();
  },

  sum(month){

    var sum = 0;

    this.state.rows.forEach(element => {
      sum =  sum + Number(element[month]);

      console.log(element[month]);


    });

    return sum;

  },
  createRows(numberOfRows) {
    let rows = [];
    for (let i = 1; i < numberOfRows; i++) {
      rows.push({
        Jan:  Math.min(100, Math.round(Math.random() * 110)),
        Feb: Math.min(100, Math.round(Math.random() * 110)),
        Mar:  Math.min(100, Math.round(Math.random() * 110)),
        Apr:  Math.min(100, Math.round(Math.random() * 110)),
        May: Math.min(100, Math.round(Math.random() * 110)),
        June: Math.min(100, Math.round(Math.random() * 110)),
        July: Math.min(100, Math.round(Math.random() * 110)),
        Aug: Math.min(100, Math.round(Math.random() * 110)),
        Sep: Math.min(100, Math.round(Math.random() * 110)),
        Oct: Math.min(100, Math.round(Math.random() * 110))
        // Nov: Math.min(100, Math.round(Math.random() * 110)),
        // Dec: Math.min(100, Math.round(Math.random() * 110))
      });
    }
  //  rows[Jan]
  console.log(rows);
  rows[0].Jan = "MONTHLY INCOME";
   rows[1].Jan = "Employment";
    rows[2].Jan = "Saving and investments";
    rows[3].Jan = "allowance";
    rows[4].Jan = "TOTAL INCOME";
    return rows;
  },

  rowGetter(i) {
    return this.state.rows[i];
  },


handleAddRow({ newRowIndex }) {

 // alert('000');
    const newRow = {
      Jan: '',
      Feb: '',
      Mar: '',
      Apr: '',
       May: '',
      June: '',
      July: '',
      Aug: '',
       Sep: '',
      Oct: '',
      Nov: '',
      Dec: '',
    };

    let rows = this.state.rows.slice();
    rows = update(rows, {$push: [newRow]});
    this.setState({ rows });

      this.grid.openCellEditor(rows.length -1, 0);
  },

  handleGridRowsUpdated({ fromRow, toRow, updated }) {
   // debugger;
    debugger;
    //alert('Mxaaa');
    let rows = this.state.rows.slice();

    for (let i = fromRow; i <= toRow; i++) {
      let rowToUpdate = rows[i];
      let updatedRow = update(rowToUpdate, {$merge: updated});
       rows[i] = updatedRow;
    }

   console.log(rows);
    this.setState({ rows });
  },

  render() {
    return  (
      <div className="ms-fontColor-themeDarker">
        <div style = {{textAlign:"center", color:"blue", paddingBottom:"20px"}}>Student Budget</div>
          <ReactDataGrid
           ref={ node => this.grid = node }
            enableCellSelect={true}
            columns={this._columns}
            rowGetter={this.rowGetter}
            rowsCount={this.state.rows.length}
            minHeight={250}
            toolbar={<button  onClick={this.handleAddRow}>Add</button>}
            onGridRowsUpdated={this.handleGridRowsUpdated} />



          <div style = {{textAlign:"center", color:"red", paddingBottom:"20px"}}>Student Budget123</div>
          <ReactDataGrid
           ref={ node => this.grid = node }
            enableCellSelect={true}
            columns={this._columns1}
            rowGetter={this.rowGetter}
            rowsCount={this.state.rows.length}
            minHeight={250}
            toolbar={<div/>}
            onGridRowsUpdated={this.handleGridRowsUpdated} />

            

        
    </div>);
  }
});


export {Example}