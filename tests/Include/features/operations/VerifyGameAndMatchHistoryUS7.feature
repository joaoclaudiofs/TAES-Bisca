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
@US7
Feature: Histórico de jogos e partidas 
	As a utilizador 
  I want to ver o meu histórico de jogos e partidas antigas
  So that I can ver o meu progresso ao longo do tempo

  @US7
  Scenario: Ver histórico de jogos e partidas do utilizador
    Given Eu abro a aplicação, efetuo o login e estou na dashboard 7
    When Eu clico no botão "Match History" 7 
    Then Eu vejo os detalhes de uma partida 7
    And Eu fecho a aplicação 7