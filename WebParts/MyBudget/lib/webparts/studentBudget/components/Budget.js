"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ReactDataGrid = require("react-data-grid");
var $ = require("jquery");
var ReactDataGridPlugins = require("react-data-grid-addons");
var update = require("immutability-helper");
var React = require("react");
var Chart_1 = require("./Chart");
var ListRender_1 = require("./ListRender");
require("rc-slider/assets/index.css");
var Bar_1 = require("./Bar");
var rc_slider_1 = require("rc-slider");
var sp_http_1 = require("@microsoft/sp-http");
var strings = require("studentBudgetStrings");
require('!style-loader!css-loader!../../../../src/examples.css');
require('!style-loader!css-loader!../../../../src/react-context-menu.css');
var objectAssignfrom = require("object-assign");
//import listener from './globalEventListener';
var ContextMenu = ReactDataGridPlugins.Menu.ContextMenu;
var MenuItem = ReactDataGridPlugins.Menu.MenuItem;
var MenuItem1 = ReactDataGridPlugins.Menu.MenuItem;
var Row = ReactDataGrid.Row;
var Range = rc_slider_1.default["Range"];
var step = 8.3;
var highLightColor = "#EB6C2C";
var marginTop = '0px';
var firstMonth = 'Sep';
var firstClick = true;
var firstload = true;
//const url = `${this.props.siteUrl}/_api/web/lists/getbytitle('GeoCash')/items?$select=Title,Id,Budget`
var YearFormatter = React.createClass({
    render: function () {
        var year = this.props.value;
        return (React.createElement("div", { style: { marginTop: marginTop } },
            React.createElement("div", { style: { color: highLightColor } }, year)));
    }
});
var DeleteBox = React.createClass({
    render: function () {
        return (React.createElement("div", null, "Box"));
    }
});
var RowRenderer = React.createClass({
    propTypes: {
        idx: React.PropTypes.string.isRequired
    },
    setScrollLeft: function (scrollBy) {
        this.row.setScrollLeft(scrollBy);
    },
    getRowStyle: function () {
        return {
            color: this.getRowBackground()
        };
    },
    getRowBackground: function () {
        return this.props.idx == 0 ? 'green' : 'blue';
    },
    render: function () {
        var _this = this;
        return (React.createElement("div", { style: this.getRowStyle() },
            React.createElement(Row, __assign({ ref: function (node) { return _this.row = node; } }, this.props))));
    }
});
var MyContextMenu = React.createClass({
    propTypes: {},
    getDefaultProps: function () {
        return {
            onRowDelete: function () { },
            onRowInsert: function () { },
            onCopyAcross: function () { }
        };
    },
    onRowDelete: function (e, data) {
        if (typeof (this.props.onRowDelete) === 'function') {
            this.props.onRowDelete(e, data);
        }
    },
    onRowInsert: function (e, data) {
        if (typeof (this.props.onRowInsert) === 'function') {
            this.props.onRowInsert(e, data);
        }
    },
    onCopyAcross: function (e, data) {
        if (typeof (this.props.onRowInsert) === 'function') {
            this.props.onCopyAcross(e, data);
        }
    },
    render: function () {
        return (React.createElement(ContextMenu, null,
            React.createElement(MenuItem, { data: { rowIdx: this.props.rowIdx, idx: this.props.idx }, onClick: this.onRowDelete }, "Delete Row"),
            React.createElement(MenuItem, { data: { rowIdx: this.props.rowIdx, idx: this.props.idx }, onClick: this.onRowInsert }, "Insert Row"),
            React.createElement(MenuItem, { data: { rowIdx: this.props.rowIdx, idx: this.props.idx }, onClick: this.onCopyAcross }, "Copy Across")));
    }
});
var MyBudget = React.createClass({
    sliderMove: function (value) {
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
    getMyBudget: function (loginName) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.props.spHttpClient.get(_this.props.siteUrl + "/_api/web/lists/getbytitle('GeoCash')/items?$filter=Title eq " + "'" + loginName + "'&$select=Title,Id,Budget", 
            //this.props.spHttpClient.get(`https://gc123dev.shacrepoint.com/_api/web/lists`,
            sp_http_1.SPHttpClient.configurations.v1, {
                headers: {
                    'Accept': 'application/json;odata=nometadata',
                    'odata-version': ''
                }
            })
                .then(function (response) {
                return response.json();
            })
                .then(function (response) {
                console.log(response.value);
                return resolve(response.value[0]["Budget"]);
            });
        });
    },
    getListItemEntityTypeName: function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.listItemEntityTypeName) {
                resolve(_this.listItemEntityTypeName);
                return;
            }
            _this.props.spHttpClient.get(_this.props.siteUrl + "/_api/web/lists/getbytitle('GeoCash')?$select=ListItemEntityTypeFullName", sp_http_1.SPHttpClient.configurations.v1, {
                headers: {
                    'Accept': 'application/json;odata=nometadata',
                    'odata-version': ''
                }
            })
                .then(function (response) {
                return response.json();
            }, function (error) {
                reject(error);
            })
                .then(function (response) {
                _this.listItemEntityTypeName = response.ListItemEntityTypeFullName;
                resolve(_this.listItemEntityTypeName);
            });
        });
    },
    createItem: function (json) {
        var _this = this;
        debugger;
        // var item = this.props.context;
        var loginName = this.props.context.pageContext.user.loginName;
        this.getListItemEntityTypeName()
            .then(function (listItemEntityTypeName) {
            console.log(listItemEntityTypeName);
            var body = JSON.stringify({
                '__metadata': {
                    'type': listItemEntityTypeName
                },
                'Title': loginName,
                'Budget': json
            });
            return _this.props.spHttpClient.post(_this.props.siteUrl + "/_api/web/lists/getbytitle('GeoCash')/items", sp_http_1.SPHttpClient.configurations.v1, {
                headers: {
                    'Accept': 'application/json;odata=nometadata',
                    'Content-type': 'application/json;odata=verbose',
                    'odata-version': ''
                },
                body: body
            });
        })
            .then(function (response) {
            return response.json();
        })
            .then(function (item) {
            _this.setState({
                status: "successfully created"
            });
        });
    },
    readItems: function () {
        var _this = this;
        this.setState({
            status: 'Loading all items...',
            items: []
        });
        this.props.spHttpClient.get("https://gc123dev.sharepoint.com/_api/web/lists/getbytitle('GeoCash')/items?$select=Title,Id,Budget", sp_http_1.SPHttpClient.configurations.v1, {
            headers: {
                'Accept': 'application/json;odata=nometadata',
                'odata-version': ''
            }
        })
            .then(function (response) {
            return response.json();
        })
            .then(function (response) {
            console.log(response.value);
            _this.setState({
                status: "Successfully loaded " + response.value.length + " items",
                items: response.value[0]["Budget"]
            });
            Window["myObject"] = response.value[0]["Budget"];
            //Promise.resolve(response.value[0]["Budget"]);
            return response.value[0]["Budget"];
        }, function (error) {
            _this.setState({
                status: 'Loading all items failed with error: ' + error,
                items: []
            });
        });
    },
    updateItem: function (json) {
        var _this = this;
        debugger;
        var loginName = this.props.context.pageContext.user.loginName;
        this.setState({
            status: 'Loading latest items...',
            items: []
        });
        var latestItemId = undefined;
        var etag = undefined;
        var listItemEntityTypeName = undefined;
        this.getListItemEntityTypeName()
            .then(function (listItemType) {
            listItemEntityTypeName = listItemType;
            return _this.getLatestItemId();
        })
            .then(function (itemId) {
            if (itemId === -1 && _this.state.itemId != 999) {
                _this.state.itemId = 999;
                //debugger;
                _this.createItem(json);
                return Promise.resolve();
            }
            latestItemId = itemId;
            _this.setState({
                status: "Loading information about item ID: " + latestItemId + "...",
                items: []
            });
            return _this.props.spHttpClient.get(_this.props.siteUrl + "/_api/web/lists/getbytitle('GeoCash')/items(" + latestItemId + ")?$select=Id", sp_http_1.SPHttpClient.configurations.v1, {
                headers: {
                    'Accept': 'application/json;odata=nometadata',
                    'odata-version': ''
                }
            });
        })
            .then(function (response) {
            etag = response.headers.get('ETag');
            return response.json();
        })
            .then(function (item) {
            _this.setState({
                status: "Updating item with ID: " + latestItemId + "...",
                items: []
            });
            var body = JSON.stringify({
                '__metadata': {
                    'type': listItemEntityTypeName
                },
                'Title': loginName,
                'Budget': json
            });
            return _this.props.spHttpClient.post(_this.props.siteUrl + "/_api/web/lists/getbytitle('GeoCash')/items(" + item.Id + ")", sp_http_1.SPHttpClient.configurations.v1, {
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
            .then(function (response) {
            _this.setState({
                status: "Item with ID: " + latestItemId + " successfully updated",
                items: []
            });
        }, function (error) {
            _this.setState({
                status: "Error updating item: " + error,
                items: []
            });
        });
    },
    getLatestItemId: function () {
        var _this = this;
        var loginName = this.props.context.pageContext.user.loginName;
        return new Promise(function (resolve, reject) {
            _this.props.spHttpClient.get(_this.props.siteUrl + "/_api/web/lists/getbytitle('GeoCash')/items?$filter=Title eq " + "'" + loginName + "'&$orderby=Id desc&$top=1&$select=id", 
            //  this.props.spHttpClient.get(`${this.props.siteUrl}/_api/web/lists/getbytitle('GeoCash')/items?$orderby=Id desc&$top=1&$select=id`,
            sp_http_1.SPHttpClient.configurations.v1, {
                headers: {
                    'Accept': 'application/json;odata=nometadata',
                    'odata-version': ''
                }
            })
                .then(function (response) {
                return response.json();
            }, function (error) {
                reject(error);
            })
                .then(function (response) {
                if (response.value.length === 0) {
                    resolve(-1);
                }
                else {
                    resolve(response.value[0].Id);
                }
            });
        });
    },
    getDefaultProps: function () {
        return {
            spHttpClient: {},
            siteUrl: {},
            context: {}
        };
    },
    handleShow: function () {
        // to do
    },
    componentWillMount: function () {
    },
    checkMonthlyIncomeCells: function (i, e) {
        // debugger;
        var length = this.state.rows.length - 1;
        var row = i.rowIdx;
        var col = i.idx;
        var obj = { rowIdx: row, idx: col };
        var cells = [{ rowIdx: length, idx: 0 }, { rowIdx: length, idx: 1 }, { rowIdx: length, idx: 2 }, { rowIdx: length, idx: 3 }, { rowIdx: length, idx: 4 }, { rowIdx: length, idx: 5 }, { rowIdx: length, idx: 6 },
            { rowIdx: length, idx: 7 }, { rowIdx: length, idx: 8 }, { rowIdx: length, idx: 9 }, { rowIdx: length, idx: 10 }, { rowIdx: length, idx: 11 }, { rowIdx: length, idx: 12 }
        ];
        for (var i_1 = 0; i_1 < cells.length; i_1++) {
            if (JSON.stringify(cells[i_1]) === JSON.stringify(obj)) {
                return false;
            }
        }
    },
    checkCells: function (i, e) {
        var row = i.rowIdx;
        var col = i.idx;
        var obj = { rowIdx: row, idx: col };
        var cells = [{ rowIdx: 0, idx: 0 }, { rowIdx: 0, idx: 1 }, { rowIdx: 0, idx: 2 }, { rowIdx: 0, idx: 3 }, { rowIdx: 0, idx: 4 }, { rowIdx: 0, idx: 5 }, { rowIdx: 0, idx: 6 },
            { rowIdx: 0, idx: 7 }, { rowIdx: 0, idx: 8 }, { rowIdx: 0, idx: 9 }, { rowIdx: 0, idx: 10 }, { rowIdx: 0, idx: 11 }, { rowIdx: 0, idx: 12 }
        ];
        for (var i_2 = 0; i_2 < cells.length; i_2++) {
            if (JSON.stringify(cells[i_2]) === JSON.stringify(obj)) {
                return false;
            }
        }
    },
    componentDidMount: function () {
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
            var result = self.sumBySections(rows, monthlyExpenseRows, housingRows, insurancerows, utilitiesRows, loanPaymentRows, transportationRows, booksSuppliesRows, discretionaryRows, otherExpensesRows);
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
            var firstRow = {
                MonthlyCash: "Available funds", Jan: Jan, Feb: Feb, Mar: Mar, Apr: Apr, May: May, June: June, July: July,
                Aug: Aug, Sep: Sep, Oct: Oct, Nov: Nov, Dec: Dec
            };
            var newRow = {
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
            self.isOnBudget(month); // before: firstMonth
            self.createReportDataSet();
            // self.createReportData();
            self.refs.myChart.forceUpdate();
        });
        this.getIncomeBalance();
        this.getExpenseBalance();
        this.state.tableMapping = {
            1: "rows", 2: "monthlyExpenseRows", 3: "housingRows", 4: "insurancerows",
            5: "utilitiesRows", 6: "loanPaymentRows", 7: "booksSuppliesRows", 8: "transportationRows", 9: "discretionaryRows",
            10: "otherExpensesRows", 11: "householdExpensesRows"
        };
        var selected10 = objectAssignfrom({}, this.grid.state.selected, { idx: 0, rowIdx: 0, active: true });
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
    isOnBudget: function (month) {
        var value = this.state.cashFlowRows[0][month];
        var str = "";
        if (value > 0) {
            str = strings.UnderBudget;
        }
        else if (value == 0) {
            str = strings.OnBudget;
        }
        else {
            str = strings.OverBudget;
        }
        this.setState({ isOnBudget: str });
    },
    layoutSetting: function (grid) {
        var cell = grid._gridNode.querySelector('.react-grid-Cell__value');
        cell.style.color = "#EB6C2C";
        cell.style.fontWeight = "bold";
        var nodes = grid._gridNode.querySelectorAll('.react-grid-Row');
        $.each(nodes, function (key, element) {
            if (key != '0') {
                var cell = element.querySelector('.react-grid-Cell__value');
                cell.style.paddingLeft = "20px";
            }
        });
    },
    componentDidUpdate: function () {
        var grid;
        var currentgrid = this.state.currentgrid;
        if (currentgrid != undefined) {
            grid = "grid" + currentgrid;
        }
        else {
            grid = "grid";
        }
        var selected1 = objectAssignfrom({}, this.grid1.state.selected, { idx: -1, rowIdx: -1, active: false });
        this.grid1.setState({ selected: selected1 });
        var selected2 = objectAssignfrom({}, this.grid2.state.selected, { idx: -1, rowIdx: -1, active: false });
        this.grid2.setState({ selected: selected2 });
        var selected3 = objectAssignfrom({}, this.grid3.state.selected, { idx: -1, rowIdx: -1, active: false });
        this.grid3.setState({ selected: selected3 });
        var selected4 = objectAssignfrom({}, this.grid4.state.selected, { idx: -1, rowIdx: -1, active: false });
        this.grid4.setState({ selected: selected4 });
        var selected5 = objectAssignfrom({}, this.grid5.state.selected, { idx: -1, rowIdx: -1, active: false });
        this.grid5.setState({ selected: selected5 });
        var selected6 = objectAssignfrom({}, this.grid6.state.selected, { idx: -1, rowIdx: -1, active: false });
        this.grid6.setState({ selected: selected6 });
        var selected7 = objectAssignfrom({}, this.grid7.state.selected, { idx: -1, rowIdx: -1, active: false });
        this.grid7.setState({ selected: selected7 });
        var selected8 = objectAssignfrom({}, this.grid8.state.selected, { idx: -1, rowIdx: -1, active: false });
        this.grid8.setState({ selected: selected8 });
        var selected9 = objectAssignfrom({}, this.grid9.state.selected, { idx: -1, rowIdx: -1, active: false });
        this.grid9.setState({ selected: selected9 });
        var selected10 = objectAssignfrom({}, this.grid10.state.selected, { idx: -1, rowIdx: -1, active: false });
        this.grid10.setState({ selected: selected10 });
        var selected11 = objectAssignfrom({}, this.grid11.state.selected, { idx: -1, rowIdx: -1, active: false });
        this.grid11.setState({ selected: selected11 });
        var selected12 = objectAssignfrom({}, this.grid12.state.selected, { idx: -1, rowIdx: -1, active: false });
        this.grid12.setState({ selected: selected12 });
        //  let selected00 = objectAssignfrom({}, this.grid.state.selected, {idx: -0, rowIdx: -0, active: true});
        //  this.grid.setState({selected: selected00});
        var selected00 = objectAssignfrom({}, this.grid.state.selected, { idx: -1, rowIdx: -1, active: false });
        this.grid.setState({ selected: selected00 });
        // this.isOnBudget(this.state.currentMonth);
        for (var i = 2; i <= 11; i++) {
            {
                var name_1 = "grid" + i;
                var grid1 = this[name_1];
                this.layoutSetting(grid1);
            }
        }
    },
    creatHeader: function (Jan, Feb, Mar, Apr, May, June, July, Aug, Sep, Oct, Nov, Dec, Year) {
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
    onCellSelected1: function (rowIdx, idx) {
        this.state.currentRowIdx = rowIdx.rowIdx;
        this.state.currentIdx = rowIdx.idx;
        var currentGrid = this.state.currentgrid;
        this.state.currentgrid = 1;
        this.grid1.state.selected.rowIdx = rowIdx.rowIdx;
        this.grid1.state.selected.idx = rowIdx.idx;
    },
    onCellSelected7: function (rowIdx, idx) {
        this.state.currentRowIdx = rowIdx.rowIdx;
        this.state.currentIdx = rowIdx.idx;
        this.state.currentgrid = 7;
        this.grid7.state.selected.rowIdx = rowIdx.rowIdx;
        this.grid7.state.selected.idx = rowIdx.idx;
    },
    onCellSelected2: function (rowIdx, idx) {
        this.state.currentRowIdx = rowIdx.rowIdx;
        this.state.currentIdx = rowIdx.idx;
        this.state.currentgrid = 2;
        this.grid2.state.selected.rowIdx = rowIdx.rowIdx;
        this.grid2.state.selected.idx = rowIdx.idx;
    },
    onCellSelected3: function (rowIdx, idx) {
        this.state.currentRowIdx = rowIdx.rowIdx;
        this.state.currentIdx = rowIdx.idx;
        this.state.currentgrid = 3;
        this.grid3.state.selected.rowIdx = rowIdx.rowIdx;
        this.grid3.state.selected.idx = rowIdx.idx;
    },
    onCellSelected4: function (rowIdx, idx) {
        this.state.currentRowIdx = rowIdx.rowIdx;
        this.state.currentIdx = rowIdx.idx;
        this.state.currentgrid = 4;
        this.grid4.state.selected.rowIdx = rowIdx.rowIdx;
        this.grid4.state.selected.idx = rowIdx.idx;
    },
    onCellSelected5: function (rowIdx, idx) {
        this.state.currentRowIdx = rowIdx.rowIdx;
        this.state.currentIdx = rowIdx.idx;
        this.state.currentgrid = 5;
        this.grid5.state.selected.rowIdx = rowIdx.rowIdx;
        this.grid5.state.selected.idx = rowIdx.idx;
    },
    onCellSelected6: function (rowIdx, idx) {
        this.state.currentRowIdx = rowIdx.rowIdx;
        this.state.currentIdx = rowIdx.idx;
        this.state.currentgrid = 6;
        this.grid6.state.selected.rowIdx = rowIdx.rowIdx;
        this.grid6.state.selected.idx = rowIdx.idx;
    },
    onCellSelected9: function (rowIdx, idx) {
        this.state.currentRowIdx = rowIdx.rowIdx;
        this.state.currentIdx = rowIdx.idx;
        this.state.currentgrid = 9;
        this.grid9.state.selected.rowIdx = rowIdx.rowIdx;
        this.grid9.state.selected.idx = rowIdx.idx;
    },
    onCellSelected8: function (rowIdx, idx) {
        this.state.currentRowIdx = rowIdx.rowIdx;
        this.state.currentIdx = rowIdx.idx;
        this.state.currentgrid = 8;
        this.grid8.state.selected.rowIdx = rowIdx.rowIdx;
        this.grid8.state.selected.idx = rowIdx.idx;
    },
    onSelect10: function () {
        //alert('onselect10');
    },
    onCellSelected10: function (rowIdx, idx) {
        this.state.currentRowIdx = rowIdx.rowIdx;
        this.state.currentIdx = rowIdx.idx;
        this.state.currentgrid = 10;
        this.grid10.state.selected.rowIdx = rowIdx.rowIdx;
        this.grid10.state.selected.idx = rowIdx.idx;
    },
    onCellSelected11: function (rowIdx, idx) {
        this.state.currentRowIdx = rowIdx.rowIdx;
        this.state.currentIdx = rowIdx.idx;
        this.state.currentgrid = 11;
        this.grid11.state.selected.rowIdx = rowIdx.rowIdx;
        this.grid11.state.selected.idx = rowIdx.idx;
    },
    onCellDeSelected: function (rowIdx, idx) {
    },
    onCellSelected: function (rowIdx, idx) {
        this.state.currentRowIdx = rowIdx.rowIdx;
        this.state.currentIdx = rowIdx.idx;
        var currentGrid = this.state.currentgrid;
        for (var i = 1; i <= 12; i++) {
            var grid = "grid" + i;
            var rowIdx_1 = this[grid].state.selected;
            if (rowIdx_1.rowIdx > 0 || rowIdx_1.idx > 0) {
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
    getInitialState: function () {
        var rows1;
        var self = this;
        var items = [];
        // debugger;
        var currentMonth = firstMonth;
        var headerName = this.creatHeader({ key: 'Jan', name: 'Jan', editable: true, width: 55 }, { key: 'Feb', name: 'Feb', editable: true, width: 55 }, { key: 'Mar', name: 'Mar', editable: true, width: 55 }, { key: 'Apr', name: 'Apr', editable: true, width: 55 }, { key: 'May', name: 'May', editable: true, width: 55 }, { key: 'June', name: 'June', editable: true, width: 55 }, { key: 'July', name: 'July', editable: true, width: 55 }, { key: 'Aug', name: 'Aug', editable: true, width: 55 }, { key: 'Sep', name: 'Sep', editable: true, width: 55 }, { key: 'Oct', name: 'Oct', editable: true, width: 55 }, { key: 'Nov', name: 'Nov', editable: true, width: 55 }, { key: 'Dec', name: 'Dec', editable: true, width: 55 }, { key: 'Year', name: 'Year', width: 55, editable: false, formatter: YearFormatter });
        var headerWithoutName = this.creatHeader({ key: 'Jan', name: '', editable: true, width: 55 }, { key: 'Feb', name: '', editable: true, width: 55 }, { key: 'Mar', name: '', editable: true, width: 55 }, { key: 'Apr', name: '', editable: true, width: 55 }, { key: 'May', name: '', editable: true, width: 55 }, { key: 'June', name: '', editable: true, width: 55 }, { key: 'July', name: '', editable: true, width: 55 }, { key: 'Aug', name: '', editable: true, width: 55 }, { key: 'Sep', name: '', editable: true, width: 55 }, { key: 'Oct', name: '', editable: true, width: 55 }, { key: 'Nov', name: '', editable: true, width: 55 }, { key: 'Dec', name: '', editable: true, width: 55 }, { key: 'Year', name: '', width: 55, editable: false, formatter: YearFormatter });
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
    convertArrayOfObjectsToCSV: function (args) {
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
                    if (ctr > 0)
                        result += columnDelimiter;
                    result += item[key];
                    ctr++;
                });
                result += lineDelimiter;
            });
        });
        return result;
    },
    downloadCSV: function (args) {
        var data, filename, link;
        var self = this;
        var csv = this.convertArrayOfObjectsToCSV({
            data1: this.state.rows, data2: this.state.monthlyExpenseRows, data3: this.state.insurancerows,
            data4: this.state.utilitiesRows, data5: this.state.loanPaymentRows, data6: this.state.transportationRows,
            data7: this.state.booksSuppliesRows, data8: this.state.discretionaryRows, data9: this.state.otherExpensesRows
        });
        if (csv == null)
            return;
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
    getRandomDate: function (start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toLocaleDateString();
    },
    sum: function (rows, column) {
        var amount = 0;
        rows.forEach(function (element) {
            amount = amount + Number(element[column] == undefined ? 0 : element[column]);
        });
        return amount == 0 ? "" : amount;
    },
    sumByColomn: function (rows, column) {
        var temp = $.extend({}, rows);
        var amount = 0;
        delete temp[0];
        Object.keys(temp).forEach(function (key) {
            amount = amount + temp[key][column];
        });
        return amount == 0 ? "" : amount;
    },
    change: function (row, e) {
        //this.setState({ rows });
        // setTimeout(this.setState({status: 'wwww'}), 3000);
        e.currentTarget.dispatchEvent("resize1");
    },
    sumByRow: function (row) {
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
    onRowSelect: function (rows, e) {
        // debugger;
        // alert('select row');
        //  this.setState({ show: true});
        this.change(rows, e);
    },
    sumByYear: function (rows) {
        var _this = this;
        rows.forEach(function (element, index) {
            rows[index]['Year'] = _this.sumByRow(rows[index]);
        });
        return rows;
    },
    createSummaryRows: function (numberOfRows) {
        var rows = [];
        for (var i = 1; i < numberOfRows; i++) {
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
        rows.push({
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
    totalSummaryRows: function (numberOfRows) {
        var rows = [];
        for (var i = 1; i < numberOfRows; i++) {
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
        rows.push({
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
    sumBySections: function (sections) {
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
    createTable: function (firstColumn, columns) {
        var _this = this;
        var rows = [];
        var numberOfRows = columns.length;
        for (var i = 0; i < numberOfRows; i++) {
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
        columns.forEach(function (element, index) {
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
        columns.forEach(function (element, index) {
            rows[index]['Year'] = _this.sumByRow(rows[index]);
            console.log(_this.sumByRow(rows[index]), firstColumn);
        });
        return rows;
    },
    rowGetterMonthlyExpense: function (i) {
        return this.state.monthlyExpenseRows[i];
    },
    rowGetterCashFlow: function (i) {
        var rows = this.state.rows.slice();
        var result = this.sumBySections(this.state.rows, this.state.monthlyExpenseRows, this.state.housingRows, this.state.insurancerows, this.state.utilitiesRows, this.state.loanPaymentRows, this.state.transportationRows, this.state.booksSuppliesRows, this.state.discretionaryRows, this.state.otherExpensesRows, this.state.householdExpensesRows);
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
        var firstRow = {
            MonthlyCash: "Available funds", Jan: Jan, Feb: Feb, Mar: Mar, Apr: Apr, May: May, June: June, July: July,
            Aug: Aug, Sep: Sep, Oct: Oct, Nov: Nov, Dec: Dec
        };
        var newRow = {
            MonthlyCash: "Cumulative available funds", Jan: Jan, Feb: Feb, Mar: Mar, Apr: Apr, May: May, June: June, July: July,
            Aug: Aug, Sep: Sep, Oct: Oct, Nov: Nov, Dec: Dec
        };
        this.state.cashFlowRows[0] = firstRow;
        this.state.cashFlowRows[1] = newRow;
        return this.state.cashFlowRows[i];
    },
    rowGetterHousing: function (i) {
        return this.state.housingRows[i];
    },
    rowGetterHousing1: function (i) {
        return this.state.householdExpensesRows[i];
    },
    rowGetterInsurance: function (i) {
        return this.state.insurancerows[i];
    },
    rowGetterUtilities: function (i) {
        return this.state.utilitiesRows[i];
    },
    rowGetterLoanPayment: function (i) {
        return this.state.loanPaymentRows[i];
    },
    rowGetterTransportation: function (i) {
        return this.state.transportationRows[i];
    },
    rowGetterBooksSupplies: function (i) {
        return this.state.booksSuppliesRows[i];
    },
    rowGetterDiscretionary: function (i) {
        return this.state.discretionaryRows[i];
    },
    rowGetterOtherExpenses: function (i) {
        return this.state.otherExpensesRows[i];
    },
    rowGetterTotalExpenses: function (i) {
        var result = this.sumBySections(this.state.rows, this.state.monthlyExpenseRows, this.state.housingRows, this.state.insurancerows, this.state.utilitiesRows, this.state.loanPaymentRows, this.state.transportationRows, this.state.booksSuppliesRows, this.state.discretionaryRows, this.state.otherExpensesRows, this.state.householdExpensesRows);
        result.Year = result.Sep + result.Oct + result.Nov + result.Dec + result.Jan +
            result.Feb + result.Mar + result.Apr + result.May + result.June + result.July + result.Aug;
        return result;
    },
    rowGetter: function (i) {
        return this.state.rows[i];
    },
    deleteRowMonthlyInCome: function () {
        //  debugger;
        var length = this.state.rows.length;
        var tableName = this.state.tableMapping[this.state.currentgrid];
        var currentgrid = "grid" + this.state.currentgrid;
        var i = this.state.currentRowIdx;
        if (currentgrid == "grid1") {
            if (i != length - 1) {
                this.state.rows.splice(i, 1);
                this.setState({ rows: this.state.rows });
                this.onSave({ "rows": this.state.rows });
            }
            this.handleGridRowsUpdated(1, 1);
        }
    },
    deleteRow1: function () {
        debugger;
        var tableName = this.state.tableMapping[this.state.currentgrid];
        var currentgrid = "grid" + this.state.currentgrid;
        var i = this.state.currentRowIdx;
        this.state[tableName].splice(i, 1);
        this.setState({ rows: this.state.rows });
        this.onSave({ "rows": this.state.rows });
    },
    deleteRow7: function () {
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
            _row["BooksSupplies"] = "Books & Supplies";
            this.setState({ booksSuppliesRows: rows });
            this.onSave({ "booksSuppliesRows": rows });
            this.handleGridRowsUpdatedbooksSupplies(1, 1);
        }
    },
    deleteRow3: function () {
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
            _row["Housing"] = "Housing";
            rows[0] = _row;
            this.setState({ housingRows: rows });
            this.onSave({ "housingRows": rows });
            this.handleGridRowsUpdatedHousing(1, 1);
        }
    },
    deleteRow2: function () {
        var tableName = this.state.tableMapping[this.state.currentgrid];
        var currentgrid = "grid" + this.state.currentgrid;
        var i = this.state.currentRowIdx;
        if (currentgrid == "grid2" && i > 0) {
            var rows = this.state.monthlyExpenseRows;
            rows.splice(i, 1);
            var length = rows.length;
            var items = rows.slice(1, length);
            var _row = this.createSummaryRow(items, "MonthlyExpense");
            _row["MonthlyExpense"] = "Tuition & Fees";
            rows[0] = _row;
            this.setState({ monthlyExpenseRows: rows });
            this.onSave({ "monthlyExpenseRows": rows });
            this.handleGridRowsUpdatedMonthlyExpense(1, 1);
        }
    },
    deleteRow4: function () {
        var tableName = this.state.tableMapping[this.state.currentgrid];
        var currentgrid = "grid" + this.state.currentgrid;
        var i = this.state.currentRowIdx;
        if (currentgrid == "grid4" && i > 0) {
            var rows = this.state.insurancerows;
            rows.splice(i, 1);
            var length = rows.length;
            var items = rows.slice(1, length);
            var _row = this.createSummaryRow(items, "Insurance");
            _row["Insurance"] = "Insurance";
            rows[0] = _row;
            this.setState({ insurancerows: rows });
            this.onSave({ "insurancerows": rows });
            this.handleGridRowsUpdatedInsurance(1, 1);
        }
    },
    deleteRow5: function () {
        var tableName = this.state.tableMapping[this.state.currentgrid];
        var currentgrid = "grid" + this.state.currentgrid;
        var i = this.state.currentRowIdx;
        if (currentgrid == "grid5" && i > 0) {
            var rows = this.state.utilitiesRows;
            rows.splice(i, 1);
            var length = rows.length;
            var items = rows.slice(1, length);
            var _row = this.createSummaryRow(items, "utilities");
            _row["Utilities"] = "Utilities";
            rows[0] = _row;
            this.setState({ utilitiesRows: rows });
            this.onSave({ "utilitiesRows": rows });
            this.handleGridRowsUpdatedUtilities(1, 1);
        }
    },
    deleteRow6: function () {
        var tableName = this.state.tableMapping[this.state.currentgrid];
        var currentgrid = "grid" + this.state.currentgrid;
        var i = this.state.currentRowIdx;
        if (currentgrid == "grid6" && i > 0) {
            var rows = this.state.loanPaymentRows;
            rows.splice(i, 1);
            var length = rows.length;
            var items = rows.slice(1, length);
            var _row = this.createSummaryRow(items, "loanPayment");
            _row["loanPayment"] = "Debt Payment";
            rows[0] = _row;
            this.setState({ loanPaymentRows: rows });
            this.onSave({ "loanPaymentRows": rows });
            this.handleGridRowsUpdatedLoanPayment(1, 1);
        }
    },
    deleteRow8: function () {
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
    deleteRow9: function () {
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
    deleteRow10: function () {
        var tableName = this.state.tableMapping[this.state.currentgrid];
        var currentgrid = "grid" + this.state.currentgrid;
        var i = this.state.currentRowIdx;
        if (currentgrid == "grid10" && i > 0) {
            var rows = this.state.otherExpensesRows;
            rows.splice(i, 1);
            var length = rows.length;
            var items = rows.slice(1, length);
            var _row = this.createSummaryRow(items, "OtherExpenses");
            _row["OtherExpenses"] = "Other Expenses";
            rows[0] = _row;
            this.setState({ otherExpensesRows: rows });
            this.onSave({ "otherExpensesRows": rows });
            this.handleGridRowsUpdatedOtherExpenses(1, 1);
        }
    },
    deleteRow11: function () {
        var tableName = this.state.tableMapping[this.state.currentgrid];
        var currentgrid = "grid" + this.state.currentgrid;
        var i = this.state.currentRowIdx;
        if (currentgrid == "grid11" && i > 0) {
            var rows = this.state.householdExpensesRows;
            rows.splice(i, 1);
            var length = rows.length;
            var items = rows.slice(1, length);
            var _row = this.createSummaryRow(items, "householdExpenses");
            _row["HouseholdExpenses"] = "Household Expenses";
            rows[0] = _row;
            this.setState({ householdExpensesRows: rows });
            this.onSave({ "householdExpensesRows": rows });
            this.handleGridRowsUpdatedHouseholdExpensesRows(1, 1);
        }
    },
    deleteRow: function (e, _a) {
        var rowIdx = _a.rowIdx;
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
    copyAcross: function (e, _a) {
        var _this = this;
        var rowIdx = _a.rowIdx, idx = _a.idx;
        debugger;
        var tableName = this.state.tableMapping[this.state.currentgrid];
        var currentgrid = "grid" + this.state.currentgrid;
        for (var loop = this.state.currentIdx + 1; loop <= this[currentgrid].props.columns.length - 2; loop++) {
            this.state[tableName][this.state.currentRowIdx][this[currentgrid].props.columns[loop].key] = this.state[tableName][this.state.currentRowIdx][this[currentgrid].props.columns[this.state.currentIdx].key]; //this.state.rows[0][0]
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
        setTimeout(function () {
            _this.getExpenseBalance();
            setTimeout(function () {
                _this.isOnBudget(_this.state.currentMonth);
            }, 1);
        }, 1);
    },
    handleAddRowMonthlyIncome: function () {
        var newRow = { Jan: '', Feb: '', Mar: '', Apr: '', May: '', June: '', July: '', Aug: '', Sep: '', Oct: '', Nov: '', Dec: '' };
        var rows = this.state.rows.slice();
        rows = update(rows, { $push: [newRow] });
        rows[rows.length - 1] = rows[rows.length - 2];
        this.grid1.openCellEditor(rows.length - 2, 0);
        rows[rows.length - 2] = {};
        this.state.addMonthlyIncome = true;
        this.isOnBudget(this.state.currentMonth);
        this.setState({ rows: rows });
    },
    handleAddRowMonthlyExpense: function () {
        var newRow = { Jan: '', Feb: '', Mar: '', Apr: '', May: '', June: '', July: '', Aug: '', Sep: '', Oct: '', Nov: '', Dec: '' };
        var rows = this.state.monthlyExpenseRows.slice();
        rows = update(rows, { $push: [newRow] });
        this.grid2.openCellEditor(rows.length - 1, 0);
        this.state.monthlyExpenseRows = rows;
        this.layoutSetting(this.grid2);
        this.setState({ "monthlyExpenseRows": rows });
    },
    handleAddRowHousing: function () {
        var newRow = { Jan: '', Feb: '', Mar: '', Apr: '', May: '', June: '', July: '', Aug: '', Sep: '', Oct: '', Nov: '', Dec: '' };
        var rows = this.state.housingRows.slice();
        rows = update(rows, { $push: [newRow] });
        this.grid7.openCellEditor(rows.length - 1, 0);
        this.state.housingRows = rows;
        this.setState({ "housingRows": rows });
    },
    handleAddRowBooksSupplies: function () {
        var newRow = { Jan: '', Feb: '', Mar: '', Apr: '', May: '', June: '', July: '', Aug: '', Sep: '', Oct: '', Nov: '', Dec: '' };
        var rows = this.state.booksSuppliesRows.slice();
        rows = update(rows, { $push: [newRow] });
        this.grid7.openCellEditor(rows.length - 1, 0);
        this.state.booksSuppliesRows = rows;
        this.setState({ "booksSuppliesRows": rows });
    },
    handleAddRowHouseholdExpense: function () {
        var newRow = { Jan: '', Feb: '', Mar: '', Apr: '', May: '', June: '', July: '', Aug: '', Sep: '', Oct: '', Nov: '', Dec: '' };
        var rows = this.state.householdExpensesRows.slice();
        rows = update(rows, { $push: [newRow] });
        this.grid7.openCellEditor(rows.length - 1, 0);
        this.state.householdExpensesRows = rows;
        this.setState({ "householdExpensesRows": rows });
    },
    handleAddRowUtilities: function () {
        var newRow = { Jan: '', Feb: '', Mar: '', Apr: '', May: '', June: '', July: '', Aug: '', Sep: '', Oct: '', Nov: '', Dec: '' };
        var rows = this.state.utilitiesRows.slice();
        rows = update(rows, { $push: [newRow] });
        this.grid4.openCellEditor(rows.length - 1, 0);
        this.state.utilitiesRows = rows;
        this.setState({ "utilitiesRows": rows });
    },
    handleAddRowInsurance: function () {
        var newRow = { Jan: '', Feb: '', Mar: '', Apr: '', May: '', June: '', July: '', Aug: '', Sep: '', Oct: '', Nov: '', Dec: '' };
        var rows = this.state.insurancerows.slice();
        rows = update(rows, { $push: [newRow] });
        this.grid4.openCellEditor(rows.length - 1, 0);
        this.state.insuranceRows = rows;
        this.setState({ "insurancerows": rows });
    },
    handleAddRowLoanPayment: function () {
        var newRow = { Jan: '', Feb: '', Mar: '', Apr: '', May: '', June: '', July: '', Aug: '', Sep: '', Oct: '', Nov: '', Dec: '' };
        var rows = this.state.loanPaymentRows.slice();
        rows = update(rows, { $push: [newRow] });
        this.grid4.openCellEditor(rows.length - 1, 0);
        this.state.loanPaymentRows = rows;
        this.setState({ "loanPaymentRows": rows });
    },
    handleAddRowTransportation: function () {
        var newRow = { Jan: '', Feb: '', Mar: '', Apr: '', May: '', June: '', July: '', Aug: '', Sep: '', Oct: '', Nov: '', Dec: '' };
        var rows = this.state.transportationRows.slice();
        rows = update(rows, { $push: [newRow] });
        this.grid4.openCellEditor(rows.length - 1, 0);
        this.state.transportationRows = rows;
        this.setState({ "transportationRows": rows });
    },
    handleAddRowDiscretionary: function () {
        var newRow = { Jan: '', Feb: '', Mar: '', Apr: '', May: '', June: '', July: '', Aug: '', Sep: '', Oct: '', Nov: '', Dec: '' };
        var rows = this.state.discretionaryRows.slice();
        rows = update(rows, { $push: [newRow] });
        this.grid4.openCellEditor(rows.length - 1, 0);
        this.state.discretionaryRows = rows;
        this.setState({ "discretionaryRows": rows });
    },
    handleAddRowOtherExpenses: function () {
        var newRow = { Jan: '', Feb: '', Mar: '', Apr: '', May: '', June: '', July: '', Aug: '', Sep: '', Oct: '', Nov: '', Dec: '' };
        var rows = this.state.otherExpensesRows.slice();
        rows = update(rows, { $push: [newRow] });
        this.grid10.openCellEditor(rows.length - 1, 0);
        this.state.otherExpensesRows = rows;
        this.setState({ "otherExpensesRows": rows });
    },
    handleAddRow: function (_a) {
        var newRowIndex = _a.newRowIndex;
        var tableName = this.state.tableMapping[this.state.currentgrid];
        var currentgrid = "grid" + this.state.currentgrid;
        var newRow = { Jan: '', Feb: '', Mar: '', Apr: '', May: '', June: '', July: '', Aug: '', Sep: '', Oct: '', Nov: '', Dec: '' };
        var rows;
        if (this.state.currentgrid == 1) {
            rows = this.state.rows.slice();
            rows = update(rows, { $push: [newRow] });
            rows[rows.length - 1] = rows[rows.length - 2];
            this[currentgrid].openCellEditor(rows.length - 2, 0);
            rows[rows.length - 2] = {};
            this.setState({ rows: rows });
        }
        else {
            rows = this.state[tableName].slice();
            rows = update(rows, { $push: [newRow] });
            this[currentgrid].openCellEditor(rows.length - 1, 0);
            this.state[tableName] = rows;
            this.setState({ tableName: rows });
        }
    },
    handleAddRowMonththlyExpense: function (_a) {
        var newRowIndex = _a.newRowIndex;
        var newRow = { Jan: '', Feb: '', Mar: '', Apr: '', May: '', June: '', July: '', Aug: '', Sep: '', Oct: '', Nov: '', Dec: '' };
        var rows = this.state.monthlyExpenseRows.slice();
        rows = update(rows, { $push: [newRow] });
        rows[rows.length - 1] = rows[rows.length - 2];
        this.grid2.openCellEditor(rows.length - 2, 0);
        rows[rows.length - 2] = {};
        this.setState({ rows: rows });
    },
    handleGridRowsUpdated: function (_a) {
        var fromRow = _a.fromRow, toRow = _a.toRow, updated = _a.updated;
        var filled = false;
        var rows = this.state.rows.slice();
        var length = this.state.rows.length;
        for (var i = fromRow; i <= toRow; i++) {
            var rowToUpdate = rows[i];
            var updatedRow = update(rowToUpdate, { $merge: updated });
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
        var result = this.sumBySections(this.state.rows, this.state.monthlyExpenseRows, this.state.housingRows, this.state.insurancerows, this.state.utilitiesRows, this.state.loanPaymentRows, this.state.transportationRows, this.state.booksSuppliesRows, this.state.discretionaryRows, this.state.otherExpensesRows);
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
        this.isOnBudget(this.state.currentMonth); //before: empty
        this.getIncomeBalance();
        this.getExpenseBalance();
    },
    createSummaryRow: function (items, column) {
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
        var newRow = { Jan: jan, Feb: feb, Mar: mar, Apr: apr, May: may, June: june, July: july, Aug: aug, Sep: sep, Oct: oct, Nov: nov, Dec: dec };
        newRow[column] = column;
        return newRow;
    },
    createSummaryRowKeys: function (items, columnkey, columnvalue) {
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
        var newRow = { Jan: jan, Feb: feb, Mar: mar, Apr: apr, May: may, June: june, July: july, Aug: aug, Sep: sep, Oct: oct, Nov: nov, Dec: dec };
        newRow[columnkey] = columnvalue;
        return newRow;
    },
    createNewRow: function (column, jan, feb, mar, apr, may, june, july, aug, sep, oct, nov, dec) {
        var newRow = {
            column: column, Jan: jan, Feb: feb, Mar: mar, Apr: apr, May: may,
            June: june, July: july, Aug: aug, Sep: sep, Oct: oct, Nov: nov, Dec: dec
        };
        return newRow;
    },
    handleGridRowsUpdatedMonthlyExpense: function (_a) {
        var _this = this;
        var fromRow = _a.fromRow, toRow = _a.toRow, updated = _a.updated;
        var filled = false;
        var monthlyExpenseRows = this.state.monthlyExpenseRows.slice();
        var length = this.state.monthlyExpenseRows.length;
        for (var i = fromRow; i <= toRow; i++) {
            var rowToUpdate = monthlyExpenseRows[i];
            var updatedRow = update(rowToUpdate, { $merge: updated });
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
        var newRow = {
            MonthlyExpense: "Tuition & Fees", Jan: jan, Feb: feb, Mar: mar, Apr: apr, May: may, June: june, July: july,
            Aug: aug, Sep: sep, Oct: oct, Nov: nov, Dec: dec
        };
        monthlyExpenseRows[0] = newRow;
        this.sumByYear(monthlyExpenseRows);
        this.setState({ monthlyExpenseRows: monthlyExpenseRows });
        this.layoutSetting(this.grid2);
        this.onSave({ "monthlyExpenseRows": monthlyExpenseRows });
        this.getIncomeBalance();
        //this.getExpenseBalance();
        setTimeout(function () {
            _this.getExpenseBalance();
            setTimeout(function () {
                _this.isOnBudget(_this.state.currentMonth);
            }, 1);
        }, 1);
    },
    handleGridRowsUpdatedHouseholdExpensesRows: function (_a) {
        var _this = this;
        var fromRow = _a.fromRow, toRow = _a.toRow, updated = _a.updated;
        var filled = false;
        var householdExpensesRows = this.state.householdExpensesRows.slice();
        var length = this.state.householdExpensesRows.length;
        for (var i = fromRow; i <= toRow; i++) {
            var rowToUpdate = householdExpensesRows[i];
            var updatedRow = update(rowToUpdate, { $merge: updated });
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
        setTimeout(function () {
            _this.getExpenseBalance();
            setTimeout(function () {
                _this.isOnBudget(_this.state.currentMonth);
            }, 1);
        }, 1);
    },
    handleGridRowsUpdatedHousing: function (_a) {
        var _this = this;
        var fromRow = _a.fromRow, toRow = _a.toRow, updated = _a.updated;
        var filled = false;
        var housingRows = this.state.housingRows.slice();
        var length = this.state.housingRows.length;
        for (var i = fromRow; i <= toRow; i++) {
            var rowToUpdate = housingRows[i];
            var updatedRow = update(rowToUpdate, { $merge: updated });
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
        setTimeout(function () {
            _this.getExpenseBalance();
            setTimeout(function () {
                _this.isOnBudget(_this.state.currentMonth);
            }, 1);
        }, 1);
    },
    handleGridRowsUpdatedInsurance: function (_a) {
        var _this = this;
        var fromRow = _a.fromRow, toRow = _a.toRow, updated = _a.updated;
        var filled = false;
        var rows = this.state.insurancerows.slice();
        var length = this.state.insurancerows.length;
        for (var i = fromRow; i <= toRow; i++) {
            var rowToUpdate = rows[i];
            var updatedRow = update(rowToUpdate, { $merge: updated });
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
        this.onSave({ "insuranceRows": rows });
        this.getIncomeBalance();
        setTimeout(function () {
            _this.getExpenseBalance();
            setTimeout(function () {
                _this.isOnBudget(_this.state.currentMonth);
            }, 1);
        }, 1);
    },
    handleGridRowsUpdatedUtilities: function (_a) {
        var _this = this;
        var fromRow = _a.fromRow, toRow = _a.toRow, updated = _a.updated;
        var filled = false;
        var rows = this.state.utilitiesRows.slice();
        var length = this.state.utilitiesRows.length;
        for (var i = fromRow; i <= toRow; i++) {
            var rowToUpdate = rows[i];
            var updatedRow = update(rowToUpdate, { $merge: updated });
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
        this.onSave({ "utilitiesRows": rows });
        this.getIncomeBalance();
        setTimeout(function () {
            _this.getExpenseBalance();
            setTimeout(function () {
                _this.isOnBudget(_this.state.currentMonth);
            }, 1);
        }, 1);
    },
    handleGridRowsUpdatedLoanPayment: function (_a) {
        var _this = this;
        var fromRow = _a.fromRow, toRow = _a.toRow, updated = _a.updated;
        var filled = false;
        var rows = this.state.loanPaymentRows.slice();
        var length = this.state.loanPaymentRows.length;
        for (var i = fromRow; i <= toRow; i++) {
            var rowToUpdate = rows[i];
            var updatedRow = update(rowToUpdate, { $merge: updated });
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
        this.onSave({ "LoanPayment": rows });
        //this.getIncomeBalance();
        //this.getExpenseBalance();
        this.getIncomeBalance();
        setTimeout(function () {
            _this.getExpenseBalance();
            setTimeout(function () {
                _this.isOnBudget(_this.state.currentMonth);
            }, 1);
        }, 1);
    },
    handleGridRowsUpdatedTransportation: function (_a) {
        var _this = this;
        var fromRow = _a.fromRow, toRow = _a.toRow, updated = _a.updated;
        var filled = false;
        var rows = this.state.transportationRows.slice();
        var length = this.state.transportationRows.length;
        for (var i = fromRow; i <= toRow; i++) {
            var rowToUpdate = rows[i];
            var updatedRow = update(rowToUpdate, { $merge: updated });
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
        this.onSave({ "transportationRows": rows });
        // this.getIncomeBalance();
        //this.getExpenseBalance();
        this.getIncomeBalance();
        setTimeout(function () {
            _this.getExpenseBalance();
            setTimeout(function () {
                _this.isOnBudget(_this.state.currentMonth);
            }, 1);
        }, 1);
    },
    handleGridRowsUpdatedbooksSupplies: function (_a) {
        var _this = this;
        var fromRow = _a.fromRow, toRow = _a.toRow, updated = _a.updated;
        debugger;
        var filled = false;
        var rows = this.state.booksSuppliesRows.slice();
        var length = this.state.booksSuppliesRows.length;
        for (var i = fromRow; i <= toRow; i++) {
            var rowToUpdate = rows[i];
            var updatedRow = update(rowToUpdate, { $merge: updated });
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
        setTimeout(function () {
            _this.getExpenseBalance();
            setTimeout(function () {
                _this.isOnBudget(_this.state.currentMonth);
            }, 1);
        }, 1);
    },
    initColor: function (myArray) {
        this.state.colors = myArray;
    },
    generateColor: function () {
        var self = this.state.colors.slice();
        var i = Math.floor(Math.random() * self.length);
        var rand = self[i];
        self.splice(i, 1);
        this.state.colors = self;
        return rand;
    },
    diffArray: function (a, b) {
        var seen = [], diff = [];
        for (var i = 0; i < b.length; i++)
            seen[b[i]] = true;
        for (var i = 0; i < a.length; i++)
            if (!seen[a[i]])
                diff.push(a[i]);
        return diff;
    },
    createReportDataSet: function () {
        var _this = this;
        var month = this.state.currentMonth;
        if (this.state.reports != null) {
        }
        var items = [];
        var color;
        var dataSet = [];
        var rows = this.state.rows.slice();
        var len = rows.length;
        rows.splice(len - 1, 1);
        //if (this.state.addMonthlyIncome== true ){
        //   console.log('add a row');
        // }
        var arr = [];
        var colorArray = ["green", "yellow", "black", "red", "blue", "pink", "gray"];
        if (firstload == true) {
            this.initColor(colorArray);
            rows.forEach(function (element, index) {
                var cell = {};
                var column = element['MonthlyIncome'];
                color = _this.generateColor();
                cell[column] = element[month];
                var temp = Object.keys(cell)[0];
                var value = isNaN(cell[temp]) ? 0 : Number(cell[temp]);
                if (column != undefined) {
                    items.push({ color: color, value: column });
                    arr.push(color);
                }
                dataSet.push({ color: color, value: value, label: column });
                firstload = false;
            });
            this.state.reports = items;
            this.state.colorArray = arr;
            this.state.reports1 = dataSet;
        }
        else {
            rows.forEach(function (element, index) {
                var cell = {};
                var column = element['MonthlyIncome'];
                if (_this.state.reports != undefined) {
                    var found = _this.state.reports.filter(function (item) { return item.value == column; });
                    if (column != undefined && found[0] != undefined) {
                        color = found[0]["color"];
                    }
                    else {
                        var items1 = _this.diffArray(colorArray, _this.state.colorArray);
                        var array = _this.state.colorArray;
                        if (color != undefined && column != undefined) {
                            color = items1[0];
                            _this.state.colorArray.push(color);
                        }
                    }
                }
                cell[column] = element[month];
                var temp = Object.keys(cell)[0];
                var value = isNaN(cell[temp]) ? 0 : Number(cell[temp]);
                if (column != undefined) {
                    items.push({ color: color, value: column });
                    dataSet.push({ color: color, value: value, label: column });
                }
            });
        }
        var count = dataSet.filter(function (item) { return item.value != ""; });
        if (count.length > 0) {
            //this.state.reports = items;
            this.state.reports = items;
            this.state.reports1 = dataSet;
        }
        else {
            items = [];
            this.state.reports1 = [];
        }
        return items;
    },
    createReportData: function () {
        var month = this.state.currentMonth;
        var items = [];
        var dataSet = [];
        var rows = this.state.rows.slice();
        var len = rows.length;
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
    createExpenseReportDataSet: function () {
        var month = this.state.currentMonth;
        var dataSet = [];
        var TuitionFees = Number(this.state.monthlyExpenseRows[0][month]);
        var housingRows = Number(this.state.housingRows[0][month]);
        var otherExpenses = Number(this.state.otherExpensesRows[0][month]);
        var discretionary = Number(this.state.discretionaryRows[0][month]);
        var transportation = Number(this.state.transportationRows[0][month]);
        var loanPayment = Number(this.state.loanPaymentRows[0][month]);
        var utilities = Number(this.state.utilitiesRows[0][month]);
        var insurance = Number(this.state.insurancerows[0][month]);
        var booksSupplies = Number(this.state.booksSuppliesRows[0][month]);
        var householdExp = Number(this.state.householdExpensesRows[0][month]);
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
    getIncomeBalance: function () {
        var month = this.state.currentMonth;
        var length = this.state.rows.length;
        var income = this.sumByYear(this.state.rows)[length - 1][month];
        this.state.income = income;
        this.setState({ income: income });
    },
    getExpenseBalance: function () {
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
    disableRowsSelected: function (rows, name) {
        var _this = this;
        rows.forEach(function (r) {
            if (r.isSelected == true) {
                r.isSelected = false;
            }
            _this.setState({ name: rows });
        });
    },
    onRowClick1: function (rowIdx, row) {
        var rows = this.state.rows.slice();
        rows.forEach(function (r) {
            if (r.isSelected == true) {
                r.isSelected = false;
            }
        });
        rows[rowIdx] = objectAssignfrom({}, row, { isSelected: !row.isSelected });
        this.setState({ rows: rows });
        for (var i = 2; i <= 11; i++) {
            var name = this.state.tableMapping[i];
            var selectRows = this.state[name];
            var rows2 = selectRows.slice();
            this.disableRowsSelected(rows2, name);
        }
    },
    onRowClick2: function (rowIdx, row) {
        var rows2 = this.state.monthlyExpenseRows.slice();
        rows2.forEach(function (r) {
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
                var rows = selectRows.slice();
                this.disableRowsSelected(rows, name);
            }
        }
    },
    onRowClick3: function (rowIdx, row) {
        var rows = this.state.housingRows.slice();
        rows.forEach(function (r) {
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
                var rows_1 = selectRows.slice();
                this.disableRowsSelected(rows_1, name);
            }
        }
    },
    onRowClick4: function (rowIdx, row) {
        var rows = this.state.insurancerows.slice();
        rows.forEach(function (r) {
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
                var rows_2 = selectRows.slice();
                this.disableRowsSelected(rows_2, name);
            }
        }
    },
    onRowClick5: function (rowIdx, row) {
        var rows = this.state.utilitiesRows.slice();
        rows.forEach(function (r) {
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
                var rows_3 = selectRows.slice();
                this.disableRowsSelected(rows_3, name);
            }
        }
    },
    onRowClick6: function (rowIdx, row) {
        var rows = this.state.loanPaymentRows.slice();
        rows.forEach(function (r) {
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
                var rows_4 = selectRows.slice();
                this.disableRowsSelected(rows_4, name);
            }
        }
    },
    onRowClick10: function (rowIdx, row) {
        var rows = this.state.otherExpensesRows.slice();
        rows.forEach(function (r) {
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
                var rows_5 = selectRows.slice();
                this.disableRowsSelected(rows_5, name);
            }
        }
    },
    onRowClick8: function (rowIdx, row) {
        var rows = this.state.transportationRows.slice();
        rows.forEach(function (r) {
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
                var rows_6 = selectRows.slice();
                this.disableRowsSelected(rows_6, name);
            }
        }
    },
    onRowClick9: function (rowIdx, row) {
        var rows = this.state.discretionaryRows.slice();
        rows.forEach(function (r) {
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
                var rows_7 = selectRows.slice();
                this.disableRowsSelected(rows_7, name);
            }
        }
    },
    onRowClick11: function (rowIdx, row) {
        var rows = this.state.householdExpensesRows.slice();
        rows.forEach(function (r) {
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
                var rows_8 = selectRows.slice();
                this.disableRowsSelected(rows_8, name);
            }
        }
    },
    onRowClick7: function (rowIdx, row) {
        var rows = this.state.booksSuppliesRows.slice();
        rows.forEach(function (r) {
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
                var rows2 = selectRows.slice();
                this.disableRowsSelected(rows2, name);
            }
        }
    },
    handleGridRowsUpdatedDiscretionary: function (_a) {
        var _this = this;
        var fromRow = _a.fromRow, toRow = _a.toRow, updated = _a.updated;
        var filled = false;
        var rows = this.state.discretionaryRows.slice();
        var length = this.state.discretionaryRows.length;
        for (var i = fromRow; i <= toRow; i++) {
            var rowToUpdate = rows[i];
            var updatedRow = update(rowToUpdate, { $merge: updated });
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
        this.onSave({ "discretionaryRows": rows });
        this.getIncomeBalance();
        setTimeout(function () {
            _this.getExpenseBalance();
            setTimeout(function () {
                _this.isOnBudget(_this.state.currentMonth);
            }, 1);
        }, 1);
    },
    onRowsSelected: function (rows) {
        this.grid1.setState({ selectedIndexes: 2 });
    },
    handleGridRowsUpdatedOtherExpenses: function (_a) {
        var _this = this;
        var fromRow = _a.fromRow, toRow = _a.toRow, updated = _a.updated;
        var filled = false;
        var rows = this.state.otherExpensesRows.slice();
        var length = this.state.otherExpensesRows.length;
        for (var i = fromRow; i <= toRow; i++) {
            var rowToUpdate = rows[i];
            var updatedRow = update(rowToUpdate, { $merge: updated });
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
        this.onSave({ "otherExpensesRows": rows });
        //this.getIncomeBalance();
        //this.getExpenseBalance();
        this.getIncomeBalance();
        setTimeout(function () {
            _this.getExpenseBalance();
            setTimeout(function () {
                _this.isOnBudget(_this.state.currentMonth);
            }, 1);
        }, 1);
    },
    onSave: function (rows) {
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
    render: function () {
        var _this = this;
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
        return (React.createElement("div", { className: "ms-fontColor-themeDarker" },
            React.createElement("div", null,
                React.createElement("span", { ref: "mybudget" }, " My Budget ")),
            React.createElement("div", null,
                React.createElement("button", { name: "Edit", className: "ms-CommandBarItem-link itemLink_ceb80f25", onClick: onSelectEvent.bind(this), style: { display: "none" } },
                    React.createElement("span", { className: "ms-CommandBarItem-commandText itemCommandText_ceb80f25", style: { display: "none" } }, "Download"))),
            React.createElement("div", { style: { clear: "both" } },
                React.createElement("div", { className: "ms-Grid-col", style: { width: "350px" } },
                    React.createElement("div", { style: { width: "150px", height: "200px", float: "left" } },
                        React.createElement("div", { style: { fontSize: "15px" } },
                            this.state.currentMonth,
                            " income:"),
                        React.createElement("div", { style: { display: "block", fontSize: "22px" } },
                            "$",
                            this.state.income),
                        React.createElement(ListRender_1.default, { list: this.createReportDataSet() })),
                    React.createElement(Chart_1.default, { ref: "myChart", JSON: this.createReportData() })),
                React.createElement("div", { className: "ms-Grid-col", style: { width: "350px" } },
                    React.createElement("div", { style: { width: "150px", height: "200px", float: "left" } },
                        React.createElement("span", null,
                            this.state.currentMonth,
                            " expense:"),
                        React.createElement("span", { style: { display: "block", fontSize: "20px" } },
                            "$",
                            this.state.expense),
                        React.createElement("span", { style: { display: "block", fontSize: "13px" } },
                            React.createElement("button", { style: { background: "#898B8E", padding: "4px", border: "none", verticalAlign: "middle" } }),
                            "Tuition & Fees "),
                        React.createElement("span", { style: { display: "block", fontSize: "13px" } },
                            React.createElement("button", { style: { background: "#5FD2E0", padding: "4px", border: "none", verticalAlign: "middle" } }),
                            "Housing"),
                        React.createElement("span", { style: { display: "block", fontSize: "13px" } },
                            React.createElement("button", { style: { background: "#84E112", padding: "4px", border: "none", verticalAlign: "middle" } }),
                            "Insurance"),
                        React.createElement("span", { style: { display: "block", fontSize: "13px" } },
                            React.createElement("button", { style: { background: "#E4B806", padding: "4px", border: "none", verticalAlign: "middle" } }),
                            "Utilities"),
                        React.createElement("span", { style: { display: "block", fontSize: "13px" } },
                            React.createElement("button", { style: { background: "#A012E1", padding: "4px", border: "none", verticalAlign: "middle" } }),
                            "Loan Payments"),
                        React.createElement("span", { style: { display: "block", fontSize: "13px" } },
                            React.createElement("button", { style: { background: "red", padding: "4px", border: "none", verticalAlign: "middle" } }),
                            "Transportation"),
                        React.createElement("span", { style: { display: "block", fontSize: "13px" } },
                            React.createElement("button", { style: { background: "#f47442", padding: "4px", border: "none", verticalAlign: "middle" } }),
                            "Discretionary"),
                        React.createElement("span", { style: { display: "block", fontSize: "13px" } },
                            React.createElement("button", { style: { background: "black", padding: "4px", border: "none", verticalAlign: "middle" } }),
                            "Other Expenses"),
                        React.createElement("span", { style: { display: "block", fontSize: "13px" } },
                            React.createElement("button", { style: { background: "blue", padding: "4px", border: "none", verticalAlign: "middle" } }),
                            "Books & Supplies"),
                        React.createElement("span", { style: { display: "block", fontSize: "13px" } },
                            React.createElement("button", { style: { background: "yellow", padding: "4px", border: "none", verticalAlign: "middle" } }),
                            "Household Expenses")),
                    React.createElement(Chart_1.default, { JSON: this.createExpenseReportDataSet() })),
                React.createElement("div", { className: "ms-Grid-col", style: { width: "150px" } },
                    React.createElement("span", null,
                        this.state.currentMonth,
                        " available funds:"),
                    React.createElement("span", { style: { display: "block", fontSize: "20px" } },
                        "$",
                        this.state.income - this.state.expense),
                    React.createElement(Bar_1.default, null))),
            React.createElement("div", { style: { clear: "both" } },
                React.createElement("div", { style: { float: "left", width: "190px", textAlign: "right", paddingRight: "23px" } }, "Available funds"),
                React.createElement("div", { style: { float: "left" } },
                    React.createElement("div", null,
                        React.createElement("div", { style: { width: "650px", marginBottom: "20px", marginLeft: "0px" } },
                            React.createElement(rc_slider_1.default, { step: 8.3, onAfterChange: this.sliderMove, style: { width: "95%" }, handleStyle: { backgroundColor: 'green' } })),
                        React.createElement("div", { className: "ms-Grid" },
                            React.createElement("div", { className: "ms-Grid-row" },
                                React.createElement("div", { className: "ms-Grid-col sep" }, "Sep"),
                                React.createElement("div", { className: "ms-Grid-col oct" }, "Oct"),
                                React.createElement("div", { className: "ms-Grid-col nov" }, "Nov"),
                                React.createElement("div", { className: "ms-Grid-col dev" }, "Dec"),
                                React.createElement("div", { className: "ms-Grid-col jan" }, "Jan"),
                                React.createElement("div", { className: "ms-Grid-col feb" }, "Feb"),
                                React.createElement("div", { className: "ms-Grid-col mar" }, "Mar"),
                                React.createElement("div", { className: "ms-Grid-col apr" }, "Apr"),
                                React.createElement("div", { className: "ms-Grid-col may" }, "May"),
                                React.createElement("div", { className: "ms-Grid-col june" }, "June"),
                                React.createElement("div", { className: "ms-Grid-col july" }, "July"),
                                React.createElement("div", { className: "ms-Grid-col aug" }, "Aug"),
                                React.createElement("div", { className: "ms-Grid-col year" }, "Year")))))),
            React.createElement("div", null,
                React.createElement("span", { style: { clear: "both", color: "green", display: "block", width: "68%", paddingBottom: "20px", paddingTop: "20px" } }, this.state.isOnBudget)),
            React.createElement(ReactDataGrid, { ref: function (node) { return _this.grid = node; }, columns: this._monthlyCashColumns, rowGetter: this.rowGetterCashFlow, rowsCount: this.state.cashFlowRows.length, rowHeight: 30, minHeight: 90 }),
            React.createElement(ReactDataGrid, { ref: function (node) { return _this.grid1 = node; }, enableCellSelect: true, columns: this._monthlyIncomeColumns, rowGetter: this.rowGetter, rowsCount: this.state.rows.length, rowHeight: 30, minHeight: (this.state.rows.length + 1) * 30, rowss: this.state.rows, contextMenu: React.createElement(MyContextMenu, { onRowDelete: this.deleteRow, onRowInsert: this.handleAddRow, onCopyAcross: this.copyAcross }), onRowClick: this.onRowClick1, onCellSelected: this.onCellSelected1, onGridRowsUpdated: this.handleGridRowsUpdated, onCheckCellIsEditable: this.checkMonthlyIncomeCells, rowSelection: {
                    showCheckbox: false,
                    selectBy: {
                        isSelectedKey: 'isSelected'
                    }
                } }),
            React.createElement("div", { style: { float: "left" } },
                React.createElement("button", { style: { marginLeft: "830px", float: "left" }, onClick: this.handleAddRowMonthlyIncome }, "+"),
                React.createElement("button", { style: { float: "left", width: "25px", visibility: "visible" }, onClick: this.deleteRowMonthlyInCome }, "-")),
            React.createElement(ReactDataGrid, { ref: function (node) { return _this.grid2 = node; }, enableCellSelect: true, columns: this._monthlyExpenseColumns, rowGetter: this.rowGetterMonthlyExpense, rowsCount: this.state.monthlyExpenseRows.length, rowHeight: 30, minHeight: (this.state.monthlyExpenseRows.length + 1) * 30, contextMenu: React.createElement(MyContextMenu, { onRowDelete: this.deleteRow, onRowInsert: this.handleAddRow, onCopyAcross: this.copyAcross }), onRowClick: this.onRowClick2, onCellSelected: this.onCellSelected2, onGridRowsUpdated: this.handleGridRowsUpdatedMonthlyExpense, onCheckCellIsEditable: this.checkCells, rowSelection: {
                    showCheckbox: false,
                    selectBy: {
                        isSelectedKey: 'isSelected'
                    }
                } }),
            React.createElement("div", { style: { float: "left" } },
                React.createElement("button", { style: { marginLeft: "830px", float: "left" }, onClick: this.handleAddRowMonthlyExpense }, "+"),
                React.createElement("button", { style: { float: "left", width: "25px", visibility: "visible" }, onClick: this.deleteRow2 }, "-")),
            React.createElement(ReactDataGrid, { ref: function (node) { return _this.grid7 = node; }, enableCellSelect: true, columns: this._booksSuppliesColumns, rowGetter: this.rowGetterBooksSupplies, rowsCount: this.state.booksSuppliesRows.length, contextMenu: React.createElement(MyContextMenu, { onRowDelete: this.deleteRow, onRowInsert: this.handleAddRow, onCopyAcross: this.copyAcross }), rowHeight: 30, minHeight: (this.state.booksSuppliesRows.length + 1) * 30, onRowClick: this.onRowClick7, onCellSelected: this.onCellSelected7, onGridRowsUpdated: this.handleGridRowsUpdatedbooksSupplies, onCheckCellIsEditable: this.checkCells, rowSelection: {
                    showCheckbox: false,
                    selectBy: {
                        isSelectedKey: 'isSelected'
                    }
                } }),
            React.createElement("div", { style: { float: "left" } },
                React.createElement("button", { style: { marginLeft: "830px", float: "left" }, onClick: this.handleAddRowBooksSupplies }, "+"),
                React.createElement("button", { style: { float: "left", width: "25px", visibility: "visible" }, onClick: this.deleteRow7 }, "-")),
            React.createElement(ReactDataGrid, { ref: function (node) { return _this.grid3 = node; }, enableCellSelect: true, columns: this._housingColumns, rowGetter: this.rowGetterHousing, rowsCount: this.state.housingRows.length, rowHeight: 30, minHeight: (this.state.housingRows.length + 1) * 30, onCellSelected: this.onCellSelected3, onRowClick: this.onRowClick3, contextMenu: React.createElement(MyContextMenu, { onRowDelete: this.deleteRow, onRowInsert: this.handleAddRow, onCopyAcross: this.copyAcross }), onGridRowsUpdated: this.handleGridRowsUpdatedHousing, onCheckCellIsEditable: this.checkCells, rowSelection: {
                    showCheckbox: false,
                    selectBy: {
                        isSelectedKey: 'isSelected'
                    }
                } }),
            React.createElement("div", { style: { float: "left" } },
                React.createElement("button", { style: { marginLeft: "830px", float: "left" }, onClick: this.handleAddRowHousing }, "+"),
                React.createElement("button", { style: { float: "left", width: "25px", visibility: "visible" }, onClick: this.deleteRow3 }, "-")),
            React.createElement(ReactDataGrid, { ref: function (node) { return _this.grid11 = node; }, enableCellSelect: true, columns: this._housingColumns1, rowGetter: this.rowGetterHousing1, rowsCount: this.state.householdExpensesRows.length, rowHeight: 30, minHeight: (this.state.householdExpensesRows.length + 1) * 30, onCellSelected: this.onCellSelected11, onRowClick: this.onRowClick11, contextMenu: React.createElement(MyContextMenu, { onRowDelete: this.deleteRow, onRowInsert: this.handleAddRow, onCopyAcross: this.copyAcross }), onGridRowsUpdated: this.handleGridRowsUpdatedHouseholdExpensesRows, onCheckCellIsEditable: this.checkCells, rowSelection: {
                    showCheckbox: false,
                    selectBy: {
                        isSelectedKey: 'isSelected'
                    }
                } }),
            React.createElement("div", { style: { float: "left" } },
                React.createElement("button", { style: { marginLeft: "830px", float: "left" }, onClick: this.handleAddRowHouseholdExpense }, "+"),
                React.createElement("button", { style: { float: "left", width: "25px", visibility: "visible" }, onClick: this.deleteRow11 }, "-")),
            React.createElement(ReactDataGrid, { ref: function (node) { return _this.grid4 = node; }, enableCellSelect: true, columns: this._insuranceColumns, rowGetter: this.rowGetterInsurance, rowsCount: this.state.insurancerows.length, contextMenu: React.createElement(MyContextMenu, { onRowDelete: this.deleteRow, onRowInsert: this.handleAddRow, onCopyAcross: this.copyAcross }), rowHeight: 30, minHeight: (this.state.insurancerows.length + 1) * 30, onCellSelected: this.onCellSelected4, onRowClick: this.onRowClick4, onGridRowsUpdated: this.handleGridRowsUpdatedInsurance, onCheckCellIsEditable: this.checkCells, rowSelection: {
                    showCheckbox: false,
                    selectBy: {
                        isSelectedKey: 'isSelected'
                    }
                } }),
            React.createElement("div", { style: { float: "left" } },
                React.createElement("button", { style: { marginLeft: "830px", float: "left" }, onClick: this.handleAddRowInsurance }, "+"),
                React.createElement("button", { style: { float: "left", width: "25px", visibility: "visible" }, onClick: this.deleteRow4 }, "-")),
            React.createElement(ReactDataGrid, { ref: function (node) { return _this.grid5 = node; }, enableCellSelect: true, columns: this._utilitiesColumns, rowGetter: this.rowGetterUtilities, rowsCount: this.state.utilitiesRows.length, contextMenu: React.createElement(MyContextMenu, { onRowDelete: this.deleteRow, onRowInsert: this.handleAddRow, onCopyAcross: this.copyAcross }), rowHeight: 30, minHeight: (this.state.utilitiesRows.length + 1) * 30, onCellSelected: this.onCellSelected5, onRowClick: this.onRowClick5, onGridRowsUpdated: this.handleGridRowsUpdatedUtilities, onCheckCellIsEditable: this.checkCells, rowSelection: {
                    showCheckbox: false,
                    selectBy: {
                        isSelectedKey: 'isSelected'
                    }
                } }),
            React.createElement("div", { style: { float: "left" } },
                React.createElement("button", { style: { marginLeft: "830px", float: "left" }, onClick: this.handleAddRowUtilities }, "+"),
                React.createElement("button", { style: { float: "left", width: "25px", visibility: "visible" }, onClick: this.deleteRow5 }, "-")),
            React.createElement(ReactDataGrid, { ref: function (node) { return _this.grid6 = node; }, enableCellSelect: true, columns: this._loanPaymentColumns, rowGetter: this.rowGetterLoanPayment, rowsCount: this.state.loanPaymentRows.length, rowHeight: 30, minHeight: (this.state.loanPaymentRows.length + 1) * 30, onCellSelected: this.onCellSelected6, onRowClick: this.onRowClick6, contextMenu: React.createElement(MyContextMenu, { onRowDelete: this.deleteRow, onRowInsert: this.handleAddRow, onCopyAcross: this.copyAcross }), onGridRowsUpdated: this.handleGridRowsUpdatedLoanPayment, onCheckCellIsEditable: this.checkCells, rowSelection: {
                    showCheckbox: false,
                    selectBy: {
                        isSelectedKey: 'isSelected'
                    }
                } }),
            React.createElement("div", { style: { float: "left" } },
                React.createElement("button", { style: { marginLeft: "830px", float: "left" }, onClick: this.handleAddRowLoanPayment }, "+"),
                React.createElement("button", { style: { float: "left", width: "25px", visibility: "visible" }, onClick: this.deleteRow6 }, "-")),
            React.createElement(ReactDataGrid, { ref: function (node) { return _this.grid8 = node; }, enableCellSelect: true, columns: this._transportationColumns, rowGetter: this.rowGetterTransportation, rowsCount: this.state.transportationRows.length, contextMenu: React.createElement(MyContextMenu, { onRowDelete: this.deleteRow, onRowInsert: this.handleAddRow, onCopyAcross: this.copyAcross }), rowHeight: 30, minHeight: (this.state.transportationRows.length + 1) * 30, onCellSelected: this.onCellSelected8, onRowClick: this.onRowClick8, onGridRowsUpdated: this.handleGridRowsUpdatedTransportation, onCheckCellIsEditable: this.checkCells, rowSelection: {
                    showCheckbox: false,
                    selectBy: {
                        isSelectedKey: 'isSelected'
                    }
                } }),
            React.createElement("div", { style: { float: "left" } },
                React.createElement("button", { style: { marginLeft: "830px", float: "left" }, onClick: this.handleAddRowTransportation }, "+"),
                React.createElement("button", { style: { float: "left", width: "25px", visibility: "visible" }, onClick: this.deleteRow8 }, "-")),
            React.createElement(ReactDataGrid, { ref: function (node) { return _this.grid9 = node; }, enableCellSelect: true, columns: this._discretionaryColumns, rowGetter: this.rowGetterDiscretionary, rowsCount: this.state.discretionaryRows.length, rowHeight: 30, minHeight: (this.state.discretionaryRows.length + 1) * 30, onCellSelected: this.onCellSelected9, onRowClick: this.onRowClick9, contextMenu: React.createElement(MyContextMenu, { onRowDelete: this.deleteRow, onRowInsert: this.handleAddRow, onCopyAcross: this.copyAcross }), onGridRowsUpdated: this.handleGridRowsUpdatedDiscretionary, onCheckCellIsEditable: this.checkCells, rowSelection: {
                    showCheckbox: false,
                    selectBy: {
                        isSelectedKey: 'isSelected'
                    }
                } }),
            React.createElement("div", { style: { float: "left" } },
                React.createElement("button", { style: { marginLeft: "830px", float: "left" }, onClick: this.handleAddRowDiscretionary }, "+"),
                React.createElement("button", { style: { float: "left", width: "23px", visibility: "visible" }, onClick: this.deleteRow9 }, "-")),
            React.createElement(ReactDataGrid, { ref: function (node) { return _this.grid10 = node; }, enableCellSelect: true, columns: this._otherExpensesColumns, rowGetter: this.rowGetterOtherExpenses, rowsCount: this.state.otherExpensesRows.length, rowHeight: 30, minHeight: (this.state.otherExpensesRows.length + 1) * 30, onCellDeSelected: this.onSelect10, onCellSelected: this.onCellSelected10, onRowClick: this.onRowClick10, onGridRowsUpdated: this.handleGridRowsUpdatedOtherExpenses, onCheckCellIsEditable: this.checkCells, rowSelection: {
                    showCheckbox: false,
                    selectBy: {
                        isSelectedKey: 'isSelected'
                    }
                } }),
            React.createElement("div", { style: { float: "left" } },
                React.createElement("button", { style: { marginLeft: "830px", float: "left" }, onClick: this.handleAddRowOtherExpenses }, "+"),
                React.createElement("button", { style: { float: "left", width: "25px", visibility: "visible" }, onClick: this.deleteRow10 }, "-")),
            React.createElement(ReactDataGrid, { ref: function (node) { return _this.grid12 = node; }, enableCellSelect: false, columns: this._totalExpensesColumns, rowGetter: this.rowGetterTotalExpenses, rowsCount: this.state.totalExpensesRows.length, minHeight: 150 })));
    }
});
exports.MyBudget = MyBudget;

//# sourceMappingURL=Budget.js.map
