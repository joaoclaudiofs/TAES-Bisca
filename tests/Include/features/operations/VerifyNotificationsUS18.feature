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
@US18
Feature: Notificações
	As a utilizador
  I want to receber notificações do sistema sobre eventos importantes
	So that I can manter-me atualizado sobre novidades e mudanças relevantes no jogo

  @US18
  Scenario: Apresentação de notificações
    Given Eu abro a aplicação, efetuo o login e estou na dashboard 18
    When Eu clico no botão de notificações 18
    And Eu clico numa notificação 18
    Then Eu vejo o texto "Leaderboard" 18
    And Eu fecho a aplicação 18
