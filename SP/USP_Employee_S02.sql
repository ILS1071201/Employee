USE [EmployeeData]
GO

/****** Object:  StoredProcedure [dbo].[USP_Employee_S02]    Script Date: 2019/1/4 ¤U¤È 04:50:01 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO






CREATE PROCEDURE [dbo].[USP_Employee_S02]
	@I_CHR_EmployeeNumber	VARCHAR(10),
	@I_CHR_Name				NVARCHAR(50),
	@I_CHR_Department		NVARCHAR(50)
AS
BEGIN
	SET NOCOUNT ON

	SELECT E.EmployeeID, E.EmployeeNumber, E.Name, D.Name AS Department, E.JobTitle, E.HireDate
	FROM dbo.Employee AS E
	JOIN dbo.Department AS D
	ON E.DepartmentNumber = D.DepartmentNumber
	WHERE E.EmployeeNumber LIKE '%' + @I_CHR_EmployeeNumber + '%' AND E.Name LIKE '%' + @I_CHR_Name + '%' AND D.Name LIKE '%' + @I_CHR_Department + '%'

	SET NOCOUNT OFF
END
GO


