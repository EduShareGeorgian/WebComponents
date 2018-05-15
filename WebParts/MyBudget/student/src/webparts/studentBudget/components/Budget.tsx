
import * as ReactDataGrid from 'react-data-grid';

import * as $ from 'jquery';


import { Editors, Toolbar, Formatters } from 'react-data-grid-addons';


import ReactDataGridPlugins from 'react-data-grid-addons';

import { ContextMenu, MenuItem, ContextMenuTrigger, SubMenu } from "react-contextmenu";


require ('!style-loader!css-loader!../../../../src/examples.css');



import { Menu }  from 'react-data-grid-addons';

import * as update from 'immutability-helper';

import * as json2csv from 'json2csv';


import * as React from 'react';


const { Row } = ReactDataGrid;

//import update from 'react-dom';


const PercentCompleteFormatter = React.createClass({
  

  render() {
    const percentComplete = this.props.value;
    return (
      <div className="progress" style={{marginTop: '20px'}}>
        <div style = {{color:"#EB6C2C"}} >
          {percentComplete}
        </div>
      </div>);
  }
});


const RowRenderer = React.createClass({
  propTypes: {
    idx: React.PropTypes.string.isRequired
  },

  setScrollLeft(scrollBy) {
    // if you want freeze columns to work, you need to make sure you implement this as apass through
    this.row.setScrollLeft(scrollBy);
  },

  getRowStyle() {
    return {
      color: this.getRowBackground()
    };
  },

  getRowBackground() {
    return this.props.idx % 2 ?  'green' : 'blue';
  },

  render: function() {
    // here we are just changing the style
    // but we could replace this with anything we liked, cards, images, etc
    // usually though it will just be a matter of wrapping a div, and then calling back through to the grid
    return (<div style={this.getRowStyle()}><Row ref={ node => this.row = node } {...this.props}/></div>);
  }
});

const MyContextMenu = React.createClass({


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
      <ContextMenu id="1232">
       
         <MenuItem data={{rowIdx: this.props.rowIdx, idx: this.props.idx}} onClick={this.onRowDelete}>Delete Row</MenuItem>
      </ContextMenu>
    );
  }
});


const Example = React.createClass({
  getInitialState() {

    var months = [
       {
        key: 'Jan',
        name: 'Jan',
        editable: true,
        width:50
      },
      {
        key: 'Feb',
        name: 'Feb',
        editable: true,
          width:50
      },
      {
        key: 'Mar',
        name: 'Mar',
        editable: true,
          width:50
      },
      {
        key: 'Apr',
        name: 'Apr',
        editable: true,
          width:50
      },
      {
        key: 'May',
        name: 'May',
        editable: true,
           width:50
      },
      {
        key: 'June',
        name: 'June',
        editable: true,
           width:60
      },
      {
        key: 'July',
        name: 'July',
        editable: true,
           width:60
      },
      {
        key: 'Aug',
        name: 'Aug',
        editable: true,
           width:60
      },
      {
        key: 'Sep',
        name: 'Sep',
        editable: true,
           width:60
      },
       {
        key: 'Oct',
        name: 'Oct',
        editable: true,
           width:60
      },
     
          {
        key: 'Nov',
        name: 'Nov',
        editable: true,
        width:50
      },
       
      {
        key: 'Dec',
        name: 'Dec',
        editable: true,
           width:60
       
      },
          
      {
        key: 'Year',
        name: 'Year',
          width:60,
        editable: true,
           formatter: PercentCompleteFormatter
      }

    ]
    
    var months1 = [
       {
        key: 'Jan',
        name: '',
        editable: true,
        width:50
      },
      {
        key: 'Feb',
        name: '',
        editable: true,
          width:50
      },
      {
        key: 'Mar',
        name: '',
        editable: true,
          width:50
      },
      {
        key: 'Apr',
        name: '',
        editable: true,
          width:50
      },
      {
        key: 'May',
        name: '',
        editable: true,
           width:50
      },
      {
        key: 'June',
        name: '',
        editable: true,
           width:60
      },
      {
        key: 'July',
        name: '',
        editable: true,
           width:60
      },
      {
        key: 'Aug',
        name: '',
        editable: true,
           width:60
      },
      {
        key: 'Sep',
        name: '',
        editable: true,
           width:60
      },
       {
        key: 'Oct',
        name: '',
        editable: true,
           width:60
      },
     
          {
        key: 'Nov',
        name: '',
        editable: true,
        width:50
      },
       
      {
        key: 'Dec',
        name: '',
        editable: true,
           width:60
       
      },
          
      {
        key: 'Year',
        name: '',
          width:60,
        editable: true,
        formatter: PercentCompleteFormatter
      }

    ]
    
    var columns2 =    
      [{
        key: 'MonthlyExpense',
        name: 'MONTHLY EXPENSE',
        width: 140,
     
        editable: true
      }]

 var columns3 =    
      [{
        key: 'Housing',
        name: '',
        width: 140,
     
        editable: true
      }]

    this._columns3 =  columns3.concat(months1)

    this._columns2 = columns2.concat(months);
    this._columns = [
     
      {
        key: 'MonthlyIncome',
        name: 'MONTHLY INCOME',
        width: 140,
        background: 'red',
        editable: true
      },
      {
        key: 'Jan',
        name: 'Jan',
        editable: true,
        width:50
      },
      {
        key: 'Feb',
        name: 'Feb',
        editable: true,
          width:50
      },
      {
        key: 'Mar',
        name: 'Mar',
        editable: true,
          width:50
      },
      {
        key: 'Apr',
        name: 'Apr',
        editable: true,
          width:50
      },
      {
        key: 'May',
        name: 'May',
        editable: true,
           width:50
      },
      {
        key: 'June',
        name: 'June',
        editable: true,
           width:60
      },
      {
        key: 'July',
        name: 'July',
        editable: true,
           width:60
      },
      {
        key: 'Aug',
        name: 'Aug',
        editable: true,
           width:60
      },
      {
        key: 'Sep',
        name: 'Sep',
        editable: true,
           width:60
      },
       {
        key: 'Oct',
        name: 'Oct',
        editable: true,
           width:60
      },
     
          {
        key: 'Nov',
        name: 'Nov',
        editable: true,
        width:50
      },
       
      {
        key: 'Dec',
        name: 'Dec',
        editable: true,
           width:60
       
      },
          
      {
        key: 'Year',
        name: 'Year',
        editable: true,
           formatter: PercentCompleteFormatter
         
      }

    ];


      this._columns1 = [
     
      {
        key: 'MonthlyExpense',
        name: 'MONTHLY EXPENSE',
        width: 140,
        background: 'red',
        editable: true
      },
      {
        key: 'Jan',
        name: 'Jan',
        editable: true,
        width:50
      },
      {
        key: 'Feb',
        name: 'Feb',
        editable: true,
          width:50
      },
      {
        key: 'Mar',
        name: 'Mar',
        editable: true,
          width:50
      },
      {
        key: 'Apr',
        name: 'Apr',
        editable: true,
          width:50
      },
      {
        key: 'May',
        name: 'May',
        editable: true,
           width:50
      },
      {
        key: 'June',
        name: 'June',
        editable: true,
           width:60
      },
      {
        key: 'July',
        name: 'July',
        editable: true,
           width:60
      },
      {
        key: 'Aug',
        name: 'Aug',
        editable: true,
           width:60
      },
      {
        key: 'Sep',
        name: 'Sep',
        editable: true,
           width:60
      },
       {
        key: 'Oct',
        name: 'Oct',
        editable: true,
           width:60
      },
     
      {
        key: 'Nov',
        name: 'Nov',
        editable: true,
        width:50
      },
       
      {
        key: 'Dec',
        name: 'Dec',
        editable: true,
           width:60
       
      },
          
      {
        key: 'Year',
        name: 'Year',
        editable: true,
           formatter: PercentCompleteFormatter
      }

    ];


    return { rows: this.createRows(5), rows1: this.createRows1(6), rows2: this.createRows2(5) };
  },

  


convertArrayOfObjectsToCSV(args) {
        var result, ctr, keys, columnDelimiter, lineDelimiter, data;

        data = args.data || null;
        if (data == null || !data.length) {
            return null;
        }

        columnDelimiter = args.columnDelimiter || ',';
        lineDelimiter = args.lineDelimiter || '\n';

        keys = Object.keys(data[0]);

        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        data.forEach(function(item) {
            ctr = 0;
            keys.forEach(function(key) {
                if (ctr > 0) result += columnDelimiter;

                result += item[key];
                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
    },


  downloadCSV(args) {
        var data, filename, link;
        var self = this;
        var csv = this.convertArrayOfObjectsToCSV({
            data: this.state.rows
        });
        if (csv == null) return;
        filename = 'export.csv';
        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        data = encodeURI(csv);
        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();
        self.setState({data: data,fileName: 'export.csv'})

        console.log(self.state.data);
    },
  getRandomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toLocaleDateString();
  },

  sum(rows,column){
      var amount = 0;
      rows.forEach(element => {
      amount =  amount + Number(element[column] == undefined ? 0: element[column]);
    });
    return amount;
  },

  
  sum1(rows,column){

     var temp = $.extend({}, rows);
    var amount = 0;
    delete temp[0]

   Object.keys(temp).forEach(function(key) {
      amount = amount +temp[key][column];
   
});
   
     return amount;


  },


  sumByRow(row){
    var temp = $.extend({}, row);
    var amount = 0;
    delete temp['MonthlyIncome']
    delete temp['Year']
    delete temp['MonthlyExpense']
    delete temp['Housing']
    for (var k in temp){ 
      amount = amount + Number(row[k])
    }

     return amount;
  },
  
  sumByYear(rows){
    debugger;
   rows[0].Year = this.sumByRow(rows[0]);
   rows[1].Year = this.sumByRow(rows[1]);
   rows[2].Year = this.sumByRow(rows[2]);
   rows[3].Year = this.sumByRow(rows[3]);
   rows[4].Year = this.sumByRow(rows[4]);


    return rows;

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
        Oct: Math.min(100, Math.round(Math.random() * 110)),
        Nov: Math.min(100, Math.round(Math.random() * 110)),
        Dec: Math.min(100, Math.round(Math.random() * 110))
     
      });
    }
  rows[0].MonthlyIncome = "Employment";
  rows[1].MonthlyIncome = "Saving";
  rows[2].MonthlyIncome = "Allowance";
  rows[3].MonthlyIncome = "Loan";
  rows[0].Year = this.sumByRow(rows[0]);
  rows[1].Year = this.sumByRow(rows[1]);
  rows[2].Year = this.sumByRow(rows[2]);
  rows[3].Year = this.sumByRow(rows[3]);
  
  rows.push(
   {
        MonthlyIncome:  "Summary:",
        Jan:  this.sum(rows,'Jan'),
        Feb:  this.sum(rows,'Feb'),
        Mar: this.sum(rows,'Mar'),
        Apr: this.sum(rows,'Apr'),
        May: this.sum(rows,'May'),
        June: this.sum(rows,'June'),
        July: this.sum(rows,'July'),
        Aug: this.sum(rows,'Aug'),
        Sep: this.sum(rows,'Sep'),
        Oct: this.sum(rows,'Oct'),
        Nov: this.sum(rows,'Nov'),
        Dec: this.sum(rows,'Dec')
      
  });
      return rows;
  },

   createRows1(numberOfRows) {
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
        Oct: Math.min(100, Math.round(Math.random() * 110)),
        Nov: Math.min(100, Math.round(Math.random() * 110)),
        Dec: Math.min(100, Math.round(Math.random() * 110))
     
      });
    }
      rows[0].MonthlyExpense = "Tuition&Fees";
      rows[1].MonthlyExpense = "Tuition";
      rows[2].MonthlyExpense = "Ancillary fees";
      rows[3].MonthlyExpense = "Insurance";
      rows[4].MonthlyExpense = "Student card";

      rows[0].Jan = this.sum1(rows,'Jan');
      rows[0].Feb = this.sum1(rows,'Feb');
      rows[0].Mar = this.sum1(rows,'Mar');
      rows[0].Apr = this.sum1(rows,'Apr');
      rows[0].May = this.sum1(rows,'May');
      rows[0].June = this.sum1(rows,'June');
      rows[0].July = this.sum1(rows,'July');
      rows[0].Aug = this.sum1(rows,'Aug');
      rows[0].Sep = this.sum1(rows,'Sep');
      rows[0].Oct = this.sum1(rows,'Oct');
      rows[0].Nov= this.sum1(rows,'Nov');
      rows[0].Dec = this.sum1(rows,'Dec');
  
      
      rows[0].Year = this.sumByRow(rows[0]);
      rows[1].Year = this.sumByRow(rows[1]);
      rows[2].Year = this.sumByRow(rows[2]);
      rows[3].Year = this.sumByRow(rows[3]);
      rows[4].Year = this.sumByRow(rows[4]);
    return rows;
  },



   createRows2(numberOfRows) {
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
        Oct: Math.min(100, Math.round(Math.random() * 110)),
        Nov: Math.min(100, Math.round(Math.random() * 110)),
        Dec: Math.min(100, Math.round(Math.random() * 110))
     
      });
    }
      rows[0].Housing = "Housing";
      rows[1].Housing = "Rent or residence";
      rows[2].Housing = "Mortgage";
      rows[3].Housing = "Property taxes";
     

      rows[0].Jan = this.sum1(rows,'Jan');
      rows[0].Feb = this.sum1(rows,'Feb');
      rows[0].Mar = this.sum1(rows,'Mar');
      rows[0].Apr = this.sum1(rows,'Apr');
      rows[0].May = this.sum1(rows,'May');
      rows[0].June = this.sum1(rows,'June');
      rows[0].July = this.sum1(rows,'July');
      rows[0].Aug = this.sum1(rows,'Aug');
      rows[0].Sep = this.sum1(rows,'Sep');
      rows[0].Oct = this.sum1(rows,'Oct');
      rows[0].Nov= this.sum1(rows,'Nov');
      rows[0].Dec = this.sum1(rows,'Dec');
  
      
      rows[0].Year = this.sumByRow(rows[0]);
      rows[1].Year = this.sumByRow(rows[1]);
      rows[2].Year = this.sumByRow(rows[2]);
      rows[3].Year = this.sumByRow(rows[3]);
   
    return rows;
  },
    rowGetter1(i) {
    return this.state.rows1[i];
  },

    rowGetter2(i) {
    return this.state.rows2[i];
  },

  rowGetter(i) {
    return this.state.rows[i];
  },


handleAddRow({ newRowIndex }) {

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
    rows[rows.length-1] = rows[rows.length-2];
    this.grid.openCellEditor(rows.length -2, 0);
    rows[rows.length-2] =  {};
    this.setState({ rows });
  },

  handleGridRowsUpdated({ fromRow, toRow, updated }) {
    let rows = this.state.rows.slice();
    let length = this.state.rows.length;
    for (let i = fromRow; i <= toRow; i++) {
      let rowToUpdate = rows[i];
      let updatedRow = update(rowToUpdate, {$merge: updated});
      rows[i] = updatedRow;
  }

  var ok = rows.slice(0,length-1);
      var jan = this.sum(ok, 'Jan' );
      var mar = this.sum(ok, 'Mar' );
      var feb = this.sum(ok, 'Feb' );
      var mar = this.sum(ok, 'Mar' );
      var apr = this.sum(ok, 'Apr' );
      var may = this.sum(ok, 'May' );
      var june = this.sum(ok, 'June' );
      var july = this.sum(ok, 'July' );
      var aug = this.sum(ok, 'Aug' );
      var sep = this.sum(ok, 'Sep' );
      var oct = this.sum(ok, 'Oct' );
      var nov = this.sum(ok, 'Nov' );
      var dec = this.sum(ok, 'Dec' );

        const newRow = {
            MonthlyIncome:  "Summary:",
            Jan: jan,
            Feb: feb,
            Mar: mar,
            Apr: apr,
            May:  may,
            June: june,
            July: july,
            Aug: aug,
            Sep: sep,
            Oct: oct,
            Nov: nov,
            Dec: dec
      };
      rows[length -1] = newRow;
      this.sumByYear(rows);
      this.setState({ rows });
  },




 handleGridRowsUpdated1({ fromRow, toRow, updated }) {
    let rows1 = this.state.rows1.slice();
    let length = this.state.rows1.length;

    for (let i = fromRow; i <= toRow; i++) {
      let rowToUpdate = rows1[i];
      let updatedRow = update(rowToUpdate, {$merge: updated});
      rows1[i] = updatedRow;
    }
   
     var ok = rows1.slice(0,length-1);
      var jan = this.sum(ok, 'Jan' );
      var mar = this.sum(ok, 'Mar' );
      var feb = this.sum(ok, 'Feb' );
      var mar = this.sum(ok, 'Mar' );
      var apr = this.sum(ok, 'Apr' );
      var may = this.sum(ok, 'May' );
      var june = this.sum(ok, 'June' );
      var july = this.sum(ok, 'July' );
      var aug = this.sum(ok, 'Aug' );
      var sep = this.sum(ok, 'Sep' );
      var oct = this.sum(ok, 'Oct' );
      var nov = this.sum(ok, 'Nov' );
      var dec = this.sum(ok, 'Dec' );

        this.sumByYear(rows1);
    
    this.setState({ rows1});

  },

  

  render() {

    
 function onSelectEvent(event){
            var self = this;

            debugger;
            self.downloadCSV();
       
       
}
    return  (
      <div className="ms-fontColor-themeDarker">
        <div style = {{textAlign:"center", color:"blue", paddingBottom:"20px"}}>Student Budget</div>
          <ReactDataGrid 
            ref={ node => this.grid = node }
            enableCellSelect={true}
            columns={this._columns}
            rowGetter={this.rowGetter}
            rowsCount={this.state.rows.length}
            minHeight={240}
            toolbar={<button  onClick={this.handleAddRow}>Add</button>}
            onGridRowsUpdated={this.handleGridRowsUpdated}
            />

          <ReactDataGrid
            ref={ node => this.grid = node }
            enableCellSelect={true}
            columns={this._columns2}
            rowGetter={this.rowGetter1}
            rowsCount={this.state.rows1.length}
            minHeight={210}
      
            onGridRowsUpdated={this.handleGridRowsUpdated1} />


              <ReactDataGrid
            ref={ node => this.grid = node }
            enableCellSelect={true}
            columns={this._columns3}
            rowGetter={this.rowGetter2}
            rowsCount={this.state.rows2.length}
            minHeight={250}
      
            onGridRowsUpdated={this.handleGridRowsUpdated1} />


        <a href='#' onClick={onSelectEvent.bind(this)} >download</a>
    </div>);
  }
});




export {Example}