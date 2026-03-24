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
@US17
Feature: Gastar Moedas
	As a utilizador
	I Want to usar as minhas moedas para pagar a taxa de entrada de uma partida
	So that I can jogar um jogo
	
	@US17
	Scenario: Utilizar moedas para entrar numa partida
	  Given Eu abro aplicação, efetuo o login e possuo moedas 17
	  When Eu tento pagar a taxa de entrada de 50 moedas 17
	  Then O sistema deve atualizar o saldo 17
	  And Eu fecho a aplicação 17
