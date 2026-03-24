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
@US11
Feature: Começar um jogo
  As a utilizador
  I want to começar um jogo
  So that I can estar pronto para jogar

  @US11
  Scenario: Entrar no jogo distribui cartas e atualiza o número do baralho
    Given Eu abro a aplicação 11
    When Eu clico no botão "Continue as Guest" 11
    And Eu pressiono o botão "Start Practice" 11
    Then Eu vejo o jogo a ser distribuido corretamente 11
    And Eu fecho a aplicação 11
