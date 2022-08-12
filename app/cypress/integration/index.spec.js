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

    cy.waitUntil(() => cy.url().should('contain', '/dashboard'));

    // Dashboard page

    cy.waitUntil(() => cy.get('h1').contains('Dashboard').should('be.visible'));

    cy.get('button').contains('New application').should('be.visible').click();

    cy.wait(4000);

    // Project information page

    cy.waitUntil(() =>
      cy.get('h1').contains('Project information').should('be.visible')
    );

    cy.waitUntil(() => cy.get('[id="root_projectTitle"]').should('be.visible'));

    cy.get('[id="root_geographicAreaDescription"]')
      .should('be.visible')
      .type('test');

    cy.get('[id="root_projectDescription"]').should('be.visible').type('test');

    cy.get('button').contains('Continue').should('be.visible').click();

    cy.wait(2000);

    // Project area page

    cy.waitUntil(() =>
      cy.get('h1').contains('Project area').should('be.visible')
    );

    cy.waitUntil(() =>
      cy
        .get('input[id="root_geographicArea-0"]')
        .parent()
        .should('be.visible')
        .then((e) => {
          Cypress.$(e).click();
        })
    );

    cy.get('input[id="root_geographicArea-0"]').parent().click({ force: true });
    cy.get('input[id="root_geographicArea-1"]').parent().click({ force: true });
    cy.get('input[id="root_geographicArea-2"]').parent().click({ force: true });
    cy.get('input[id="root_geographicArea-3"]').parent().click({ force: true });
    cy.get('input[id="root_geographicArea-4"]').parent().click({ force: true });
    cy.get('input[id="root_geographicArea-5"]').parent().click({ force: true });
    cy.get('input[id="root_geographicArea-6"]').parent().click({ force: true });
    cy.get('input[id="root_geographicArea-7"]').parent().click({ force: true });
    cy.get('input[id="root_geographicArea-8"]').parent().click({ force: true });
    cy.get('input[id="root_geographicArea-9"]').parent().click({ force: true });
    cy.get('input[id="root_geographicArea-10"]')
      .parent()
      .click({ force: true });
    cy.get('input[id="root_geographicArea-11"]')
      .parent()
      .click({ force: true });
    cy.get('input[id="root_geographicArea-12"]')
      .parent()
      .click({ force: true });
    cy.get('input[id="root_geographicArea-13"]')
      .parent()
      .click({ force: true });

    cy.get('input[id="root_projectSpanMultipleLocations-0"]').parent().click();

    cy.get('input[id="root_provincesTerritories-0"]').parent().click();
    cy.get('input[id="root_provincesTerritories-1"]').parent().click();
    cy.get('input[id="root_provincesTerritories-2"]').parent().click();

    cy.get('button').contains('Continue').should('be.visible').click();

    cy.wait(2000);

    // Existing network coverage page
    cy.waitUntil(() =>
      cy.get('h1').contains('Existing network coverage').should('be.visible')
    );

    cy.waitUntil(() =>
      cy
        .get('input[id="root_hasProvidedExitingNetworkCoverage-0"]')
        .parent()
        .should('be.visible')
    );

    cy.get('input[id="root_hasProvidedExitingNetworkCoverage-0"]')
      .parent()
      .click({ force: true });
    cy.get('input[id="root_hasProvidedExitingNetworkCoverage-1"]')
      .parent()
      .click({ force: true });
    cy.get('input[id="root_hasProvidedExitingNetworkCoverage-2"]')
      .parent()
      .click({ force: true });

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

    // // Budget details page
    cy.waitUntil(() =>
      cy.get('h1').contains('Budget details').should('be.visible')
    );

    cy.get('[id="root_totalEligibleCosts"]').should('be.visible');

    cy.get('[id="root_totalProjectCost"]').should('be.visible');

    cy.get('button').contains('Continue').should('be.visible').click();

    cy.wait(2000);

    // Project funding page
    cy.waitUntil(() =>
      cy.get('h1').contains('Project funding').should('be.visible')
    );

    cy.waitUntil(() => cy.get('[id="root_fundingRequestedCCBC2223"]')).then(
      () => {
        cy.wait(500);
      }
    );

    cy.get('[id="root_fundingRequestedCCBC2223"]')
      .should('be.visible')
      .type(123);
    cy.get('[id="root_fundingRequestedCCBC2324"]')
      .should('be.visible')
      .type(123);
    cy.get('[id="root_fundingRequestedCCBC2425"]')
      .should('be.visible')
      .type(123);
    cy.get('[id="root_fundingRequestedCCBC2526"]')
      .should('be.visible')
      .type(123);
    cy.get('[id="root_fundingRequestedCCBC2627"]')
      .should('be.visible')
      .type(123);

    cy.get('[id="root_totalFundingRequestedCCBC"]')
      .should('be.visible')
      .type(12345);

    cy.get('[id="root_applicationContribution2223"]')
      .should('be.visible')
      .type(123);
    cy.get('[id="root_applicationContribution2324"]')
      .should('be.visible')
      .type(123);
    cy.get('[id="root_applicationContribution2425"]')
      .should('be.visible')
      .type(123);
    cy.get('[id="root_applicationContribution2526"]')
      .should('be.visible')
      .type(123);
    cy.get('[id="root_applicationContribution2627"]')
      .should('be.visible')
      .type(123);

    cy.get('[id="root_totalApplicantContribution"]')
      .should('be.visible')
      .type(12345);

    cy.get('button').contains('Continue').should('be.visible').click();

    cy.wait(2000);

    // // Other funding sources page
    cy.waitUntil(() =>
      cy.get('h1').contains('Other funding sources').should('be.visible')
    );

    cy.get('input[id="root_otherFundingSources-0"]')
      .parent()
      .click()
      .then(() => {
        cy.wait(500);
      });

    cy.waitUntil(() =>
      cy.get('[id="root_otherFundingSourcesArray_0_fundingPartnersName"]')
    );

    cy.get('[id="root_otherFundingSourcesArray_0_fundingPartnersName"]').type(
      'test'
    );

    cy.get(
      '[id="root_otherFundingSourcesArray_0_fundingSourceContactInfo"]'
    ).type('test');

    cy.get(
      'select[id="root_otherFundingSourcesArray_0_statusOfFunding"]'
    ).select('Submitted');

    cy.get('select[id="root_otherFundingSourcesArray_0_funderType"]').select(
      'Federal'
    );

    cy.get('[id="root_otherFundingSourcesArray_0_nameOfFundingProgram"]').type(
      'test'
    );

    cy.get(
      '[id="root_otherFundingSourcesArray_0_requestedFundingPartner2223"]'
    ).type(123);

    cy.get(
      '[id="root_otherFundingSourcesArray_0_requestedFundingPartner2324"]'
    ).type(123);

    cy.get(
      '[id="root_otherFundingSourcesArray_0_requestedFundingPartner2425"]'
    ).type(123);

    cy.get(
      '[id="root_otherFundingSourcesArray_0_requestedFundingPartner2526"]'
    ).type(123);

    cy.get(
      '[id="root_otherFundingSourcesArray_0_requestedFundingPartner2627"]'
    ).type(123);

    cy.get(
      '[id="root_otherFundingSourcesArray_0_totalRequestedFundingPartner"]'
    ).type(12345);

    cy.get('button').contains('Continue').should('be.visible').click();

    cy.wait(2000);

    // Technological solution page
    cy.waitUntil(() =>
      cy.get('h1').contains('Technological solution').should('be.visible')
    );

    cy.waitUntil(() => cy.get('[id="root_systemDesign"]'));

    cy.get('[id="root_systemDesign"]').type('test', { force: true });

    cy.get('[id="root_scalability"]').type('test', { force: true });

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

    cy.waitUntil(() => cy.get('h1').contains('Benefits').should('be.visible'));

    cy.get('[id="root_projectBenefits"]').type('test', { force: true });

    cy.get('[id="root_numberOfHouseholds"]').type('123');

    cy.get('button').contains('Continue').should('be.visible').click();

    cy.wait(2000);

    // // Project planning and management page
    cy.waitUntil(() =>
      cy
        .get('h1')
        .contains('Project planning and management')
        .should('be.visible')
    );

    cy.get('[id="root_projectStartDate"]');

    cy.get('[id="root_projectCompletionDate"]');

    cy.get('[id="root_relationshipManagerApplicant"]').type('test');

    cy.get('[id="root_overviewOfProjectParticipants"]').type('test');

    cy.get('[id="root_operationalPlan"]').type('test');

    cy.get('button').contains('Continue').should('be.visible').click();

    cy.wait(2000);

    // Estimated project employment page

    cy.get('h1').contains('Estimated project employment').should('be.visible');

    cy.get('[id="root_currentEmployment"]').type(20);

    cy.get('[id="root_numberOfEmployeesToWork"]').type(12);

    cy.get('[id="root_hoursOfEmploymentPerWeek"]').type(12);

    cy.get('[id="root_personMonthsToBeCreated"]').type(12);

    cy.get('[id="root_numberOfContractorsToWork"]').type(12);

    cy.get('[id="root_hoursOfContractorEmploymentPerWeek"]').type(12);

    cy.get('[id="root_contractorPersonMonthsToBeCreated"]').type(12);

    cy.get('button').contains('Continue').should('be.visible').click();

    cy.wait(2000);

    // Template uploads page

    cy.get('h1').contains('Template uploads').should('be.visible');

    // Todo: file uploads

    cy.get('button').contains('Continue').should('be.visible').click();

    cy.wait(2000);

    // Supporting documents page

    cy.get('h1').contains('Supporting documents').should('be.visible');

    // Todo: file uploads

    cy.get('button').contains('Continue').should('be.visible').click();

    cy.wait(2000);

    // Mapping page

    cy.get('h1').contains('Mapping').should('be.visible');

    // Todo: file uploads

    cy.get('button').contains('Continue').should('be.visible').click();

    cy.wait(2000);

    // Organization Profile page

    cy.get('h1').contains('Organization profile').should('be.visible');

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

    cy.get('input[id="root_isNameLegalName-0"]').parent().click();

    cy.get('input[id="root_isSubsidiary-0"]').parent().click();

    cy.get('input[id="root_parentOrgName"]').type('test');

    cy.get('input[id="root_isIndigenousEntity-0"]').parent().click();

    cy.get('input[id="root_indigenousEntityDesc"]').type('test');

    // Todo: Datepicker test
    cy.get('input[id="root_orgRegistrationDate"]');

    cy.get('input[id="root_businessNumber"]').type(123);

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

    cy.get('button').contains('Continue').should('be.visible').click();

    cy.wait(2000);

    // Review page

    cy.get('h1').contains('Review').should('be.visible');

    cy.get('input[id="review-confirmation-checkbox"]').parent().click();

    cy.get('button').contains('Continue').should('be.visible').click();

    cy.wait(2000);

    // Acknowledgements page

    cy.get('h1').contains('Acknowledgements').should('be.visible');

    cy.get('input[id="root_acknowledgementsList-0"]').parent().click();

    cy.get('input[id="root_acknowledgementsList-1"]').parent().click();

    cy.get('input[id="root_acknowledgementsList-2"]').parent().click();

    cy.get('input[id="root_acknowledgementsList-3"]').parent().click();

    cy.get('input[id="root_acknowledgementsList-4"]').parent().click();

    cy.get('input[id="root_acknowledgementsList-5"]').parent().click();

    cy.get('input[id="root_acknowledgementsList-6"]').parent().click();

    cy.get('input[id="root_acknowledgementsList-7"]').parent().click();

    cy.get('input[id="root_acknowledgementsList-8"]').parent().click();

    cy.get('input[id="root_acknowledgementsList-9"]').parent().click();

    cy.get('input[id="root_acknowledgementsList-10"]').parent().click();

    cy.get('input[id="root_acknowledgementsList-11"]').parent().click();

    cy.get('input[id="root_acknowledgementsList-12"]').parent().click();

    cy.get('input[id="root_acknowledgementsList-13"]').parent().click();

    cy.get('input[id="root_acknowledgementsList-14"]').parent().click();

    cy.get('button').contains('Continue').should('be.visible').click();

    cy.wait(2000);

    // Sign Submission

    cy.get('h1').contains('Submission').should('be.visible');

    cy.get('input[id="root_submissionDate"]');

    cy.get('input[id="root_submissionCompletedBy"]').type('test');

    cy.get('input[id="root_submissionTitle"]').type('test');

    cy.get('button').contains('Submit').should('be.visible').click();

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

    cy.get('body').happoScreenshot();
  });

  it('should render the header', () => {
    cy.get('header').contains('Help');
    cy.get('header').get('.banner').find('img');
    cy.get('.pg-menu-group').find('a').contains('Dashboard');
    cy.get('.pg-menu-group').find('form').get('button').contains('Logout');
  });

  it('should render the footer', () => {
    cy.get('footer').contains('Home');
    cy.get('footer').contains('Disclaimer');
    cy.get('footer').contains('Privacy');
    cy.get('footer').contains('Accessibility');
    cy.get('footer').contains('Copyright');
  });
});
