/// <reference types="cypress" />

describe('Test with backend', () => {
    beforeEach('login to the app', () => {
        cy.intercept({method: 'Get', path:'tags'}, {fixture:'tags.json' })
        cy.loginToApplication()
    })

    /**     COMMENTED OUT AS USLESS, SINCE SKIPPING POST TEST METHOD.
    after('verify correct request and response', () => {
        cy.get('body > app-root > app-layout-header > nav > div > ul > li:nth-child(4) > a').click()
        cy.get('body > app-root > app-profile-page > div > div.container > div > div > app-profile-articles > app-article-list > app-article-preview > div > a > h1').click()
        cy.get('body > app-root > app-article-page > div > div.container.page > div.article-actions > app-article-meta > div > span:nth-child(3) > button').click()
    })
    */

    it.skip('verify correct request and response', () => {
        cy.intercept('POST', '**/api.realworld.io/api/articles*').as('postArticles')

        cy.get('[routerlink="/editor"]').click()
        cy.get('[formcontrolname="title"]').type('This is a title')
        cy.get('[formcontrolname="description"]').type('This is a description')
        cy.get('[formcontrolname="body"]').type('This is a body of the Article')
        cy.contains('Publish Article').click()

        cy.wait('@postArticles')
        cy.get('@postArticles').then( xhr => {
            console.log(xhr)
            expect(xhr.response.statusCode).to.equal(200)
            expect(xhr.request.body.article.body).to.equal('This is a body of the Article')
            expect(xhr.response.body.article.description).to.equal('This is a description')
            expect(xhr.response.body.article.title).to.equal('This is a title')
        })
    })

    it.skip('intercepting and modifying the request and response', () => {

        cy.intercept('POST', '**/api.realworld.io/api/articles*', (req) => {
            req.reply( res => {
                expect(res.body.article.description).to.equal('This is a description')
                res.body.article.description = "This is a modified description"
            })
        }).as('postArticles')

        cy.get('[routerlink="/editor"]').click()
        cy.get('[formcontrolname="title"]').type('This is a title')
        cy.get('[formcontrolname="description"]').type('This is a description')
        cy.get('[formcontrolname="body"]').type('This is a body of the Article')
        cy.contains('Publish Article').click()

        cy.wait('@postArticles')
        cy.get('@postArticles').then( xhr => {
            console.log(xhr)
            expect(xhr.response.statusCode).to.equal(200)
            expect(xhr.request.body.article.body).to.equal('This is a body of the Article')
            expect(xhr.response.body.article.description).to.equal('This is a modified description')
            expect(xhr.response.body.article.title).to.equal('This is a title')
        })
    })

    it('should have tags', () => {
        cy.get('.tag-list').should('contain', 'cypress')
            .and('contain', 'automation')
            .and('contain', 'testing')
    })

    it('verify global feed likes count', () => {
        cy.intercept('GET', '**/articles/feed*', {"articles":[],"articlesCount":0 })
        cy.intercept('GET', '**/articles*', {fixture:'articles.json'})

        cy.contains('Global Feed').click()
        cy.get('app-article-list button').then( listOfButtons => {
            expect(listOfButtons[0]).to.contain('33')
            expect(listOfButtons[1]).to.contain('23')

            cy.fixture('articles').then( file => {
                const articleLink = file.articles[1].slug
                cy.intercept('POST', '**/articles/'+articleLink+'/favorite', file)
            })
            cy.get('app-article-list button').eq(1).click()
                .should('contain', '24')
        })
    })

    it('deleta a new article in a global feed', () => {
        const bodyRequest = {
            "article": {
                "tagList": [],
                "title": "Request from API",
                "description": "API testing go brr",
                "body": "Cypress Testing"
            }
        }

        cy.get('@token').then( token => {
            cy.request({
                url: Cypress.env('apiURL')+'/api/articles',
                headers: { 'Authorization': 'Token '+token},
                method: 'POST',
                body: bodyRequest
            }).then( response => {
                expect(response.status).to.equal(200)
            })

            cy.contains('Global Feed').click()
            cy.get('.article-preview').first().click()
            cy.get('.article-actions').contains('Delete Article').click()
    
            cy.request({
                url: Cypress.env('apiURL')+'api/articles?limit=10&offset=0',
                headers: { 'Authorization': 'Token '+token},
                method: 'GET'
            }).its('body').then( body => {
                expect(body.articles[0].title).not.to.equal('Request from API')
            })
        })
    })
})
