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
@US28
Feature: Comprar na loja
	As a utilizador
  I want to fazer uma compra na loja 
  So that I can personalizar o meu avatar/deck
  

  @US28
  Scenario: Comprar algo na loja
     Given Eu abro a aplicação, efetuo o login e estou na dashboard 28
    When Eu clico no botão "Store" 28
    Then Eu vejo o texto "Store" 28
    And Eu clico no botão para comprar "Buy Blue Gradient (1)" 28
    And Eu fecho a aplicação 28
