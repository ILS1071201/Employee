using System.Web.Mvc;

namespace EmployeeTable.Controllers
{
    public class HomeController : Controller
    {
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

        //[HttpPost]
        //public ActionResult ReadData(List<EmployeeViewModel> employeeList)
        //{
        //    string json = JsonConvert.SerializeObject(employeeList, Formatting.Indented);
        //    DataTable dt = (DataTable)JsonConvert.DeserializeObject(json, (typeof(DataTable)));
        //    string dtToJson = JsonConvert.SerializeObject(dt, Formatting.Indented);

        //    return Content(dtToJson);
        //}

        
    }
}