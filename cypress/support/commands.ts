// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("save", (row: number) => {
  return cy
    .get("table")
    .find("tr")
    .eq(row)
    .find("td")
    .eq(1)
    .contains("check")
    .click({ force: true });
});

Cypress.Commands.add("edit", (row: number) => {
  return cy
    .get("table")
    .find("tr")
    .eq(row)
    .find("td")
    .eq(1)
    .contains("edit")
    .click();
});

Cypress.Commands.add("nextPage", () => {
  return cy.contains("chevron_right").click({ force: true });
});

Cypress.Commands.add("previousPage", () => {
  return cy.contains("chevron_left").click();
});

Cypress.Commands.add("lastPage", () => {
  return cy.contains("last_page").click();
});

Cypress.Commands.add("firstPage", () => {
  return cy.contains("first_page").click();
});

Cypress.Commands.add("deselectMultiselect", (row: number, cell: number) => {
  return cy
    .get("table")
    .find("tr")
    .eq(row)
    .find("td")
    .eq(cell)
    .click()
    .get("li.MuiListItem-button")
    .click();
});

Cypress.Commands.add("selectMultiselect", (row: number, cell: number) => {
  return cy
    .get("table")
    .find("tr")
    .eq(row)
    .find("td")
    .eq(cell)
    .click()
    .get("li.MuiListItem-button")
    .click();
});

Cypress.Commands.add("getCellValues", (cell: number) => {
  return cy.get(".MuiTableBody-root").each((row) => row.find("td").eq(cell));
});

Cypress.Commands.add("countQuantity", (total: number) => {
  return cy
    .get("td:nth-child(6)")
    .then(toStrings)
    .then(toNumbers)
    .then(sum)
    .then((sum) => {
      cy.contains("chevron_right").then((btn: any) => {
        if (btn!.is(":disabled")) {
          return sum + total;
        } else {
          cy.nextPage();
          cy.countQuantity(sum + total);
        }
      });
    });
});

Cypress.Commands.add("generateActionCards", (status: number) => {
  cy.intercept({
    method: "POST",
    url: "/initial",
  }).as("fetchInitialModel");
  cy.get("[data-testid=generate-action-cards-button]").click();
  return cy
    .wait("@fetchInitialModel")
    .its("response.statusCode")
    .should("equal", status);
});

Cypress.Commands.add("verifyGeneratedActions", (expectedActions: number) => {
  return cy
    .get("[data-testid=action-card]")
    .should("have.length", expectedActions);
});

Cypress.Commands.add("getActionCard", (index: number) => {
  return cy.get("[data-testid=action-card]").eq(index);
});

Cypress.Commands.add("openSidebar", () => {
  return cy.get("[aria-label='open drawer']").click();
});

Cypress.Commands.add("selectProcedure", (index: number) => {
  return cy
    .get("[data-testid='procedure-dropdown']")
    .click()
    .get("[data-testid='procedure']")
    .eq(index)
    .click();
});

Cypress.Commands.add("selectTaxonomy", (taxonomy: string) => {
  return cy
    .get("[data-testid='taxonomy-selector']")
    .click()
    .get(`[data-value='${taxonomy}']`)
    .click();
});

Cypress.Commands.add("editTaxonomy", (index: number) => {
  return cy
    .get("[data-testid='taxonomy-dropdown']")
    .click()
    .get("[data-testid='procedure']")
    .eq(index)
    .click();
});

Cypress.Commands.add("reviseAction", (index: number) => {
  return cy
    .get("[data-testid='revise-button']")
    .eq(index)
    .click({ force: true });
});

Cypress.Commands.add("verifyRevisionOptions", (length: number) => {
  return cy
    .get("[data-testid='revision-options']")
    .should("have.length", length);
});

Cypress.Commands.add("relieveAgent", () => {
  return cy.get("[data-testid='relieve-button']").click();
});

Cypress.Commands.add("scheduleAgent", (index: number) => {
  return cy.get("[data-testid='schedule-button']").eq(index).click();
});

Cypress.Commands.add(
  "verifyActionCardAgent",
  (index: number, agent: string) => {
    return cy
      .get("[data-testid=action-card]")
      .eq(index)
      .find("td:nth-child(1)")
      .contains(agent);
  }
);

Cypress.Commands.add("submitRevision", () => {
  cy.intercept({
    method: "POST",
    url: "/revise",
  }).as("fetchRevisedModel");
  cy.get("[data-testid='revision-submit-button']").click({ force: true });
  return cy
    .wait("@fetchRevisedModel")
    .its("response.statusCode")
    .should("equal", 200);
});

const toStrings = (cells$: any) => Cypress._.map(cells$, "textContent");
const toNumbers = (texts: any) => Cypress._.map(texts, Number);
const sum = (numbers: any) => Cypress._.sum(numbers);
