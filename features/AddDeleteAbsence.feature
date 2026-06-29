Feature: Playwright - React - Employee - Absence Reason Page

    @OU_VerifyAbsenceReasonAdditionAndDeletion @Regression_Test @HCMAT-23443
    Scenario: Playwright - React - Employee - Absence Reason Page
        Given Application is open in the browser
        When User logs in using "reactAppUserName" and "reactAppPassword"
        Then User is logged in successfully and is redirected to application homepage
        # Creating an Absence Reason
        And User navigate from "Reference Data" menu option to "Absence Reason"
        When User create new react "AR_Auto_23443" with following "Vacation" "," and "Needs Approval,Enforce Balances" "React-Automation School"
        # Verify creating an employee
        And User navigate from "Master Data" menu option to "Employee" sub menu to "General Information" through UI
        When User creates react employee with "23443" "Emp_Auto_23443" "automationUser23443@gmail.com" "Male" "09/24/2019" "09/25/2020" "03/05/1993" "Teacher" "2987654776" "50494" "IDT_23443" "React-Automation School" "Accounting Code" "Budget Code"
        Then user clicks the save button
        And User verify the Toast message for "Add" "Employee" "The employee has been successfully added."
        # Opening Absence Reason page & Verifying created absence reason should not exist initially
        And User clicks Absence Reason tab
        And User verifies the title of the react "Absence Reason" page
        Then User verifies absence reason "AR_Auto_23443" is "not available" under "home page" tab
        # Adding newly created absence reason
        And User clicks Add Absence Reasons link on the absence reasons page
        Then User verifies absence reason "AR_Auto_23443" is "available" under "Add Absence Reasons page" tab
        Then User includes the absence reason "AR_Auto_23443" in the selection
        # Opening Absence Reason page & Verifying created absence reason should exist
        And User clicks return to Absence Reason tab
        And User verifies the title of the react "Absence Reason" page
        Then User verifies absence reason "AR_Auto_23443" is "available" under "home page" tab
        And User verifies the grid fields on react Employee "Absence Reason" Page
            | field                      | value         |
            | reactEmpAbsencereason      | AR_Auto_23443 |
            | reactTrackingType          | Daily         |
            | reactInitialBalance        | 0             |
            | absenceReasonAsOf          | currentDate   |
            | reactTimeUsed              | 0             |
            | reactCurrentbalanceBalance | 0             |
            | reatTimeFromPendingAbsence | 0             |
        #User Add Initial Absence Reason Balance
        And User "add Initial" Absence reason balance "10" and Exisitng balance "5" with as Of date "currentDate"
        #User Verify the Absence Reason Balance
        And User verifies the grid fields on react Employee "Absence Reason" Page
            | field                      | value         |
            | reactEmpAbsencereason      | AR_Auto_23443 |
            | reactTrackingType          | Daily         |
            | reactInitialBalance        | 10            |
            | absenceReasonAsOf          | currentDate   |
            | reactTimeUsed              | 0             |
            | reactCurrentBalance        | 10            |
            | reatTimeFromPendingAbsence | 0             |
        #User Add Update initial Absence Reason Balance
        And User "Update Initial" Absence reason balance "12" and Exisitng balance "5" with as Of date "currentDate-3"
        #User Verify the Absence Reason Balance
        And User verifies the grid fields on react Employee "Absence Reason" Page
            | field                      | value         |
            | reactEmpAbsencereason      | AR_Auto_23443 |
            | reactTrackingType          | Daily         |
            | reactInitialBalance        | 12            |
            | absenceReasonAsOf          | currentDate-3 |
            | reactTimeUsed              | 0             |
            | reactCurrentBalance        | 12            |
            | reatTimeFromPendingAbsence | 0             |
        #User Update Existing Balance
        And User "Update Existing" Absence reason balance "10" and Exisitng balance "5" with as Of date "currentDate-4"
        #User Verify the Absence Reason Balance
        And User verifies the grid fields on react Employee "Absence Reason" Page
            | field                      | value         |
            | reactEmpAbsencereason      | AR_Auto_23443 |
            | reactTrackingType          | Daily         |
            | reactInitialBalance        | 17            |
            | absenceReasonAsOf          | currentDate-4 |
            | reactTimeUsed              | 0             |
            | reactCurrentBalance        | 17            |
            | reatTimeFromPendingAbsence | 0             |
        #Verify creating of an absence for the employee & validating the same
        And User navigate from "Absences" menu option to "Create Absence" through UI
        Then User Select "Emp_Auto_23443, 23443" and click on fillOutDetalis
        And User switch to Day View
        And User create Absence in Viewby Day Page "currentDate-2" to "currentDate-2" for "AR_Auto_23443" "8" and "Accounting Code"
        And User enter  details "Test Note" to "Test Note to Sub" and "Test Notes to admin"
        Then User verify Absence is created successfully
        #Search and open the Employee
        And User navigate from "Master Data" menu option to "Employee" sub menu to "General Information" through UI
        And User searches the Employee with "Last Name" "Emp_Auto_23443"
        #User Navigate to Absence reason tab
        And User clicks on "Absence Reasons" tab
        #User Validaes the Current Balance and time used
        And User verifies the grid fields on react Employee "Absence Reason" Page
            | field                      | value         |
            | reactEmpAbsencereason      | AR_Auto_23443 |
            | reactTrackingType          | Daily         |
            | reactInitialBalance        | 17            |
            | absenceReasonAsOf          | currentDate-4 |
            | reactTimeUsed              | 1             |
            | reactCurrentBalance        | 16            |
            | reatTimeFromPendingAbsence | 0             |
        # Removing selected absence reasons & Verifying created absence reason should not exist
        And User clicks edit button on the absence reason tab
        And User select "AR_Auto_23443" for absence reason removal
        And User saves the updated absence reasons list after removal
        Then User verifies absence reason "AR_Auto_23443" is "not available" under "home page" tab
        #Delete Absence
        And User navigate to "Web Navigator"
        And User navigate from "Absences" menu option to "Modify"
        When User search the absence with the "confirmationNumber"
        And User delete the React absence or vacancy
        #Deleting employee
        And User navigate from "Master Data" menu option to "Employee" sub menu to "General Information" through UI
        And User deletes the Employee having "Last Name" "Emp_Auto_23443"
