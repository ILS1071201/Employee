SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[USP_Employee_U00]
    @I_INT_EmployeeID		INT,
    @I_CHR_EmployeeNumber   VARCHAR(10),
    @I_CHR_Name             NVARCHAR(50),
    @I_CHR_DepartmentNumber VARCHAR(10),
    @I_CHR_JobTitle         NVARCHAR(50),
    @I_DTE_HireDate         DATE
AS
BEGIN
    SET NOCOUNT ON

    IF NOT EXISTS(SELECT 1
    FROM Employee WITH (NOLOCK)
    WHERE EmployeeID = @I_INT_EmployeeID
        AND EmployeeNumber = @I_CHR_EmployeeNumber
        AND Name = @I_CHR_Name
        AND DepartmentNumber = @I_CHR_DepartmentNumber
        AND JobTitle = @I_CHR_JobTitle
        AND HireDate = @I_DTE_HireDate
    )
    BEGIN
        UPDATE dbo.Employee
		SET EmployeeNumber = @I_CHR_EmployeeNumber,
			Name = @I_CHR_Name,
			DepartmentNumber = @I_CHR_DepartmentNumber,
			JobTitle = @I_CHR_JobTitle,
			HireDate = @I_DTE_HireDate
        WHERE EmployeeID = @I_INT_EmployeeID
    END

    IF (@@ROWCOUNT = 1)
	BEGIN
        RETURN @I_INT_EmployeeID
    END
    RETURN 0

    SET NOCOUNT OFF
END
GO
