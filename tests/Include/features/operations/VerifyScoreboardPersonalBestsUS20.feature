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
@US20
Feature: Consultar scoreboard dos personal bests
	As a utilizador
  I want to consultar a scoreboard dos meus personal bests
  So that I can rever a minha performance para melhorar no futuro

  @US20
  Scenario: Consultar scoreboard dos personal bests do utilizador
  	Given Eu abro a aplicação, efetuo o login e estou na dashboard 20
    When Eu clico no botão "My Stats (2)" 20
    Then Eu vejo o texto "My Stats" e o meu scoreboard 20
    And Eu fecho a aplicação 20
