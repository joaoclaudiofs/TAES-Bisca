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



class VerifyMatchHistoryUS19 {
	/**
	 * The step definitions below match with Katalon sample Gherkin steps
	 */
	@Given("Eu abro a aplicação, efetuo o login e estou na dashboard 19")
	def eu_efetuei_o_login_e_estou_na_dashboard() {
		Mobile.startApplication('C:\\Users\\joao2\\Desktop\\PROJETOS_3A\\TAES\\code\\frontend\\android\\app\\build\\outputs\\apk\\release\\app-release-unsigned.apk', true)
		Mobile.tap(findTestObject('Object Repository/android.widget.Button - Login'), 0)
		Mobile.setText(findTestObject('Object Repository/android.widget.EditText - Email (1)'), "a1@mail.pt", 0)
		Mobile.setText(findTestObject('Object Repository/android.widget.EditText - Password (1)'), "123", 0)
		Mobile.hideKeyboard()
		Mobile.tap(findTestObject('Object Repository/android.widget.Button - ' + "Sign in"), 0)
	}

	@When("Eu clico no botão {string} 19")
	def eu_clico_no_botao(String string) {
		Mobile.tap(findTestObject('Object Repository/android.widget.TextView - ' + string), 3)
	}

	@Then("Eu vejo o texto {string} 19")
	def eu_vejo_o_texto(String string) {
		Mobile.verifyElementExist(findTestObject('Object Repository/android.widget.Button - Next'), 0)
		Mobile.verifyElementExist(findTestObject('Object Repository/android.widget.Button - Previous'), 0)
		Mobile.verifyElementText(findTestObject('Object Repository/android.widget.TextView - ' + string), string)
	}

	@And ("Eu fecho a aplicação 19")
	def eu_fecho_a_aplicacao() {
		Mobile.closeApplication()
	}
}