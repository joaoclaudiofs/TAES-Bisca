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
import com.kms.katalon.core.testobject.MobileTestObject

import com.kms.katalon.core.mobile.helper.MobileElementCommonHelper
import com.kms.katalon.core.util.KeywordUtil

import com.kms.katalon.core.webui.exception.WebElementNotFoundException

import cucumber.api.java.en.And
import cucumber.api.java.en.Given
import cucumber.api.java.en.Then
import cucumber.api.java.en.When
import com.kms.katalon.core.testobject.ConditionType



class VerifyPlayGameUS12 {
	/**
	 * The step definitions below match with Katalon sample Gherkin steps
	 */
	@Given("Eu abro a aplicação 12")
	def eu_abro_a_aplicacao() {
		Mobile.startApplication('C:\\Users\\joao2\\Desktop\\PROJETOS_3A\\TAES\\code\\frontend\\android\\app\\build\\outputs\\apk\\release\\app-release-unsigned.apk',
				true)
	}
	@When("Eu clico no botão {string} 12")
	def eu_clico_no_botao(String string) {
		Mobile.tap(findTestObject('Object Repository/android.widget.Button - ' + string), 2)
	}

	@And("Eu pressiono o botão {string} 12")
	def eu_pressiono_o_botao_(String string) {
		Mobile.tap(findTestObject('Object Repository/android.widget.Button - ' + string), 2)
	}

	
	@Then("Eu jogo cartas 12")
	def eu_jogo_todas_as_cartas() {
	 
		for(int i = 0; i < 15; i++) {
			Mobile.tapAtPosition(136, 2188)
			Mobile.delay(5)
		}
		
		for(int i = 0; i < 9; i++) {
			Mobile.tapAtPosition(136, 2188)
			Mobile.delay(2)
			Mobile.tapAtPosition(330, 2188)
			Mobile.delay(2)
			Mobile.tapAtPosition(508, 2188)
			Mobile.delay(2)
			Mobile.tapAtPosition(709, 2188)
			Mobile.delay(2)
			Mobile.tapAtPosition(870, 2188)
			Mobile.delay(5)
		}
		/*
	    List<String> prefixos = ["c", "e", "o", "p"]
	    List<Integer> numeros = (1..7) + (11..13)
	
	    List<MobileTestObject> cartasVisiveis = []
	
	    prefixos.each { letra ->
	        numeros.each { num ->
	            String prefixo = "${letra}${num}"
	            if (!prefixo) return
	
	            MobileTestObject carta = new MobileTestObject("carta_${prefixo}")
	            String xpath = "//android.widget.Image[starts-with(@text,'${prefixo}')]"
	            println "Procurar carta com XPath: ${xpath}"
	            carta.addProperty("xpath", ConditionType.EQUALS, xpath)
	
	            if (Mobile.waitForElementPresent(carta, 2)) {
	                cartasVisiveis.add(carta)
	            }
	        }
	    }
	
	    println "Cartas visíveis encontradas: ${cartasVisiveis.size()}"
	
	    try { Mobile.hideKeyboard() } catch(Exception e) { println "Teclado não estava aberto" }
	
	    cartasVisiveis.each { cartaObj ->
	        Mobile.tap(cartaObj, 10)
	    }
	
	    println "Todas as cartas visíveis jogadas!"
	    */
	}
	


	@And("Eu fecho a aplicação 12")
	def eu_fecho_a_aplicacao() {
		Mobile.closeApplication()
	}
}