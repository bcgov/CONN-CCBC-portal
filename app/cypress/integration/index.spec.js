context('Homepage', () => {
  beforeEach(function () {
    cy.visit('/');
  });

  it('should start and fill the first page of the form', () => {
    cy.get('body').happoScreenshot();

    cy.get('button').contains('Start Form').click();

    // Specifying the type was unnecessary but possibly safer to be more specific
    cy.get('input[name="Organization name (legal name)"][type="input"]').type(
      'test'
    );

    // We click their parent since the labels are hiding the inputs
    cy.get('input[name="Is this the primary legal name?"][type="radio"]')
      .first()
      .parent()
      .click();

    cy.get('input[name="Is operating name same as legal name?"][type="radio"]')
      .first()
      .parent()
      .click();

    cy.get('input[name="Operating name (if different)"][type="input"]').type(
      'test'
    );

    // Type of organization checkbox group
    cy.get('input[name="root_typeOfOrganization_0-checkbox"][type="checkbox"]')
      .parent()
      .click();
    cy.get('input[name="root_typeOfOrganization_1-checkbox"][type="checkbox"]')
      .parent()
      .click();
    cy.get('input[name="root_typeOfOrganization_2-checkbox"][type="checkbox"]')
      .parent()
      .click();
    cy.get('input[name="root_typeOfOrganization_3-checkbox"][type="checkbox"]')
      .parent()
      .click();
    cy.get('input[name="root_typeOfOrganization_4-checkbox"][type="checkbox"]')
      .parent()
      .click();
    cy.get('input[name="root_typeOfOrganization_5-checkbox"][type="checkbox"]')
      .parent()
      .click();
    cy.get('input[name="root_typeOfOrganization_6-checkbox"][type="checkbox"]')
      .parent()
      .click();
    cy.get('input[name="root_typeOfOrganization_7-checkbox"][type="checkbox"]')
      .parent()
      .click();
    cy.get('input[name="root_typeOfOrganization_8-checkbox"][type="checkbox"]')
      .parent()
      .click();
    cy.get('input[name="root_typeOfOrganization_9-checkbox"][type="checkbox"]')
      .parent()
      .click();
    cy.get('input[name="root_typeOfOrganization_10-checkbox"][type="checkbox"]')
      .parent()
      .click();
    cy.get('input[name="root_typeOfOrganization_11-checkbox"][type="checkbox"]')
      .parent()
      .click();
    cy.get('input[name="root_typeOfOrganization_12-checkbox"][type="checkbox"]')
      .parent()
      .click();
    cy.get('input[name="root_typeOfOrganization_13-checkbox"][type="checkbox"]')
      .parent()
      .click();
    cy.get('input[name="root_typeOfOrganization_14-checkbox"][type="checkbox"]')
      .parent()
      .click();

    cy.get(
      'input[name="If band council, please specify the band number"][type="input"]'
    ).type('test');

    cy.get(
      'input[name="Is this applicant organization an Idigenous entity?"][type="radio"]'
    )
      .first()
      .parent()
      .click();

    cy.get(
      'input[name="Please provide a short description of the Indigenous entity"][type="input"]'
    ).type('test');

    cy.get(
      'input[name="Please provide a short description of the Indigenous entity"][type="input"]'
    ).type('test');

    cy.get(
      'textarea[name="Provide an overview of the organization. Include an overview of its current business model, years in business, experience in operating broadband services, previous federal broadband funding (if applicable), mission/mandate/vision, size of operation (e.g. annual revenue, assets, number of staff), membership (if applicable), current coverage and subscription base (maximum 3,500 characters)"]'
    )
      .first()
      .type('test');

    cy.get(
      'input[name="Data of incorporation or registration"][type="input"]'
    ).type('test');

    cy.get(
      'input[name="Applicant business number (9-digit business identifier provided by Canada Revenue Agency)"][type="input"]'
    ).type('test');

    cy.get('body').happoScreenshot();
  });

  it('should render the header', () => {
    cy.get('header').contains('Help');
    cy.get('header').get('.banner').find('svg');
    cy.get('h1').contains('Connecting Communities BC');
  });

  it('should render the footer', () => {
    cy.get('footer').contains('Home');
    cy.get('footer').contains('Disclaimer');
    cy.get('footer').contains('Privacy');
    cy.get('footer').contains('Accessibility');
    cy.get('footer').contains('Copyright');
  });
});
