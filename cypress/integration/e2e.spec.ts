const url = "localhost:3000";
let numberOfExpectedActions = 0;
describe("Verify generated action cards", () => {
  it("should fail to fetch action cards", () => {
    cy.visit(url);
    cy.generateActionCards();
    cy.contains('"Result": "UNSATISFIABLE"');
  });

  it("should successfully fetch action cards", () => {
    cy.nextPage();
    cy.edit(1);
    cy.deselectMultiselect(1, 3);
    cy.save(1);
    cy.generateActionCards();
    cy.previousPage();
    cy.contains("Submit revised plan");
  });

  it("should count number of expected actions", () => {
    cy.countQuantity(0).then((res) => {
      numberOfExpectedActions = res;
    });
  });

  it("should verify number of expected actions with number of generated actions", () => {
    cy.verifyGeneratedActions(numberOfExpectedActions);
  });

  it("should change action quantity", () => {
    cy.firstPage();
    cy.edit(1);
    cy.get("input[placeholder=Quantity]").clear().type("2");
    cy.save(1);
    cy.wait(10);
  });

  it("should verify quantity change", () => {
    cy.intercept({
      method: "POST",
      url: "/initial",
    }).as("fetchInitialModel");
    cy.generateActionCards();
    cy.wait("@fetchInitialModel")
      .its("response.statusCode")
      .should("equal", 200);
    return cy.countQuantity(0).then((res) => cy.verifyGeneratedActions(res));
  });

  it("should verify role restrictions", () => {
    cy.getActionCard(4).get("td:nth-child(1)").contains("john");
    cy.firstPage();
    cy.edit(4);
    cy.selectMultiselect(4, 3);
    cy.save(4);
    cy.intercept({
      method: "POST",
      url: "/initial",
    }).as("fetchInitialModel");
    cy.generateActionCards();
    cy.wait("@fetchInitialModel")
      .its("response.statusCode")
      .should("equal", 200);
    cy.getActionCard(4).get("td:nth-child(1)").contains("barry");
  });
});

//cy.get("#navToggle").click
//cy.visit(url)
//cy.contains(text).click
//cy.get("notification-message").children().should("contain", "Login").and("be.visible")
//cy.get("input[name=email]").type(email)
