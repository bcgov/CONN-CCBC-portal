import 'happo-cypress';

Cypress.Commands.add('sqlFixture', (fixtureName) => {
  return cy.fixture(`${fixtureName}.sql`).then((fixture) =>
    cy.exec(
      `psql -v "ON_ERROR_STOP=1" -d ccbc<< 'EOF'
${fixture}
EOF`
    )
  );
});
