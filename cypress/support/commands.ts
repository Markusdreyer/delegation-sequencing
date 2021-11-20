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
  return cy.contains("chevron_right").click();
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

Cypress.Commands.add("generateActionCards", () => {
  return cy.get("[data-testid=generate-action-cards-button]").click();
});

Cypress.Commands.add("verifyGeneratedActions", (expectedActions: number) => {
  return cy
    .get("[data-testid=action-card]")
    .should("have.length", expectedActions);
});

Cypress.Commands.add("getActionCard", (index: number) => {
  return cy.get("[data-testid=action-card]").eq(index);
});

const toStrings = (cells$: any) => Cypress._.map(cells$, "textContent");
const toNumbers = (texts: any) => Cypress._.map(texts, Number);
const sum = (numbers: any) => Cypress._.sum(numbers);
