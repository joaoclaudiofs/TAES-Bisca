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
@US8
Feature: Scoreboard pessoal e global
	As a utilizador
  I want to ver o meu histórico de jogos e partidas antigas
	So that I can comparar a minha performance com a de outros utilizadores

  @US8
  Scenario: Visualizar o scoreboard pessoal e global
    Given Eu abro a aplicação, efetuo o login e estou na dashboard 8
    When Eu clico no botão "My Stats (2)" 8
    Then Eu vejo o texto "My Stats" e partidas recentes 8
    And Eu fecho a aplicação 8
