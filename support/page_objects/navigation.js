
function selectGroupMenuItem(groupName) {
    cy.contains('a', groupName).then( menu => {
        cy.wrap(menu).find('.expand-state g g').invoke('attr', 'data-name').then( attr => {
        if( attr.includes('left')) {
            cy.wrap(menu).click({force: true})
            }
        }) 
    })
}

export class NavigationPage {

    // Layout Pages
    layoutStepperPage() {
        selectGroupMenuItem('Layout')
        cy.contains('Stepper').click()
    }
    layoutAccordionPage() {
        selectGroupMenuItem('Layout')
        cy.contains('Accordion').click()
    }

    // Form Pages
    formLayoutsPage() {
        selectGroupMenuItem('Form')
        cy.contains('Form Layouts').click()
    }
    datepickerPage() {
        selectGroupMenuItem('Form')
        cy.contains('Datepicker').click()
    }
    
    // Modal & Overlay Pages
    modalDialogPage() {
        selectGroupMenuItem('Modal & Overlays')
        cy.contains('Dialog').click()
    }
    modalWindowPage() {
        selectGroupMenuItem('Modal & Overlays')
        cy.contains('Window').click()
    }
    modalPopoverPage() {
        selectGroupMenuItem('Modal & Overlays')
        cy.contains('Popover').click()
    }
    modalToastrPage() {
        selectGroupMenuItem('Modal & Overlays')
        cy.contains('Toastr').click()
    }
    modalTooltipPage() {
        selectGroupMenuItem('Modal & Overlays')
        cy.contains('Tooltip').click()
    }

    //Extra Componenet Pages


    //Table & Data Pages
    tableSmartTablePage() {
        selectGroupMenuItem('Tables & Data')
        cy.contains('Smart Table').click()
    }
    tableTreeGrid() {
        selectGroupMenuItem('Tables & Data')
        cy.contains('Tree Grid').click()
    }

    //Auth Pages

}

export const navigateTo = new NavigationPage()
