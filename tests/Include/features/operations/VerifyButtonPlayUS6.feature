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
@US6
Feature: Iniciar uma partida
  As a utilizador
  I want to iniciar uma partida single-player contra um bot diretamente na dashboard
  So that I can rapidamente jogar sem ter que navegar por múltiplos ecrãs

  @US6
  Scenario: Clicar no botão Play
    Given Eu abro a aplicação 6
    When Eu clico no botão "Continue as Guest" 6
    And Eu pressiono o botão "Start Practice" 6 
    Then Eu vejo o texto "Your Hand" 6
    And Eu fecho a aplicação 6
