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
@US2
Feature: Login
	As a utilizador
  I want to realizar login na aplicação
  So that I can ver todas as funcionalidades

  @US2
  Scenario: Login válido através da página de login
    Given Eu tenho a aplicação aberta 2
    When Eu clico no botão "Login" 2
    Then Eu vejo o texto "Sign in to your account" 2 
    And Eu insiro "a1@mail.pt" no campo de endereço de email 2
    And Eu digito "123" no campo de password 2
    And Eu pressiono o botão "Sign in" 2
    Then Eu observo o texto "Start Match" 2
		And Eu fecho a aplicação 2