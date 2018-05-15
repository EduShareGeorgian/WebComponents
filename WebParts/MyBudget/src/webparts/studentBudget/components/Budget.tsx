
import * as ReactDataGrid from 'react-data-grid';
import * as $ from 'jquery';
import { Editors, Toolbar, Formatters } from 'react-data-grid-addons';
import * as ReactDataGridPlugins from 'react-data-grid-addons';
import * as update from 'immutability-helper';
import * as json2csv from 'json2csv';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import DoughnutChart from './Chart';
import ListRender from './ListRender';
import 'rc-slider/assets/index.css';
import CanvasComponent from './Bar';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import Slider from 'rc-slider';
import { IListItem } from './IListItem';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import * as strings from 'studentBudgetStrings';
require('!style-loader!css-loader!../../../../src/examples.css');
require('!style-loader!css-loader!../../../../src/react-context-menu.css');
import * as objectAssignfrom from 'object-assign';


//import listener from './globalEventListener';



const ContextMenu = ReactDataGridPlugins.Menu.ContextMenu;
const MenuItem = ReactDataGridPlugins.Menu.MenuItem;
const MenuItem1 = ReactDataGridPlugins.Menu.MenuItem;
const { Row } = ReactDataGrid;
const Range = Slider["Range"];
const step = 8.3;
const highLightColor = "#EB6C2C";
const marginTop = '0px';
const firstMonth = 'Sep';
var firstClick = true;
var firstload = true;

//const url = `${this.props.siteUrl}/_api/web/lists/getbytitle('GeoCash')/items?$select=Title,Id,Budget`

const YearFormatter = React.createClass({
  render() {
    const year = this.props.value;
    return (
      <div style={{ marginTop: marginTop }}>
        <div style={{ color: highLightColor }} >
          {year}
        </div>
      </div>);
  }
});

const DeleteBox = React.createClass({
  render() {
    return (<div>Box</div>);

  }

});

const RowRenderer = React.createClass({
  propTypes: {
    idx: React.PropTypes.string.isRequired
  },

  setScrollLeft(scrollBy) {
    this.row.setScrollLeft(scrollBy);
  },

  getRowStyle() {
    return {
      color: this.getRowBackground()
    };
  },

  getRowBackground() {
    return this.props.idx == 0 ? 'green' : 'blue';
  },

  render: function () {
    return (<div style={this.getRowStyle()}><Row ref={node => this.row = node} {...this.props} /></div>);
  }
});

const MyContextMenu = React.createClass({
  propTypes: {

  },

  getDefaultProps() {
    return {
      onRowDelete: () => { },
      onRowInsert: () => { },
      onCopyAcross: () => { }
    };
  },


  onRowDelete(e, data) {
    if (typeof (this.props.onRowDelete) === 'function') {
      this.props.onRowDelete(e, data);
    }
  },

  onRowInsert(e, data) {
    if (typeof (this.props.onRowInsert) === 'function') {
      this.props.onRowInsert(e, data);
    }
  },

  onCopyAcross(e, data) {
    if (typeof (this.props.onRowInsert) === 'function') {
      this.props.onCopyAcross(e, data);
    }
  },

  render() {
    return (
      <ContextMenu >
        <MenuItem data={{ rowIdx: this.props.rowIdx, idx: this.props.idx }} onClick={this.onRowDelete}>Delete Row</MenuItem>
        <MenuItem data={{ rowIdx: this.props.rowIdx, idx: this.props.idx }} onClick={this.onRowInsert}>Insert Row</MenuItem>
        <MenuItem data={{ rowIdx: this.props.rowIdx, idx: this.props.idx }} onClick={this.onCopyAcross}>Copy Across</MenuItem>
      </ContextMenu>
    );
  }
});


const MyBudget = React.createClass({

  sliderMove(value) {
    var step = Math.round(value / 8.3);
    var months = { 0: 'Sep', 1: 'Oct', 2: 'Nov', 3: 'Dec', 4: 'Jan', 5: 'Feb', 6: 'Mar', 7: 'Apr', 8: 'May', 9: 'June', 10: 'July', 11: 'Aug', 12: 'Year' };
    var month = months[step];
    this.state.currentMonth = month;
    this.setState({ currentMonth: month });
    this.getIncomeBalance();
    this.getExpenseBalance();
    this.createReportDataSet();
    // this.createReportData();
    this.createExpenseReportDataSet();
    this.isOnBudget(month);
    console.log(month);
  },

  getMyBudget(loginName): Promise<string> {

    return new Promise((resolve) => {

      this.props.spHttpClient.get(`${this.props.siteUrl}/_api/web/lists/getbytitle('GeoCash')/items?$filter=Title eq ` + "'" + loginName + "'&$select=Title,Id,Budget",
        //this.props.spHttpClient.get(`https://gc123dev.shacrepoint.com/_api/web/lists`,
        SPHttpClient.configurations.v1,
        {
          headers: {
            'Accept': 'application/json;odata=nometadata',
            'odata-version': ''
          }
        })
        .then((response: SPHttpClientResponse): Promise<{ value: IListItem[] }> => {
          return response.json();
        })
        .then((response: { value: IListItem[] }): void => {
          console.log(response.value);

          return resolve(response.value[0]["Budget"]);
        })

    });
  },



  getListItemEntityTypeName(): Promise<string> {
    return new Promise<string>((resolve: (listItemEntityTypeName: string) => void, reject: (error: any) => void): void => {
      if (this.listItemEntityTypeName) {
        resolve(this.listItemEntityTypeName);
        return;
      }

      this.props.spHttpClient.get(`${this.props.siteUrl}/_api/web/lists/getbytitle('GeoCash')?$select=ListItemEntityTypeFullName`,
        SPHttpClient.configurations.v1,
        {
          headers: {
            'Accept': 'application/json;odata=nometadata',
            'odata-version': ''
          }
        })
        .then((response: SPHttpClientResponse): Promise<{ ListItemEntityTypeFullName: string }> => {
          return response.json();
        }, (error: any): void => {
          reject(error);
        })
        .then((response: { ListItemEntityTypeFullName: string }): void => {
          this.listItemEntityTypeName = response.ListItemEntityTypeFullName;
          resolve(this.listItemEntityTypeName);
        });
    });
  },

  createItem(json): void {
    debugger;
    // var item = this.props.context;
    var loginName = this.props.context.pageContext.user.loginName;
    this.getListItemEntityTypeName()
      .then((listItemEntityTypeName: string): Promise<SPHttpClientResponse> => {

        console.log(listItemEntityTypeName);
        const body: string = JSON.stringify({
          '__metadata': {
            'type': listItemEntityTypeName
          },
          'Title': loginName,
          'Budget': json
        });
        return this.props.spHttpClient.post(`${this.props.siteUrl}/_api/web/lists/getbytitle('GeoCash')/items`,
          SPHttpClient.configurations.v1,
          {
            headers: {
              'Accept': 'application/json;odata=nometadata',
              'Content-type': 'application/json;odata=verbose',
              'odata-version': ''
            },
            body: body
          });
      })
      .then((response: SPHttpClientResponse): Promise<IListItem> => {
        return response.json();
      })
      .then((item: IListItem): void => {
        this.setState({
          status: "successfully created"
        });
      });

  },


  readItems() {
    this.setState({
      status: 'Loading all items...',
      items: []
    });
    this.props.spHttpClient.get(`https://gc123dev.sharepoint.com/_api/web/lists/getbytitle('GeoCash')/items?$select=Title,Id,Budget`,
      SPHttpClient.configurations.v1,
      {
        headers: {
          'Accept': 'application/json;odata=nometadata',
          'odata-version': ''
        }
      })
      .then((response: SPHttpClientResponse): Promise<{ value: IListItem[] }> => {
        return response.json();
      })
      .then((response: { value: IListItem[] }): void => {
        console.log(response.value);
        this.setState({
          status: `Successfully loaded ${response.value.length} items`,
          items: response.value[0]["Budget"]
        });

        Window["myObject"] = response.value[0]["Budget"];
        //Promise.resolve(response.value[0]["Budget"]);

        return response.value[0]["Budget"];

      }, (error: any): void => {
        this.setState({
          status: 'Loading all items failed with error: ' + error,
          items: []
        });
      });

  },


  updateItem(json): void {
    debugger;

    var loginName = this.props.context.pageContext.user.loginName;
    this.setState({
      status: 'Loading latest items...',
      items: []
    });
    let latestItemId: number = undefined;
    let etag: string = undefined;
    let listItemEntityTypeName: string = undefined;
    this.getListItemEntityTypeName()
      .then((listItemType: string): Promise<number> => {
        listItemEntityTypeName = listItemType;
        return this.getLatestItemId();
      })
      .then((itemId: number): Promise<SPHttpClientResponse> => {
        if (itemId === -1 && this.state.itemId != 999) {

          this.state.itemId = 999;
          //debugger;
          this.createItem(json);
          return Promise.resolve();
        }

        latestItemId = itemId;
        this.setState({
          status: `Loading information about item ID: ${latestItemId}...`,
          items: []
        });
        return this.props.spHttpClient.get(`${this.props.siteUrl}/_api/web/lists/getbytitle('GeoCash')/items(${latestItemId})?$select=Id`,
          SPHttpClient.configurations.v1,
          {
            headers: {
              'Accept': 'application/json;odata=nometadata',
              'odata-version': ''
            }
          });
      })
      .then((response: SPHttpClientResponse): Promise<IListItem> => {
        etag = response.headers.get('ETag');
        return response.json();
      })
      .then((item: IListItem): Promise<SPHttpClientResponse> => {
        this.setState({
          status: `Updating item with ID: ${latestItemId}...`,
          items: []
        });
        const body: string = JSON.stringify({
          '__metadata': {
            'type': listItemEntityTypeName
          },
          'Title': loginName,
          'Budget': json
        });
        return this.props.spHttpClient.post(`${this.props.siteUrl}/_api/web/lists/getbytitle('GeoCash')/items(${item.Id})`,
          SPHttpClient.configurations.v1,
          {
            headers: {
              'Accept': 'application/json;odata=nometadata',
              'Content-type': 'application/json;odata=verbose',
              'odata-version': '',
              'IF-MATCH': etag,
              'X-HTTP-Method': 'MERGE'
            },
            body: body
          });
      })
      .then((response: SPHttpClientResponse): void => {
        this.setState({
          status: `Item with ID: ${latestItemId} successfully updated`,
          items: []
        });
      }, (error: any): void => {
        this.setState({
          status: `Error updating item: ${error}`,
          items: []
        });
      });
  },

  getLatestItemId(): Promise<number> {



    var loginName = this.props.context.pageContext.user.loginName;

    return new Promise<number>((resolve: (itemId: number) => void, reject: (error: any) => void): void => {
      this.props.spHttpClient.get(`${this.props.siteUrl}/_api/web/lists/getbytitle('GeoCash')/items?$filter=Title eq ` + "'" + loginName + "'&$orderby=Id desc&$top=1&$select=id",
        //  this.props.spHttpClient.get(`${this.props.siteUrl}/_api/web/lists/getbytitle('GeoCash')/items?$orderby=Id desc&$top=1&$select=id`,
        SPHttpClient.configurations.v1,
        {
          headers: {
            'Accept': 'application/json;odata=nometadata',
            'odata-version': ''
          }
        })
        .then((response: SPHttpClientResponse): Promise<{ value: { Id: number }[] }> => {
          return response.json();
        }, (error: any): void => {
          reject(error);
        })
        .then((response: { value: { Id: number }[] }): void => {
          if (response.value.length === 0) {
            resolve(-1);
          }
          else {
            resolve(response.value[0].Id);
          }
        });
    });
  },


  getDefaultProps() {
    return {
      spHttpClient: {},
      siteUrl: {},
      context: {}
    };
  },

  handleShow() {
    // to do
  },


  componentWillMount() {


  },
  checkMonthlyIncomeCells(i, e) {
    // debugger;
    var length = this.state.rows.length - 1;
    var row = i.rowIdx;
    var col = i.idx;
    var obj = { rowIdx: row, idx: col };
    var cells = [{ rowIdx: length, idx: 0 }, { rowIdx: length, idx: 1 }, { rowIdx: length, idx: 2 }, { rowIdx: length, idx: 3 }, { rowIdx: length, idx: 4 }, { rowIdx: length, idx: 5 }, { rowIdx: length, idx: 6 },
    { rowIdx: length, idx: 7 }, { rowIdx: length, idx: 8 }, { rowIdx: length, idx: 9 }, { rowIdx: length, idx: 10 }, { rowIdx: length, idx: 11 }, { rowIdx: length, idx: 12 }
    ]
    for (let i = 0; i < cells.length; i++) {
      if (JSON.stringify(cells[i]) === JSON.stringify(obj)) {
        return false;
      }
    }
  },

  checkCells(i, e) {
    var row = i.rowIdx;
    var col = i.idx;
    var obj = { rowIdx: row, idx: col };
    var cells = [{ rowIdx: 0, idx: 0 }, { rowIdx: 0, idx: 1 }, { rowIdx: 0, idx: 2 }, { rowIdx: 0, idx: 3 }, { rowIdx: 0, idx: 4 }, { rowIdx: 0, idx: 5 }, { rowIdx: 0, idx: 6 },
    { rowIdx: 0, idx: 7 }, { rowIdx: 0, idx: 8 }, { rowIdx: 0, idx: 9 }, { rowIdx: 0, idx: 10 }, { rowIdx: 0, idx: 11 }, { rowIdx: 0, idx: 12 }
    ]
    for (let i = 0; i < cells.length; i++) {
      if (JSON.stringify(cells[i]) === JSON.stringify(obj)) {
        return false;
      }
    }
  },


  componentDidMount() {


    if ($('div[class^="scrollRegion_"]') != undefined) {
      $('div[class^="scrollRegion_fbc3251a').css('overflow-x', 'scroll');
    }


    // window.addEventListener("resize1", this.handleResizedScreen);

    //self.setState({reports1: {}});

    var month = this.state.currentMonth;



    var loginName = this.props.context.pageContext.user.loginName;
    var self = this;
    this.getMyBudget(loginName).then(function (val) {
      var monthlyExpenseRows, booksSuppliesRows, insurancerows, transportationRows, otherExpensesRows;
      var rows, housingRows, utilitiesRows, loanPaymentRows, discretionaryRows, householdExpensesRows;
      var result = JSON.parse(val);
      rows = result['rows']['rows'];
      if (rows == undefined) {
        rows = result['rows'];
      }

      monthlyExpenseRows = result['monthlyExpenseRows']['monthlyExpenseRows'];
      if (monthlyExpenseRows == undefined) {
        monthlyExpenseRows = result['monthlyExpenseRows'];
      }

      booksSuppliesRows = result['booksSuppliesRows']['booksSuppliesRows'];
      if (booksSuppliesRows == undefined) {
        booksSuppliesRows = result['booksSuppliesRows'];
      }

      housingRows = result['housingRows']['housingRows'];
      if (housingRows == undefined) {
        housingRows = result['housingRows'];
      }

      insurancerows = result['insuranceRows']['insuranceRows'];
      if (insurancerows == undefined) {
        insurancerows = result['insuranceRows'];
      }

      utilitiesRows = result['utilitiesRows']['utilitiesRows'];
      if (utilitiesRows == undefined) {
        utilitiesRows = result['utilitiesRows'];
      }

      loanPaymentRows = result['loanPaymentRows']['loanPaymentRows'];
      if (loanPaymentRows == undefined) {
        loanPaymentRows = result['loanPaymentRows'];
      }

      transportationRows = result['transportationRows']['transportationRows'];
      if (transportationRows == undefined) {
        transportationRows = result['transportationRows'];
      }

      discretionaryRows = result['discretionaryRows']['discretionaryRows'];
      if (discretionaryRows == undefined) {
        discretionaryRows = result['discretionaryRows'];
      }

      otherExpensesRows = result['otherExpensesRows']['otherExpensesRows'];
      if (otherExpensesRows == undefined) {
        otherExpensesRows = result['otherExpensesRows'];
      }

      householdExpensesRows = result['householdExpensesRows']['householdExpensesRows'];
      if (householdExpensesRows == undefined) {
        householdExpensesRows = result['householdExpensesRows'];
      }

      var rows = rows.slice();
      var result = self.sumBySections(
        rows, monthlyExpenseRows, housingRows,
        insurancerows, utilitiesRows, loanPaymentRows,
        transportationRows, booksSuppliesRows, discretionaryRows,
        otherExpensesRows
      );


      var length = rows.length;
      var _rows = self.state.cashFlowRows.slice();
      var length1 = self.state.cashFlowRows.length;
      var items = rows.slice(0, length - 1);

      _rows[0].Sep = Number(self.sum(items, 'Sep') - result.Sep);
      _rows[0].Oct = Number(self.sum(items, 'Oct') - result.Oct);
      _rows[0].Nov = Number(self.sum(items, 'Nov') - result.Nov);
      _rows[0].Dec = Number(self.sum(items, 'Dec') - result.Dec);
      _rows[0].Jan = Number(self.sum(items, 'Jan') - result.Jan);
      _rows[0].Feb = Number(self.sum(items, 'Feb') - result.Feb);
      _rows[0].Mar = Number(self.sum(items, 'Mar') - result.Mar);
      _rows[0].Apr = Number(self.sum(items, 'Apr') - result.Apr);
      _rows[0].May = Number(self.sum(items, 'May') - result.May);
      _rows[0].June = Number(self.sum(items, 'June') - result.June);
      _rows[0].July = Number(self.sum(items, 'July') - result.July);
      _rows[0].Aug = Number(self.sum(items, 'Aug') - result.Aug);


      var Sep = Number(_rows[0].Sep);
      var Oct = Number(_rows[0].Oct + Sep);
      var Nov = Number(_rows[0].Nov + Oct);
      var Dec = Number(_rows[0].Dec + Nov);
      var Jan = Number(_rows[0].Jan + Dec);
      var Feb = Number(_rows[0].Feb + _rows[1].Jan);
      var Mar = Number(_rows[0].Mar + _rows[1].Feb);
      var Apr = Number(_rows[0].Apr + _rows[1].Mar);
      var May = Number(_rows[0].May + _rows[1].Apr);
      var June = Number(_rows[0].June + May);
      var July = Number(_rows[0].July + June);
      var Aug = Number(_rows[0].Aug + July);

      _rows[0].Year = Aug;
      const firstRow = {
        MonthlyCash: "Available funds", Jan: Jan, Feb: Feb, Mar: Mar, Apr: Apr, May: May, June: June, July: July,
        Aug: Aug, Sep: Sep, Oct: Oct, Nov: Nov, Dec: Dec
      };
      const newRow = {
        MonthlyCash: "Cumulative available funds", Jan: Jan, Feb: Feb, Mar: Mar, Apr: Apr, May: May, June: June, July: July,
        Aug: Aug, Sep: Sep, Oct: Oct, Nov: Nov, Dec: Dec
      };
      self.state.cashFlowRows[0] = firstRow;
      self.state.cashFlowRows[1] = newRow;


      self.setState({
        rows: rows, monthlyExpenseRows: monthlyExpenseRows, booksSuppliesRows: booksSuppliesRows, housingRows: housingRows,
        insurancerows: insurancerows, utilitiesRows: utilitiesRows, loanPaymentRows: loanPaymentRows, transportationRows: transportationRows,
        discretionaryRows: discretionaryRows, otherExpensesRows: otherExpensesRows, householdExpensesRows: householdExpensesRows,
        cashFlowRows: self.state.cashFlowRows
      });

      self.getIncomeBalance();
      self.getExpenseBalance();


      self.isOnBudget(month);// before: firstMonth


      self.createReportDataSet();
      // self.createReportData();
      self.refs.myChart.forceUpdate();


    })


    this.getIncomeBalance();
    this.getExpenseBalance();


    this.state.tableMapping = {
      1: "rows", 2: "monthlyExpenseRows", 3: "housingRows", 4: "insurancerows",
      5: "utilitiesRows", 6: "loanPaymentRows", 7: "booksSuppliesRows", 8: "transportationRows", 9: "discretionaryRows",
      10: "otherExpensesRows", 11: "householdExpensesRows"
    };


    let selected10 = objectAssignfrom({}, this.grid.state.selected, { idx: 0, rowIdx: 0, active: true });
    this.grid.setState({ selected: selected10 });

    //this.onCellSelected1(1,1);

    //this.state.currentgrid =1;
    // this.grid1.state.selected.rowIdx = 1;
    //this.grid1.state.selected.idx = 1;



    // for(var i= 2; i <= 12; i++ ){
    //         if ( i!= 12){
    //         let name = "grid" + i;
    //         var grid = this[name];
    //         this.layoutSetting(grid);
    //     }
    //   }
  },


  isOnBudget(month) {
    var value = this.state.cashFlowRows[0][month];
    var str = "";

    if (value > 0) {
      str = strings.UnderBudget;
    } else if (value == 0) {
      str = strings.OnBudget;
    } else {
      str = strings.OverBudget;
    }
    this.setState({ isOnBudget: str });
  },

  layoutSetting(grid) {
    var cell = grid._gridNode.querySelector('.react-grid-Cell__value');
    cell.style.color = "#EB6C2C";
    cell.style.fontWeight = "bold";

    var nodes = grid._gridNode.querySelectorAll('.react-grid-Row');


    $.each(nodes, function (key, element) {

      if (key != '0') {
        var cell = element.querySelector('.react-grid-Cell__value')
        cell.style.paddingLeft = "20px"
      }
    })
  },

  componentDidUpdate() {


    var grid;
    var currentgrid = this.state.currentgrid;

    if (currentgrid != undefined) {
      grid = "grid" + currentgrid;
    }
    else {
      grid = "grid";
    }



    let selected1 = objectAssignfrom({}, this.grid1.state.selected, { idx: -1, rowIdx: -1, active: false });
    this.grid1.setState({ selected: selected1 });
    let selected2 = objectAssignfrom({}, this.grid2.state.selected, { idx: -1, rowIdx: -1, active: false });
    this.grid2.setState({ selected: selected2 });
    let selected3 = objectAssignfrom({}, this.grid3.state.selected, { idx: -1, rowIdx: -1, active: false });
    this.grid3.setState({ selected: selected3 });

    let selected4 = objectAssignfrom({}, this.grid4.state.selected, { idx: -1, rowIdx: -1, active: false });
    this.grid4.setState({ selected: selected4 });

    let selected5 = objectAssignfrom({}, this.grid5.state.selected, { idx: -1, rowIdx: -1, active: false });
    this.grid5.setState({ selected: selected5 });

    let selected6 = objectAssignfrom({}, this.grid6.state.selected, { idx: -1, rowIdx: -1, active: false });
    this.grid6.setState({ selected: selected6 });

    let selected7 = objectAssignfrom({}, this.grid7.state.selected, { idx: -1, rowIdx: -1, active: false });
    this.grid7.setState({ selected: selected7 });

    let selected8 = objectAssignfrom({}, this.grid8.state.selected, { idx: -1, rowIdx: -1, active: false });
    this.grid8.setState({ selected: selected8 });

    let selected9 = objectAssignfrom({}, this.grid9.state.selected, { idx: -1, rowIdx: -1, active: false });
    this.grid9.setState({ selected: selected9 });

    let selected10 = objectAssignfrom({}, this.grid10.state.selected, { idx: -1, rowIdx: -1, active: false });
    this.grid10.setState({ selected: selected10 });

    let selected11 = objectAssignfrom({}, this.grid11.state.selected, { idx: -1, rowIdx: -1, active: false });
    this.grid11.setState({ selected: selected11 });

    let selected12 = objectAssignfrom({}, this.grid12.state.selected, { idx: -1, rowIdx: -1, active: false });
    this.grid12.setState({ selected: selected12 });

    //  let selected00 = objectAssignfrom({}, this.grid.state.selected, {idx: -0, rowIdx: -0, active: true});
    //  this.grid.setState({selected: selected00});

    var selected00 = objectAssignfrom({}, this.grid.state.selected, { idx: -1, rowIdx: -1, active: false });
    this.grid.setState({ selected: selected00 });
    // this.isOnBudget(this.state.currentMonth);
    for (var i = 2; i <= 11; i++) {
      {
        let name = "grid" + i;
        var grid1 = this[name];
        this.layoutSetting(grid1);
      }
    }
  },


  creatHeader(Jan, Feb, Mar, Apr, May, June, July, Aug, Sep, Oct, Nov, Dec, Year) {
    var headerName = [
      {
        key: Sep.key,
        name: Sep.name,
        editable: Sep.editable,
        width: Sep.width
      },
      {
        key: Oct.key,
        name: Oct.name,
        editable: Oct.editable,
        width: Oct.width
      },

      {
        key: Nov.key,
        name: Nov.name,
        editable: Nov.editable,
        width: Nov.width
      },

      {
        key: Dec.key,
        name: Dec.name,
        editable: Dec.editable,
        width: Dec.width
      },

      {
        key: Jan.key,
        name: Jan.name,
        editable: Jan.editable,
        width: Jan.width
      },
      {
        key: Feb.key,
        name: Feb.name,
        editable: Feb.editable,
        width: Feb.width
      },
      {
        key: Mar.key,
        name: Mar.name,
        editable: Mar.editable,
        width: Mar.width
      },
      {
        key: Apr.key,
        name: Apr.name,
        editable: Apr.editable,
        width: Apr.width
      },
      {
        key: May.key,
        name: May.name,
        editable: May.editable,
        width: May.width
      },
      {
        key: June.key,
        name: June.name,
        editable: June.editable,
        width: June.width
      },
      {
        key: July.key,
        name: July.name,
        editable: July.editable,
        width: July.width
      },
      {
        key: Aug.key,
        name: Aug.name,
        editable: Aug.editable,
        width: Aug.width
      },
      {
        key: Year.key,
        name: Year.name,
        editable: Year.editable,
        width: Year.width,
        formatter: YearFormatter
      },
    ];
    return headerName;
  },


  onCellSelected1(rowIdx, idx) {
    this.state.currentRowIdx = rowIdx.rowIdx;
    this.state.currentIdx = rowIdx.idx;
    var currentGrid = this.state.currentgrid;
    this.state.currentgrid = 1;
    this.grid1.state.selected.rowIdx = rowIdx.rowIdx;
    this.grid1.state.selected.idx = rowIdx.idx;
  },

  onCellSelected7(rowIdx, idx) {
    this.state.currentRowIdx = rowIdx.rowIdx;
    this.state.currentIdx = rowIdx.idx;
    this.state.currentgrid = 7;
    this.grid7.state.selected.rowIdx = rowIdx.rowIdx;
    this.grid7.state.selected.idx = rowIdx.idx;
  },

  onCellSelected2(rowIdx, idx) {
    this.state.currentRowIdx = rowIdx.rowIdx;
    this.state.currentIdx = rowIdx.idx;
    this.state.currentgrid = 2;
    this.grid2.state.selected.rowIdx = rowIdx.rowIdx;
    this.grid2.state.selected.idx = rowIdx.idx;
  },

  onCellSelected3(rowIdx, idx) {
    this.state.currentRowIdx = rowIdx.rowIdx;
    this.state.currentIdx = rowIdx.idx;
    this.state.currentgrid = 3;
    this.grid3.state.selected.rowIdx = rowIdx.rowIdx;
    this.grid3.state.selected.idx = rowIdx.idx;
  },

  onCellSelected4(rowIdx, idx) {
    this.state.currentRowIdx = rowIdx.rowIdx;
    this.state.currentIdx = rowIdx.idx;
    this.state.currentgrid = 4;
    this.grid4.state.selected.rowIdx = rowIdx.rowIdx;
    this.grid4.state.selected.idx = rowIdx.idx;
  },

  onCellSelected5(rowIdx, idx) {
    this.state.currentRowIdx = rowIdx.rowIdx;
    this.state.currentIdx = rowIdx.idx;
    this.state.currentgrid = 5;
    this.grid5.state.selected.rowIdx = rowIdx.rowIdx;
    this.grid5.state.selected.idx = rowIdx.idx;
  },

  onCellSelected6(rowIdx, idx) {
    this.state.currentRowIdx = rowIdx.rowIdx;
    this.state.currentIdx = rowIdx.idx;
    this.state.currentgrid = 6;
    this.grid6.state.selected.rowIdx = rowIdx.rowIdx;
    this.grid6.state.selected.idx = rowIdx.idx;
  },

  onCellSelected9(rowIdx, idx) {
    this.state.currentRowIdx = rowIdx.rowIdx;
    this.state.currentIdx = rowIdx.idx;
    this.state.currentgrid = 9;
    this.grid9.state.selected.rowIdx = rowIdx.rowIdx;
    this.grid9.state.selected.idx = rowIdx.idx;
  },

  onCellSelected8(rowIdx, idx) {
    this.state.currentRowIdx = rowIdx.rowIdx;
    this.state.currentIdx = rowIdx.idx;
    this.state.currentgrid = 8;
    this.grid8.state.selected.rowIdx = rowIdx.rowIdx;
    this.grid8.state.selected.idx = rowIdx.idx;
  },

  onSelect10() {

    //alert('onselect10');
  },

  onCellSelected10(rowIdx, idx) {
    this.state.currentRowIdx = rowIdx.rowIdx;
    this.state.currentIdx = rowIdx.idx;
    this.state.currentgrid = 10;
    this.grid10.state.selected.rowIdx = rowIdx.rowIdx;
    this.grid10.state.selected.idx = rowIdx.idx;
  },

  onCellSelected11(rowIdx, idx) {
    this.state.currentRowIdx = rowIdx.rowIdx;
    this.state.currentIdx = rowIdx.idx;
    this.state.currentgrid = 11;
    this.grid11.state.selected.rowIdx = rowIdx.rowIdx;
    this.grid11.state.selected.idx = rowIdx.idx;
  },




  onCellDeSelected(rowIdx, idx) {

  },

  onCellSelected(rowIdx, idx) {
    this.state.currentRowIdx = rowIdx.rowIdx;
    this.state.currentIdx = rowIdx.idx;
    var currentGrid = this.state.currentgrid;

    for (var i = 1; i <= 12; i++) {
      let grid = "grid" + i;
      let rowIdx = this[grid].state.selected;

      if (rowIdx.rowIdx > 0 || rowIdx.idx > 0) {
        if (currentGrid != i) {
          this.state.currentgrid = i;
          if (currentGrid != null) {
            grid = "grid" + currentGrid;
          }
          else {
            this.state.currentgrid = i;
          }

          this[grid].state.selected.rowIdx = 0;
          this[grid].state.selected.idx = 0;

        }
      }
    }

    if (this.state.currentgrid == 1) {
      //this.grid1.state.setState( {show: true});
    }
    if (this.state.currentgrid == 2) {
      // this.setState( {show: false});
    }
  },


  getInitialState() {
    var rows1;
    var self = this;
    let items = [];

    // debugger;



    let currentMonth = firstMonth;
    let headerName = this.creatHeader(
      { key: 'Jan', name: 'Jan', editable: true, width: 55 },
      { key: 'Feb', name: 'Feb', editable: true, width: 55 },
      { key: 'Mar', name: 'Mar', editable: true, width: 55 },
      { key: 'Apr', name: 'Apr', editable: true, width: 55 },
      { key: 'May', name: 'May', editable: true, width: 55 },
      { key: 'June', name: 'June', editable: true, width: 55 },
      { key: 'July', name: 'July', editable: true, width: 55 },
      { key: 'Aug', name: 'Aug', editable: true, width: 55 },
      { key: 'Sep', name: 'Sep', editable: true, width: 55 },
      { key: 'Oct', name: 'Oct', editable: true, width: 55 },
      { key: 'Nov', name: 'Nov', editable: true, width: 55 },
      { key: 'Dec', name: 'Dec', editable: true, width: 55 },
      { key: 'Year', name: 'Year', width: 55, editable: false, formatter: YearFormatter }
    );


    let headerWithoutName = this.creatHeader(
      { key: 'Jan', name: '', editable: true, width: 55 },
      { key: 'Feb', name: '', editable: true, width: 55 },
      { key: 'Mar', name: '', editable: true, width: 55 },
      { key: 'Apr', name: '', editable: true, width: 55 },
      { key: 'May', name: '', editable: true, width: 55 },
      { key: 'June', name: '', editable: true, width: 55 },
      { key: 'July', name: '', editable: true, width: 55 },
      { key: 'Aug', name: '', editable: true, width: 55 },
      { key: 'Sep', name: '', editable: true, width: 55 },
      { key: 'Oct', name: '', editable: true, width: 55 },
      { key: 'Nov', name: '', editable: true, width: 55 },
      { key: 'Dec', name: '', editable: true, width: 55 },
      { key: 'Year', name: '', width: 55, editable: false, formatter: YearFormatter }
    );


    var MonthlyExpenseColumn = [{ key: 'MonthlyExpense', name: 'Monthly Expense', width: 190, editable: true }];
    var HousingColumn = [{ key: 'Housing', name: '', width: 198, editable: true }];
    var HouseholdExpensesColumn = [{ key: 'HouseholdExpenses', name: '', width: 198, editable: true }];
    var InsuranceColumn = [{ key: 'Insurance', name: '', width: 198, editable: true }];
    var UtilitiesColumn = [{ key: 'Utilities', name: '', width: 198, editable: true }];
    var LoanPaymentColumn = [{ key: 'LoanPayment', name: '', width: 198, editable: true }];
    var MonthlyCashColumn = [{ key: 'MonthlyCash', name: 'Monthly Cash After Expense', width: 190, editable: true }];
    var TuitionFeesColumn = [{ key: 'Tuition&Fees', name: '', width: 190, editable: true }];
    var TransportationColumn = [{ key: 'Transportation', name: '', width: 198, editable: true }];
    var BooksSuppliesColumn = [{ key: 'BooksSupplies', name: '', width: 198, editable: true }];
    var MonthlyIncomeColumn = [{ key: 'MonthlyIncome', name: 'Monthly Income', width: 190, background: 'red', editable: true }];
    var DiscretionaryColumn = [{ key: 'Discretionary', name: '', width: 198, editable: true }];
    var OtherExpensesColumn = [{ key: 'OtherExpenses', name: '', width: 198, editable: true }];
    var TotalExpensesColumn = [{ key: 'TotalExpenses', name: '', width: 198, editable: false }];


    this._monthlyCashColumns = MonthlyCashColumn.concat(headerName);
    this._monthlyIncomeColumns = MonthlyIncomeColumn.concat(headerName);
    this._housingColumns = HousingColumn.concat(headerName);
    this._housingColumns1 = HouseholdExpensesColumn.concat(headerName);
    this._monthlyExpenseColumns = MonthlyExpenseColumn.concat(headerName);
    this._insuranceColumns = InsuranceColumn.concat(headerName);
    this._utilitiesColumns = UtilitiesColumn.concat(headerName);
    this._loanPaymentColumns = LoanPaymentColumn.concat(headerName);
    this._transportationColumns = TransportationColumn.concat(headerName);
    this._booksSuppliesColumns = BooksSuppliesColumn.concat(headerName);
    this._discretionaryColumns = DiscretionaryColumn.concat(headerName);
    this._otherExpensesColumns = OtherExpensesColumn.concat(headerName);
    this._totalExpensesColumns = TotalExpensesColumn.concat(headerName);

    return {
      rows: self.createSummaryRows(5),
      monthlyExpenseRows: self.createTable("MonthlyExpense", ["Tuition & Fees", "Tuition", "Ancillary fees"]),
      housingRows: self.createTable("Housing", ["Housing", "Rent or residence", "Mortgage", "Property taxes"]),
      householdExpensesRows: self.createTable("HouseholdExpenses", ["Household Expenses", "Groceries", "Household", "Personal/Hygiene", "Child care"]),
      insurancerows: self.createTable("Insurance", ["Insurance", "Car", "Home", "Mortgage", "Other/Life"]),
      utilitiesRows: self.createTable("Utilities", ["Utilities", "Cell phone", "Hydro", "Water", "Gas", "Cable", "Internet"]),
      loanPaymentRows: self.createTable("LoanPayment", ["Debt Payment", "Line of credit", "Bank", "Car loan", "Credit card"]),
      transportationRows: self.createTable("Transportation", ["Transportation", "Gas, maintenance", "Bus", "Parking", "Taxis", "License and registration", "Transit fares", "Travel at holidays"]),
      booksSuppliesRows: self.createTable("BooksSupplies", ["Books & Supplies", "Textbooks", "School supplies", "Lab uniforms"]),
      discretionaryRows: self.createTable("Discretionary", ["Discretionary", "Savings", "Donations", "Snacks, dining out", "Clothes", "Entertainment"]),
      otherExpensesRows: self.createTable("OtherExpenses", ["Other Expenses", "Other"]),
      totalExpensesRows: self.createTable("TotalExpenses", ["Total Expenses"]),
      cashFlowRows: self.createTable("MonthlyCash", ["Available funds", "Cumulative available funds"]),
      currentMonth: firstMonth,
      grid1visible: 'hidden',
      show: false,
      reports1: {},
      items: {},

    };

  },

  convertArrayOfObjectsToCSV(args) {
    var result, ctr, keys, columnDelimiter, lineDelimiter, data;
    result = '';
    Object.keys(args).forEach(function (key) {
      data = args[key];

      if (data == null || !data.length) {
        return null;
      }

      columnDelimiter = args.columnDelimiter || ',';
      lineDelimiter = args.lineDelimiter || '\n';
      keys = Object.keys(data[0]);
      result += keys.join(columnDelimiter);
      result += lineDelimiter;

      data.forEach(function (item) {
        ctr = 0;
        keys.forEach(function (key) {
          if (ctr > 0) result += columnDelimiter;

          result += item[key];
          ctr++;
        });
        result += lineDelimiter;
      });
    });
    return result;
  },

  downloadCSV(args) {
    var data, filename, link;
    var self = this;
    var csv = this.convertArrayOfObjectsToCSV(
      {
        data1: this.state.rows, data2: this.state.monthlyExpenseRows, data3: this.state.insurancerows,
        data4: this.state.utilitiesRows, data5: this.state.loanPaymentRows, data6: this.state.transportationRows,
        data7: this.state.booksSuppliesRows, data8: this.state.discretionaryRows, data9: this.state.otherExpensesRows

      }
    );
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
    self.setState({ data: data, fileName: 'export.csv' });
  },

  getRandomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toLocaleDateString();
  },

  sum(rows, column) {
    var amount = 0;
    rows.forEach(element => {
      amount = amount + Number(element[column] == undefined ? 0 : element[column]);
    });
    return amount == 0 ? "" : amount;
  },

  sumByColomn(rows, column) {
    var temp = $.extend({}, rows);
    var amount = 0;
    delete temp[0];
    Object.keys(temp).forEach(function (key) {
      amount = amount + temp[key][column];
    });
    return amount == 0 ? "" : amount;
  },

  change(row, e) {

    //this.setState({ rows });
    // setTimeout(this.setState({status: 'wwww'}), 3000);

    e.currentTarget.dispatchEvent("resize1");

  },

  sumByRow(row) {
    var temp = $.extend({}, row);
    var amount = 0;
    var columns = ['MonthlyIncome', 'Year', 'MonthlyExpense', 'Housing', 'Insurance', 'Utilities', 'LoanPayment',
      'MonthlyCash', 'Transportation', 'BooksSupplies', 'Discretionary', 'OtherExpenses', 'TotalExpenses', 'HouseholdExpenses', 'isSelected'];
    for (var k in temp) {
      if (columns.indexOf(k) < 0) {
        amount = amount + Number(row[k]);
      }
    }
    return amount == 0 ? "" : amount;
  },

  onRowSelect(rows, e) {

    // debugger;

    // alert('select row');
    //  this.setState({ show: true});

    this.change(rows, e);



  },

  sumByYear(rows) {
    rows.forEach((element, index) => {
      rows[index]['Year'] = this.sumByRow(rows[index]);
    });
    return rows;
  },


  createSummaryRows(numberOfRows) {
    let rows = [];
    for (let i = 1; i < numberOfRows; i++) {
      rows.push({
        //  Sep: Math.min(2000, Math.round(Math.random() * 2000)),
        Sep: "",
        Jan: "",
        Feb: "",
        Mar: "",
        Apr: "",
        May: "",
        June: "",
        July: "",
        Aug: "",
        Oct: "",
        Nov: "",
        Dec: ""
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
        MonthlyIncome: "Total Income",
        Jan: this.sum(rows, 'Jan'),
        Feb: this.sum(rows, 'Feb'),
        Mar: this.sum(rows, 'Mar'),
        Apr: this.sum(rows, 'Apr'),
        May: this.sum(rows, 'May'),
        June: this.sum(rows, 'June'),
        July: this.sum(rows, 'July'),
        Aug: this.sum(rows, 'Aug'),
        Sep: this.sum(rows, 'Sep'),
        Oct: this.sum(rows, 'Oct'),
        Nov: this.sum(rows, 'Nov'),
        Dec: this.sum(rows, 'Dec')
      });
    return rows;
  },

  totalSummaryRows(numberOfRows) {
    let rows = [];
    for (let i = 1; i < numberOfRows; i++) {
      rows.push({
        Jan: Math.min(2000, Math.round(Math.random() * 2000)),
        Feb: Math.min(2000, Math.round(Math.random() * 110)),
        Mar: Math.min(2000, Math.round(Math.random() * 110)),
        Apr: Math.min(2000, Math.round(Math.random() * 110)),
        May: Math.min(2000, Math.round(Math.random() * 110)),
        June: Math.min(2000, Math.round(Math.random() * 110)),
        July: Math.min(2000, Math.round(Math.random() * 110)),
        Aug: Math.min(2000, Math.round(Math.random() * 2000)),
        Sep: Math.min(2000, Math.round(Math.random() * 2000)),
        Oct: Math.min(6000, Math.round(Math.random() * 2000)),
        Nov: Math.min(6000, Math.round(Math.random() * 2000)),
        Dec: Math.min(6000, Math.round(Math.random() * 2000))
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
        MonthlyIncome: "Total Income",
        Jan: this.sum(rows, 'Jan'),
        Feb: this.sum(rows, 'Feb'),
        Mar: this.sum(rows, 'Mar'),
        Apr: this.sum(rows, 'Apr'),
        May: this.sum(rows, 'May'),
        June: this.sum(rows, 'June'),
        July: this.sum(rows, 'July'),
        Aug: this.sum(rows, 'Aug'),
        Sep: this.sum(rows, 'Sep'),
        Oct: this.sum(rows, 'Oct'),
        Nov: this.sum(rows, 'Nov'),
        Dec: this.sum(rows, 'Dec')

      });
    return rows;
  },

  sumBySections(sections) {
    var JanExpense = 0;
    var FebExpense = 0;
    var MarExpense = 0;
    var AprExpense = 0;
    var MayExpense = 0;
    var JuneExpense = 0;
    var JulyExpense = 0;
    var AugExpense = 0;
    var SepExpense = 0;
    var OctExpense = 0;
    var NovExpense = 0;
    var DecExpense = 0;
    var incomeSection = arguments[0];
    var JanIncome = this.sum(incomeSection, 'Jan');
    var FebIncome = this.sum(incomeSection, 'Feb');
    var MarIncome = this.sum(incomeSection, 'Mar');
    var AprIncome = this.sum(incomeSection, 'Apr');
    var MayIncome = this.sum(incomeSection, 'May');
    var JuneIncome = this.sum(incomeSection, 'June');
    var JulyIncome = this.sum(incomeSection, 'July');
    var AugIncome = this.sum(incomeSection, 'Aug');
    var SepIncome = this.sum(incomeSection, 'Sep');
    var OctIncome = this.sum(incomeSection, 'Oct');
    var NovIncome = this.sum(incomeSection, 'Nov');
    var DecIncome = this.sum(incomeSection, 'Dec');
    for (var i = 1; i < arguments.length; i++) {
      var rows = arguments[i];

      JanExpense = JanExpense + Number(rows[0].Jan);
      FebExpense = FebExpense + Number(rows[0].Feb);
      MarExpense = MarExpense + Number(rows[0].Mar);
      AprExpense = AprExpense + Number(rows[0].Apr);
      MayExpense = MayExpense + Number(rows[0].May);
      AugExpense = AugExpense + Number(rows[0].Aug);
      JuneExpense = JuneExpense + Number(rows[0].June);
      JulyExpense = JulyExpense + Number(rows[0].July);
      SepExpense = SepExpense + Number(rows[0].Sep);
      OctExpense = OctExpense + Number(rows[0].Oct);
      NovExpense = NovExpense + Number(rows[0].Nov);
      DecExpense = DecExpense + Number(rows[0].Dec);
    }
    return {
      Jan: JanExpense,
      Feb: FebExpense,
      Mar: MarExpense,
      Apr: AprExpense,
      May: MayExpense,
      June: JuneExpense,
      July: JulyExpense,
      Aug: AugExpense,
      Sep: SepExpense,
      Oct: OctExpense,
      Nov: NovExpense,
      Dec: DecExpense,
      TotalExpenses: "Total Expenses"
    };
  },


  createTable(firstColumn, columns) {
    let rows = [];
    var numberOfRows = columns.length;
    for (let i = 0; i < numberOfRows; i++) {
      rows.push({
        Jan: "",
        Feb: "",
        Mar: "",
        Apr: "",
        May: "",
        June: "",
        July: "",
        Aug: "",
        Sep: "",
        Oct: "",
        Nov: "",
        Dec: ""
      });
    }
    columns.forEach((element, index) => {
      rows[index][firstColumn] = element;
    });
    rows[0].Jan = this.sumByColomn(rows, 'Jan');
    rows[0].Feb = this.sumByColomn(rows, 'Feb');
    rows[0].Mar = this.sumByColomn(rows, 'Mar');
    rows[0].Apr = this.sumByColomn(rows, 'Apr');
    rows[0].May = this.sumByColomn(rows, 'May');
    rows[0].June = this.sumByColomn(rows, 'June');
    rows[0].July = this.sumByColomn(rows, 'July');
    rows[0].Aug = this.sumByColomn(rows, 'Aug');
    rows[0].Sep = this.sumByColomn(rows, 'Sep');
    rows[0].Oct = this.sumByColomn(rows, 'Oct');
    rows[0].Nov = this.sumByColomn(rows, 'Nov');
    rows[0].Dec = this.sumByColomn(rows, 'Dec');
    columns.forEach((element, index) => {
      rows[index]['Year'] = this.sumByRow(rows[index]);
      console.log(this.sumByRow(rows[index]), firstColumn);
    });
    return rows;
  },



  rowGetterMonthlyExpense(i) {

    return this.state.monthlyExpenseRows[i];
  },

  rowGetterCashFlow(i) {

    var rows = this.state.rows.slice();
    var result = this.sumBySections(
      this.state.rows, this.state.monthlyExpenseRows, this.state.housingRows,
      this.state.insurancerows, this.state.utilitiesRows, this.state.loanPaymentRows,
      this.state.transportationRows, this.state.booksSuppliesRows, this.state.discretionaryRows,
      this.state.otherExpensesRows, this.state.householdExpensesRows
    );

    //rows = this.state.rows.slice();
    var length = rows.length;
    var _rows = this.state.cashFlowRows.slice();
    var length1 = this.state.cashFlowRows.length;
    var items = rows.slice(0, length - 1);

    _rows[0].Sep = Number(this.sum(items, 'Sep') - result.Sep);
    _rows[0].Oct = Number(this.sum(items, 'Oct') - result.Oct);
    _rows[0].Nov = Number(this.sum(items, 'Nov') - result.Nov);
    _rows[0].Dec = Number(this.sum(items, 'Dec') - result.Dec);
    _rows[0].Jan = Number(this.sum(items, 'Jan') - result.Jan);
    _rows[0].Feb = Number(this.sum(items, 'Feb') - result.Feb);
    _rows[0].Mar = Number(this.sum(items, 'Mar') - result.Mar);
    _rows[0].Apr = Number(this.sum(items, 'Apr') - result.Apr);
    _rows[0].May = Number(this.sum(items, 'May') - result.May);
    _rows[0].June = Number(this.sum(items, 'June') - result.June);
    _rows[0].July = Number(this.sum(items, 'July') - result.July);
    _rows[0].Aug = Number(this.sum(items, 'Aug') - result.Aug);


    var Sep = Number(_rows[0].Sep);
    var Oct = Number(_rows[0].Oct + Sep);
    var Nov = Number(_rows[0].Nov + Oct);
    var Dec = Number(_rows[0].Dec + Nov);
    var Jan = Number(_rows[0].Jan + Dec);
    var Feb = Number(_rows[0].Feb + _rows[1].Jan);
    var Mar = Number(_rows[0].Mar + _rows[1].Feb);
    var Apr = Number(_rows[0].Apr + _rows[1].Mar);
    var May = Number(_rows[0].May + _rows[1].Apr);
    var June = Number(_rows[0].June + May);
    var July = Number(_rows[0].July + June);
    var Aug = Number(_rows[0].Aug + July);

    _rows[0].Year = Aug;
    const firstRow = {
      MonthlyCash: "Available funds", Jan: Jan, Feb: Feb, Mar: Mar, Apr: Apr, May: May, June: June, July: July,
      Aug: Aug, Sep: Sep, Oct: Oct, Nov: Nov, Dec: Dec
    };
    const newRow = {
      MonthlyCash: "Cumulative available funds", Jan: Jan, Feb: Feb, Mar: Mar, Apr: Apr, May: May, June: June, July: July,
      Aug: Aug, Sep: Sep, Oct: Oct, Nov: Nov, Dec: Dec
    };
    this.state.cashFlowRows[0] = firstRow;
    this.state.cashFlowRows[1] = newRow;
    return this.state.cashFlowRows[i];
  },

  rowGetterHousing(i) {
    return this.state.housingRows[i];
  },


  rowGetterHousing1(i) {
    return this.state.householdExpensesRows[i];
  },

  rowGetterInsurance(i) {
    return this.state.insurancerows[i];
  },


  rowGetterUtilities(i) {
    return this.state.utilitiesRows[i];
  },

  rowGetterLoanPayment(i) {
    return this.state.loanPaymentRows[i];
  },
  rowGetterTransportation(i) {
    return this.state.transportationRows[i];
  },

  rowGetterBooksSupplies(i) {
    return this.state.booksSuppliesRows[i];
  },

  rowGetterDiscretionary(i) {
    return this.state.discretionaryRows[i];
  },

  rowGetterOtherExpenses(i) {
    return this.state.otherExpensesRows[i];
  },


  rowGetterTotalExpenses(i) {
    var result = this.sumBySections(this.state.rows, this.state.monthlyExpenseRows, this.state.housingRows, this.state.insurancerows, this.state.utilitiesRows, this.state.loanPaymentRows,
      this.state.transportationRows, this.state.booksSuppliesRows, this.state.discretionaryRows, this.state.otherExpensesRows, this.state.householdExpensesRows);
    result.Year = result.Sep + result.Oct + result.Nov + result.Dec + result.Jan +
      result.Feb + result.Mar + result.Apr + result.May + result.June + result.July + result.Aug;
    return result;
  },

  rowGetter(i) {
    return this.state.rows[i];
  },

  deleteRowMonthlyInCome() {

    //  debugger;
    var length = this.state.rows.length;
    var tableName = this.state.tableMapping[this.state.currentgrid];
    var currentgrid = "grid" + this.state.currentgrid;
    var i = this.state.currentRowIdx;
    if (currentgrid == "grid1") {
      if (i != length - 1) {
        this.state.rows.splice(i, 1);
        this.setState({ rows: this.state.rows });
        this.onSave({ "rows": this.state.rows })
      }


      this.handleGridRowsUpdated(1, 1);

    }


  },


  deleteRow1() {

    debugger;

    var tableName = this.state.tableMapping[this.state.currentgrid];
    var currentgrid = "grid" + this.state.currentgrid;
    var i = this.state.currentRowIdx;
    this.state[tableName].splice(i, 1);
    this.setState({ rows: this.state.rows });
    this.onSave({ "rows": this.state.rows })
  },

  deleteRow7() {

    var tableName = this.state.tableMapping[this.state.currentgrid];
    var currentgrid = "grid" + this.state.currentgrid;
    var i = this.state.currentRowIdx;
    if (currentgrid == "grid7" && i > 0) {
      var rows = this.state.booksSuppliesRows;
      rows.splice(i, 1);
      var length = rows.length;
      var items = rows.slice(1, length);
      var _row = this.createSummaryRow(items, "booksSupplies");
      rows[0] = _row;
      _row["BooksSupplies"] = "Books & Supplies"
      this.setState({ booksSuppliesRows: rows });
      this.onSave({ "booksSuppliesRows": rows });
      this.handleGridRowsUpdatedbooksSupplies(1, 1);
    }
  },


  deleteRow3() {

    var tableName = this.state.tableMapping[this.state.currentgrid];
    var currentgrid = "grid" + this.state.currentgrid;
    var i = this.state.currentRowIdx;
    if (currentgrid == "grid3" && i > 0) {
      var rows = this.state.housingRows;
      rows.splice(i, 1);
      var length = rows.length;
      var items = rows.slice(1, length);
      var _row = this.createSummaryRow(items, "Housing");
      rows[0] = _row;
      _row["Housing"] = "Housing"
      rows[0] = _row;
      this.setState({ housingRows: rows });
      this.onSave({ "housingRows": rows });
      this.handleGridRowsUpdatedHousing(1, 1);
    }
  },

  deleteRow2() {

    var tableName = this.state.tableMapping[this.state.currentgrid];
    var currentgrid = "grid" + this.state.currentgrid;
    var i = this.state.currentRowIdx;
    if (currentgrid == "grid2" && i > 0) {
      var rows = this.state.monthlyExpenseRows;
      rows.splice(i, 1);
      var length = rows.length;
      var items = rows.slice(1, length);
      var _row = this.createSummaryRow(items, "MonthlyExpense");
      _row["MonthlyExpense"] = "Tuition & Fees"
      rows[0] = _row;
      this.setState({ monthlyExpenseRows: rows });
      this.onSave({ "monthlyExpenseRows": rows });
      this.handleGridRowsUpdatedMonthlyExpense(1, 1);
    }
  },


  deleteRow4() {

    var tableName = this.state.tableMapping[this.state.currentgrid];
    var currentgrid = "grid" + this.state.currentgrid;
    var i = this.state.currentRowIdx;
    if (currentgrid == "grid4" && i > 0) {


      var rows = this.state.insurancerows;
      rows.splice(i, 1);
      var length = rows.length;
      var items = rows.slice(1, length);

      var _row = this.createSummaryRow(items, "Insurance");
      _row["Insurance"] = "Insurance"
      rows[0] = _row;
      this.setState({ insurancerows: rows });
      this.onSave({ "insurancerows": rows });
      this.handleGridRowsUpdatedInsurance(1, 1);
    }
  },
  deleteRow5() {

    var tableName = this.state.tableMapping[this.state.currentgrid];
    var currentgrid = "grid" + this.state.currentgrid;
    var i = this.state.currentRowIdx;
    if (currentgrid == "grid5" && i > 0) {
      var rows = this.state.utilitiesRows;
      rows.splice(i, 1);
      var length = rows.length;
      var items = rows.slice(1, length);
      var _row = this.createSummaryRow(items, "utilities");
      _row["Utilities"] = "Utilities"
      rows[0] = _row;
      this.setState({ utilitiesRows: rows });
      this.onSave({ "utilitiesRows": rows });
      this.handleGridRowsUpdatedUtilities(1, 1);
    }
  },



  deleteRow6() {

    var tableName = this.state.tableMapping[this.state.currentgrid];
    var currentgrid = "grid" + this.state.currentgrid;
    var i = this.state.currentRowIdx;
    if (currentgrid == "grid6" && i > 0) {
      var rows = this.state.loanPaymentRows;
      rows.splice(i, 1);
      var length = rows.length;
      var items = rows.slice(1, length);
      var _row = this.createSummaryRow(items, "loanPayment");
      _row["loanPayment"] = "Debt Payment"
      rows[0] = _row;
      this.setState({ loanPaymentRows: rows });
      this.onSave({ "loanPaymentRows": rows });
      this.handleGridRowsUpdatedLoanPayment(1, 1);
    }
  },

  deleteRow8() {

    var tableName = this.state.tableMapping[this.state.currentgrid];
    var currentgrid = "grid" + this.state.currentgrid;
    var i = this.state.currentRowIdx;
    if (currentgrid == "grid8" && i > 0) {
      var rows = this.state.transportationRows;
      rows.splice(i, 1);
      var length = rows.length;
      var items = rows.slice(1, length);
      var _row = this.createSummaryRow(items, "transportation");
      _row["transportation"] = "Transportation";
      rows[0] = _row;
      this.setState({ transportationRows: rows });
      this.onSave({ "transportationRows": rows });
      this.handleGridRowsUpdatedTransportation(1, 1);
    }
  },

  deleteRow9() {

    var tableName = this.state.tableMapping[this.state.currentgrid];
    var currentgrid = "grid" + this.state.currentgrid;
    var i = this.state.currentRowIdx;
    if (currentgrid == "grid9" && i > 0) {
      var rows = this.state.discretionaryRows;
      rows.splice(i, 1);
      var length = rows.length;
      var items = rows.slice(1, length);
      var _row = this.createSummaryRow(items, "discretionary");
      _row["Discretionary"] = "Discretionary";
      rows[0] = _row;
      this.setState({ discretionaryRows: rows });
      this.onSave({ "discretionaryRows": rows });
      this.handleGridRowsUpdatedDiscretionary(1, 1);
    }
  },

  deleteRow10() {

    var tableName = this.state.tableMapping[this.state.currentgrid];
    var currentgrid = "grid" + this.state.currentgrid;
    var i = this.state.currentRowIdx;
    if (currentgrid == "grid10" && i > 0) {
      var rows = this.state.otherExpensesRows;
      rows.splice(i, 1);
      var length = rows.length;
      var items = rows.slice(1, length);
      var _row = this.createSummaryRow(items, "OtherExpenses");
      _row["OtherExpenses"] = "Other Expenses"
      rows[0] = _row;
      this.setState({ otherExpensesRows: rows });
      this.onSave({ "otherExpensesRows": rows });
      this.handleGridRowsUpdatedOtherExpenses(1, 1);
    }
  },

  deleteRow11() {

    var tableName = this.state.tableMapping[this.state.currentgrid];
    var currentgrid = "grid" + this.state.currentgrid;
    var i = this.state.currentRowIdx;
    if (currentgrid == "grid11" && i > 0) {
      var rows = this.state.householdExpensesRows;
      rows.splice(i, 1);
      var length = rows.length;
      var items = rows.slice(1, length);
      var _row = this.createSummaryRow(items, "householdExpenses");
      _row["HouseholdExpenses"] = "Household Expenses"
      rows[0] = _row;
      this.setState({ householdExpensesRows: rows });
      this.onSave({ "householdExpensesRows": rows });
      this.handleGridRowsUpdatedHouseholdExpensesRows(1, 1);
    }
  },

  deleteRow(e, { rowIdx: rowIdx }) {
    debugger;
    var tableName = this.state.tableMapping[this.state.currentgrid];


    if (tableName == "rows") {

      this.deleteRowMonthlyInCome();

    }

    if (tableName == "householdExpensesRows") {

      this.deleteRow11();


    }

    if (tableName == "monthlyExpenseRows") {

      this.deleteRow2();


    }

    if (tableName == "housingRows") {
      this.deleteRow3();


    }

    if (tableName == "insurancerows") {

      this.deleteRow4();


    }


    if (tableName == "utilitiesRows") {

      this.deleteRow5();


    }

    if (tableName == "loanPaymentRows") {

      this.deleteRow6();


    }

    if (tableName == "booksSuppliesRows") {

      this.deleteRow7();


    }

    if (tableName == "transportationRows") {

      this.deleteRow8();

    }

    if (tableName == "discretionaryRows") {

      this.deleteRow9();

    }

    if (tableName == "otherExpensesRows") {

      this.deleteRow10();

    }


  },

  copyAcross(e, { rowIdx: rowIdx, idx: idx }) {
    debugger;
    var tableName = this.state.tableMapping[this.state.currentgrid];
    var currentgrid = "grid" + this.state.currentgrid;

    for (let loop = this.state.currentIdx + 1; loop <= this[currentgrid].props.columns.length - 2; loop++) {
      this.state[tableName][this.state.currentRowIdx][this[currentgrid].props.columns[loop].key] = this.state[tableName][this.state.currentRowIdx][this[currentgrid].props.columns[this.state.currentIdx].key];//this.state.rows[0][0]
    }


    this.setState({ rows: this.state.rows });
    this.handleGridRowsUpdated(1, 1);
    this.handleGridRowsUpdatedMonthlyExpense(1, 1);
    this.handleGridRowsUpdatedHouseholdExpensesRows(1, 1);
    this.handleGridRowsUpdatedHousing(1, 1);
    this.handleGridRowsUpdatedInsurance(1, 1);
    this.handleGridRowsUpdatedUtilities(1, 1);
    this.handleGridRowsUpdatedLoanPayment(1, 1);
    this.handleGridRowsUpdatedTransportation(1, 1);
    this.handleGridRowsUpdatedbooksSupplies(1, 1);
    this.handleGridRowsUpdatedDiscretionary(1, 1);
    this.handleGridRowsUpdatedOtherExpenses(1, 1);



    setTimeout(() => {
      this.getExpenseBalance();
      setTimeout(() => {

        this.isOnBudget(this.state.currentMonth);
      }, 1);
    }, 1);


  },



  handleAddRowMonthlyIncome() {
    const newRow = { Jan: '', Feb: '', Mar: '', Apr: '', May: '', June: '', July: '', Aug: '', Sep: '', Oct: '', Nov: '', Dec: '' };
    var rows = this.state.rows.slice();
    rows = update(rows, { $push: [newRow] });
    rows[rows.length - 1] = rows[rows.length - 2];
    this.grid1.openCellEditor(rows.length - 2, 0);
    rows[rows.length - 2] = {};
    this.state.addMonthlyIncome = true;
    this.isOnBudget(this.state.currentMonth);
    this.setState({ rows });

  },

  handleAddRowMonthlyExpense() {
    const newRow = { Jan: '', Feb: '', Mar: '', Apr: '', May: '', June: '', July: '', Aug: '', Sep: '', Oct: '', Nov: '', Dec: '' };
    var rows = this.state.monthlyExpenseRows.slice();
    rows = update(rows, { $push: [newRow] });
    this.grid2.openCellEditor(rows.length - 1, 0);
    this.state.monthlyExpenseRows = rows;
    this.layoutSetting(this.grid2);
    this.setState({ "monthlyExpenseRows": rows });

  },

  handleAddRowHousing() {
    const newRow = { Jan: '', Feb: '', Mar: '', Apr: '', May: '', June: '', July: '', Aug: '', Sep: '', Oct: '', Nov: '', Dec: '' };
    var rows = this.state.housingRows.slice();
    rows = update(rows, { $push: [newRow] });
    this.grid7.openCellEditor(rows.length - 1, 0);
    this.state.housingRows = rows;
    this.setState({ "housingRows": rows });
  },

  handleAddRowBooksSupplies() {
    const newRow = { Jan: '', Feb: '', Mar: '', Apr: '', May: '', June: '', July: '', Aug: '', Sep: '', Oct: '', Nov: '', Dec: '' };
    var rows = this.state.booksSuppliesRows.slice();
    rows = update(rows, { $push: [newRow] });
    this.grid7.openCellEditor(rows.length - 1, 0);
    this.state.booksSuppliesRows = rows;
    this.setState({ "booksSuppliesRows": rows });
  },

  handleAddRowHouseholdExpense() {
    const newRow = { Jan: '', Feb: '', Mar: '', Apr: '', May: '', June: '', July: '', Aug: '', Sep: '', Oct: '', Nov: '', Dec: '' };
    var rows = this.state.householdExpensesRows.slice();
    rows = update(rows, { $push: [newRow] });
    this.grid7.openCellEditor(rows.length - 1, 0);
    this.state.householdExpensesRows = rows;
    this.setState({ "householdExpensesRows": rows });
  },

  handleAddRowUtilities() {
    const newRow = { Jan: '', Feb: '', Mar: '', Apr: '', May: '', June: '', July: '', Aug: '', Sep: '', Oct: '', Nov: '', Dec: '' };
    var rows = this.state.utilitiesRows.slice();
    rows = update(rows, { $push: [newRow] });
    this.grid4.openCellEditor(rows.length - 1, 0);
    this.state.utilitiesRows = rows;
    this.setState({ "utilitiesRows": rows });
  },

  handleAddRowInsurance() {
    const newRow = { Jan: '', Feb: '', Mar: '', Apr: '', May: '', June: '', July: '', Aug: '', Sep: '', Oct: '', Nov: '', Dec: '' };
    var rows = this.state.insurancerows.slice();
    rows = update(rows, { $push: [newRow] });
    this.grid4.openCellEditor(rows.length - 1, 0);
    this.state.insuranceRows = rows;
    this.setState({ "insurancerows": rows });
  },

  handleAddRowLoanPayment() {
    const newRow = { Jan: '', Feb: '', Mar: '', Apr: '', May: '', June: '', July: '', Aug: '', Sep: '', Oct: '', Nov: '', Dec: '' };
    var rows = this.state.loanPaymentRows.slice();
    rows = update(rows, { $push: [newRow] });
    this.grid4.openCellEditor(rows.length - 1, 0);
    this.state.loanPaymentRows = rows;
    this.setState({ "loanPaymentRows": rows });
  },

  handleAddRowTransportation() {
    const newRow = { Jan: '', Feb: '', Mar: '', Apr: '', May: '', June: '', July: '', Aug: '', Sep: '', Oct: '', Nov: '', Dec: '' };
    var rows = this.state.transportationRows.slice();
    rows = update(rows, { $push: [newRow] });
    this.grid4.openCellEditor(rows.length - 1, 0);
    this.state.transportationRows = rows;
    this.setState({ "transportationRows": rows });
  },


  handleAddRowDiscretionary() {
    const newRow = { Jan: '', Feb: '', Mar: '', Apr: '', May: '', June: '', July: '', Aug: '', Sep: '', Oct: '', Nov: '', Dec: '' };
    var rows = this.state.discretionaryRows.slice();
    rows = update(rows, { $push: [newRow] });
    this.grid4.openCellEditor(rows.length - 1, 0);
    this.state.discretionaryRows = rows;
    this.setState({ "discretionaryRows": rows });
  },

  handleAddRowOtherExpenses() {
    const newRow = { Jan: '', Feb: '', Mar: '', Apr: '', May: '', June: '', July: '', Aug: '', Sep: '', Oct: '', Nov: '', Dec: '' };
    var rows = this.state.otherExpensesRows.slice();
    rows = update(rows, { $push: [newRow] });
    this.grid10.openCellEditor(rows.length - 1, 0);
    this.state.otherExpensesRows = rows;
    this.setState({ "otherExpensesRows": rows });
  },
  handleAddRow({ newRowIndex }) {
    var tableName = this.state.tableMapping[this.state.currentgrid];
    var currentgrid = "grid" + this.state.currentgrid;
    const newRow = { Jan: '', Feb: '', Mar: '', Apr: '', May: '', June: '', July: '', Aug: '', Sep: '', Oct: '', Nov: '', Dec: '' };
    var rows;

    if (this.state.currentgrid == 1) {

      rows = this.state.rows.slice();
      rows = update(rows, { $push: [newRow] });
      rows[rows.length - 1] = rows[rows.length - 2];
      this[currentgrid].openCellEditor(rows.length - 2, 0);
      rows[rows.length - 2] = {};
      this.setState({ rows });
    }
    else {
      rows = this.state[tableName].slice();
      rows = update(rows, { $push: [newRow] });
      this[currentgrid].openCellEditor(rows.length - 1, 0);
      this.state[tableName] = rows;
      this.setState({ tableName: rows });
    }
  },

  handleAddRowMonththlyExpense({ newRowIndex }) {
    const newRow = { Jan: '', Feb: '', Mar: '', Apr: '', May: '', June: '', July: '', Aug: '', Sep: '', Oct: '', Nov: '', Dec: '' };
    let rows = this.state.monthlyExpenseRows.slice();
    rows = update(rows, { $push: [newRow] });
    rows[rows.length - 1] = rows[rows.length - 2];
    this.grid2.openCellEditor(rows.length - 2, 0);
    rows[rows.length - 2] = {};
    this.setState({ rows });
  },

  handleGridRowsUpdated({ fromRow, toRow, updated }) {
    var filled = false;
    let rows = this.state.rows.slice();
    let length = this.state.rows.length;
    for (let i = fromRow; i <= toRow; i++) {
      let rowToUpdate = rows[i];
      let updatedRow = update(rowToUpdate, { $merge: updated });

      for (var key in updatedRow) {
        if (['MonthlyIncome', 'Sep'].indexOf(key) == -1) {

          var value = updatedRow[key];
          if (value != undefined && value != "") {
            filled = true;
            break;
          }
        }

      }

      if (filled == false && (updatedRow.Oct == "" || updatedRow.Oct == undefined) && (updatedRow.Sep != "" || updatedRow.Sep != undefined)) {
        updatedRow.Feb = updatedRow.Sep;
        updatedRow.Mar = updatedRow.Sep;
        updatedRow.Apr = updatedRow.Sep;
        updatedRow.May = updatedRow.Sep;
        updatedRow.June = updatedRow.Sep;
        updatedRow.July = updatedRow.Sep;
        updatedRow.Aug = updatedRow.Sep;
        updatedRow.Jan = updatedRow.Sep;
        updatedRow.Oct = updatedRow.Sep;
        updatedRow.Nov = updatedRow.Sep;
        updatedRow.Dec = updatedRow.Sep;
      }
      rows[i] = updatedRow;
    }


    var result = this.sumBySections(this.state.rows, this.state.monthlyExpenseRows, this.state.housingRows, this.state.insurancerows, this.state.utilitiesRows, this.state.loanPaymentRows,
      this.state.transportationRows, this.state.booksSuppliesRows, this.state.discretionaryRows, this.state.otherExpensesRows);
    rows = rows.slice();
    length = rows.length;

    var _rows = this.state.cashFlowRows.slice();
    var length1 = this.state.cashFlowRows.length;
    var items = rows.slice(0, length - 1);
    this.sum(items, 'Sep');

    _rows[0].Jan = this.sum(items, 'Sep') - result.Sep;
    _rows[0].Feb = this.sum(items, 'Oct') - result.Oct;
    _rows[0].Mar = this.sum(items, 'Nov') - result.Nov;
    _rows[0].Apr = this.sum(items, 'Dev') - result.Dev;
    _rows[0].May = this.sum(items, 'May') - result.May;
    _rows[0].June = this.sum(items, 'June') - result.June;
    _rows[0].July = this.sum(items, 'July') - result.July;
    _rows[0].Aug = this.sum(items, 'Aug') - result.Aug;
    _rows[0].Sep = this.sum(items, 'Sep') - result.Sep;
    _rows[0].Oct = this.sum(items, 'Oct') - result.Oct;
    _rows[0].Nov = this.sum(items, 'Nov') - result.Nov;
    _rows[0].Dec = this.sum(items, 'Dec') - result.Dec;
    var Jan = _rows[0].Jan;
    var Feb = _rows[0].Feb + _rows[1].Jan;
    var Mar = _rows[0].Mar + _rows[1].Feb;

    var newRow = {
      MonthlyCash: "Cumulative cash flow", Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, June: 0,
      July: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0
    };

    _rows[1] = newRow;
    var items = rows.slice(0, length - 1);
    var jan = this.sum(items, 'Jan');
    var mar = this.sum(items, 'Mar');
    var feb = this.sum(items, 'Feb');
    var mar = this.sum(items, 'Mar');
    var apr = this.sum(items, 'Apr');
    var may = this.sum(items, 'May');
    var june = this.sum(items, 'June');
    var july = this.sum(items, 'July');
    var aug = this.sum(items, 'Aug');
    var sep = this.sum(items, 'Sep');
    var oct = this.sum(items, 'Oct');
    var nov = this.sum(items, 'Nov');
    var dec = this.sum(items, 'Dec');

    var _row = {
      MonthlyIncome: "Total Income", Jan: jan, Feb: feb, Mar: mar,
      Apr: apr, May: may, June: june, July: july, Aug: aug, Sep: sep,
      Oct: oct, Nov: nov, Dec: dec
    };

    rows[length - 1] = _row;
    this.sumByYear(rows);

    this.state.rows = rows;
    this.setState({ rows: rows });
    this.setState({ cashFlowRows: _rows });



    this.onSave({ "rows": rows });
    this.isOnBudget(this.state.currentMonth);//before: empty
    this.getIncomeBalance();
    this.getExpenseBalance();
  },

  createSummaryRow(items, column) {
    var jan = this.sum(items, 'Jan');
    var mar = this.sum(items, 'Mar');
    var feb = this.sum(items, 'Feb');
    var mar = this.sum(items, 'Mar');
    var apr = this.sum(items, 'Apr');
    var may = this.sum(items, 'May');
    var june = this.sum(items, 'June');
    var july = this.sum(items, 'July');
    var aug = this.sum(items, 'Aug');
    var sep = this.sum(items, 'Sep');
    var oct = this.sum(items, 'Oct');
    var nov = this.sum(items, 'Nov');
    var dec = this.sum(items, 'Dec');
    const newRow = { Jan: jan, Feb: feb, Mar: mar, Apr: apr, May: may, June: june, July: july, Aug: aug, Sep: sep, Oct: oct, Nov: nov, Dec: dec };
    newRow[column] = column;
    return newRow;
  },


  createSummaryRowKeys(items, columnkey, columnvalue) {
    var jan = this.sum(items, 'Jan');
    var mar = this.sum(items, 'Mar');
    var feb = this.sum(items, 'Feb');
    var mar = this.sum(items, 'Mar');
    var apr = this.sum(items, 'Apr');
    var may = this.sum(items, 'May');
    var june = this.sum(items, 'June');
    var july = this.sum(items, 'July');
    var aug = this.sum(items, 'Aug');
    var sep = this.sum(items, 'Sep');
    var oct = this.sum(items, 'Oct');
    var nov = this.sum(items, 'Nov');
    var dec = this.sum(items, 'Dec');
    const newRow = { Jan: jan, Feb: feb, Mar: mar, Apr: apr, May: may, June: june, July: july, Aug: aug, Sep: sep, Oct: oct, Nov: nov, Dec: dec };
    newRow[columnkey] = columnvalue;
    return newRow;
  },






  createNewRow(column, jan, feb, mar, apr, may, june, july, aug, sep, oct, nov, dec) {
    let newRow = {
      column: column, Jan: jan, Feb: feb, Mar: mar, Apr: apr, May: may,
      June: june, July: july, Aug: aug, Sep: sep, Oct: oct, Nov: nov, Dec: dec
    };
    return newRow;
  },

  handleGridRowsUpdatedMonthlyExpense({ fromRow, toRow, updated }) {
    var filled = false;
    let monthlyExpenseRows = this.state.monthlyExpenseRows.slice();
    let length = this.state.monthlyExpenseRows.length;

    for (let i = fromRow; i <= toRow; i++) {
      let rowToUpdate = monthlyExpenseRows[i];
      let updatedRow = update(rowToUpdate, { $merge: updated });

      for (var key in updatedRow) {
        if (['MonthlyExpense', 'Sep'].indexOf(key) == -1) {

          var value = updatedRow[key];
          if (value != undefined && value != "") {
            filled = true;
            break;
          }
        }

      }

      if (updatedRow.Oct == "" && filled == false) {
        updatedRow.Feb = updatedRow.Sep;
        updatedRow.Mar = updatedRow.Sep;
        updatedRow.Apr = updatedRow.Sep;
        updatedRow.May = updatedRow.Sep;
        updatedRow.June = updatedRow.Sep;
        updatedRow.July = updatedRow.Sep;
        updatedRow.Aug = updatedRow.Sep;
        updatedRow.Jan = updatedRow.Sep;
        updatedRow.Oct = updatedRow.Sep;
        updatedRow.Nov = updatedRow.Sep;
        updatedRow.Dec = updatedRow.Sep;
      }
      monthlyExpenseRows[i] = updatedRow;
    }

    var items = monthlyExpenseRows.slice(1, length);
    var jan = this.sum(items, 'Jan');
    var mar = this.sum(items, 'Mar');
    var feb = this.sum(items, 'Feb');
    var mar = this.sum(items, 'Mar');
    var apr = this.sum(items, 'Apr');
    var may = this.sum(items, 'May');
    var june = this.sum(items, 'June');
    var july = this.sum(items, 'July');
    var aug = this.sum(items, 'Aug');
    var sep = this.sum(items, 'Sep');
    var oct = this.sum(items, 'Oct');
    var nov = this.sum(items, 'Nov');
    var dec = this.sum(items, 'Dec');

    const newRow = {
      MonthlyExpense: "Tuition & Fees", Jan: jan, Feb: feb, Mar: mar, Apr: apr, May: may, June: june, July: july,
      Aug: aug, Sep: sep, Oct: oct, Nov: nov, Dec: dec
    };

    monthlyExpenseRows[0] = newRow;
    this.sumByYear(monthlyExpenseRows);
    this.setState({ monthlyExpenseRows: monthlyExpenseRows });
    this.layoutSetting(this.grid2);
    this.onSave({ "monthlyExpenseRows": monthlyExpenseRows })
    this.getIncomeBalance();
    //this.getExpenseBalance();
    setTimeout(() => {
      this.getExpenseBalance();
      setTimeout(() => {

        this.isOnBudget(this.state.currentMonth);
      }, 1);
    }, 1);
  },

  handleGridRowsUpdatedHouseholdExpensesRows({ fromRow, toRow, updated }) {
    var filled = false;
    let householdExpensesRows = this.state.householdExpensesRows.slice();
    let length = this.state.householdExpensesRows.length;

    for (let i = fromRow; i <= toRow; i++) {
      let rowToUpdate = householdExpensesRows[i];
      let updatedRow = update(rowToUpdate, { $merge: updated });

      for (var key in updatedRow) {
        if (['HouseholdExpenses', 'Sep'].indexOf(key) == -1) {

          var value = updatedRow[key];
          if (value != undefined && value != "") {
            filled = true;
            break;
          }
        }
      }

      if (updatedRow.Oct == "" && filled == false) {
        updatedRow.Feb = updatedRow.Sep;
        updatedRow.Mar = updatedRow.Sep;
        updatedRow.Apr = updatedRow.Sep;
        updatedRow.May = updatedRow.Sep;
        updatedRow.June = updatedRow.Sep;
        updatedRow.July = updatedRow.Sep;
        updatedRow.Aug = updatedRow.Sep;
        updatedRow.Jan = updatedRow.Sep;
        updatedRow.Oct = updatedRow.Sep;
        updatedRow.Nov = updatedRow.Sep;
        updatedRow.Dec = updatedRow.Sep;
      }

      householdExpensesRows[i] = updatedRow;
    }

    var items = householdExpensesRows.slice(1, length);
    var _row = this.createSummaryRowKeys(items, "HouseholdExpenses", "Household Expenses");
    householdExpensesRows[0] = _row;
    this.sumByYear(householdExpensesRows);
    this.setState({ householdExpensesRows: householdExpensesRows });

    this.onSave({ "householdExpensesRows": householdExpensesRows });

    this.getIncomeBalance();
    setTimeout(() => {
      this.getExpenseBalance();
      setTimeout(() => {

        this.isOnBudget(this.state.currentMonth);
      }, 1);
    }, 1);

  },

  handleGridRowsUpdatedHousing({ fromRow, toRow, updated }) {
    var filled = false;
    let housingRows = this.state.housingRows.slice();
    let length = this.state.housingRows.length;

    for (let i = fromRow; i <= toRow; i++) {
      let rowToUpdate = housingRows[i];
      let updatedRow = update(rowToUpdate, { $merge: updated });

      for (var key in updatedRow) {
        if (['Housing', 'Sep'].indexOf(key) == -1) {

          var value = updatedRow[key];
          if (value != undefined && value != "") {
            filled = true;
            break;
          }
        }
      }

      if (updatedRow.Oct == "" && filled == false) {
        updatedRow.Feb = updatedRow.Sep;
        updatedRow.Mar = updatedRow.Sep;
        updatedRow.Apr = updatedRow.Sep;
        updatedRow.May = updatedRow.Sep;
        updatedRow.June = updatedRow.Sep;
        updatedRow.July = updatedRow.Sep;
        updatedRow.Aug = updatedRow.Sep;
        updatedRow.Jan = updatedRow.Sep;
        updatedRow.Oct = updatedRow.Sep;
        updatedRow.Nov = updatedRow.Sep;
        updatedRow.Dec = updatedRow.Sep;
      }


      housingRows[i] = updatedRow;
    }

    var items = housingRows.slice(1, length);
    var _row = this.createSummaryRow(items, "Housing");
    housingRows[0] = _row;
    this.sumByYear(housingRows);
    this.setState({ housingRows: housingRows });

    this.onSave({ "housingRows": housingRows });

    this.getIncomeBalance();
    setTimeout(() => {
      this.getExpenseBalance();
      setTimeout(() => {

        this.isOnBudget(this.state.currentMonth);
      }, 1);
    }, 1);

  },


  handleGridRowsUpdatedInsurance({ fromRow, toRow, updated }) {
    var filled = false;
    let rows = this.state.insurancerows.slice();
    let length = this.state.insurancerows.length;

    for (let i = fromRow; i <= toRow; i++) {
      let rowToUpdate = rows[i];
      let updatedRow = update(rowToUpdate, { $merge: updated });

      for (var key in updatedRow) {
        if (['Insurance', 'Sep'].indexOf(key) == -1) {

          var value = updatedRow[key];
          if (value != undefined && value != "") {
            filled = true;
            break;
          }
        }
      }

      if (updatedRow.Oct == "" && filled == false) {
        updatedRow.Feb = updatedRow.Sep;
        updatedRow.Mar = updatedRow.Sep;
        updatedRow.Apr = updatedRow.Sep;
        updatedRow.May = updatedRow.Sep;
        updatedRow.June = updatedRow.Sep;
        updatedRow.July = updatedRow.Sep;
        updatedRow.Aug = updatedRow.Sep;
        updatedRow.Jan = updatedRow.Sep;
        updatedRow.Oct = updatedRow.Sep;
        updatedRow.Nov = updatedRow.Sep;
        updatedRow.Dec = updatedRow.Sep;
      }

      rows[i] = updatedRow;
    }
    var items = rows.slice(1, length);
    var _row = this.createSummaryRow(items, "Insurance");
    rows[0] = _row;
    this.sumByYear(rows);
    this.setState({ insurancerows: rows });

    this.onSave({ "insuranceRows": rows })

    this.getIncomeBalance();
    setTimeout(() => {
      this.getExpenseBalance();
      setTimeout(() => {

        this.isOnBudget(this.state.currentMonth);
      }, 1);
    }, 1);

  },

  handleGridRowsUpdatedUtilities({ fromRow, toRow, updated }) {
    var filled = false;
    let rows = this.state.utilitiesRows.slice();
    let length = this.state.utilitiesRows.length;

    for (let i = fromRow; i <= toRow; i++) {
      let rowToUpdate = rows[i];
      let updatedRow = update(rowToUpdate, { $merge: updated });

      for (var key in updatedRow) {
        if (['Utilities', 'Sep'].indexOf(key) == -1) {

          var value = updatedRow[key];
          if (value != undefined && value != "") {
            filled = true;
            break;
          }
        }
      }

      if (updatedRow.Oct == "" && filled == false) {
        updatedRow.Feb = updatedRow.Sep;
        updatedRow.Mar = updatedRow.Sep;
        updatedRow.Apr = updatedRow.Sep;
        updatedRow.May = updatedRow.Sep;
        updatedRow.June = updatedRow.Sep;
        updatedRow.July = updatedRow.Sep;
        updatedRow.Aug = updatedRow.Sep;
        updatedRow.Jan = updatedRow.Sep;
        updatedRow.Oct = updatedRow.Sep;
        updatedRow.Nov = updatedRow.Sep;
        updatedRow.Dec = updatedRow.Sep;
      }

      rows[i] = updatedRow;
    }
    var items = rows.slice(1, length);
    var _row = this.createSummaryRow(items, "Utilities");
    rows[0] = _row;
    this.sumByYear(rows);
    this.setState({ utilitiesRows: rows });

    this.onSave({ "utilitiesRows": rows })

    this.getIncomeBalance();
    setTimeout(() => {
      this.getExpenseBalance();
      setTimeout(() => {

        this.isOnBudget(this.state.currentMonth);
      }, 1);
    }, 1);

  },

  handleGridRowsUpdatedLoanPayment({ fromRow, toRow, updated }) {

    var filled = false;
    let rows = this.state.loanPaymentRows.slice();
    let length = this.state.loanPaymentRows.length;

    for (let i = fromRow; i <= toRow; i++) {
      let rowToUpdate = rows[i];
      let updatedRow = update(rowToUpdate, { $merge: updated });

      for (var key in updatedRow) {
        if (['LoanPayment', 'Sep'].indexOf(key) == -1) {

          var value = updatedRow[key];
          if (value != undefined && value != "") {
            filled = true;
            break;
          }
        }
      }

      if (updatedRow.Oct == "" && filled == false) {
        updatedRow.Feb = updatedRow.Sep;
        updatedRow.Mar = updatedRow.Sep;
        updatedRow.Apr = updatedRow.Sep;
        updatedRow.May = updatedRow.Sep;
        updatedRow.June = updatedRow.Sep;
        updatedRow.July = updatedRow.Sep;
        updatedRow.Aug = updatedRow.Sep;
        updatedRow.Jan = updatedRow.Sep;
        updatedRow.Oct = updatedRow.Sep;
        updatedRow.Nov = updatedRow.Sep;
        updatedRow.Dec = updatedRow.Sep;
      }
      rows[i] = updatedRow;
    }

    var items = rows.slice(1, length);
    var _row = this.createSummaryRowKeys(items, "LoanPayment", "Debt Payments");

    rows[0] = _row;
    this.sumByYear(rows);
    this.setState({ loanPaymentRows: rows });
    this.onSave({ "LoanPayment": rows })
    //this.getIncomeBalance();
    //this.getExpenseBalance();
    this.getIncomeBalance();
    setTimeout(() => {
      this.getExpenseBalance();
      setTimeout(() => {

        this.isOnBudget(this.state.currentMonth);
      }, 1);
    }, 1);
  },

  handleGridRowsUpdatedTransportation({ fromRow, toRow, updated }) {
    var filled = false;
    let rows = this.state.transportationRows.slice();
    let length = this.state.transportationRows.length;

    for (let i = fromRow; i <= toRow; i++) {
      let rowToUpdate = rows[i];
      let updatedRow = update(rowToUpdate, { $merge: updated });

      for (var key in updatedRow) {
        if (['Transportation', 'Sep'].indexOf(key) == -1) {

          var value = updatedRow[key];
          if (value != undefined && value != "") {
            filled = true;
            break;
          }
        }
      }

      if (updatedRow.Oct == "" && filled == false) {
        updatedRow.Feb = updatedRow.Sep;
        updatedRow.Mar = updatedRow.Sep;
        updatedRow.Apr = updatedRow.Sep;
        updatedRow.May = updatedRow.Sep;
        updatedRow.June = updatedRow.Sep;
        updatedRow.July = updatedRow.Sep;
        updatedRow.Aug = updatedRow.Sep;
        updatedRow.Jan = updatedRow.Sep;
        updatedRow.Oct = updatedRow.Sep;
        updatedRow.Nov = updatedRow.Sep;
        updatedRow.Dec = updatedRow.Sep;
      }
      rows[i] = updatedRow;
    }

    var items = rows.slice(1, length);
    var _row = this.createSummaryRow(items, "Transportation");
    rows[0] = _row;
    this.sumByYear(rows);
    this.setState({ transportationRows: rows });
    this.onSave({ "transportationRows": rows })

    // this.getIncomeBalance();
    //this.getExpenseBalance();

    this.getIncomeBalance();
    setTimeout(() => {
      this.getExpenseBalance();
      setTimeout(() => {

        this.isOnBudget(this.state.currentMonth);
      }, 1);
    }, 1);

  },

  handleGridRowsUpdatedbooksSupplies({ fromRow, toRow, updated }) {
    debugger;
    var filled = false;
    let rows = this.state.booksSuppliesRows.slice();
    let length = this.state.booksSuppliesRows.length;

    for (let i = fromRow; i <= toRow; i++) {
      let rowToUpdate = rows[i];
      let updatedRow = update(rowToUpdate, { $merge: updated });

      for (var key in updatedRow) {
        if (['BooksSupplies', 'Sep'].indexOf(key) == -1) {

          var value = updatedRow[key];
          if (value != undefined && value != "") {
            filled = true;
            break;
          }
        }

      }
      if ((updatedRow.Oct == "") && filled == false) {
        updatedRow.Feb = updatedRow.Sep;
        updatedRow.Mar = updatedRow.Sep;
        updatedRow.Apr = updatedRow.Sep;
        updatedRow.May = updatedRow.Sep;
        updatedRow.June = updatedRow.Sep;
        updatedRow.July = updatedRow.Sep;
        updatedRow.Aug = updatedRow.Sep;
        updatedRow.Jan = updatedRow.Sep;
        updatedRow.Oct = updatedRow.Sep;
        updatedRow.Nov = updatedRow.Sep;
        updatedRow.Dec = updatedRow.Sep;
      }

      rows[i] = updatedRow;
    }
    var items = rows.slice(1, length);
    var _row = this.createSummaryRowKeys(items, "BooksSupplies", "Books & Supplies");
    rows[0] = _row;
    this.sumByYear(rows);
    this.layoutSetting(this.grid7);
    this.setState({ booksSuppliesRows: rows });

    this.onSave({ "booksSuppliesRows": rows });

    this.getIncomeBalance();
    setTimeout(() => {
      this.getExpenseBalance();
      setTimeout(() => {

        this.isOnBudget(this.state.currentMonth);
      }, 1);
    }, 1);

  },

  initColor(myArray) {
    this.state.colors = myArray;
  },

  generateColor() {
    var self = this.state.colors.slice();
    var i = Math.floor(Math.random() * self.length);
    var rand = self[i];
    self.splice(i, 1);
    this.state.colors = self;
    return rand;
  },
  diffArray(a, b) {
    var seen = [], diff = [];
    for (var i = 0; i < b.length; i++)
      seen[b[i]] = true;
    for (var i = 0; i < a.length; i++)
      if (!seen[a[i]])
        diff.push(a[i]);
    return diff;
  },
  createReportDataSet() {

    var month = this.state.currentMonth;

    if (this.state.reports != null) {

    }
    let items = [];
    var color;

    let dataSet = [];
    let rows = this.state.rows.slice();
    var len = rows.length;
    rows.splice(len - 1, 1);

    //if (this.state.addMonthlyIncome== true ){

    //   console.log('add a row');
    // }
    var arr = [];
    var colorArray = ["green", "yellow", "black", "red", "blue", "pink", "gray"];

    if (firstload == true) {



      this.initColor(colorArray);
      rows.forEach((element, index) => {
        var cell = {};

        var column = element['MonthlyIncome'];

        color = this.generateColor()
        cell[column] = element[month];
        var temp = Object.keys(cell)[0];

        var value = isNaN(cell[temp]) ? 0 : Number(cell[temp])
        if (column != undefined) {
          items.push({ color: color, value: column });
          arr.push(color);
        }

        dataSet.push({ color: color, value: value, label: column });
        firstload = false;
      })

      this.state.reports = items;
      this.state.colorArray = arr;
      this.state.reports1 = dataSet;
    } else {


      rows.forEach((element, index) => {
        var cell = {};

        var column = element['MonthlyIncome'];

        if (this.state.reports != undefined) {


          var found = this.state.reports.filter(function (item) { return item.value == column })


          if (column != undefined && found[0] != undefined) {

            color = found[0]["color"];
          }
          else {
            var items1 = this.diffArray(colorArray, this.state.colorArray);
            var array = this.state.colorArray;


            if (color != undefined && column != undefined) {
              color = items1[0];
              this.state.colorArray.push(color);
            }

          }
        }

        cell[column] = element[month];
        var temp = Object.keys(cell)[0];

        var value = isNaN(cell[temp]) ? 0 : Number(cell[temp])
        if (column != undefined) {
          items.push({ color: color, value: column });
          dataSet.push({ color: color, value: value, label: column });
        }


      }
      );
    }
    var count = dataSet.filter(function (item) { return item.value != "" });

    if (count.length > 0) {
      //this.state.reports = items;
      this.state.reports = items;
      this.state.reports1 = dataSet;
    }
    else {
      items = []
      this.state.reports1 = [];
    }


    return items;
  },

  createReportData() {

    var month = this.state.currentMonth;

    let items = [];

    let dataSet = [];

    let rows = this.state.rows.slice();
    var len = rows.length
    rows.splice(len - 1, 1);

    // rows.forEach((element,index) => {
    //  var cell = {};

    //     var column = element['MonthlyIncome'];
    //     cell[column] = element[month];
    //     var temp = Object.keys(cell)[0];
    //     var value = cell[temp];
    //     var found = this.state.reports.filter(function(item){
    //       return item.value == column
    //     })

    //     if(found.length > 0)
    //     {
    //         var color = found[0]["color"]
    //            var copy = {color: color, label: found[0]["value"], value: value}

    //    dataSet.push(copy);
    //     }


    //   })



    console.log("JSON");

    console.log(this.state.reports);
    console.log(this.state.reports1);

    return this.state.reports1;
  },

  createExpenseReportDataSet() {

    var month = this.state.currentMonth;
    var dataSet = [];
    var TuitionFees = Number(this.state.monthlyExpenseRows[0][month]);
    var housingRows = Number(this.state.housingRows[0][month]);
    let otherExpenses = Number(this.state.otherExpensesRows[0][month]);
    let discretionary = Number(this.state.discretionaryRows[0][month]);
    let transportation = Number(this.state.transportationRows[0][month]);
    let loanPayment = Number(this.state.loanPaymentRows[0][month]);
    let utilities = Number(this.state.utilitiesRows[0][month]);
    let insurance = Number(this.state.insurancerows[0][month]);
    let booksSupplies = Number(this.state.booksSuppliesRows[0][month]);
    let householdExp = Number(this.state.householdExpensesRows[0][month]);

    dataSet.push({ color: "#898B8E", value: TuitionFees, label: "TuitionFees" });
    dataSet.push({ color: "#5FD2E0", value: housingRows, label: "Housing" });
    dataSet.push({ color: "#84E112", value: insurance, label: "Insurance" });
    dataSet.push({ color: "#E4B806", value: utilities, label: "Utilities" });
    dataSet.push({ color: "#A012E1", value: loanPayment, label: "Loan Payment" });
    dataSet.push({ color: "red", value: transportation, label: "Transportation" });
    dataSet.push({ color: "#f47442", value: discretionary, label: "Discretionary" });
    dataSet.push({ color: "black", value: otherExpenses, label: "otherExpenses" });
    dataSet.push({ color: "blue", value: booksSupplies, label: "Books Supplies" });
    dataSet.push({ color: "yellow", value: householdExp, label: "Household Expenses" });


    return dataSet;

  },

  getIncomeBalance() {
    var month = this.state.currentMonth;
    var length = this.state.rows.length;
    var income = this.sumByYear(this.state.rows)[length - 1][month];
    this.state.income = income;
    this.setState({ income: income });
  },

  getExpenseBalance() {
    var month = this.state.currentMonth;
    var loanPaymentRows = Number(this.state.loanPaymentRows[0][month]);
    var discretionaryRows = Number(this.state.discretionaryRows[0][month]);
    var monthlyExpenseRows = Number(this.state.monthlyExpenseRows[0][month]);
    var housingRows = Number(this.state.housingRows[0][month]);
    var householdExpensesRows = Number(this.state.householdExpensesRows[0][month]);
    var insurancerows = Number(this.state.insurancerows[0][month]);
    var utilitiesRows = Number(this.state.utilitiesRows[0][month]);
    var transportationRows = Number(this.state.transportationRows[0][month]);
    var booksSuppliesRows = Number(this.state.booksSuppliesRows[0][month]);
    var otherExpensesRows = Number(this.state.otherExpensesRows[0][month]);
    var balance = monthlyExpenseRows + housingRows + insurancerows + utilitiesRows + transportationRows +
      booksSuppliesRows + otherExpensesRows + loanPaymentRows + discretionaryRows + householdExpensesRows;
    this.state.expense = balance;
    this.setState({ expense: balance });
  },

  disableRowsSelected(rows, name) {
    rows.forEach((r) => {
      if (r.isSelected == true) {
        r.isSelected = false;
      }
      this.setState({ name: rows });


    });
  },
  onRowClick1(rowIdx, row) {

    let rows = this.state.rows.slice();

    rows.forEach((r) => {
      if (r.isSelected == true) {
        r.isSelected = false;
      }
    });
    rows[rowIdx] = objectAssignfrom({}, row, { isSelected: !row.isSelected });
    this.setState({ rows });

    for (var i = 2; i <= 11; i++) {

      var name = this.state.tableMapping[i];
      var selectRows = this.state[name];
      let rows2 = selectRows.slice();
      this.disableRowsSelected(rows2, name);
    }
  },
  onRowClick2(rowIdx, row) {

    let rows2 = this.state.monthlyExpenseRows.slice();
    rows2.forEach((r) => {
      if (r.isSelected == true) {
        r.isSelected = false;
      }
    });

    rows2[rowIdx] = objectAssignfrom({}, row, { isSelected: !row.isSelected });
    this.setState({ "monthlyExpenseRows": rows2 });

    for (var i = 1; i <= 11; i++) {

      if (i != 2) {
        var name = this.state.tableMapping[i];
        var selectRows = this.state[name];
        let rows = selectRows.slice();
        this.disableRowsSelected(rows, name);
      }
    }
  },
  onRowClick3(rowIdx, row) {
    let rows = this.state.housingRows.slice();
    rows.forEach((r) => {
      if (r.isSelected == true) {
        r.isSelected = false;
      }
    });

    rows[rowIdx] = objectAssignfrom({}, row, { isSelected: !row.isSelected });
    this.setState({ "housingRows": rows });

    for (var i = 1; i <= 11; i++) {

      if (i != 3) {
        var name = this.state.tableMapping[i];
        var selectRows = this.state[name];
        let rows = selectRows.slice();
        this.disableRowsSelected(rows, name);
      }
    }
  },

  onRowClick4(rowIdx, row) {
    let rows = this.state.insurancerows.slice();
    rows.forEach((r) => {
      if (r.isSelected == true) {
        r.isSelected = false;
      }
    });

    rows[rowIdx] = objectAssignfrom({}, row, { isSelected: !row.isSelected });
    this.setState({ "insurancerows": rows });

    for (var i = 1; i <= 11; i++) {

      if (i != 4) {
        var name = this.state.tableMapping[i];
        var selectRows = this.state[name];
        let rows = selectRows.slice();
        this.disableRowsSelected(rows, name);
      }
    }
  },

  onRowClick5(rowIdx, row) {
    let rows = this.state.utilitiesRows.slice();
    rows.forEach((r) => {
      if (r.isSelected == true) {
        r.isSelected = false;
      }
    });

    rows[rowIdx] = objectAssignfrom({}, row, { isSelected: !row.isSelected });
    this.setState({ "utilitiesRows": rows });

    for (var i = 1; i <= 11; i++) {

      if (i != 5) {
        var name = this.state.tableMapping[i];
        var selectRows = this.state[name];
        let rows = selectRows.slice();
        this.disableRowsSelected(rows, name);
      }
    }
  },


  onRowClick6(rowIdx, row) {
    let rows = this.state.loanPaymentRows.slice();
    rows.forEach((r) => {
      if (r.isSelected == true) {
        r.isSelected = false;
      }
    });

    rows[rowIdx] = objectAssignfrom({}, row, { isSelected: !row.isSelected });
    this.setState({ "loanPaymentRows": rows });

    for (var i = 1; i <= 11; i++) {

      if (i != 6) {
        var name = this.state.tableMapping[i];
        var selectRows = this.state[name];
        let rows = selectRows.slice();
        this.disableRowsSelected(rows, name);
      }
    }
  },

  onRowClick10(rowIdx, row) {
    let rows = this.state.otherExpensesRows.slice();
    rows.forEach((r) => {
      if (r.isSelected == true) {
        r.isSelected = false;
      }
    });

    rows[rowIdx] = objectAssignfrom({}, row, { isSelected: !row.isSelected });
    this.setState({ "otherExpensesRows": rows });

    for (var i = 1; i <= 11; i++) {

      if (i != 10) {
        var name = this.state.tableMapping[i];
        var selectRows = this.state[name];
        let rows = selectRows.slice();
        this.disableRowsSelected(rows, name);
      }
    }
  },

  onRowClick8(rowIdx, row) {
    let rows = this.state.transportationRows.slice();
    rows.forEach((r) => {
      if (r.isSelected == true) {
        r.isSelected = false;
      }
    });

    rows[rowIdx] = objectAssignfrom({}, row, { isSelected: !row.isSelected });
    this.setState({ "transportationRows": rows });

    for (var i = 1; i <= 11; i++) {

      if (i != 8) {
        var name = this.state.tableMapping[i];
        var selectRows = this.state[name];
        let rows = selectRows.slice();
        this.disableRowsSelected(rows, name);
      }
    }
  },

  onRowClick9(rowIdx, row) {
    let rows = this.state.discretionaryRows.slice();
    rows.forEach((r) => {
      if (r.isSelected == true) {
        r.isSelected = false;
      }
    });

    rows[rowIdx] = objectAssignfrom({}, row, { isSelected: !row.isSelected });
    this.setState({ "discretionaryRows": rows });

    for (var i = 1; i <= 11; i++) {

      if (i != 9) {
        var name = this.state.tableMapping[i];
        var selectRows = this.state[name];
        let rows = selectRows.slice();
        this.disableRowsSelected(rows, name);
      }
    }
  },
  onRowClick11(rowIdx, row) {
    let rows = this.state.householdExpensesRows.slice();
    rows.forEach((r) => {
      if (r.isSelected == true) {
        r.isSelected = false;
      }
    });

    rows[rowIdx] = objectAssignfrom({}, row, { isSelected: !row.isSelected });
    this.setState({ "householdExpensesRows": rows });

    for (var i = 1; i <= 11; i++) {

      {
        var name = this.state.tableMapping[i];
        var selectRows = this.state[name];
        let rows = selectRows.slice();
        this.disableRowsSelected(rows, name);
      }
    }
  },
  onRowClick7(rowIdx, row) {
    let rows = this.state.booksSuppliesRows.slice();
    rows.forEach((r) => {
      if (r.isSelected == true) {
        r.isSelected = false;
      }
    });
    rows[rowIdx] = objectAssignfrom({}, row, { isSelected: !row.isSelected });
    this.setState({ "booksSuppliesRows": rows });
    for (var i = 1; i <= 10; i++) {
      if (i != 7) {
        var name = this.state.tableMapping[i];
        var selectRows = this.state[name];
        let rows2 = selectRows.slice();
        this.disableRowsSelected(rows2, name);
      }
    }
  },
  handleGridRowsUpdatedDiscretionary({ fromRow, toRow, updated }) {
    var filled = false;
    let rows = this.state.discretionaryRows.slice();
    let length = this.state.discretionaryRows.length;

    for (let i = fromRow; i <= toRow; i++) {
      let rowToUpdate = rows[i];
      let updatedRow = update(rowToUpdate, { $merge: updated });


      for (var key in updatedRow) {
        if (['Discretionary', 'Sep'].indexOf(key) == -1) {

          var value = updatedRow[key];
          if (value != undefined && value != "") {
            filled = true;
            break;
          }
        }
      }

      if (updatedRow.Oct == "" && filled == false) {
        updatedRow.Feb = updatedRow.Sep;
        updatedRow.Mar = updatedRow.Sep;
        updatedRow.Apr = updatedRow.Sep;
        updatedRow.May = updatedRow.Sep;
        updatedRow.June = updatedRow.Sep;
        updatedRow.July = updatedRow.Sep;
        updatedRow.Aug = updatedRow.Sep;
        updatedRow.Jan = updatedRow.Sep;
        updatedRow.Oct = updatedRow.Sep;
        updatedRow.Nov = updatedRow.Sep;
        updatedRow.Dec = updatedRow.Sep;
      }

      rows[i] = updatedRow;
    }
    var items = rows.slice(1, length);
    var _row = this.createSummaryRow(items, "Discretionary");
    rows[0] = _row;
    this.sumByYear(rows);
    this.setState({ discretionaryRows: rows });

    this.onSave({ "discretionaryRows": rows })

    this.getIncomeBalance();
    setTimeout(() => {
      this.getExpenseBalance();
      setTimeout(() => {

        this.isOnBudget(this.state.currentMonth);
      }, 1);
    }, 1);

  },
  onRowsSelected(rows) {
    this.grid1.setState({ selectedIndexes: 2 });
  },
  handleGridRowsUpdatedOtherExpenses({ fromRow, toRow, updated }) {
    var filled = false;
    let rows = this.state.otherExpensesRows.slice();
    let length = this.state.otherExpensesRows.length;

    for (let i = fromRow; i <= toRow; i++) {
      let rowToUpdate = rows[i];
      let updatedRow = update(rowToUpdate, { $merge: updated });


      for (var key in updatedRow) {
        if (['OtherExpenses', 'Sep'].indexOf(key) == -1) {

          var value = updatedRow[key];
          if (value != undefined && value != "") {
            filled = true;
            break;
          }
        }
      }
      if (updatedRow.Oct == "" && filled == false) {
        updatedRow.Feb = updatedRow.Sep;
        updatedRow.Mar = updatedRow.Sep;
        updatedRow.Apr = updatedRow.Sep;
        updatedRow.May = updatedRow.Sep;
        updatedRow.June = updatedRow.Sep;
        updatedRow.July = updatedRow.Sep;
        updatedRow.Aug = updatedRow.Sep;
        updatedRow.Jan = updatedRow.Sep;
        updatedRow.Oct = updatedRow.Sep;
        updatedRow.Nov = updatedRow.Sep;
        updatedRow.Dec = updatedRow.Sep;
      }

      rows[i] = updatedRow;
    }

    var items = rows.slice(1, length);
    var _row = this.createSummaryRowKeys(items, "OtherExpenses", "Other Expenses");
    rows[0] = _row;
    this.sumByYear(rows);
    this.setState({ otherExpensesRows: rows });
    this.onSave({ "otherExpensesRows": rows })
    //this.getIncomeBalance();
    //this.getExpenseBalance();

    this.getIncomeBalance();
    setTimeout(() => {
      this.getExpenseBalance();
      setTimeout(() => {

        this.isOnBudget(this.state.currentMonth);
      }, 1);
    }, 1);
  },

  onSave(rows) {
    var self = this;
    var key = Object.keys(rows)[0];
    var items = {
      "rows": self.state.rows, "monthlyExpenseRows": self.state.monthlyExpenseRows,
      "housingRows": self.state.housingRows, "insuranceRows": self.state.insurancerows,
      "utilitiesRows": self.state.utilitiesRows, "loanPaymentRows": self.state.loanPaymentRows,
      "transportationRows": self.state.transportationRows, "booksSuppliesRows": self.state.booksSuppliesRows,
      "discretionaryRows": self.state.discretionaryRows, "otherExpensesRows": self.state.otherExpensesRows,
      "householdExpensesRows": self.state.householdExpensesRows
    };

    items[key] = rows[key];
    var result = JSON.stringify(items);
    this.updateItem(result);
  },
  render() {

    //this.forceUpdate(this.grid1.forceUpdate());
    console.log(this.state.rows);
    function onSelectEvent(event) {
      var self = this;
      self.downloadCSV();
    }

    function onSave(event) {
      var self = this;
      var items = {
        "rows": self.state.rows, "monthlyExpenseRows": self.state.monthlyExpenseRows,
        "housingRows": self.state.housingRows, "insurancerows": self.state.insurancerows,
        "utilitiesRows": self.state.utilitiesRows, "loanPaymentRows": self.state.loanPaymentRows,
        "transportationRows": self.state.transportationRows, "booksSuppliesRows": self.state.booksSuppliesRows,
        "discretionaryRows": self.state.discretionaryRows, "otherExpensesRows": self.state.otherExpensesRows
      };

      var result = JSON.stringify(items);
      this.createItem(result);
    }
    return (

      <div className="ms-fontColor-themeDarker">
        <div >
          <span ref="mybudget"> My Budget </span>

        </div>
        <div>
          <button name="Edit" className="ms-CommandBarItem-link itemLink_ceb80f25" onClick={onSelectEvent.bind(this)} style={{ display: "none" }}>
            {/*<i className="ms-Icon ms-Icon--Download ms-CommandBarItem-icon  ms-CommandBarItem-iconColor"></i>*/}
            <span className="ms-CommandBarItem-commandText itemCommandText_ceb80f25" style={{ display: "none" }}>Download</span>
          </button>
        </div>
        <div style={{ clear: "both" }} >
          <div className="ms-Grid-col" style={{ width: "350px" }}>
            <div style={{ width: "150px", height: "200px", float: "left" }}>
              <div style={{ fontSize: "15px" }}>{this.state.currentMonth} income:</div>
              <div style={{ display: "block", fontSize: "22px" }}>${this.state.income}</div>

              <ListRender list={this.createReportDataSet()} />


            </div>
            <DoughnutChart ref="myChart" JSON={this.createReportData()} />
          </div>

          <div className="ms-Grid-col" style={{ width: "350px" }}>

            <div style={{ width: "150px", height: "200px", float: "left" }}>
              <span>{this.state.currentMonth} expense:</span>
              <span style={{ display: "block", fontSize: "20px" }}>${this.state.expense}</span>
              <span style={{ display: "block", fontSize: "13px" }}><button style={{ background: "#898B8E", padding: "4px", border: "none", verticalAlign: "middle" }}></button>Tuition & Fees </span>
              <span style={{ display: "block", fontSize: "13px" }}><button style={{ background: "#5FD2E0", padding: "4px", border: "none", verticalAlign: "middle" }}></button>Housing</span>
              <span style={{ display: "block", fontSize: "13px" }}><button style={{ background: "#84E112", padding: "4px", border: "none", verticalAlign: "middle" }}></button>Insurance</span>
              <span style={{ display: "block", fontSize: "13px" }}><button style={{ background: "#E4B806", padding: "4px", border: "none", verticalAlign: "middle" }}></button>Utilities</span>
              <span style={{ display: "block", fontSize: "13px" }}><button style={{ background: "#A012E1", padding: "4px", border: "none", verticalAlign: "middle" }}></button>Loan Payments</span>
              <span style={{ display: "block", fontSize: "13px" }}><button style={{ background: "red", padding: "4px", border: "none", verticalAlign: "middle" }}></button>Transportation</span>
              <span style={{ display: "block", fontSize: "13px" }}><button style={{ background: "#f47442", padding: "4px", border: "none", verticalAlign: "middle" }}></button>Discretionary</span>
              <span style={{ display: "block", fontSize: "13px" }}><button style={{ background: "black", padding: "4px", border: "none", verticalAlign: "middle" }}></button>Other Expenses</span>
              <span style={{ display: "block", fontSize: "13px" }}><button style={{ background: "blue", padding: "4px", border: "none", verticalAlign: "middle" }}></button>Books & Supplies</span>
              <span style={{ display: "block", fontSize: "13px" }}><button style={{ background: "yellow", padding: "4px", border: "none", verticalAlign: "middle" }}></button>Household Expenses</span>
            </div>
            <DoughnutChart JSON={this.createExpenseReportDataSet()} />
          </div>
          <div className="ms-Grid-col" style={{ width: "150px" }} >
            <span>{this.state.currentMonth} available funds:</span>
            <span style={{ display: "block", fontSize: "20px" }}>${this.state.income - this.state.expense}</span>
            <CanvasComponent />
          </div>
        </div>
        <div style={{ clear: "both" }}>
          <div style={{ float: "left", width: "190px", textAlign: "right", paddingRight: "23px" }}>Available funds</div>
          <div style={{ float: "left" }}>
            <div >
              <div style={{ width: "650px", marginBottom: "20px", marginLeft: "0px" }}>
                <Slider step={8.3} onAfterChange={this.sliderMove} style={{ width: "95%" }} handleStyle={{ backgroundColor: 'green' }} />
              </div>
              <div className="ms-Grid">
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col sep" >Sep</div>
                  <div className="ms-Grid-col oct" >Oct</div>
                  <div className="ms-Grid-col nov" >Nov</div>
                  <div className="ms-Grid-col dev" >Dec</div>
                  <div className="ms-Grid-col jan" >Jan</div>
                  <div className="ms-Grid-col feb" >Feb</div>
                  <div className="ms-Grid-col mar" >Mar</div>
                  <div className="ms-Grid-col apr" >Apr</div>
                  <div className="ms-Grid-col may" >May</div>
                  <div className="ms-Grid-col june" >June</div>
                  <div className="ms-Grid-col july" >July</div>
                  <div className="ms-Grid-col aug" >Aug</div>
                  <div className="ms-Grid-col year" >Year</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <span style={{ clear: "both", color: "green", display: "block", width: "68%", paddingBottom: "20px", paddingTop: "20px" }} >
            {this.state.isOnBudget}
          </span>
        </div>
        <ReactDataGrid
          ref={node => this.grid = node}

          columns={this._monthlyCashColumns}
          rowGetter={this.rowGetterCashFlow}
          rowsCount={this.state.cashFlowRows.length}
          rowHeight={30}
          minHeight={90} />


        <ReactDataGrid
          ref={node => this.grid1 = node}
          enableCellSelect={true}
          columns={this._monthlyIncomeColumns}
          rowGetter={this.rowGetter}
          rowsCount={this.state.rows.length}
          rowHeight={30}
          minHeight={(this.state.rows.length + 1) * 30}
          rowss={this.state.rows}
          contextMenu={<MyContextMenu onRowDelete={this.deleteRow} onRowInsert={this.handleAddRow} onCopyAcross={this.copyAcross} />}
          onRowClick={this.onRowClick1}
          onCellSelected={this.onCellSelected1}
          onGridRowsUpdated={this.handleGridRowsUpdated}
          onCheckCellIsEditable={this.checkMonthlyIncomeCells}

          rowSelection={{
            showCheckbox: false,
            selectBy: {
              isSelectedKey: 'isSelected'
            }
          }}
        />
        <div style={{ float: "left" }}><button style={{ marginLeft: "830px", float: "left" }} onClick={this.handleAddRowMonthlyIncome}>+</button><button style={{ float: "left", width: "25px", visibility: "visible" }} onClick={this.deleteRowMonthlyInCome}>-</button>

        </div>
        <ReactDataGrid
          ref={node => this.grid2 = node}
          enableCellSelect={true}
          columns={this._monthlyExpenseColumns}
          rowGetter={this.rowGetterMonthlyExpense}
          rowsCount={this.state.monthlyExpenseRows.length}
          rowHeight={30}
          minHeight={(this.state.monthlyExpenseRows.length + 1) * 30}
          contextMenu={<MyContextMenu onRowDelete={this.deleteRow} onRowInsert={this.handleAddRow} onCopyAcross={this.copyAcross} />}
          onRowClick={this.onRowClick2}
          onCellSelected={this.onCellSelected2}
          onGridRowsUpdated={this.handleGridRowsUpdatedMonthlyExpense}
          onCheckCellIsEditable={this.checkCells}
          rowSelection={{
            showCheckbox: false,
            selectBy: {
              isSelectedKey: 'isSelected'
            }
          }}

        />

        <div style={{ float: "left" }}><button style={{ marginLeft: "830px", float: "left" }} onClick={this.handleAddRowMonthlyExpense}>+</button><button style={{ float: "left", width: "25px", visibility: "visible" }} onClick={this.deleteRow2}>-</button>
        </div>

        <ReactDataGrid
          ref={node => this.grid7 = node}
          enableCellSelect={true}
          columns={this._booksSuppliesColumns}
          rowGetter={this.rowGetterBooksSupplies}
          rowsCount={this.state.booksSuppliesRows.length}
          contextMenu={<MyContextMenu onRowDelete={this.deleteRow} onRowInsert={this.handleAddRow} onCopyAcross={this.copyAcross} />}
          rowHeight={30}
          minHeight={(this.state.booksSuppliesRows.length + 1) * 30}
          onRowClick={this.onRowClick7}
          onCellSelected={this.onCellSelected7}
          onGridRowsUpdated={this.handleGridRowsUpdatedbooksSupplies}
          onCheckCellIsEditable={this.checkCells}
          rowSelection={{
            showCheckbox: false,
            selectBy: {
              isSelectedKey: 'isSelected'
            }
          }}
        />

        <div style={{ float: "left" }}><button style={{ marginLeft: "830px", float: "left" }} onClick={this.handleAddRowBooksSupplies}>+</button><button style={{ float: "left", width: "25px", visibility: "visible" }} onClick={this.deleteRow7}>-</button>
        </div>

        <ReactDataGrid
          ref={node => this.grid3 = node}
          enableCellSelect={true}
          columns={this._housingColumns}
          rowGetter={this.rowGetterHousing}
          rowsCount={this.state.housingRows.length}
          rowHeight={30}
          minHeight={(this.state.housingRows.length + 1) * 30}
          onCellSelected={this.onCellSelected3}
          onRowClick={this.onRowClick3}
          contextMenu={<MyContextMenu onRowDelete={this.deleteRow} onRowInsert={this.handleAddRow} onCopyAcross={this.copyAcross} />}
          onGridRowsUpdated={this.handleGridRowsUpdatedHousing}
          onCheckCellIsEditable={this.checkCells}
          rowSelection={{
            showCheckbox: false,
            selectBy: {
              isSelectedKey: 'isSelected'
            }
          }}
        />

        <div style={{ float: "left" }}><button style={{ marginLeft: "830px", float: "left" }} onClick={this.handleAddRowHousing}>+</button><button style={{ float: "left", width: "25px", visibility: "visible" }} onClick={this.deleteRow3}>-</button>
        </div>


        <ReactDataGrid
          ref={node => this.grid11 = node}
          enableCellSelect={true}
          columns={this._housingColumns1}
          rowGetter={this.rowGetterHousing1}
          rowsCount={this.state.householdExpensesRows.length}
          rowHeight={30}
          minHeight={(this.state.householdExpensesRows.length + 1) * 30}
          onCellSelected={this.onCellSelected11}
          onRowClick={this.onRowClick11}
          contextMenu={<MyContextMenu onRowDelete={this.deleteRow} onRowInsert={this.handleAddRow} onCopyAcross={this.copyAcross} />}
          onGridRowsUpdated={this.handleGridRowsUpdatedHouseholdExpensesRows}
          onCheckCellIsEditable={this.checkCells}
          rowSelection={{
            showCheckbox: false,
            selectBy: {
              isSelectedKey: 'isSelected'
            }
          }}

        />

        <div style={{ float: "left" }}><button style={{ marginLeft: "830px", float: "left" }} onClick={this.handleAddRowHouseholdExpense}>+</button><button style={{ float: "left", width: "25px", visibility: "visible" }} onClick={this.deleteRow11}>-</button>
        </div>

        <ReactDataGrid
          ref={node => this.grid4 = node}
          enableCellSelect={true}
          columns={this._insuranceColumns}
          rowGetter={this.rowGetterInsurance}
          rowsCount={this.state.insurancerows.length}
          contextMenu={<MyContextMenu onRowDelete={this.deleteRow} onRowInsert={this.handleAddRow} onCopyAcross={this.copyAcross} />}
          rowHeight={30}
          minHeight={(this.state.insurancerows.length + 1) * 30}
          onCellSelected={this.onCellSelected4}
          onRowClick={this.onRowClick4}
          onGridRowsUpdated={this.handleGridRowsUpdatedInsurance}
          onCheckCellIsEditable={this.checkCells}
          rowSelection={{
            showCheckbox: false,
            selectBy: {
              isSelectedKey: 'isSelected'
            }
          }}
        />

        <div style={{ float: "left" }}><button style={{ marginLeft: "830px", float: "left" }} onClick={this.handleAddRowInsurance}>+</button><button style={{ float: "left", width: "25px", visibility: "visible" }} onClick={this.deleteRow4}>-</button>
        </div>


        <ReactDataGrid
          ref={node => this.grid5 = node}
          enableCellSelect={true}
          columns={this._utilitiesColumns}
          rowGetter={this.rowGetterUtilities}
          rowsCount={this.state.utilitiesRows.length}
          contextMenu={<MyContextMenu onRowDelete={this.deleteRow} onRowInsert={this.handleAddRow} onCopyAcross={this.copyAcross} />}
          rowHeight={30}
          minHeight={(this.state.utilitiesRows.length + 1) * 30}
          onCellSelected={this.onCellSelected5}
          onRowClick={this.onRowClick5}
          onGridRowsUpdated={this.handleGridRowsUpdatedUtilities}
          onCheckCellIsEditable={this.checkCells}
          rowSelection={{
            showCheckbox: false,
            selectBy: {
              isSelectedKey: 'isSelected'
            }
          }}

        />

        <div style={{ float: "left" }}><button style={{ marginLeft: "830px", float: "left" }} onClick={this.handleAddRowUtilities}>+</button><button style={{ float: "left", width: "25px", visibility: "visible" }} onClick={this.deleteRow5}>-</button>
        </div>

        <ReactDataGrid
          ref={node => this.grid6 = node}
          enableCellSelect={true}
          columns={this._loanPaymentColumns}
          rowGetter={this.rowGetterLoanPayment}
          rowsCount={this.state.loanPaymentRows.length}
          rowHeight={30}
          minHeight={(this.state.loanPaymentRows.length + 1) * 30}
          onCellSelected={this.onCellSelected6}
          onRowClick={this.onRowClick6}
          contextMenu={<MyContextMenu onRowDelete={this.deleteRow} onRowInsert={this.handleAddRow} onCopyAcross={this.copyAcross} />}
          onGridRowsUpdated={this.handleGridRowsUpdatedLoanPayment}
          onCheckCellIsEditable={this.checkCells}
          rowSelection={{
            showCheckbox: false,
            selectBy: {
              isSelectedKey: 'isSelected'
            }
          }}

        />


        <div style={{ float: "left" }}><button style={{ marginLeft: "830px", float: "left" }} onClick={this.handleAddRowLoanPayment}>+</button><button style={{ float: "left", width: "25px", visibility: "visible" }} onClick={this.deleteRow6}>-</button>
        </div>


        <ReactDataGrid
          ref={node => this.grid8 = node}
          enableCellSelect={true}
          columns={this._transportationColumns}
          rowGetter={this.rowGetterTransportation}
          rowsCount={this.state.transportationRows.length}
          contextMenu={<MyContextMenu onRowDelete={this.deleteRow} onRowInsert={this.handleAddRow} onCopyAcross={this.copyAcross} />}
          rowHeight={30}
          minHeight={(this.state.transportationRows.length + 1) * 30}
          onCellSelected={this.onCellSelected8}
          onRowClick={this.onRowClick8}
          onGridRowsUpdated={this.handleGridRowsUpdatedTransportation}
          onCheckCellIsEditable={this.checkCells}
          rowSelection={{
            showCheckbox: false,
            selectBy: {
              isSelectedKey: 'isSelected'
            }
          }}

        />

        <div style={{ float: "left" }}><button style={{ marginLeft: "830px", float: "left" }} onClick={this.handleAddRowTransportation}>+</button><button style={{ float: "left", width: "25px", visibility: "visible" }} onClick={this.deleteRow8}>-</button>
        </div>


        <ReactDataGrid
          ref={node => this.grid9 = node}
          enableCellSelect={true}
          columns={this._discretionaryColumns}
          rowGetter={this.rowGetterDiscretionary}
          rowsCount={this.state.discretionaryRows.length}
          rowHeight={30}
          minHeight={(this.state.discretionaryRows.length + 1) * 30}
          onCellSelected={this.onCellSelected9}
          onRowClick={this.onRowClick9}
          contextMenu={<MyContextMenu onRowDelete={this.deleteRow} onRowInsert={this.handleAddRow} onCopyAcross={this.copyAcross} />}
          onGridRowsUpdated={this.handleGridRowsUpdatedDiscretionary}
          onCheckCellIsEditable={this.checkCells}

          rowSelection={{
            showCheckbox: false,
            selectBy: {
              isSelectedKey: 'isSelected'
            }
          }}


        />
        <div style={{ float: "left" }}><button style={{ marginLeft: "830px", float: "left" }} onClick={this.handleAddRowDiscretionary}>+</button><button style={{ float: "left", width: "23px", visibility: "visible" }} onClick={this.deleteRow9}>-</button>
        </div>

        <ReactDataGrid
          ref={node => this.grid10 = node}
          enableCellSelect={true}
          columns={this._otherExpensesColumns}
          rowGetter={this.rowGetterOtherExpenses}
          rowsCount={this.state.otherExpensesRows.length}
          rowHeight={30}
          minHeight={(this.state.otherExpensesRows.length + 1) * 30}

          onCellDeSelected={this.onSelect10}
          onCellSelected={this.onCellSelected10}
          onRowClick={this.onRowClick10}

          onGridRowsUpdated={this.handleGridRowsUpdatedOtherExpenses}
          onCheckCellIsEditable={this.checkCells}
          rowSelection={{
            showCheckbox: false,
            selectBy: {
              isSelectedKey: 'isSelected'
            }
          }}
        />
        <div style={{ float: "left" }}><button style={{ marginLeft: "830px", float: "left" }} onClick={this.handleAddRowOtherExpenses}>+</button><button style={{ float: "left", width: "25px", visibility: "visible" }} onClick={this.deleteRow10}>-</button>
        </div>
        <ReactDataGrid
          ref={node => this.grid12 = node}
          enableCellSelect={false}
          columns={this._totalExpensesColumns}
          rowGetter={this.rowGetterTotalExpenses}
          rowsCount={this.state.totalExpensesRows.length}
          minHeight={150} />

      </div>);
  }
});


export { MyBudget }