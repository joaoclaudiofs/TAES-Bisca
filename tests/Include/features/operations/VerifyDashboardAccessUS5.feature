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
@US5
Feature: Acesso à Dashboard
	As a utilizador
  I want to ser redirecionado para a dashboard
  So that I can ver e ter acesso a todas as funcionalidades

  @US5
 	Scenario: Dashboard
    Given Eu tenho a aplicação aberta 5 
    When Eu realizo o login "1" ou clico no botão "Continue as Guest" 5 
    Then Eu vejo o texto "Start Practice" 5
		And Eu fecho a aplicação 5
		 
		#  | loginFlag |
    #  | 1         |
    #  | 0         |
		
