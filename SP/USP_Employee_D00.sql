SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[USP_Employee_D00]
	@I_INT_EmployeeID		INT,
    @I_CHR_EmployeeNumber   VARCHAR(10),
    @I_CHR_Name             NVARCHAR(50),
    @I_CHR_DepartmentNumber VARCHAR(10),
    @I_CHR_JobTitle         NVARCHAR(50),
    @I_DTE_HireDate         DATE
AS
BEGIN
	SET NOCOUNT ON

    DELETE FROM dbo.Employee
        WHERE EmployeeID = @I_INT_EmployeeID
		AND	EmployeeNumber = @I_CHR_EmployeeNumber
		AND Name = @I_CHR_Name
		AND DepartmentNumber = @I_CHR_DepartmentNumber
		AND JobTitle = @I_CHR_JobTitle
		AND HireDate = @I_DTE_HireDate

	IF (@@ERROR <> 0)
	BEGIN
		RETURN 0
	END
    RETURN @I_INT_EmployeeID

	SET NOCOUNT OFF
END
GO
