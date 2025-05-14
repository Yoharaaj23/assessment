@performance
Feature: Shops Inventory Management System - Early Performance Tests

  Background:
    Given the api and database status is valid

  Scenario: Validating the login api performance
    Given I have a valid username and password
    When I submit a login request
    Then the response status code should be 200
    And the response time should be less than 700 milliseconds with 100% threshold

  Scenario: Validating the create-product api performance
    Given I logged into the inventory management with a valid user
    When I send a request to create a product with the following payload
      | name          | price | productType   | quantity |
      | Picture Frame | 5.50  | miscellaneous | 10       |
    Then the response status code should be 201
    And the response time should be less than 500 milliseconds with 100% threshold

  Scenario: Validating the get-all-product api performance
    When I send a request to get all products
    Then the response status code should be 200
    And the response time should be less than 4000 milliseconds with 120% threshold

  Scenario: Validating the update-product api performance
    Given a product exists in the inventory
      | name        | price | productType | quantity |
      | Bike Racing | 10.10 | games       | 1        |
    When I send a request to update "stored-productId" product with the updated details
      | name          | price | productType | quantity |
      | Bike Racing 2 | 10.10 | games       | 10       |
    Then the response status code should be 200
    And the response time should be less than 500 milliseconds with 100% threshold

  Scenario: Validating the delete-product api performance
    Given a product exists in the inventory
      | name   | price | productType   | quantity |
      | Shorts | 5.50  | miscellaneous | 100      |
    When I send a request to delete a product with "stored-productId"
    Then the response status code should be 200
    And the response time should be less than 500 milliseconds with 100% threshold

  Scenario: Validating the retrieve-a-product api performance
    Given a product exists in the inventory
      | name | price | productType | quantity |
      | NFS  | 20.10 | games       | 1        |
    When I send a request to retrieve a product with "stored-productId"
    Then the response status code should be 200
    And the response time should be less than 500 milliseconds with 100% threshold

  Scenario: Validating the create-order api performance
    Given a product exists in the inventory
      | name   | price  | productType        | quantity |
      | Webcam | 220.50 | computer accessory | 10       |
    When I send a request to create a new "buy" order with the following payload
      | orderType | productId        | quantity |
      | buy       | stored-productId | 20       |
    Then the response status code should be 201
    And the response time should be less than 1000 milliseconds with 100% threshold

  Scenario: Validating the retrieve-current-stock api performance
    Given a product exists in the inventory
      | name     | price | productType        | quantity |
      | Keyboard | 10.00 | computer accessory | 10       |
    When I send a request to create a new "buy" order with the following payload
      | orderType | productId        | quantity |
      | buy       | stored-productId | 20       |
    Then the response status code should be 201
    When I send a request to get current stock level for a product id "stored-productId"
    Then the response status code should be 200
    And the response time should be less than 500 milliseconds with 100% threshold

#     login?




#  Clean up
#Replacing values needed?
#other clean ups