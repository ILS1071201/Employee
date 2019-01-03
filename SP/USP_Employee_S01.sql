USE [EmployeeData]
GO

/****** Object:  StoredProcedure [dbo].[USP_Employee_S01]    Script Date: 2019/1/3 ¤U¤È 04:09:36 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



CREATE PROCEDURE [dbo].[USP_Employee_S01]
    @I_CHR_SearchText VARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON

    SELECT E.EmployeeID, E.EmployeeNumber, E.Name, D.Name AS Department, E.JobTitle, E.HireDate
    FROM Employee AS E
        INNER JOIN Department AS D
        ON E.DepartmentNumber = D.DepartmentNumber
    WHERE E.Name like '%' + @I_CHR_SearchText + '%'

    SET NOCOUNT OFF
END
GO


