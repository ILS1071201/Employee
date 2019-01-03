$(document).ready(initialize);

function initialize() {
    const model = new EmployeeViewModel();
    const view = new EmployeeView(model);
    const controller = new EmployeeController(model, view);
}

class Employee {
    employeeID: number | null;
    employeeNumber: string;
    name: string;
    department: string;
    jobTitle: string;
    hireDate: string;

    constructor(employeeID: number, employeeNumber: string, name: string, department: string, jobTitle: string, hireDate: string) {
        this.employeeID = employeeID;
        this.employeeNumber = employeeNumber;
        this.name = name;
        this.department = department;
        this.jobTitle = jobTitle;
        this.hireDate = hireDate;
    }
}

class Department {
    name: string;

    constructor(name: string) {
        this.name = name;
    }
}

class TempEmployee extends Employee {
    status: TempEmployeeStatus;

    constructor() {
        super(null, '', '', '', '', '');
        this.status = TempEmployeeStatus.modify;
    }
}

enum TempEmployeeStatus {
    modify,
    insert,
    update,
    delete
}

enum BtnStatus {
    display,
    hidden
}

enum TableStatus {
    onlyDisplay,
    allowModify
}

interface InsertUpdateDeleteCollection {
    insert: Array<Employee>,
    update: Array<Employee>,
    delete: Array<Employee>
}

class EmployeeViewModel {
    employees: Array<Employee>;
    departments: Array<Department>;
    tempEmployees: Array<TempEmployee>;
    searchText: string;
    btnSearchStatus: BtnStatus;
    btnAddStatus: BtnStatus;
    btnModifyStatus: BtnStatus;
    btnSaveStatus: BtnStatus;
    btnCancelStatus: BtnStatus;
    tableStatus: TableStatus;

    constructor() {
        this.employees = new Array<Employee>();
        this.departments = new Array<Department>();
        this.tempEmployees = new Array<TempEmployee>();
        this.searchText = '';
        this.btnSearchStatus = BtnStatus.display;
        this.btnAddStatus = BtnStatus.display;
        this.btnModifyStatus = BtnStatus.hidden;
        this.btnSaveStatus = BtnStatus.hidden;
        this.btnCancelStatus = BtnStatus.hidden;
        this.tableStatus = TableStatus.onlyDisplay;
    }
}

class EmployeeView {
    model: EmployeeViewModel;
    search: JQuery;
    btnSearch: JQuery;
    btnAdd: JQuery;
    btnModify: JQuery;
    btnSave: JQuery;
    btnCancel: JQuery;
    table: JQuery;

    constructor(model: EmployeeViewModel) {
        this.model = model;
        this.bindHtml();
    }

    bindHtml() {
        this.search = $('#searchText');
        this.btnSearch = $('#btnSearch');
        this.btnAdd = $('#btnAdd');
        this.btnModify = $('#btnModify');
        this.btnSave = $('#btnSave');
        this.btnCancel = $('#btnCancel');
        this.table = $('#tableBody');
    }

    updateView() {
        if (this.model.btnSearchStatus === BtnStatus.display) {
            this.search.removeClass('d-none');
            this.btnSearch.removeClass('d-none');
        } else if (this.model.btnSearchStatus === BtnStatus.hidden) {
            this.search.addClass('d-none');
            this.btnSearch.addClass('d-none');
        }

        if (this.model.btnModifyStatus === BtnStatus.display) {
            this.btnModify.removeClass('d-none');
        } else if (this.model.btnModifyStatus === BtnStatus.hidden) {
            this.btnModify.addClass('d-none');
        }

        if (this.model.btnSaveStatus === BtnStatus.display) {
            this.btnSave.removeClass('d-none');
        } else if (this.model.btnSaveStatus === BtnStatus.hidden) {
            this.btnSave.addClass('d-none');
        }

        if (this.model.btnCancelStatus === BtnStatus.display) {
            this.btnCancel.removeClass('d-none');
        } else if (this.model.btnCancelStatus === BtnStatus.hidden) {
            this.btnCancel.addClass('d-none');
        }

        if (this.model.tableStatus === TableStatus.onlyDisplay) {
            this.showTable();
        } else if (this.model.tableStatus === TableStatus.allowModify) {
            this.showInputTable();
        }

        this.search.val(this.model.searchText);
    }

    showTable() {
        let htmlEmployeeList = '';

        for (let i = 0; i < this.model.employees.length; i++) {
            htmlEmployeeList +=
                `<tr>
                    <th scope="row">${i + 1}</th>
                    <td>${this.model.employees[i].employeeNumber}</td>
                    <td>${this.model.employees[i].name}</td>
                    <td>${this.model.employees[i].department}</td>
                    <td>${this.model.employees[i].jobTitle}</td>
                    <td>${this.model.employees[i].hireDate}</td>
                </tr>`
        }

        this.table.html(htmlEmployeeList);
    }

    showInputTable() {
        let htmlEmployeeInputList = '';

        for (let i = 0; i < this.model.tempEmployees.length; i++) {
            let display = '';
            if (this.model.tempEmployees[i].status === TempEmployeeStatus.delete) {
                display = 'd-none';
            }

            let htmlDepartmentOptions = '';
            if (!this.model.tempEmployees[i].department) {
                htmlDepartmentOptions += `<option value="" selected></option>`;
            }
            for (const department of this.model.departments) {
                if (department.name === this.model.tempEmployees[i].department) {
                    htmlDepartmentOptions += `<option value="${department.name}" selected>${department.name}</option>`;
                } else {
                    htmlDepartmentOptions += `<option value="${department.name}">${department.name}</option>`;
                }
            }

            htmlEmployeeInputList +=
                `<tr class="${display}">
                    <th scope="row">
                        <button type="button" class="btn btn-secondary btn-sm delete idx${i}">X</button>
                    </th>
                    <td>
                        <input type="text" class="form-control employeeNumber idx${i}" value="${this.model.tempEmployees[i].employeeNumber}" required>
                    </td>
                    <td>
                        <input type="text" class="form-control name idx${i}" value="${this.model.tempEmployees[i].name}" required>
                    </td>
                    <td>
                        <select class="form-control department idx${i}" required>
                            ${htmlDepartmentOptions}
                        </select>
                    </td>
                    <td>
                        <input type="text" class="form-control jobTitle idx${i}" value="${this.model.tempEmployees[i].jobTitle}" required>
                    </td>
                    <td>
                        <input type="date" class="form-control hireDate idx${i}" value="${this.model.tempEmployees[i].hireDate}" required>
                    </td>
                </tr>`
        }

        this.table.html(htmlEmployeeInputList);
    }

}

class EmployeeController {
    model: EmployeeViewModel;
    view: EmployeeView;

    constructor(model: EmployeeViewModel, view: EmployeeView) {
        this.model = model;
        this.view = view;
        this.subscribeEvents();
        this.view.updateView();
    }

    subscribeEvents() {
        this.view.search.change(() => this.model.searchText = this.view.search.val());
        this.view.btnSearch.click(() => this.searchEmployee());
        this.view.btnAdd.click(() => this.addTableRow());
        this.view.btnModify.click(() => this.modifyTable());
        this.view.btnSave.click(() => this.saveTable());
        this.view.btnCancel.click(() => this.cancelChanges());
    }

    searchEmployee() {
        this.clearEmployeeData();
        let data = {
            searchText: this.model.searchText
        }

        $.ajax({
            type: 'POST',
            url: '../Employee/SearchEmployees',
            data: data,
            dataType: 'json'
        }).done((employees) => {
            if (employees) {
                for (const employee of employees) {
                    let temp = new Employee(
                        employee.EmployeeID,
                        employee.EmployeeNumber,
                        employee.Name,
                        employee.Department,
                        employee.JobTitle,
                        employee.HireDate)

                    this.model.employees.push(temp);
                }
                this.model.btnModifyStatus = BtnStatus.display;
            }

            this.view.updateView();
        });
    }

    addTableRow() {
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
        }).done((departments) => {
            if (departments) {
                for (const department of departments) {
                    let temp = new Department(department.Name);

                    this.model.departments.push(temp);
                }
            }

            let tempEmployee = new TempEmployee();
            tempEmployee.status = TempEmployeeStatus.insert;
            this.model.tempEmployees.push(tempEmployee);

            this.view.updateView();
            this.bindTable();

        });
    }

    modifyTable() {
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
        }).done((departments) => {
            if (departments) {
                for (const department of departments) {
                    let temp = new Department(department.Name);

                    this.model.departments.push(temp);
                }
            }

            for (const employee of this.model.employees) {
                let temp = new TempEmployee();
                temp.employeeID = employee.employeeID;
                temp.employeeNumber = employee.employeeNumber;
                temp.name = employee.name;
                temp.department = employee.department;
                temp.jobTitle = employee.jobTitle;
                temp.hireDate = employee.hireDate;
                temp.status = TempEmployeeStatus.modify;

                this.model.tempEmployees.push(temp);
            }

            this.view.updateView();
            this.bindTable();

        });

    }

    saveTable() {
        if (!$('form').valid()) {
            return;
        }

        const changedEmployeeData = this.sortTempEmployeeData();

        this.clearEmployeeData();

        $.ajax({
            type: 'POST',
            url: '../Employee/ChangeData',
            data: changedEmployeeData,
            dataType: 'json'
        }).done((employees) => {
            if (employees) {
                for (const employee of employees) {
                    let temp = new Employee(
                        employee.EmployeeID,
                        employee.EmployeeNumber,
                        employee.Name,
                        employee.Department,
                        employee.JobTitle,
                        employee.HireDate)

                    this.model.employees.push(temp);
                }
            }

            this.model.searchText = '';
            this.model.tableStatus = TableStatus.onlyDisplay;
            this.model.btnSearchStatus = BtnStatus.display;
            if (this.model.employees.length) {
                this.model.btnModifyStatus = BtnStatus.display;
            }
            this.model.btnSaveStatus = BtnStatus.hidden;
            this.model.btnCancelStatus = BtnStatus.hidden;
            this.clearTempTable();
            this.view.updateView();
        });

    }

    cancelChanges() {
        this.model.tableStatus = TableStatus.onlyDisplay;
        this.model.btnSearchStatus = BtnStatus.display;
        this.model.btnSaveStatus = BtnStatus.hidden;
        this.model.btnCancelStatus = BtnStatus.hidden;
        this.clearTempTable();

        if (this.model.employees.length) {
            this.clearEmployeeData();
            this.view.updateView();
            this.searchEmployee();
        } else {
            this.view.updateView();
        }

    }

    bindTable() {
        this.view.table.find('.delete').each((index, element) => $(element).click(() => {
            if (this.model.tempEmployees[index].status === TempEmployeeStatus.insert) {
                this.model.tempEmployees.splice(index, 1);
            } else {
                this.model.tempEmployees[index].status = TempEmployeeStatus.delete;
            }
            this.view.updateView();
            this.bindTable();
        }));

        this.view.table.find('.employeeNumber').each((index, element) => $(element).change((event) => {
            if (this.model.tempEmployees[index].status === TempEmployeeStatus.modify) {
                this.model.tempEmployees[index].status = TempEmployeeStatus.update;
            }
            this.model.tempEmployees[index].employeeNumber = $(event.target).val();
        }));

        this.view.table.find('.name').each((index, element) => $(element).change((event) => {
            if (this.model.tempEmployees[index].status === TempEmployeeStatus.modify) {
                this.model.tempEmployees[index].status = TempEmployeeStatus.update;
            }
            this.model.tempEmployees[index].name = $(event.target).val();
        }));

        this.view.table.find('.department').each((index, element) => $(element).change((event) => {
            if (this.model.tempEmployees[index].status === TempEmployeeStatus.modify) {
                this.model.tempEmployees[index].status = TempEmployeeStatus.update;
            }
            this.model.tempEmployees[index].department = $(event.target).val();
        }));

        this.view.table.find('.jobTitle').each((index, element) => $(element).change((event) => {
            if (this.model.tempEmployees[index].status === TempEmployeeStatus.modify) {
                this.model.tempEmployees[index].status = TempEmployeeStatus.update;
            }
            this.model.tempEmployees[index].jobTitle = $(event.target).val()
        }));

        this.view.table.find('.hireDate').each((index, element) => $(element).change((event) => {
            if (this.model.tempEmployees[index].status === TempEmployeeStatus.modify) {
                this.model.tempEmployees[index].status = TempEmployeeStatus.update;
            }
            this.model.tempEmployees[index].hireDate = $(event.target).val()
        }));
    }

    clearEmployeeData() {
        this.model.employees.length = 0;
    }

    clearTempTable() {
        this.model.tempEmployees.length = 0;
    }

    sortTempEmployeeData(): InsertUpdateDeleteCollection {
        let Data = {
            insert: new Array<Employee>(),
            update: new Array<Employee>(),
            delete: new Array<Employee>()
        }

        for (const tempEmployee of this.model.tempEmployees) {
            let temp = new Employee(
                tempEmployee.employeeID,
                tempEmployee.employeeNumber,
                tempEmployee.name,
                tempEmployee.department,
                tempEmployee.jobTitle,
                tempEmployee.hireDate)

            if (tempEmployee.status === TempEmployeeStatus.insert) {
                Data.insert.push(temp);
            } else if (tempEmployee.status === TempEmployeeStatus.update) {
                Data.update.push(temp);
            } else if (tempEmployee.status === TempEmployeeStatus.delete) {
                Data.delete.push(temp);
            }
        }
        return Data;
    }

}