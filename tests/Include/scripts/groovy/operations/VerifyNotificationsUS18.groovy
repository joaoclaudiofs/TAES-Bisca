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



class VerifyNotificationsUS18 {
	/**
	 * The step definitions below match with Katalon sample Gherkin steps
	 */
	@Given("Eu abro a aplicação, efetuo o login e estou na dashboard 18")
	def eu_efetuei_o_login_e_estou_na_dashboard() {
		Mobile.startApplication('C:\\Users\\joao2\\Desktop\\PROJETOS_3A\\TAES\\code\\frontend\\android\\app\\build\\outputs\\apk\\release\\app-release-unsigned.apk', true)
		Mobile.tap(findTestObject('Object Repository/android.widget.Button - Login'), 0)
		Mobile.setText(findTestObject('Object Repository/android.widget.EditText - Email (1)'), "a1@mail.pt", 0)
		Mobile.setText(findTestObject('Object Repository/android.widget.EditText - Password (1)'), "123", 0)
		Mobile.hideKeyboard()
		Mobile.tap(findTestObject('Object Repository/android.widget.Button - ' + "Sign in"), 0)
	}

	@When("Eu clico no botão de notificações 18")
	def eu_clico_no_botao_de_notificacoes() {
		Mobile.delay(5)
		TestObject btnNotificacao = new TestObject("btnNotificacao")
		btnNotificacao.addProperty("xpath", ConditionType.EQUALS, "//android.widget.Button[@index='5']")

		Mobile.waitForElementPresent(btnNotificacao, 10)
		Mobile.tap(btnNotificacao, 3)
	}

	@And("Eu clico numa notificação 18")
	def eu_clico_numa_notificacao() {
		Mobile.delay(3)
		Mobile.tapAtPosition(476, 2040)

		/* Problemas a fazer com que ele clique na notificação desejada, fizemos pelas coordenadas no ecrã
		 //Espera o dialog abrir
		 Mobile.waitForElementPresent(
		 findTestObject("Object Repository/android.app.Dialog - Notifications"),
		 10
		 )
		 //Delay proposital
		 Mobile.delay(5)
		 //Espera o item aparecer dentro do dialog
		 Mobile.waitForElementPresent(
		 findTestObject("Object Repository/android.widget.TextView - New Scoreboard Leader"),10)
		 // Tenta clicar
		 Mobile.tap(findTestObject("Object Repository/android.widget.TextView - New Scoreboard Leader"),0)
		 */
	}


	@Then("Eu vejo o texto {string} 18")
	def eu_vejo_o_texto(String string) {

		TestObject target = new TestObject("TargetPage")
		target.addProperty("xpath", ConditionType.EQUALS, "//*[@text='" + string + "']")

		Mobile.waitForElementPresent(target, 10)
		Mobile.verifyElementExist(target, 5)

		Mobile.delay(5)
	}

	@And ("Eu fecho a aplicação 18")
	def eu_fecho_a_aplicacao() {
		Mobile.closeApplication()
	}
}