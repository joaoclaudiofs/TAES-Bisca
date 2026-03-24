#Author: your.email@your.domain.com
#Keywords Summary :
#Feature: List of scenarios.
#Scenario: Business rule through list of steps with arguments.
#Given: Some precondition step
#When: Some key actions
#Then: To observe outcomes or validation
#And,But: To enumerate more Given,When,Then steps
#Scenario Outline: List of steps for data-driven as an Examples and <placeholder>
#Examples: Container for s table
#Background: List of steps run before each of the scenarios
#""" (Doc Strings)
#| (Data Tables)
#@ (Tags/Labels):To group Scenarios
#<> (placeholder)
#""
## (Comments)
#Sample Feature Definition Template
@US3
Feature: Utilizador Anónimo
	As a utilizador
  I want to saltar o passo de login
  So that I can jogar apenas practice games

  @US3
  Scenario: Jogar sem login
    Given Eu tenho a aplicação aberta 3
    When Eu clico no botão "Continue as Guest" 3
    And Eu vejo o texto "Start Practice" 3
    Then Eu pressiono o botão "Start Practice" 3
    And Eu fecho a aplicação 3
