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
@US4	
Feature: Restrições para o utilizador anónimo
	As a utilizador
  I want to saltar o passo de login
  So that I can não poder ver o resto das funcionalidades sem ser o practice games

  @US4
  Scenario: Verificar restrições ao saltar login
    Given Eu tenho a aplicação aberta 4
    When Eu clico no botão "Continue as Guest" 4
    And Eu vejo o texto "Start Practice" 4
    Then Eu verifico que as opções "GameHistory", "MatchHistory", "MyStats", "Leaderboard" estão bloqueadas 4
    And Eu fecho a aplicação 4
