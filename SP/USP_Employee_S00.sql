SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[USP_Employee_S00]
    @I_CHR_SearchText VARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON

    SELECT E.EmployeeID, E.EmployeeNumber, E.Name, D.Name AS Department, E.JobTitle, E.HireDate
    FROM Employee AS E
        INNER JOIN Department AS D
        ON E.DepartmentNumber = D.DepartmentNumber
    WHERE E.EmployeeNumber like @I_CHR_SearchText + '%'

    SET NOCOUNT OFF
END
GO
