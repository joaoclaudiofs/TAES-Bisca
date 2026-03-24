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
@US24
Feature: Autenticação e Logout
	As a utilizador
  I want to que a aplicação autentique o meu login ou o acesso anónimo através do CSS
  So that I can aceder ao meu perfil e dados de jogo

  @US24
  Scenario: Realizar a autenticação e logout 24
 		Given Eu tenho a aplicação aberta 24 
    When Eu clico no botão login "Login" 24
    Then Eu vejo o texto "Sign in to your account" 24
    And Eu insiro "a1@mail.pt" no campo de endereço de email 24
    And Eu insiro "123" no campo de password 24
    And Eu pressiono o botão entrar "Sign In" 24
    Then Eu vejo os meus dados e perfil 24
    And Eu clico no botão "Logout" 24
		And Eu fecho a aplicação 24
    