using EmployeeTable.ViewModel;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Data.SqlTypes;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Xml.Linq;

namespace EmployeeTable.Controllers
{
    public class EmployeeController : Controller
    {
        private readonly string _connectionString = System.Configuration.ConfigurationManager.ConnectionStrings["EmployeeDataEntities"].ConnectionString;

        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult SearchEmployees(string searchText)
        {
            var dt = new DataTable();
            using (var con = new SqlConnection(_connectionString))
            {
                var cmd = new SqlCommand("USP_Employee_S00", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@I_CHR_SearchText", SqlDbType.VarChar, 10).Value = searchText;
                con.Open();
                var reader = cmd.ExecuteReader();
                dt.Load(reader);
            }

            List<EmployeeViewModel> employeeViewModels = dt.AsEnumerable().Select(r => new EmployeeViewModel()
            {
                EmployeeID = r.Field<int>("EmployeeID"),
                EmployeeNumber = r.Field<string>("EmployeeNumber"),
                Name = r.Field<string>("Name"),
                Department = r.Field<string>("Department"),
                JobTitle = r.Field<string>("JobTitle"),
                HireDate = r.Field<DateTime>("HireDate").ToString("yyyy-MM-dd")
            }).ToList();

            return Json(employeeViewModels);
        }

        [HttpPost]
        public ActionResult GetAllDepartments()
        {
            var dt = new DataTable();
            using (var con = new SqlConnection(_connectionString))
            {
                var cmd = new SqlCommand("USP_Department_S00", con);
                cmd.CommandType = CommandType.StoredProcedure;
                con.Open();
                var reader = cmd.ExecuteReader();
                dt.Load(reader);
            }

            List<DepartmentViewModel> departmentViewModels = dt.AsEnumerable().Select(r => new DepartmentViewModel()
            {
                Name = r.Field<string>("Department")
            }).ToList();

            return Json(departmentViewModels);
        }

        [HttpPost]
        public ActionResult ChangeData(List<EmployeeViewModel> insert, List<EmployeeViewModel> update, List<EmployeeViewModel> delete)
        {
            var employees = new List<XElement>();
            if (delete != null)
            {
                foreach (var employee in delete)
                {
                    var row = new List<XElement> { new XElement("ActionID", "D") };
                    foreach (var property in typeof(EmployeeViewModel).GetProperties())
                    {
                        row.Add(new XElement(property.Name, property.GetValue(employee)));
                    }
                    employees.Add(new XElement("Employee", row));
                }
            }

            if (update != null)
            {
                foreach (var employee in update)
                {
                    var row = new List<XElement> { new XElement("ActionID", "U") };
                    foreach (var property in typeof(EmployeeViewModel).GetProperties())
                    {
                        row.Add(new XElement(property.Name, property.GetValue(employee)));
                    }
                    employees.Add(new XElement("Employee", row));
                }
            }

            if (insert != null)
            {
                foreach (var employee in insert)
                {
                    var row = new List<XElement> { new XElement("ActionID", "I") };
                    foreach (var property in typeof(EmployeeViewModel).GetProperties())
                    {
                        row.Add(new XElement(property.Name, property.GetValue(employee)));
                    }
                    employees.Add(new XElement("Employee", row));
                }
            }

            var root = new XElement("ROOT", employees);

            var sqlXML = new SqlXml(root.CreateReader());

            var dt = new DataTable();
            using (var con = new SqlConnection(_connectionString))
            {
                var cmd = new SqlCommand("USP_Employee_XML", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@I_XML_DATA", SqlDbType.Xml).Value = sqlXML;
                con.Open();
                var reader = cmd.ExecuteReader();
                dt.Load(reader);
            }

            List<EmployeeViewModel> employeeViewModels = dt.AsEnumerable().Select(r => new EmployeeViewModel()
            {
                EmployeeID = r.Field<int>("EmployeeID"),
                EmployeeNumber = r.Field<string>("EmployeeNumber"),
                Name = r.Field<string>("Name"),
                Department = r.Field<string>("Department"),
                JobTitle = r.Field<string>("JobTitle"),
                HireDate = r.Field<DateTime>("HireDate").ToString("yyyy-MM-dd")
            }).ToList();

            return Json(employeeViewModels);
        }
    }
}