const url = "localhost:3000";
let numberOfExpectedActions = 0;
describe.skip("Verify EA fire scenario and taxonomy", () => {
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
    cy.generateActionCards();
    return cy.countQuantity(0).then((res) => cy.verifyGeneratedActions(res));
  });

  it("should verify role restrictions", () => {
    cy.getActionCard(4).get("td:nth-child(1)").contains("john");
    cy.firstPage();
    cy.edit(4);
    cy.selectMultiselect(4, 3);
    cy.save(4);
    cy.generateActionCards();
    cy.getActionCard(4).get("td:nth-child(1)").contains("barry");
  });
});

describe("Verify Hamar scenario and taxonomy", () => {
  it("should select Hamar scenario and taxonomy", () => {
    cy.visit(url);
    cy.openSidebar();
    cy.selectProcedure(4);
    cy.selectTaxonomy("Hamar");
  });

  it("should verify generated actions match expected actions", () => {
    cy.generateActionCards();
    return cy.countQuantity(0).then((res) => cy.verifyGeneratedActions(res));
  });
});

//cy.get("#navToggle").click
//cy.visit(url)
//cy.contains(text).click
//cy.get("notification-message").children().should("contain", "Login").and("be.visible")
//cy.get("input[name=email]").type(email)
