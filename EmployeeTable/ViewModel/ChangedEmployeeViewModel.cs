using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EmployeeTable.ViewModel
{
    public class ChangedEmployeeViewModel
    {
        public List<EmployeeViewModel> InsertData { get; set; }
        public List<EmployeeViewModel> UpdateData { get; set; }
        public List<EmployeeViewModel> DeleteData { get; set; }
    }
}