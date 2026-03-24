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



class VerifyManageCoinsAndCustomizationUS26 {
	/**
	 * The step definitions below match with Katalon sample Gherkin steps
	 */

	int saldoAnterior

	@Given("Eu abro a aplicação, efetuo o login e estou na dashboard 26")
	def eu_efetuei_o_login_e_estou_na_dashboard() {
		Mobile.startApplication('C:\\Users\\joao2\\Desktop\\PROJETOS_3A\\TAES\\code\\frontend\\android\\app\\build\\outputs\\apk\\release\\app-release-unsigned.apk', true)
		Mobile.tap(findTestObject('Object Repository/android.widget.Button - Login'), 0)
		Mobile.setText(findTestObject('Object Repository/android.widget.EditText - Email (1)'), "a1@mail.pt", 0)
		Mobile.setText(findTestObject('Object Repository/android.widget.EditText - Password (1)'), "123", 0)
		Mobile.hideKeyboard()
		Mobile.tap(findTestObject('Object Repository/android.widget.Button - ' + "Sign in"), 0)
	}

	@When("Eu clico no botão {string} 26")
	def eu_clico_no_botao(String string) {

		TestObject saldoObj = new TestObject("SaldoCoins")
		saldoObj.addProperty(
				"xpath",
				ConditionType.EQUALS,
				"(//*[@class='android.widget.Image' and @index='3'])/following-sibling::android.widget.TextView[1]")


		Mobile.waitForElementPresent(saldoObj, 10)

		Mobile.verifyElementExist(saldoObj, 5)

		String saldo = Mobile.getText(saldoObj, 5)
		saldoAnterior = saldo as int

		Mobile.scrollToText(string)
		Mobile.tap(findTestObject('Object Repository/android.widget.TextView - ' + string), 3)
	}

	@Then("Eu compro na loja o item {string} 26")
	def eu_compro_na_loja(String string) {
		TestObject dynamicButton = new TestObject("dynamicButton")
		dynamicButton.addProperty("text", ConditionType.EQUALS, string)
		Mobile.waitForElementPresent(dynamicButton, 5)
		Mobile.tap(findTestObject('Object Repository/android.widget.Button - ' + string), 3)
	}
	@And ("O meu saldo é atualizado 26")
	def o_meu_saldo_é_atualizado() {

		//voltar para a main
		Mobile.tap(findTestObject('Object Repository/android.widget.Button - Back'), 0)
		Mobile.scrollToText("Ranked Match")

		TestObject saldoObj = new TestObject("SaldoCoins")
		saldoObj.addProperty(
				"xpath",
				ConditionType.EQUALS,
				"(//*[@class='android.widget.Image' and @index='3'])/following-sibling::android.widget.TextView[1]")

		Mobile.waitForElementPresent(saldoObj, 10)

		Mobile.verifyElementExist(saldoObj, 5)

		String saldo = Mobile.getText(saldoObj, 5)
		int saldoNovo = saldo as int

		assert saldoAnterior != saldoNovo : "O saldo não mudou! Valor anterior: ${saldoAnterior}, valor novo: ${saldoNovo}"
	}
	@And ("Eu fecho a aplicação 26")
	def eu_fecho_a_aplicacao() {
		Mobile.closeApplication()
	}
}