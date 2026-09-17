Feature: Playwright - Org User Smoke Navigation

    @smokeWorkflow @P1 @priority-high @140462
    Scenario: P1 - Org User Smoke Navigation
        Given Application is open in the browser
        When User logs in using "org_username"
        Then User is logged in successfully and is redirected to application homepage
        And User navigate from "Master Data" menu option to "Employee" sub menu to "General Information" 
        And User navigate from "Master Data" menu option to "Employee" sub menu to "Skills"
        And User navigate from "Reference Data" menu option to "Absence Reasons" sub menu to ""
        And User navigate from "Absences" menu option to "Create Absence" sub menu to ""