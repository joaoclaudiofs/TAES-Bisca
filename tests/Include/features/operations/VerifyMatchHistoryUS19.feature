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
@US19
Feature: Consultar histórico de partidas	
	As a utilizador
  I want to consultar o meu histórico
  So that I can rever a minha performance para melhorar no futuro

  @US19
  Scenario: Consultar o histórico de partidas do utilizador
    Given Eu abro a aplicação, efetuo o login e estou na dashboard 19
    When Eu clico no botão "Match History" 19 
    Then Eu vejo o texto "Match History" 19
    And Eu fecho a aplicação 19

