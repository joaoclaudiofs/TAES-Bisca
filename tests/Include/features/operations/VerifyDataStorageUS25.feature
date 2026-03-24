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
@US25
Feature: Armazenamento de dados e estatísticas
	As a utilizador
  I want to os meus dados e estatísticas de jogo sejam armazenados no CSS
	So that I can que o meu progresso e desempenho possam ser recuperados posteriormente

  @US25
  Scenario: Ver estatísticas e dados do utilizador
    Given Eu abro a aplicação, efetuo o login e estou na dashboard 25
    When Eu clico no botão "My Stats (2)" 25
    Then Eu vejo o texto "My Stats" e as minhas estatísticas 25
    And Eu fecho a aplicação 25