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
@US26
Feature: Gestão de moedas e customização
	As a utilizador
  I want to CSS faça a gestão do meu saldo de moedas e das costumizações compradas 
  So that I can usar moedas para desbloquear e aplicar novos itens de forma consistente em todas as sessões

  @US26
  Scenario: CSS gere moedas e customizações
  	Given Eu abro a aplicação, efetuo o login e estou na dashboard 26
    When Eu clico no botão "Store" 26
    Then Eu compro na loja o item "Buy Blue Gradient (1)" 26
    And O meu saldo é atualizado 26
    And Eu fecho a aplicação 26
