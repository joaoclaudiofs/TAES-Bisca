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
@US21
Feature: Consultar scoreboard dos global rankings
	As a utilizador
  I want to consultar as scoreboard dos rankings globais
	So that I can comparar a minha performance com outros utilizadores para melhorar no futuro

  @US21
  Scenario: Consultar scoreboard dos global rankings
  	Given Eu abro a aplicação, efetuo o login e estou na dashboard 21
    When Eu clico no botão "Leaderboard" 21
    Then Eu vejo o texto "Leaderboard" 21
    And Eu fecho a aplicação 21
    