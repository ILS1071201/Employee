SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[USP_Employee_I00]
    @I_CHR_EmployeeNumber   VARCHAR(10),
    @I_CHR_Name             NVARCHAR(50),
    @I_CHR_DepartmentNumber VARCHAR(10),
    @I_CHR_JobTitle         NVARCHAR(50),
    @I_DTE_HireDate         DATE
AS
BEGIN
	SET NOCOUNT ON

    IF EXISTS (SELECT 1
    FROM dbo.Employee
    WHERE EmployeeNumber = @I_CHR_EmployeeNumber)
    BEGIN
        RETURN 0
    END

    INSERT INTO dbo.Employee(
        EmployeeNumber,
        Name,
        DepartmentNumber,
        JobTitle,
        HireDate)
    VALUES(
            @I_CHR_EmployeeNumber,
            @I_CHR_Name,
            @I_CHR_DepartmentNumber,
            @I_CHR_JobTitle,
            @I_DTE_HireDate)
    RETURN SCOPE_IDENTITY()

	SET NOCOUNT OFF
END
GO
