"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var StudentBudget_module_scss_1 = require("./StudentBudget.module.scss");
var rc_slider_1 = require("rc-slider");
var Budget_1 = require("./Budget");
var sp_http_1 = require("@microsoft/sp-http");
var Range = rc_slider_1.default["Range"];
var StudentBudget = (function (_super) {
    __extends(StudentBudget, _super);
    function StudentBudget(props) {
        var _this = _super.call(this, props) || this;
        _this.listItemEntityTypeName = undefined;
        _this.state = {
            status: ''
        };
        return _this;
    }
    StudentBudget.prototype.getListItemEntityTypeName = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.listItemEntityTypeName) {
                resolve(_this.listItemEntityTypeName);
                return;
            }
            _this.props.spHttpClient.get(_this.props.siteUrl + "/_api/web/lists/getbytitle('Tasks')?$select=ListItemEntityTypeFullName", sp_http_1.SPHttpClient.configurations.v1, {
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
    };
    StudentBudget.prototype.createItem = function () {
        var _this = this;
        this.getListItemEntityTypeName()
            .then(function (listItemEntityTypeName) {
            var body = JSON.stringify({
                '__metadata': {
                    'type': listItemEntityTypeName
                },
                'Title': "Item " + new Date(),
                'Budget': 'ok111'
            });
            return _this.props.spHttpClient.post(_this.props.siteUrl + "/_api/web/lists/getbytitle('Tasks')/items", sp_http_1.SPHttpClient.configurations.v1, {
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
            _this.setState({});
        });
    };
    StudentBudget.prototype.render = function () {
        return (React.createElement("div", { className: StudentBudget_module_scss_1.default.studentBudget, style: { width: "1300px", paddingLeft: "10px" } },
            React.createElement(Budget_1.MyBudget, { spHttpClient: this.props.spHttpClient, siteUrl: this.props.siteUrl, context: this.props.context })));
    };
    return StudentBudget;
}(React.Component));
exports.default = StudentBudget;

//# sourceMappingURL=StudentBudget.js.map
