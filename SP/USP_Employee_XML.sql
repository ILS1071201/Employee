SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[USP_Employee_XML]
    @I_XML_DATA         XML
AS
CREATE TABLE #TEMP_Employee
(
    ActionID VARCHAR(1),
    EmployeeID INT,
    EmployeeNumber VARCHAR(10),
    Name NVARCHAR(50),
    Department VARCHAR(50),
    JobTitle NVARCHAR(50),
    HireDate DATE
)

CREATE TABLE #TEMP_Result
(
    ActionID VARCHAR(1),
    EmployeeID INT
)

BEGIN
    DECLARE @CHR_ActionID           VARCHAR(1),
            @INT_EmployeeID		    INT,
            @CHR_EmployeeNumber     VARCHAR(10),
            @CHR_Name               NVARCHAR(50),
            @CHR_Department         VARCHAR(50),
            @CHR_JobTitle           NVARCHAR(50),
            @DTE_HireDate           DATE,
            @CHR_DepartmentNumber   VARCHAR(10)

    DECLARE @INT_IDOC               INT

    SET NOCOUNT ON

    EXEC sp_xml_preparedocument @INT_IDOC OUTPUT, @I_XML_DATA

    INSERT INTO #TEMP_Employee
        (ActionID, EmployeeID, EmployeeNumber, Name, Department, JobTitle, HireDate)
    SELECT ActionID, EmployeeID, EmployeeNumber, Name, Department, JobTitle, HireDate
    FROM OPENXML(@INT_IDOC, '/ROOT/Employee', 2) WITH #TEMP_Employee

    EXEC sp_xml_removedocument @INT_IDOC

    DECLARE GET_Employee CURSOR LOCAL FOR
    SELECT ActionID, EmployeeID, EmployeeNumber, Name, Department, JobTitle, HireDate
    FROM #TEMP_Employee

    OPEN GET_Employee
    FETCH GET_Employee INTO @CHR_ActionID, @INT_EmployeeID, @CHR_EmployeeNumber, @CHR_Name, @CHR_Department, @CHR_JobTitle, @DTE_HireDate
    WHILE(@@FETCH_STATUS = 0)
    BEGIN
        SET @CHR_DepartmentNumber = (SELECT DepartmentNumber
        FROM Department
        WHERE Name = @CHR_Department)

        IF @CHR_ActionID = 'D'
        BEGIN
            BEGIN TRY
            EXEC USP_Employee_D00 @INT_EmployeeID, @CHR_EmployeeNumber, @CHR_Name, @CHR_DepartmentNumber, @CHR_JobTitle, @DTE_HireDate
            END TRY
            BEGIN CATCH

            END CATCH
        END

        IF @CHR_ActionID = 'U'
        BEGIN
            BEGIN TRY
            EXEC USP_Employee_U00 @INT_EmployeeID, @CHR_EmployeeNumber, @CHR_Name, @CHR_DepartmentNumber, @CHR_JobTitle, @DTE_HireDate
            
            INSERT INTO #TEMP_Result
                (ActionID, EmployeeID)
            VALUES(@CHR_ActionID, @INT_EmployeeID)
            END TRY
            BEGIN CATCH

            END CATCH
        END

        IF @CHR_ActionID = 'I'
        BEGIN
            BEGIN TRY
            EXEC USP_Employee_I00 @CHR_EmployeeNumber, @CHR_Name, @CHR_DepartmentNumber, @CHR_JobTitle, @DTE_HireDate
            
            INSERT INTO #TEMP_Result
                (ActionID, EmployeeID)
            VALUES(@CHR_ActionID, @INT_EmployeeID)
            END TRY
            BEGIN CATCH
        
            END CATCH
        END
        FETCH GET_Employee INTO @CHR_ActionID, @INT_EmployeeID, @CHR_EmployeeNumber, @CHR_Name, @CHR_Department, @CHR_JobTitle, @DTE_HireDate
    END
    CLOSE GET_Employee
    DEALLOCATE GET_Employee
    DROP TABLE #TEMP_Employee


    SELECT E.EmployeeID, E.EmployeeNumber, E.Name, D.Name AS Department, E.JobTitle, E.HireDate
    FROM (SELECT E.EmployeeID, EmployeeNumber, E.Name, E.DepartmentNumber, E.JobTitle, E.HireDate
        FROM Employee AS E
            INNER JOIN #TEMP_Result AS T
            ON E.EmployeeID = T.EmployeeID) AS E
        INNER JOIN Department AS D
        ON E.DepartmentNumber = D.DepartmentNumber

    DROP TABLE #TEMP_Result
    SET NOCOUNT OFF
    RETURN
END
GO
