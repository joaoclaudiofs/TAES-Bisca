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
@US9
Feature: Mostrar a informação do utilizador
	As a utilizador
  I want to visualizar a minha página de perfil
	So that I can ver a minha informação pessoal
	
  @US9
  Scenario: Mostrar a página de perfil do utilizador
  	Given Eu abro a aplicação, efetuo o login 9
    When Eu estou na dashboard 9
    Then Eu vejo o meu nome e foto 9
    And Eu fecho a aplicação 9