Feature: Playwright - Org User Smoke Navigation

    @smokeWorkflow @P1 @priority-high @140462
    Scenario: P1 - Org User Smoke Navigation
        Given Application is open in the browser
        # Org User Navigation Test
        When User logs in using "org_username"
        Then User is logged in successfully and is redirected to application homepage
        And User navigate from "Master Data" menu option to "Employee" sub menu to "General Information"
        Then User verifies page title as "Employee Search"
        And User navigate from "Master Data" menu option to "Substitute" sub menu to "General Information"
        Then User verifies page title as "Substitute Search"
        And User navigate to "Daily Report"
        Then User verifies page title as "Daily Report"
        When User logged out from the application
        # Campus User Navigation Test
        When User logs in using "campusUser"
        Then User is logged in successfully and is redirected to application homepage
        And User navigate to "Daily Report"
        Then User verifies page title as "Daily Report"
        When User logged out from the application