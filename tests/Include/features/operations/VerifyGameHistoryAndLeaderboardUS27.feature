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
@US27
Feature: Histórico de jogos e leaderboard
	As a utilizador
  I want to CSS armazene e forneça o acesso ao histórico de partidas e leaderboard
	So that I can rever os meus jogos anteriores e comparar a minha classificação com a de outros utilizadores

  @US27
  Scenario: CSS armazena o histórico de jogos e leaderboard
  	Given Eu abro a aplicação, efetuo o login e estou na dashboard 27
    When Eu clico no botão "Leaderboard" 27
    And Eu vejo o texto "Leaderboard" e volto para a dashboard 27
    Then Eu pressiono o botão "Match History" 27
    And Eu observo o texto "Match History" 27
    And Eu fecho a aplicação 27
