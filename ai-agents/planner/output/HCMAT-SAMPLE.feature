Feature: Employee submits timeoff request

  Scenario: Employee submits timeoff request
    Given Application is open in the browser
    When User logs in using "appUsername" and "appPassword"
    Then User is logged in successfully and is redirected to application homepage
    And User navigate from "Absences" menu option to "Create Absence"
    And User Clicks on the Day Picker and Select Date as "1"
    And Employee Create new absence with following "Vacation" "8"
    And User Will click on Create Absence button
    Then Absence is created with the reason
