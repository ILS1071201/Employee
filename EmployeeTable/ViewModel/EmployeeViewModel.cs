using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace EmployeeTable.ViewModel
{
    public class EmployeeViewModel
    {
        public int EmployeeID { get; set; }
        public string EmployeeNumber { get; set; }
        public string Name { get; set; }
        public string Department { get; set; }
        public string JobTitle { get; set; }
        public string HireDate { get; set; }
    }

}