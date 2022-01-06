const url = "localhost:3000";
describe("Verify EA fire scenario and taxonomy", () => {
  it("should fail to fetch action cards", () => {
    cy.visit(url);
    cy.wait(2000);
    cy.generateActionCards(400);
    cy.contains('"Result": "UNSATISFIABLE"');
  });

  it("should successfully fetch action cards", () => {
    cy.nextPage();
    cy.edit(1);
    cy.deselectMultiselect(1, 3);
    cy.save(1);
    cy.generateActionCards(200);
    cy.previousPage();
    cy.contains("Submit revised plan");
  });

  it("should verify number of expected actions with number of generated actions", () => {
    cy.generateActionCards(200);
    return cy.countQuantity(0).then((res) => cy.verifyGeneratedActions(res));
  });

  it("should change action quantity", () => {
    cy.firstPage();
    cy.edit(1);
    cy.get("input[placeholder=Quantity]").clear().type("2");
    cy.save(1);
    cy.wait(10);
  });

  it("should verify quantity change", () => {
    cy.generateActionCards(200);
    return cy.countQuantity(0).then((res) => cy.verifyGeneratedActions(res));
  });

  it("should verify role restrictions", () => {
    cy.getActionCard(4).get("td:nth-child(1)").contains("john");
    cy.firstPage();
    cy.edit(4);
    cy.selectMultiselect(4, 3);
    cy.save(4);
    cy.generateActionCards(200);
    cy.getActionCard(4).get("td:nth-child(1)").contains("barry");
  });
});

describe("Verify Hamar scenario and taxonomy", () => {
  it("should select Hamar scenario and taxonomy", () => {
    cy.openSidebar();
    cy.selectProcedure(1);
    cy.wait(500);
    cy.selectTaxonomy("Hamar");
  });

  it("should verify generated actions match expected actions", () => {
    cy.generateActionCards(200);
    return cy.countQuantity(0).then((res) => cy.verifyGeneratedActions(res));
  });

  it("should verify selected agents", () => {
    //Actions at 1
    cy.verifyActionCardAgent(0, "lukas");
    //Actions at 2
    cy.verifyActionCardAgent(1, "ingolf");
    cy.verifyActionCardAgent(2, "peter");
    //Actions at 3
    cy.verifyActionCardAgent(3, "sven");
    cy.verifyActionCardAgent(4, "miriam");
    cy.verifyActionCardAgent(5, "ingolf");
    cy.verifyActionCardAgent(6, "kari");
    cy.verifyActionCardAgent(7, "rikard");
    cy.verifyActionCardAgent(8, "herman");
    cy.verifyActionCardAgent(9, "mikael");
    cy.verifyActionCardAgent(10, "morten");
    cy.verifyActionCardAgent(11, "halvard");
    //Actions at 4
    cy.verifyActionCardAgent(12, "ingolf");
    cy.verifyActionCardAgent(13, "theodor");
  });

  it("should verify available agents", () => {
    cy.reviseAction(0);
    cy.verifyRevisionOptions(1);
    cy.reviseAction(2);
    cy.verifyRevisionOptions(2);
    cy.reviseAction(9);
    cy.verifyRevisionOptions(10);
    cy.reviseAction(10);
    cy.verifyRevisionOptions(12);
    cy.reviseAction(11);
    cy.verifyRevisionOptions(10);
  });

  it("should verify revised agents", () => {
    cy.relieveAgent();
    cy.reviseAction(13); //Weird that it skips 12.. Whatever, it's atleast the last element
    cy.scheduleAgent(1);
    cy.submitRevision();
    cy.verifyActionCardAgent(9, "lukas");
    cy.verifyActionCardAgent(10, "sven");
    cy.firstPage();
    return cy.countQuantity(0).then((res) => cy.verifyGeneratedActions(res));
  });
});