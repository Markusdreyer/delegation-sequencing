describe("Verify taxonomy creation", () => {
  const url = "localhost:3000";
  const taxonomyName = "E2E taxonomy test";
  const firstParent = "First parent agent";
  const firstChild = "First child agent";
  const driverRole = "driver";

  it("should create a new taxonomy", () => {
    cy.visit(url);
    cy.wait(2000);
    cy.openSidebar();
    cy.get("[data-testid='new-taxonomy'").click();
    cy.get("[data-testid='dialog-input'").type(taxonomyName);
    cy.get("[data-testid='dialog-submit'").click();
    cy.contains(taxonomyName);
    cy.wait(2000);
  });

  it("should create a new parent element", () => {
    cy.contains("add_box").click();
    cy.get("input[placeholder=Agent]").type(firstParent);
    cy.save(1);
  });

  it("should verify the parent element", () => {
    cy.get("table").find("tr").eq(1).find("td").eq(2).contains(firstParent);
    cy.get("table").find("tr").eq(1).find("td").eq(4).contains("None");
  });

  it("should create a child element", () => {
    cy.contains("add_box").click();
    cy.get("input[placeholder=Agent]").type(firstChild);
    cy.get("input[placeholder=Role]").type(driverRole);
    cy.get(".MuiFormControl-root > .MuiInputBase-root > .MuiSelect-root")
      .click()
      .get("li.MuiListItem-button:nth-child(1)")
      .click();
    cy.save(2);
  });

  it("should verify the child element", () => {
    cy.get("table").find("tr").eq(1).find("td").eq(0).click();
    cy.get("table").find("tr").eq(2).find("td").eq(2).contains(firstChild);
    cy.get("table").find("tr").eq(2).find("td").eq(4).contains(firstParent);
  });

  it("should delete the taxonomy and all its data", () => {
    cy.get("[data-testid='delete-document'").click();
  });
});
