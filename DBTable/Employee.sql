USE [EmployeeData]
GO

/****** Object:  Table [dbo].[Employee]    Script Date: 2019/1/4 ¤U¤È 04:50:27 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Employee](
	[EmployeeID] [int] IDENTITY(1,1) NOT NULL,
	[EmployeeNumber] [varchar](10) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[DepartmentNumber] [varchar](10) NOT NULL,
	[JobTitle] [nvarchar](50) NOT NULL,
	[HireDate] [date] NOT NULL,
 CONSTRAINT [PK_Employee] PRIMARY KEY CLUSTERED 
(
	[EmployeeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[Employee]  WITH CHECK ADD  CONSTRAINT [FK_Employee_Department_DepartmentNumber] FOREIGN KEY([DepartmentNumber])
REFERENCES [dbo].[Department] ([DepartmentNumber])
GO

ALTER TABLE [dbo].[Employee] CHECK CONSTRAINT [FK_Employee_Department_DepartmentNumber]
GO


