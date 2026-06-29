Feature: Playwright - Employee User - Edit an Absence
    @smoke
    Scenario: Playwright - Employee User - Edit an Absence
        Given Application is open in the browser
        When User logs in using "appUsername" and "appPassword"
        Then User is logged in successfully and is redirected to application homepage
        #Create Absence Reason
        And User navigate from "Reference Data" menu option to "Absence Reason"
        When User Create new "AR_Test_7621" with following "Vacation" "," and "Public to Employee"
        #Logout and Login
        And User Logout from application and logged in again with "appUsername" "appPassword"
        #Create Employeee and Impersonate as Employee
        And User navigate from "Master Data" menu option to "Employee" sub menu to "General Information"
        When user creates employee with these details
        | firstName | 7261                    |
        | lastName  | AT_Test_7261            |
        | empId     | 7261                    |
        | wktId     | 286907                  |
        | listbox   | 363323                  |
        | homeInstId| 363323                  |
        | email     | automationUser@gmail.com|
        | gender    | Male                    |
        | startDate | 09/24/2019              |
        | endDate   | 09/25/2020              |
        | birthDate | 03/05/1993              |
        | jobType   | Teacher                 |
        | phone     | 4892145874              |
        | pin       | 84913                  |
        Then Employee is created successfully with first name "7261" and last name "AT_Test_7261"
        Then User Impersonate as Employee as firstName "7261" and lastName "AT_Test_7261"
        And User navigate from "Absences" menu option to "Create Absence"
        #And User Selects the Date as "currentDate+1"
        Then User Clicks on the Day Picker and Select Date as "1"
        And Employee Create new absence with following "AR_Test_7621" "8"
        And User Will click on Create Absence button
        And User click on ok button in confirmation pop-up
        And User Click on edit absence
        And User clear the Notes to Administrator and update as "Updated Notes to Administrator" 
        And User click on save absence button
        And Verify that the Notes to Administrator is updated successfully with "Updated Notes to Administrator"
        #Then Delete the absence created by the employee
        
