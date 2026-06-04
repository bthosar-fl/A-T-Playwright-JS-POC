Feature: Playwright - Employee User - create an Absence
    Scenario: Playwright - Employee User - create an Absence
        Given Application is open in the browser
        When User logs in using "appUsername" and "appPassword"
        Then User is logged in successfully and is redirected to application homepage
        #Create Absence Reason
        And User navigate from "Reference Data" menu option to "Absence Reason"
        When User Create new "AR_Test_6903" with following "Vacation" "," and "Public to Employee"
        #Logout and Login
        And User Logout from application and logged in again with "appUsername" "appPassword"
        #Create Employeee and Impersonate as Employee
        And User navigate from "Master Data" menu option to "Employee" sub menu to "General Information"
        When user creates employee with required details
        Then Employee is created successfully
        And User Impersonate as Employee
        And User navigate from "Absences" menu option to "Create Absence"
        #And User Selects the Date as "currentDate+1"
        And User Clicks on the Day Picker and Select Date as "1"
        And Employee Create new absence with following "AR_Test_6903" "4"
        And User Will click on Create Absence button
        Then Absence is created with the reason
        And User End the Impersonation
