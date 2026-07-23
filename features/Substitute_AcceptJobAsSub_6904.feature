Feature:Playwright - Sub - Accept Job

    @AcceptJobAsSub @SmokeTest @HCMAT-6904 @HCMAT-8054
    Scenario: Playwright - Sub - Accept Job
        Given Application is open in the browser
        When User logs in using "appUsername" and "appPassword"
        Then User is logged in successfully and is redirected to application homepage
        #Create Employee
        And User navigate from "Master Data" menu option to "Employee" sub menu to "Add"
        When user creates employee with these details
        | firstName | 6904                    |
        | lastName  | AT_Test_6904            |
        | empId     | 6904                    |
        | wktId     | 286907                  |
        | listbox   | 363323                  |
        | homeInstId| 363323                  |
        | email     | automationUser@gmail.com|
        | gender    | Male                    |
        | startDate | 09/24/2019              |
        | endDate   | 09/25/2020              |
        | birthDate | 03/05/1993              |
        | jobType   | Teacher                 |
        | phone     | 4876500874              |
        | pin       | 68003                   |
        Then Employee is created successfully with first name "6904" and last name "AT_Test_6904"
        And User navigate from "Master Data" menu option to "Substitute" sub menu to "Add"
        When user creates substitute with these details
        | firstName | Sub_6904                    |
        | lastName  | Sub_6904            |
        | email     | automationUser1@gmail.com|
        | dateOfJoin| 09/24/2019              |
        | birthDate | 03/05/1993              |
        | phone     | 4878980874              |
        | pin       | 79083                   |
        | identifier| 16904                   |
        | School    |Global Logic STAGE Org 2 11AB025A-EE18-43D5-9082-4|
        Then Substitute is created successfully with first name "Sub_6904" and last name "Sub_6904"
        And User navigate from "Reference Data" menu option to "Absence Reasons" sub menu to ""
        And User Create new absence reason as "AR_Auto_6904" with following "Vacation" "," and "Public to Employee"
        And User navigate from "Master Data" menu option to "Employee" sub menu to "General Information"
        And User search for employee with last name as "AT_Test_6904"
        Then User Impersonate as Employee as firstName "6904" and lastName "AT_Test_6904"
        And User navigate from "Absences" menu option to "Create Absence" sub menu to ""
        Then User Clicks on the Day Picker and Select Date as "1"
        And Employee Create new absence with following "AR_Auto_6904" "8"
        And User Will click on Create Absence button
        And User click on ok button in confirmation pop-up
        Then User End the Impersonation
        And User navigate from "Master Data" menu option to "Substitute" sub menu to "General Information"
        And User search for employee with last name as "Sub_6904"
        Then User Impersonate as Employee as firstName "Sub_6904" and lastName "Sub_6904"
        And Accept the job where lastname is "AT_Test_6904"

        
