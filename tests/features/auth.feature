Feature: User Authentication

  Scenario: Successful login
    Given I have a username "user01" and password "secpassword*"
    When I submit a login request
    Then the response status code should be 200
    And the response should contain a "token" field
    And the response should contain a "message" field with value "user01 logged in successful"

  Scenario Outline: Invalid login attempts
    Given I have a username "<username>" and password "<password>"
    When I submit a login request
    Then the response status code should be <status>
    And the response should contain a "message" field with value "<message>"

    Examples:
      | username | password  | status | message             |
      | user01   | wrongpass | 400    | Invalid credentials |
      | unknown  | anypass   | 400    | Invalid credentials |
      |          | pass123   | 400    | Invalid credentials |
      |          |           | 400    | Invalid credentials |
