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
@US12
Feature: Comecar um jogo	
	As a utilizador
  I want to comecar um jogo
  So That I Can estar pronto para jogar
  
  @US12
  Scenario: Comecar um jogo contra um bot
    Given Eu abro a aplicação 12
    When Eu clico no botão "Continue as Guest" 12
    And Eu pressiono o botão "Start Practice" 12
    Then Eu jogo cartas 12
    And Eu fecho a aplicação 12

