Feature: Playwright - Employee User - Edit an Absence
    Scenario: Playwright - Employee User - Edit an Absence
        Given Application is open in the browser
        When User logs in using "appUsername" and "appPassword"
        Then User is logged in successfully and is redirected to application homepage
        #Create Absence Reason
        And User navigate from "Reference Data" menu option to "Absence Reason"
        When User Create new "AT_Test_7772" with following "Vacation" "," and "Public to Employee"
        #Logout and Login
        And User Logout from application and logged in again with "appUsername" "appPassword"
        #Create Employeee and Impersonate as Employee
        And User navigate from "Master Data" menu option to "Employee" sub menu to "Absence History"
        Then User delete absence if exist for user last name "AT_Test_7772"
        And User navigate from "Master Data" menu option to "Employee" sub menu to "General Information"
        Then User delete employee if exist for user last name "AT_Test_7772"
        And User navigate from "Master Data" menu option to "Employee" sub menu to "General Information"
        When user creates employee with these details
        | firstName | 7772                    |
        | lastName  | AT_Test_7772            |
        | empId     | 7772                    |
        | wktId     | 286907                  |
        | listbox   | 363323                  |
        | homeInstId| 363323                  |
        | email     | automationUser@gmail.com|
        | gender    | Male                    |
        | startDate | 09/24/2019              |
        | endDate   | 09/25/2020              |
        | birthDate | 03/05/1993              |
        | jobType   | Teacher                 |
        | phone     | 4872325874              |
        | pin       | 89473                  |
        Then Employee is created successfully with first name "7772" and last name "AT_Test_7772"
        Then User Impersonate as Employee as firstName "7772" and lastName "AT_Test_7772"
        And User navigate from "Absences" menu option to "Create Absence"
        Then User Clicks on the Day Picker and Select Date as "1"
        And Employee Create new absence with following "AT_Test_7772" "8"
        And User Will click on Create Absence button
        And User click on ok button in confirmation pop-up
        Then User End the Impersonation
        And User navigate from "Master Data" menu option to "Employee" sub menu to "Absence History"
        Then User delete absence if exist for user last name "AT_Test_7772"
        
        