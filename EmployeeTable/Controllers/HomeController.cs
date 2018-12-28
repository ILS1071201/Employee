using EmployeeTable.ViewModel;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Xml;
using System.Xml.Serialization;

namespace EmployeeTable.Controllers
{
    public class HomeController : Controller
    {
        private readonly string _connectionString =  System.Configuration.ConfigurationManager.ConnectionStrings["EmployeeDataEntities"].ConnectionString;

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        [HttpPost]
        public ActionResult Data(string searchText)
        {
            DataTable dt = new DataTable();
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                SqlCommand cmd = new SqlCommand("USP_Employee_S00", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@I_CHR_SearchText", SqlDbType.VarChar, 10).Value = searchText;
                con.Open();
                SqlDataReader reader = cmd.ExecuteReader();
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
        public ActionResult Department()
        {
            DataTable dt = new DataTable();
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                SqlCommand cmd = new SqlCommand("USP_Department_S00", con);
                cmd.CommandType = CommandType.StoredProcedure;
                con.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                dt.Load(reader);
            }

            List<DepartmentViewModel> departmentViewModels = dt.AsEnumerable().Select(r => new DepartmentViewModel()
            {
                Name = r.Field<string>("Department")
            }).ToList();

            return Json(departmentViewModels);
        }

        //[HttpPost]
        //public ActionResult ReadData(List<EmployeeViewModel> employeeList)
        //{
        //    string json = JsonConvert.SerializeObject(employeeList, Formatting.Indented);
        //    DataTable dt = (DataTable)JsonConvert.DeserializeObject(json, (typeof(DataTable)));
        //    string dtToJson = JsonConvert.SerializeObject(dt, Formatting.Indented);

        //    return Content(dtToJson);
        //}

        [HttpPost]
        public ActionResult ChangeData(List<EmployeeViewModel> insert, List<EmployeeViewModel> update, List<EmployeeViewModel> delete)
        {
            XmlDocument doc = new XmlDocument();
            XmlElement EInsert = doc.CreateElement("insert");
            XmlElement EUpdate = doc.CreateElement("update");
            XmlElement EDelete = doc.CreateElement("delete");

            //foreach (var item in insert)
            //{
            //    EInsert.SetAttribute(nameof(item.EmployeeID), item.EmployeeID.ToString());
            //    EInsert.SetAttribute(nameof(item.EmployeeNumber), item.EmployeeNumber.ToString());
            //    EInsert.SetAttribute(nameof(item.Name), item.Name.ToString());
            //    EInsert.SetAttribute(nameof(item.Department), item.Department.ToString());
            //    EInsert.SetAttribute(nameof(item.JobTitle), item.JobTitle.ToString());
            //    EInsert.SetAttribute(nameof(item.HireDate), item.HireDate.ToString());
            //}
            foreach (var item in update)
            {
                EInsert.SetAttribute(nameof(item.EmployeeID), item.EmployeeID.ToString());
                EInsert.SetAttribute(nameof(item.EmployeeNumber), item.EmployeeNumber.ToString());
                EInsert.SetAttribute(nameof(item.Name), item.Name.ToString());
                EInsert.SetAttribute(nameof(item.Department), item.Department.ToString());
                EInsert.SetAttribute(nameof(item.JobTitle), item.JobTitle.ToString());
                EInsert.SetAttribute(nameof(item.HireDate), item.HireDate.ToString());
            }
            //foreach (var item in delete)
            //{
            //    EInsert.SetAttribute(nameof(item.EmployeeID), item.EmployeeID.ToString());
            //    EInsert.SetAttribute(nameof(item.EmployeeNumber), item.EmployeeNumber.ToString());
            //    EInsert.SetAttribute(nameof(item.Name), item.Name.ToString());
            //    EInsert.SetAttribute(nameof(item.Department), item.Department.ToString());
            //    EInsert.SetAttribute(nameof(item.JobTitle), item.JobTitle.ToString());
            //    EInsert.SetAttribute(nameof(item.HireDate), item.HireDate.ToString());
            //}

            return Content(doc.InnerText);
        }

    }
}