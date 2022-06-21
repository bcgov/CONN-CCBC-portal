/* eslint-disable cypress/no-unnecessary-waiting */
context('Homepage', () => {
  beforeEach(function () {
    cy.visit('/');
  });

  // Commenting out radio inputs until we pass in proper names or ids to select from

  it('should start and fill the first page of the form', () => {
    cy.get('body').happoScreenshot();

    cy.get('h1').contains('Welcome');

    // Todo: find a way around using these wait
    cy.wait(2000);

    cy.get('button').contains('Go to dashboard').should('be.visible').click();

    cy.wait(2000);

    // Dashboard page
    cy.get('h1').contains('Dashboard').should('be.visible');

    cy.get('button').contains('New application').should('be.visible').click();

    cy.wait(2000);

    // Project information page
    cy.get('h1').contains('Project information').should('be.visible');

    cy.get('[id="root_projectTitle"]').type('test');

    cy.get('[id="root_geographicAreaDescription"]').type('test');

    cy.get('[id="root_projectDescription"]').type('test');

    cy.get('button').contains('Continue').should('be.visible').click();

    cy.wait(2000);

    // Project area page
    cy.get('h1').contains('Project area').should('be.visible');

    cy.get('input[id="root_geographicArea-0"]').parent().click();
    cy.get('input[id="root_geographicArea-1"]').parent().click();
    cy.get('input[id="root_geographicArea-2"]').parent().click();
    cy.get('input[id="root_geographicArea-3"]').parent().click();
    cy.get('input[id="root_geographicArea-4"]').parent().click();
    cy.get('input[id="root_geographicArea-5"]').parent().click();
    cy.get('input[id="root_geographicArea-6"]').parent().click();
    cy.get('input[id="root_geographicArea-7"]').parent().click();
    cy.get('input[id="root_geographicArea-8"]').parent().click();
    cy.get('input[id="root_geographicArea-9"]').parent().click();
    cy.get('input[id="root_geographicArea-10"]').parent().click();
    cy.get('input[id="root_geographicArea-11"]').parent().click();
    cy.get('input[id="root_geographicArea-12"]').parent().click();
    cy.get('input[id="root_geographicArea-13"]').parent().click();

    cy.get('input[id="root_projectSpanMultipleLocations-0"]').parent().click();

    cy.get('input[id="root_provincesTerritories-0"]').parent().click();
    cy.get('input[id="root_provincesTerritories-1"]').parent().click();
    cy.get('input[id="root_provincesTerritories-2"]').parent().click();

    cy.get('button').contains('Continue').should('be.visible').click();

    cy.wait(2000);

    // Existing network coverage page

    cy.get('h1').contains('Existing network coverage').should('be.visible');

    cy.get('input[id="root_hasProvidedExitingNetworkCoverage-0"]')
      .parent()
      .click();
    cy.get('input[id="root_hasProvidedExitingNetworkCoverage-1"]')
      .parent()
      .click();
    cy.get('input[id="root_hasProvidedExitingNetworkCoverage-2"]')
      .parent()
      .click();

    cy.get('input[id="root_hasPassiveInfrastructure-0"]').parent().click();
    cy.get('input[id="root_hasPassiveInfrastructure-1"]').parent().click();

    cy.get('input[id="root_isInfrastuctureAvailable-0"]').parent().click();
    cy.get('input[id="root_isInfrastuctureAvailable-1"]').parent().click();

    cy.get('input[id="root_requiresThirdPartyInfrastructureAccess-0"]')
      .parent()
      .click();
    cy.get('input[id="root_requiresThirdPartyInfrastructureAccess-1"]')
      .parent()
      .click();

    cy.get('button').contains('Continue').should('be.visible').click();

    cy.wait(2000);

    // Budget details page

    cy.get('h1').contains('Budget details').should('be.visible');

    cy.get('[id="root_totalEligbleCosts"]').type('test');

    cy.get('[id="root_totalProjectCost"]').type('test');

    cy.get('[id="root_requestedCCBCFunding"]').type('test');

    cy.get('button').contains('Continue').should('be.visible').click();

    cy.wait(2000);

    // Project funding page

    cy.get('h1').contains('Project funding').should('be.visible');

    // TODO: PROJECT FUNDING DETAILS

    cy.get('button').contains('Continue').should('be.visible').click();

    cy.wait(2000);

    // Technological solution page

    cy.get('h1').contains('Technological solution').should('be.visible');

    cy.get('[id="root_systemDesign"]').type('test');

    cy.get('[id="root_scalability"]').type('test');

    cy.get('input[id="root_backboneTechnology-0"]').parent().click();
    cy.get('input[id="root_backboneTechnology-1"]').parent().click();
    cy.get('input[id="root_backboneTechnology-2"]').parent().click();

    cy.get('input[id="root_lastMileTechnology-0"]').parent().click();
    cy.get('input[id="root_lastMileTechnology-1"]').parent().click();
    cy.get('input[id="root_lastMileTechnology-2"]').parent().click();
    cy.get('input[id="root_lastMileTechnology-3"]').parent().click();

    cy.get('button').contains('Continue').should('be.visible').click();

    cy.wait(2000);

    // Benefits page

    cy.get('h1').contains('Benefits').should('be.visible');

    cy.get('[id="root_projectBenefits"]').type('test');

    cy.get('[id="root_numberOfHouseholds"]').type('123');

    cy.get('button').contains('Continue').should('be.visible').click();

    cy.wait(2000);

    // Project planning and management page

    cy.get('h1')
      .contains('Project planning and management')
      .should('be.visible');

    // Todo: fix typing
    cy.get('[id="root_projectStartDate"]');

    // Todo: fix typing
    cy.get('[id="root_projectCompletionDate"]');

    cy.get('[id="root_relationshipManagerApplicant"]').type('test');

    cy.get('[id="root_overviewOfProjectParticipants"]').type('test');

    cy.get('[id="root_operationalPlan"]').type('test');

    cy.get('button').contains('Continue').should('be.visible').click();

    cy.wait(2000);

    // Estimated project employment page

    cy.get('h1').contains('Estimated project employment').should('be.visible');

    cy.get('[id="root_currentEmployment"]').type('test');

    cy.get('[id="root_estimatedDirectEmployees_numberOfEmployeesToWork"]').type(
      'test'
    );

    cy.get(
      '[id="root_estimatedDirectEmployees_hoursOfEmploymentPerWeek"]'
    ).type('test');

    cy.get('[id="root_estimatedDirectEmployees_personMonthsToBeCreated"]').type(
      'test'
    );

    cy.get(
      '[id="root_estimatedContractorLabour_numberOfContractorsToWork"]'
    ).type('test');

    cy.get(
      '[id="root_estimatedContractorLabour_hoursOfContractorEmploymentPerWeek"]'
    ).type('test');

    cy.get(
      '[id="root_estimatedContractorLabour_contractorPersonMonthsToBeCreated"]'
    ).type('test');

    cy.get('button').contains('Continue').should('be.visible').click();

    cy.wait(2000);

    // Organization Profile page

    cy.get('h1').contains('Organization Profile').should('be.visible');

    cy.get('input[id="root_typeOfOrganization-0"]').parent().click();
    cy.get('input[id="root_typeOfOrganization-1"]').parent().click();
    cy.get('input[id="root_typeOfOrganization-2"]').parent().click();
    cy.get('input[id="root_typeOfOrganization-3"]').parent().click();
    cy.get('input[id="root_typeOfOrganization-4"]').parent().click();
    cy.get('input[id="root_typeOfOrganization-5"]').parent().click();
    cy.get('input[id="root_typeOfOrganization-6"]').parent().click();
    cy.get('input[id="root_typeOfOrganization-7"]').parent().click();
    cy.get('input[id="root_typeOfOrganization-8"]').parent().click();
    cy.get('input[id="root_typeOfOrganization-9"]').parent().click();
    cy.get('input[id="root_typeOfOrganization-10"]').parent().click();
    cy.get('input[id="root_typeOfOrganization-11"]').parent().click();
    cy.get('input[id="root_typeOfOrganization-12"]').parent().click();
    cy.get('input[id="root_typeOfOrganization-13"]').parent().click();
    cy.get('input[id="root_typeOfOrganization-14"]').parent().click();

    cy.get('input[id="root_organizationName"]').type('test');

    cy.get('input[id="root_isLegalPrimaryName-1"]').parent().click();

    cy.get('input[id="root_isNameLegalName-0"]').parent().click();

    cy.get('input[id="root_isNameLegalName-0"]').parent().click();

    cy.get('input[id="root_isSubsidiary-0"]').parent().click();

    cy.get('input[id="root_parentOrgName"]').type('test');

    cy.get('input[id="root_isIndigenousEntity-0"]').parent().click();

    cy.get('input[id="root_indigenousEntityDesc"]').type('test');

    // Todo: Datepicker test
    cy.get('input[id="root_orgRegistrationDate"]');

    cy.get('input[id="root_bussinessNumber"]').type(123);

    cy.get('button').contains('Continue').should('be.visible').click();

    cy.wait(2000);

    // Organization location page

    cy.get('h1').contains('Organization location').should('be.visible');

    cy.get('input[id="root_streetNumber"]').type(123);

    cy.get('input[id="root_streetName"]').type('test');

    cy.get('input[id="root_POBox"]').type('test');

    cy.get('input[id="root_city"]').type('test');

    cy.get('select[id="root_province"]').select('British Columbia');

    cy.get('input[id="root_postalCode"]').type('test');

    cy.get('input[id="root_isMailingAddress-1"]').parent().click();

    cy.get('input[id="root_mailingAddress_unitNumberMailing"]').type('test');

    cy.get('input[id="root_mailingAddress_streetNumberMailing"]').type('test');

    cy.get('input[id="root_mailingAddress_streetNameMailing"]').type('test');

    cy.get('input[id="root_mailingAddress_POBoxMailing"]').type('test');

    cy.get('input[id="root_mailingAddress_cityMailing"]').type('test');

    cy.get('select[id="root_mailingAddress_provinceMailing"]').select(
      'British Columbia'
    );

    cy.get('input[id="root_mailingAddress_postalCodeMailing"]').type('test');

    cy.get('button').contains('Continue').should('be.visible').click();

    cy.wait(2000);

    // Organization contact information page

    cy.get('h1')
      .contains('Organization contact information')
      .should('be.visible');

    cy.get('input[id="root_contactTelephoneNumber"]').type('123-4567');

    cy.get('input[id="root_contactExtension"]').type('123');

    cy.get('input[id="root_contactEmail"]').type('test@test.com');

    cy.get('input[id="root_contactWebsite"]').type('test');

    cy.get('button').contains('Continue').should('be.visible').click();

    cy.wait(2000);

    // Authorized contact page

    cy.get('h1').contains('Authorized contact').should('be.visible');

    cy.get('input[id="root_authFamilyName"]').type('test');

    cy.get('input[id="root_authGivenName"]').type('test');

    cy.get('input[id="root_authPostionTitle"]').type('test');

    cy.get('input[id="root_authEmail"]').type('test@test.com');

    cy.get('input[id="root_authTelephone"]').type('123-456');

    cy.get('input[id="root_authExtension"]').type('123');

    cy.get('input[id="root_isAuthContactSigningOfficer-0"]').parent().click();

    cy.get('input[id="root_isFirstContact"]').parent().click();

    cy.get('button').contains('Continue').should('be.visible').click();

    cy.wait(2000);

    // Alternate contact page

    cy.get('h1').contains('Alternate contact').should('be.visible');

    cy.get('input[id="root_altFamilyName"]').type('test');

    cy.get('input[id="root_altGivenName"]').type('test');

    cy.get('input[id="root_altPostionTitle"]').type('test');

    cy.get('input[id="root_altEmail"]').type('test@test.com');

    cy.get('input[id="root_altTelephone"]').type('123-456');

    cy.get('input[id="root_altExtension"]').type('123');

    cy.get('input[id="root_isAltContactSigningOfficer-0"]').parent().click();

    cy.get('input[id="root_isAltFirstContact"]').parent().click();

    cy.get('button').contains('Continue').should('be.visible').click();

    cy.wait(2000);

    // Declarations page

    cy.get('h1').contains('Declarations').should('be.visible');

    cy.get('input[id="root_declarationsList-0"]').parent().click();

    cy.get('input[id="root_declarationsList-1"]').parent().click();

    cy.get('input[id="root_declarationsList-2"]').parent().click();

    cy.get('input[id="root_declarationsList-3"]').parent().click();

    cy.get('input[id="root_declarationsList-4"]').parent().click();

    cy.get('input[id="root_declarationsList-5"]').parent().click();

    cy.get('input[id="root_declarationsList-6"]').parent().click();

    cy.get('input[id="root_declarationsList-7"]').parent().click();

    cy.get('input[id="root_declarationsList-8"]').parent().click();

    cy.get('input[id="root_declarationsList-9"]').parent().click();

    cy.get('input[id="root_declarationsList-10"]').parent().click();

    cy.get('input[id="root_declarationsList-11"]').parent().click();

    cy.get('input[id="root_declarationsList-12"]').parent().click();

    cy.get('input[id="root_declarationsList-13"]').parent().click();

    cy.get('input[id="root_declarationsList-14"]').parent().click();

    cy.get('input[id="root_declarationsList-15"]').parent().click();

    cy.get('button').contains('Continue').should('be.visible').click();

    cy.wait(2000);

    // Sign Declarations

    cy.get('h1').contains('Declarations').should('be.visible');

    cy.get('input[id="root_declarationsCompletedFor"]').type('test');

    // Todo: fix typing
    cy.get('[id="root_declarationsDate"]');

    cy.get('input[id="root_declarationsCompletedBy"]').type('test');

    cy.get('input[id="root_declarationsTitle"]').type('test');

    cy.get('button').contains('Complete form').should('be.visible').click();

    cy.wait(2000);

    // Success page

    cy.get('h2').contains('Application complete').should('be.visible');

    cy.get('h3')
      .contains('Thank you for applying to CCBC Intake 1')
      .should('be.visible');

    cy.get('body').happoScreenshot();

    cy.get('button')
      .contains('Return to dashboard')
      .should('be.visible')
      .click();

    cy.wait(4000);

    // cy.get('body').happoScreenshot();
  });

  it('should render the header', () => {
    cy.get('header').contains('Help');
    cy.get('header').get('.banner').find('img');
    cy.get('.pg-menu-group').find('a').contains('Dashboard');
    cy.get('.pg-menu-group').find('form').get('button').contains('Login');
  });

  it('should render the footer', () => {
    cy.get('footer').contains('Home');
    cy.get('footer').contains('Disclaimer');
    cy.get('footer').contains('Privacy');
    cy.get('footer').contains('Accessibility');
    cy.get('footer').contains('Copyright');
  });
});
