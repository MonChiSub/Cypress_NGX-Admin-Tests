import { onDatePickerPage } from "../../support/page_objects/datepickerPage"
import { onFormLayoutsPage } from "../../support/page_objects/formLayoutsPage"
import { navigateTo } from "../../support/page_objects/navigationPage"
import { onSmartTablePage } from "../../support/page_objects/smartTablePage"


describe('Test with Page Objects', () => {

    beforeEach('Open Application', () => {
        cy.openHomePage()
    })

    it('Verify Navigation across the pages', () => {
        //Layout
        
        //Forms
        navigateTo.formLayoutsPage()
        cy.url().should('include', '/forms/layouts')
        navigateTo.datepickerPage()
        cy.url().should('include', '/forms/datepicker')

        //Modal & Overlays
        navigateTo.modalDialogPage()
        cy.url().should('include', '/modal-overlays/dialog')
        navigateTo.modalWindowPage()
        cy.url().should('include', '/modal-overlays/window')
        navigateTo.modalPopoverPage()
        cy.url().should('include', '/modal-overlays/popover')
        navigateTo.modalToastrPage()
        cy.url().should('include', '/modal-overlays/toastr')
        navigateTo.modalTooltipPage()
        cy.url().should('include', '/modal-overlays/tooltip')

        //Extra Components

        //Tables & Data

        //Auth
    })

    it.only('Submit inline and basic form to select calendar', () => {
        navigateTo.formLayoutsPage()
        onFormLayoutsPage.submitInlineFormWithNameANdEmail('Artem', 'test@test.com')
        onFormLayoutsPage.submitBasicFormWithEmailAndPassword('test@test.com', 'password')
        navigateTo.datepickerPage()
        onDatePickerPage.selectCommonDatepickerDateFromToday(1)
        onDatePickerPage.selectDatepickerWithRangeFromToday(7, 14)
        navigateTo.tableSmartTablePage()
        onSmartTablePage.addNewRecordWithFirstAndLastName('Artem', 'Bondar')
        onSmartTablePage.updateAgeByFirstName('Artem', '60')
        onSmartTablePage.deleteRowbyIndex(1)
    })
})
