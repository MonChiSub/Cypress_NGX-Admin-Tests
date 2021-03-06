 /// <reference types="cypress" />

 describe('Our first test suite', () => {

    it('first test', () => {

        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        //Find by TAG
        cy.get('input')

        //Find by ID (use #)
        cy.get('#inputEmail1')

        //Find by CLASS (use .)
        cy.get('.input-full-width')

        //Find by attribute name (use [])
        cy.get('[placeholder]')

        //Find by attribute name & value (use [])
        cy.get('[placeholder="Email"]')

        //Find by CLASS value (use [] (Must provide entire class value, not just part of))
        cy.get('[class="input-full-width size-medium shape-rectangle"]')

        //Find by TAG and ATTRIBUTE with value (use tag + [])
        cy.get('input[placeholder="Email"]')

        //Find by two different ATTRIBUTEs (use double [])
        cy.get('[placeholder="Email"][fullwidth]')

        //Find by TAG, ATTRIBUTE with value, ID and CLASS.
        cy.get('input[placeholder="Email"]#inputEmail1.input-full-width')

        //Always recommend to make your own attributes for cypress in your code
        cy.get('[data-cy="imputEmail1"]')
    })

    it('second test', () => {
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        cy.get('[data-cy="signInButton"]')
        cy.contains('Sign in')
        cy.contains('[status="warning"]','Sign in')

        cy.get('@inputEmail3')
            .parents('form')
            .find('button')
            .should('contain','Sign in')
            .parents('form')
            .find('nb-checkbox').click()

        cy.contains('nb-card', 'Horizontal form')
            .find('[type="email"]')
    })

    it('then and wrap methods', () => {
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        //Using the Grid Form
        // cy.contains('nb-card', 'Using the Grid').find('[for="inputEmail1"]').should('contain', 'Email')
        // cy.contains('nb-card', 'Using the Grid').find('[for="inputPassword2"]').should('contain', 'Password')
        //Basic Form
        // cy.contains('nb-card', 'Basic form').find('[for="exampleInputEmail1"]').should('contain', 'Email')
        // cy.contains('nb-card', 'Basic form').find('[for="exampleInputPassword1"]').should('contain', 'Password')


        // Use THEN function for saving variables for easier mass testing!
        // use WRAP function to return from JQuery to Cypress formatting (Then function is JQuery object related, uses JQuery methods, not cypress!)
        cy.contains('nb-card', 'Using the Grid').then( firstForm => {
            const firstEmailLabel = firstForm.find('[for="inputEmail1"]').text()
            const firstPasswordLabel = firstForm.find('[for="inputPassword2"]').text()
            expect(firstEmailLabel).to.equal('Email')
            expect(firstPasswordLabel).to.equal('Password')

            cy.contains('nb-card', 'Basic form').then( secondForm => {
                const secondPasswordLabel = secondForm.find('[for="exampleInputPassword1"]').text()
                expect(firstPasswordLabel).to.equal(secondPasswordLabel)

                cy.wrap(secondForm).find('[for="exampleInputPassword1"]').should('contain', 'Password')
            })
        })
        cy.contains('nb-card', 'Basic form').then( secondForm => {
            const secondEmailLabel = secondForm.find('[for="exampleInputEmail1"]').text()
            const secondPasswordLabel = secondForm.find('[for="exampleInputPassword1"]').text()
            expect(secondEmailLabel).to.equal('Email address')
            expect(secondPasswordLabel).to.equal('Password')
        })
    })

    it('invoke command', () => {
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        //1
        cy.get('[for="exampleInputEmail1"]').should('contain', 'Email address')

        //2
        cy.get('[for="exampleInputEmail1"]').then( label => {
            expect(label.text()).to.equal('Email address')
        })

        //3
        cy.get('[for="exampleInputEmail1"]').invoke('text').then( text => {
            expect(text).to.equal('Email address')
        })

        cy.contains('nb-card', 'Basic form')
            .find('nb-checkbox')
            .click()
            .find('.custom-checkbox')
            .invoke('attr', 'class')
            //.should('contain', 'checked')
            .then(classValue => {
                expect(classValue).to.contain('checked')
            })
    })

    it('assert property', () => {
        function selectDayFromCurrent(day) {
            let date = new Date();
            date.setDate(date.getDate() + day)
            let futureDay = date.getDay()
            let futureMonth = date.toLocaleString('default', {month: 'short'})
            let dateAssert = futureMonth+' '+futureDay+', '+date.getFullYear()
            cy.get('nb-calendar-navigation').invoke('attr', 'ng-reflect-date').then( dateAttribute => {
                if(!dateAttribute.includes(futureMonth)){
                    cy.get('[data-name="chevron-right"]').click()
                    selectDayFromCurrent(day)
                } else {
                    cy.get('nb-calendar-day-picker [class="day-cell ng-star-inserted"]').contains(futureDay).click()
                }
            })
            return dateAssert
        }
        
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Datepicker').click()
        cy.get('[data-name="menu-2"]').click()

        cy.contains('nb-card', 'Common Datepicker').find('input').then( input => {
            cy.wrap(input).click()
            let dateAssert = selectDayFromCurrent(53)
            cy.wrap(input).invoke('prop', 'value').should('contain', dateAssert)
        })
    })

    it('radio button', () => {
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        cy.contains('nb-card', 'Using the Grid').find('[type="radio"]').then(radioButtons => {
            cy.wrap(radioButtons)
                .first()
                .check({force: true})
                .should('be.checked')

            cy.wrap(radioButtons)
                .eq(1)
                .check({force: true})
                
            cy.wrap(radioButtons)
                .eq(0)
                .should('not.be.checked')

            cy.wrap(radioButtons)
                .eq(2)
                .should('be.disabled')
        })
    })

    it('check boxes', () => {
        cy.visit('/')
        cy.contains('Modal & Overlays').click()
        cy.contains('Toastr').click()

        //cy.get('[type="checkbox"]').check({force: true})
        cy.get('[type="checkbox"]').eq(0).click({force: true})
        cy.get('[type="checkbox"]').eq(1).check({force: true})
    })

    it('lists and dropdowns', () => {
        cy.visit('/')

        //1 Check dark theme exists & select it, check it works too
        cy.get('nav nb-select').click()
        cy.get('.options-list').contains('Dark').click()
        cy.get('nav nb-select').should('contain', 'Dark')
        cy.get('nb-layout-header nav').should('have.css', 'background-color', 'rgb(34, 43, 69)')
        
        //2 
        cy.get('nav nb-select').then( dropdown => {
            cy.wrap(dropdown).click()
            cy.get('.options-list nb-option').each( (listItem, index) => {
                const itemText = listItem.text().trim()
                const colors = {
                    "Light": "rgb(255, 255, 255)",
                    "Dark": "rgb(34, 43, 69)",
                    "Cosmic": "rgb(50, 50, 89)",
                    "Corporate": "rgb(255, 255, 255)"
                }

                cy.wrap(listItem).click()
                cy.wrap(dropdown).should('contain', itemText)
                cy.get('nb-layout-header nav').should('have.css', 'background-color', colors[itemText])
                if( index < 3) {
                    cy.wrap(dropdown).click()
                }
            })
        })
    })

    it('Web Tables', () => {
        cy.visit('/')
        cy.contains('Tables & Data').click()
        cy.contains('Smart Table').click()
        cy.get('[data-name="menu-2"]').click()

        cy.get('[class="ng2-smart-action ng2-smart-action-edit-edit ng-star-inserted"]')

        //1
        cy.get('tbody').contains('tr', 'Larry').then( tableRow => {
            cy.wrap(tableRow).find('.nb-edit').click()
            cy.wrap(tableRow).find('[placeholder="Age"]').clear().type('89')
            cy.wrap(tableRow).find('.nb-checkmark').click()
            cy.wrap(tableRow).find('td').eq(6).should('contain', '89')
        })
        
        //2
        cy.get('thead').find('.nb-plus').click()
        cy.get('thead').find('tr').eq(2).then( tableRow => {
            cy.wrap(tableRow).find('[placeholder="First Name"]').type('Arten')
            cy.wrap(tableRow).find('[placeholder="Last Name"]').type('Bondar')
            cy.wrap(tableRow).find('.nb-checkmark').click()
        })
        cy.get('tbody tr').first().find('td').then( tableColumns => {
            cy.wrap(tableColumns).eq(2).should('contain', 'Arten')
            cy.wrap(tableColumns).eq(3).should('contain', 'Bondar')
        })

        //3
        const age = [20, 30, 40, 400]
        cy.wrap(age).each( age => {
            cy.get('thead [placeholder="Age"]').clear().type(age)
            cy.wait(500)
            cy.get('tbody tr').each( tableRow => {
                if(age == 400) {
                    cy.wrap(tableRow).should('contain', 'No data found')
                } else {
                    cy.wrap(tableRow).find('td').eq(6).should('contain', age)
                }
            })
        })
    })

    // You can use copy selector from the HTML tags.
    it('cheating with copy selector', () => {
        cy.visit('/')
        cy.contains('Tables & Data').click()
        cy.contains('Smart Table').click()
        cy.get('[data-name="menu-2"]').click()

        cy.get('body > ngx-app > ngx-pages > ngx-one-column-layout > nb-layout > div > div > div > div > div > nb-layout-column > ngx-tables > ngx-smart-table > nb-card > nb-card-body > ng2-smart-table > table > tbody > tr:nth-child(3) > td.ng2-smart-actions.ng-star-inserted > ng2-st-tbody-edit-delete > a.ng2-smart-action.ng2-smart-action-edit-edit.ng-star-inserted > i').click()
        cy.get('body > ngx-app > ngx-pages > ngx-one-column-layout > nb-layout > div > div > div > div > div > nb-layout-column > ngx-tables > ngx-smart-table > nb-card > nb-card-body > ng2-smart-table > table > tbody > tr.ng-star-inserted.ng2-smart-row.selected > td:nth-child(7) > ng2-smart-table-cell > table-cell-edit-mode > div > table-cell-default-editor > div > input-editor > input').clear().type('98')
        cy.get('body > ngx-app > ngx-pages > ngx-one-column-layout > nb-layout > div > div > div > div > div > nb-layout-column > ngx-tables > ngx-smart-table > nb-card > nb-card-body > ng2-smart-table > table > tbody > tr.ng-star-inserted.ng2-smart-row.selected > td.ng2-smart-actions.ng-star-inserted > ng2-st-tbody-create-cancel > a.ng2-smart-action.ng2-smart-action-edit-save > i').click()
        cy.get('body > ngx-app > ngx-pages > ngx-one-column-layout > nb-layout > div > div > div > div > div > nb-layout-column > ngx-tables > ngx-smart-table > nb-card > nb-card-body > ng2-smart-table > table > tbody > tr.ng-star-inserted.ng2-smart-row.selected > td:nth-child(7) > ng2-smart-table-cell > table-cell-view-mode > div > div').should('contain', '98')
    })

    it('tooltip', () => {
        cy.visit('/')
        cy.contains('Modal & Overlays').click()
        cy.contains('Tooltip').click()
        cy.get('[data-name="menu-2"]').click()

        cy.contains('nb-card', 'Colored Tooltips')
            .contains('Default').click()
        cy.get('nb-tooltip').should('contain', 'This is a tooltip')
    })

    it('dialog box', () => {
        cy.visit('/')
        cy.contains('Tables & Data').click()
        cy.contains('Smart Table').click()
        cy.get('[data-name="menu-2"]').click()

        // First method
        // cy.get('tbody tr').first('.nb-trash').click()
        // cy.on('window:confirm', (confirm) => {
        //     expect(confirm).to.equal('Are you sure you want to delete?')
        // })

        // Second Method (Confirm Delete)
        // const stub = cy.stub()
        // cy.on('window:confirm', stub)
        // cy.get('tbody tr').first().find('.nb-trash').click().then(() => {
        //     expect(stub.getCall(0)).to.be.calledWith('Are you sure you want to delete?')
        // })

        //Third Method (Cancel Delete)
        cy.get('tbody tr').first().find('.nb-trash').click()
        cy.on('window:confirm', () => false)
    })
 })
