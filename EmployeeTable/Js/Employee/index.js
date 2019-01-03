var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
$(document).ready(initialize);
function initialize() {
    var model = new EmployeeViewModel();
    var view = new EmployeeView(model);
    var controller = new EmployeeController(model, view);
}
var Employee = /** @class */ (function () {
    function Employee(employeeID, employeeNumber, name, department, jobTitle, hireDate) {
        this.employeeID = employeeID;
        this.employeeNumber = employeeNumber;
        this.name = name;
        this.department = department;
        this.jobTitle = jobTitle;
        this.hireDate = hireDate;
    }
    return Employee;
}());
var Department = /** @class */ (function () {
    function Department(name) {
        this.name = name;
    }
    return Department;
}());
var TempEmployee = /** @class */ (function (_super) {
    __extends(TempEmployee, _super);
    function TempEmployee() {
        var _this = _super.call(this, null, '', '', '', '', '') || this;
        _this.status = TempEmployeeStatus.modify;
        return _this;
    }
    return TempEmployee;
}(Employee));
var TempEmployeeStatus;
(function (TempEmployeeStatus) {
    TempEmployeeStatus[TempEmployeeStatus["modify"] = 0] = "modify";
    TempEmployeeStatus[TempEmployeeStatus["insert"] = 1] = "insert";
    TempEmployeeStatus[TempEmployeeStatus["update"] = 2] = "update";
    TempEmployeeStatus[TempEmployeeStatus["deleteOfModify"] = 3] = "deleteOfModify";
    TempEmployeeStatus[TempEmployeeStatus["deleteOfUpdate"] = 4] = "deleteOfUpdate";
})(TempEmployeeStatus || (TempEmployeeStatus = {}));
var BtnStatus;
(function (BtnStatus) {
    BtnStatus[BtnStatus["display"] = 0] = "display";
    BtnStatus[BtnStatus["hidden"] = 1] = "hidden";
})(BtnStatus || (BtnStatus = {}));
var TableStatus;
(function (TableStatus) {
    TableStatus[TableStatus["onlyDisplay"] = 0] = "onlyDisplay";
    TableStatus[TableStatus["allowModify"] = 1] = "allowModify";
})(TableStatus || (TableStatus = {}));
var EmployeeViewModel = /** @class */ (function () {
    function EmployeeViewModel() {
        this.employees = new Array();
        this.departments = new Array();
        this.tempEmployees = new Array();
        this.searchText = '';
        this.btnSearchStatus = BtnStatus.display;
        this.btnAddStatus = BtnStatus.display;
        this.btnModifyStatus = BtnStatus.hidden;
        this.btnSaveStatus = BtnStatus.hidden;
        this.btnCancelStatus = BtnStatus.hidden;
        this.tableStatus = TableStatus.onlyDisplay;
    }
    return EmployeeViewModel;
}());
var EmployeeView = /** @class */ (function () {
    function EmployeeView(model) {
        this.model = model;
        this.bindHtml();
    }
    EmployeeView.prototype.bindHtml = function () {
        this.search = $('#searchText');
        this.btnSearch = $('#btnSearch');
        this.btnAdd = $('#btnAdd');
        this.btnModify = $('#btnModify');
        this.btnSave = $('#btnSave');
        this.btnCancel = $('#btnCancel');
        this.table = $('#tableBody');
    };
    EmployeeView.prototype.updateView = function () {
        if (this.model.btnSearchStatus === BtnStatus.display) {
            this.search.removeClass('d-none');
            this.btnSearch.removeClass('d-none');
        }
        else if (this.model.btnSearchStatus === BtnStatus.hidden) {
            this.search.addClass('d-none');
            this.btnSearch.addClass('d-none');
        }
        if (this.model.btnModifyStatus === BtnStatus.display) {
            this.btnModify.removeClass('d-none');
        }
        else if (this.model.btnModifyStatus === BtnStatus.hidden) {
            this.btnModify.addClass('d-none');
        }
        if (this.model.btnSaveStatus === BtnStatus.display) {
            this.btnSave.removeClass('d-none');
        }
        else if (this.model.btnSaveStatus === BtnStatus.hidden) {
            this.btnSave.addClass('d-none');
        }
        if (this.model.btnCancelStatus === BtnStatus.display) {
            this.btnCancel.removeClass('d-none');
        }
        else if (this.model.btnCancelStatus === BtnStatus.hidden) {
            this.btnCancel.addClass('d-none');
        }
        if (this.model.tableStatus === TableStatus.onlyDisplay) {
            this.showTable();
        }
        else if (this.model.tableStatus === TableStatus.allowModify) {
            this.showInputTable();
        }
        this.search.val(this.model.searchText);
    };
    EmployeeView.prototype.showTable = function () {
        var htmlEmployeeList = '';
        for (var i = 0; i < this.model.employees.length; i++) {
            htmlEmployeeList +=
                "<tr>\n                    <th scope=\"row\">" + (i + 1) + "</th>\n                    <td>" + this.model.employees[i].employeeNumber + "</td>\n                    <td>" + this.model.employees[i].name + "</td>\n                    <td>" + this.model.employees[i].department + "</td>\n                    <td>" + this.model.employees[i].jobTitle + "</td>\n                    <td>" + this.model.employees[i].hireDate + "</td>\n                </tr>";
        }
        this.table.html(htmlEmployeeList);
    };
    EmployeeView.prototype.showInputTable = function () {
        var htmlEmployeeInputList = '';
        for (var i = 0; i < this.model.tempEmployees.length; i++) {
            var deleteBtnText = 'X';
            var display = '';
            var status_1 = '';
            if (this.model.tempEmployees[i].status === TempEmployeeStatus.deleteOfModify ||
                this.model.tempEmployees[i].status === TempEmployeeStatus.deleteOfUpdate) {
                //display = 'd-none';
                status_1 = 'disabled';
                deleteBtnText = 'O';
            }
            var htmlDepartmentOptions = '';
            if (!this.model.tempEmployees[i].department) {
                htmlDepartmentOptions += "<option value=\"\" selected></option>";
            }
            for (var _i = 0, _a = this.model.departments; _i < _a.length; _i++) {
                var department = _a[_i];
                if (department.name === this.model.tempEmployees[i].department) {
                    htmlDepartmentOptions += "<option value=\"" + department.name + "\" selected>" + department.name + "</option>";
                }
                else {
                    htmlDepartmentOptions += "<option value=\"" + department.name + "\">" + department.name + "</option>";
                }
            }
            htmlEmployeeInputList +=
                "<tr class=\"" + display + "\">\n                    <th scope=\"row\">\n                        <button type=\"button\" class=\"btn btn-secondary btn-sm delete idx" + i + "\">" + deleteBtnText + "</button>\n                    </th>\n                    <td>\n                        <input type=\"text\" class=\"form-control employeeNumber idx" + i + "\" value=\"" + this.model.tempEmployees[i].employeeNumber + "\"  " + status_1 + " required>\n                    </td>\n                    <td>\n                        <input type=\"text\" class=\"form-control name idx" + i + "\" value=\"" + this.model.tempEmployees[i].name + "\"  " + status_1 + " required>\n                    </td>\n                    <td>\n                        <select class=\"form-control department idx" + i + "\"  " + status_1 + " required>\n                            " + htmlDepartmentOptions + "\n                        </select>\n                    </td>\n                    <td>\n                        <input type=\"text\" class=\"form-control jobTitle idx" + i + "\" value=\"" + this.model.tempEmployees[i].jobTitle + "\"  " + status_1 + " required>\n                    </td>\n                    <td>\n                        <input type=\"date\" class=\"form-control hireDate idx" + i + "\" value=\"" + this.model.tempEmployees[i].hireDate + "\"  " + status_1 + " required>\n                    </td>\n                </tr>";
        }
        this.table.html(htmlEmployeeInputList);
    };
    return EmployeeView;
}());
var EmployeeController = /** @class */ (function () {
    function EmployeeController(model, view) {
        this.model = model;
        this.view = view;
        this.subscribeEvents();
        this.view.updateView();
    }
    EmployeeController.prototype.subscribeEvents = function () {
        var _this = this;
        this.view.search.change(function () { return _this.model.searchText = _this.view.search.val(); });
        this.view.btnSearch.click(function () { return _this.searchEmployee(); });
        this.view.btnAdd.click(function () { return _this.addTableRow(); });
        this.view.btnModify.click(function () { return _this.modifyTable(); });
        this.view.btnSave.click(function () { return _this.saveTable(); });
        this.view.btnCancel.click(function () { return _this.cancelChanges(); });
    };
    EmployeeController.prototype.searchEmployee = function () {
        var _this = this;
        this.clearEmployeeData();
        var data = {
            searchText: this.model.searchText
        };
        $.ajax({
            type: 'POST',
            url: '../Employee/SearchEmployees',
            data: data,
            dataType: 'json'
        }).done(function (employees) {
            if (employees) {
                for (var _i = 0, employees_1 = employees; _i < employees_1.length; _i++) {
                    var employee = employees_1[_i];
                    var temp = new Employee(employee.EmployeeID, employee.EmployeeNumber, employee.Name, employee.Department, employee.JobTitle, employee.HireDate);
                    _this.model.employees.push(temp);
                }
                _this.model.btnModifyStatus = BtnStatus.display;
            }
            _this.view.updateView();
        });
    };
    EmployeeController.prototype.addTableRow = function () {
        var _this = this;
        this.model.tableStatus = TableStatus.allowModify;
        this.model.btnSearchStatus = BtnStatus.hidden;
        this.model.btnModifyStatus = BtnStatus.hidden;
        this.model.btnSaveStatus = BtnStatus.display;
        this.model.btnCancelStatus = BtnStatus.display;
        this.model.departments.length = 0;
        $.ajax({
            type: 'POST',
            url: '../Employee/GetAllDepartments',
            dataType: 'json'
        }).done(function (departments) {
            if (departments) {
                for (var _i = 0, departments_1 = departments; _i < departments_1.length; _i++) {
                    var department = departments_1[_i];
                    var temp = new Department(department.Name);
                    _this.model.departments.push(temp);
                }
            }
            var tempEmployee = new TempEmployee();
            tempEmployee.status = TempEmployeeStatus.insert;
            _this.model.tempEmployees.push(tempEmployee);
            _this.view.updateView();
            _this.bindTable();
        });
    };
    EmployeeController.prototype.modifyTable = function () {
        var _this = this;
        this.model.tableStatus = TableStatus.allowModify;
        this.model.btnSearchStatus = BtnStatus.hidden;
        this.model.btnModifyStatus = BtnStatus.hidden;
        this.model.btnSaveStatus = BtnStatus.display;
        this.model.btnCancelStatus = BtnStatus.display;
        this.model.departments.length = 0;
        $.ajax({
            type: 'POST',
            url: '../Employee/GetAllDepartments',
            dataType: 'json'
        }).done(function (departments) {
            if (departments) {
                for (var _i = 0, departments_2 = departments; _i < departments_2.length; _i++) {
                    var department = departments_2[_i];
                    var temp = new Department(department.Name);
                    _this.model.departments.push(temp);
                }
            }
            for (var _a = 0, _b = _this.model.employees; _a < _b.length; _a++) {
                var employee = _b[_a];
                var temp = new TempEmployee();
                temp.employeeID = employee.employeeID;
                temp.employeeNumber = employee.employeeNumber;
                temp.name = employee.name;
                temp.department = employee.department;
                temp.jobTitle = employee.jobTitle;
                temp.hireDate = employee.hireDate;
                temp.status = TempEmployeeStatus.modify;
                _this.model.tempEmployees.push(temp);
            }
            _this.view.updateView();
            _this.bindTable();
        });
    };
    EmployeeController.prototype.saveTable = function () {
        var _this = this;
        if (!$('form').valid()) {
            return;
        }
        var changedEmployeeData = this.sortTempEmployeeData();
        this.clearEmployeeData();
        $.ajax({
            type: 'POST',
            url: '../Employee/ChangeData',
            data: changedEmployeeData,
            dataType: 'json'
        }).done(function (employees) {
            if (employees) {
                for (var _i = 0, employees_2 = employees; _i < employees_2.length; _i++) {
                    var employee = employees_2[_i];
                    var temp = new Employee(employee.EmployeeID, employee.EmployeeNumber, employee.Name, employee.Department, employee.JobTitle, employee.HireDate);
                    _this.model.employees.push(temp);
                }
            }
            _this.model.searchText = '';
            _this.model.tableStatus = TableStatus.onlyDisplay;
            _this.model.btnSearchStatus = BtnStatus.display;
            if (_this.model.employees.length) {
                _this.model.btnModifyStatus = BtnStatus.display;
            }
            _this.model.btnSaveStatus = BtnStatus.hidden;
            _this.model.btnCancelStatus = BtnStatus.hidden;
            _this.clearTempTable();
            _this.view.updateView();
        });
    };
    EmployeeController.prototype.cancelChanges = function () {
        this.model.tableStatus = TableStatus.onlyDisplay;
        this.model.btnSearchStatus = BtnStatus.display;
        this.model.btnSaveStatus = BtnStatus.hidden;
        this.model.btnCancelStatus = BtnStatus.hidden;
        this.clearTempTable();
        if (this.model.employees.length) {
            this.clearEmployeeData();
            this.view.updateView();
            this.searchEmployee();
        }
        else {
            this.view.updateView();
        }
    };
    EmployeeController.prototype.bindTable = function () {
        var _this = this;
        this.view.table.find('.delete').each(function (index, element) { return $(element).click(function () {
            if (_this.model.tempEmployees[index].status === TempEmployeeStatus.insert) {
                _this.model.tempEmployees.splice(index, 1);
            }
            else if (_this.model.tempEmployees[index].status === TempEmployeeStatus.modify) {
                _this.model.tempEmployees[index].status = TempEmployeeStatus.deleteOfModify;
            }
            else if (_this.model.tempEmployees[index].status === TempEmployeeStatus.update) {
                _this.model.tempEmployees[index].status = TempEmployeeStatus.deleteOfUpdate;
            }
            else if (_this.model.tempEmployees[index].status === TempEmployeeStatus.deleteOfModify) {
                _this.model.tempEmployees[index].status = TempEmployeeStatus.modify;
            }
            else if (_this.model.tempEmployees[index].status === TempEmployeeStatus.deleteOfUpdate) {
                _this.model.tempEmployees[index].status = TempEmployeeStatus.update;
            }
            _this.view.updateView();
            _this.bindTable();
        }); });
        this.view.table.find('.employeeNumber').each(function (index, element) { return $(element).change(function (event) {
            if (_this.model.tempEmployees[index].status === TempEmployeeStatus.modify) {
                _this.model.tempEmployees[index].status = TempEmployeeStatus.update;
            }
            _this.model.tempEmployees[index].employeeNumber = $(event.target).val();
        }); });
        this.view.table.find('.name').each(function (index, element) { return $(element).change(function (event) {
            if (_this.model.tempEmployees[index].status === TempEmployeeStatus.modify) {
                _this.model.tempEmployees[index].status = TempEmployeeStatus.update;
            }
            _this.model.tempEmployees[index].name = $(event.target).val();
        }); });
        this.view.table.find('.department').each(function (index, element) { return $(element).change(function (event) {
            if (_this.model.tempEmployees[index].status === TempEmployeeStatus.modify) {
                _this.model.tempEmployees[index].status = TempEmployeeStatus.update;
            }
            _this.model.tempEmployees[index].department = $(event.target).val();
        }); });
        this.view.table.find('.jobTitle').each(function (index, element) { return $(element).change(function (event) {
            if (_this.model.tempEmployees[index].status === TempEmployeeStatus.modify) {
                _this.model.tempEmployees[index].status = TempEmployeeStatus.update;
            }
            _this.model.tempEmployees[index].jobTitle = $(event.target).val();
        }); });
        this.view.table.find('.hireDate').each(function (index, element) { return $(element).change(function (event) {
            if (_this.model.tempEmployees[index].status === TempEmployeeStatus.modify) {
                _this.model.tempEmployees[index].status = TempEmployeeStatus.update;
            }
            _this.model.tempEmployees[index].hireDate = $(event.target).val();
        }); });
    };
    EmployeeController.prototype.clearEmployeeData = function () {
        this.model.employees.length = 0;
    };
    EmployeeController.prototype.clearTempTable = function () {
        this.model.tempEmployees.length = 0;
    };
    EmployeeController.prototype.sortTempEmployeeData = function () {
        var Data = {
            insert: new Array(),
            update: new Array(),
            delete: new Array()
        };
        for (var _i = 0, _a = this.model.tempEmployees; _i < _a.length; _i++) {
            var tempEmployee = _a[_i];
            var temp = new Employee(tempEmployee.employeeID, tempEmployee.employeeNumber, tempEmployee.name, tempEmployee.department, tempEmployee.jobTitle, tempEmployee.hireDate);
            if (tempEmployee.status === TempEmployeeStatus.insert) {
                Data.insert.push(temp);
            }
            else if (tempEmployee.status === TempEmployeeStatus.update) {
                Data.update.push(temp);
            }
            else if (tempEmployee.status === TempEmployeeStatus.deleteOfModify ||
                tempEmployee.status === TempEmployeeStatus.deleteOfUpdate) {
                Data.delete.push(temp);
            }
        }
        return Data;
    };
    return EmployeeController;
}());
//# sourceMappingURL=index.js.map