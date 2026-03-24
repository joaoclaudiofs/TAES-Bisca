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
@US10	
Feature: Acesso às customizações
	As a utilizador
  I want to aceder às configurações e opções de customização a partir da dashboard
  So that I can personalizar o meu perfil/jogo

  @US10
  Scenario: Aceder à página de customização
    Given Eu abro a aplicação, efetuo o login e estou na dashboard 10
    When Eu clico no botão "Customizations" 10
    Then Eu vejo o texto "Customizations" 10
    And Eu fecho a aplicação 10
