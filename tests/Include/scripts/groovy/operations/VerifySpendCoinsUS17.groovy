package operations
import static com.kms.katalon.core.checkpoint.CheckpointFactory.findCheckpoint
import static com.kms.katalon.core.testcase.TestCaseFactory.findTestCase
import static com.kms.katalon.core.testdata.TestDataFactory.findTestData
import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject

import com.kms.katalon.core.annotation.Keyword
import com.kms.katalon.core.checkpoint.Checkpoint
import com.kms.katalon.core.checkpoint.CheckpointFactory
import com.kms.katalon.core.mobile.keyword.MobileBuiltInKeywords as Mobile
import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.testcase.TestCase
import com.kms.katalon.core.testcase.TestCaseFactory
import com.kms.katalon.core.testdata.TestData
import com.kms.katalon.core.testdata.TestDataFactory
import com.kms.katalon.core.testobject.ObjectRepository
import com.kms.katalon.core.testobject.TestObject
import com.kms.katalon.core.webservice.keyword.WSBuiltInKeywords as WS
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI

import internal.GlobalVariable

import org.openqa.selenium.WebElement
import org.openqa.selenium.WebDriver
import org.openqa.selenium.By

import com.kms.katalon.core.mobile.keyword.internal.MobileDriverFactory
import com.kms.katalon.core.webui.driver.DriverFactory

import com.kms.katalon.core.testobject.RequestObject
import com.kms.katalon.core.testobject.ResponseObject
import com.kms.katalon.core.testobject.ConditionType
import com.kms.katalon.core.testobject.TestObjectProperty

import com.kms.katalon.core.mobile.helper.MobileElementCommonHelper
import com.kms.katalon.core.util.KeywordUtil

import com.kms.katalon.core.webui.exception.WebElementNotFoundException

import cucumber.api.java.en.And
import cucumber.api.java.en.Given
import cucumber.api.java.en.Then
import cucumber.api.java.en.When

import com.kms.katalon.core.testobject.TestObject
import com.kms.katalon.core.testobject.ConditionType

class VerifySpendCoinsUS17 {

	int saldoAtual
	int taxaJogo



	@Given("Eu abro aplicação, efetuo o login e possuo moedas 17")
	def verificar_moedas() {
		//login steps
		Mobile.startApplication('C:\\Users\\joao2\\Desktop\\PROJETOS_3A\\TAES\\code\\frontend\\android\\app\\build\\outputs\\apk\\release\\app-release-unsigned.apk', true)
		Mobile.tap(findTestObject('Object Repository/android.widget.Button - ' + "Login"), 0)
		Mobile.tap(findTestObject('Object Repository/android.widget.Button - ' + "Sign In"), 0)
		Mobile.setText(findTestObject('Object Repository/android.widget.EditText - Email (1)'), "a1@mail.pt", 0)
		Mobile.setText(findTestObject('Object Repository/android.widget.EditText - Password (1)'), "123", 0)
		Mobile.hideKeyboard()
		Mobile.tap(findTestObject('Object Repository/android.widget.Button - ' + "Sign in"), 0)
	}

	@When("Eu tento pagar a taxa de entrada de (\\d+) moedas 17")
	def pagarTaxa(int taxa) {

		taxaJogo = taxa
		TestObject saldoObj = new TestObject("SaldoCoins")
		saldoObj.addProperty(
				"xpath",
				ConditionType.EQUALS,
				"(//*[@class='android.widget.Image' and @index='3'])/following-sibling::android.widget.TextView[1]")


		Mobile.waitForElementPresent(saldoObj, 10)

		Mobile.verifyElementExist(saldoObj, 5)

		String saldoText = Mobile.getText(saldoObj, 2)
		saldoAtual = saldoText as int

		println "Saldo antes da partida: ${saldoAtual}"

		Mobile.tap(findTestObject('Object Repository/android.widget.Button - Start Match'), 3)
		println "Utilizador tentou entrar com taxa de ${taxa} moedas"

		//Volta para a dashboard
		TestObject backBtn = new TestObject("backDynamic")
		backBtn.addProperty("xpath", ConditionType.EQUALS,
				"//*[@class='android.widget.Button' and @text='']"
				)

		Mobile.waitForElementPresent(backBtn, 3)
		Mobile.tap(backBtn, 3)
	}

	@Then("O sistema deve atualizar o saldo 17")
	def atualizaSaldo() {

		TestObject saldoObj = new TestObject("SaldoCoins")
		saldoObj.addProperty(
				"xpath",
				ConditionType.EQUALS,
				"(//*[@class='android.widget.Image' and @index='3'])/following-sibling::android.widget.TextView[1]")


		Mobile.waitForElementPresent(saldoObj, 10)

		Mobile.verifyElementExist(saldoObj, 5)

		String saldoText = Mobile.getText(saldoObj, 2)
		int saldoDepois = saldoText as int

		assert saldoDepois == saldoAtual - taxaJogo :
		"ERRO: saldo antes=${saldoAtual}, depois=${saldoDepois}, esperado=${saldoAtual - taxaJogo}"
	}

	@And("Eu fecho a aplicação 17")
	def eu_fecho_a_aplicacao() {
		Mobile.closeApplication()
	}
}
