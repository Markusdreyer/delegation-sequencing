/// <reference types="cypress" />

const url = "localhost:3000";
describe("Hello", () => {
  it("foo", () => {
    cy.visit(url);
    cy.contains("EA fire");
  });
});
