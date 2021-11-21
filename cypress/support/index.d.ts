declare namespace Cypress {
  interface Chainable {
    save(row: number): Chainable;
    edit(row: number): Chainable;
    nextPage(): Chainable;
    previousPage(): Chainable;
    lastPage(): Chainable;
    firstPage(): Chainable;
    deselectMultiselect(row: number, cell: number): Chainable;
    selectMultiselect(row: number, cell: number): Chainable;
    getCellValues(cell: number): Chainable;
    countQuantity(total: number): Chainable;
    generateActionCards(): Chainable;
    verifyGeneratedActions(expectedActions): Chainable;
    getActionCard(index: number): Chainable;
    openSidebar(): Chainable;
    selectTaxonomy(taxonomy: string): Chainable;
    selectProcedure(index: number): Chainable;
  }
}
