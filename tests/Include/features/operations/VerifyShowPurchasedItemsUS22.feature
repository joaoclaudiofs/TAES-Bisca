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
@US22
Feature: Visualizar itens comprados
	As a utilizador
  I want to poder ver os meus itens comprados
	So that I can saber quais itens posso selecionar para aplicar

  @US22
  Scenario: Visualizar itens comprados pelo utilizador
    Given Eu abro a aplicação, efetuo o login e estou na dashboard 22
    When Eu clico no botão "Customizations" 22
    Then Eu vejo o texto "Customizations" e o item "Blue Gradient (2)" 22
    And Eu fecho a aplicação 10

