/* eslint-disable no-console */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable cypress/no-unnecessary-waiting */

describe('The applicant dashboard', () => {
  beforeEach(function () {
    const mockedDateString = '2022-10-10';
    const mockedDate = new Date(mockedDateString);
    cy.useMockedTime(mockedDate);
    cy.sqlFixture('e2e/reset_db');
    cy.sqlFixture('e2e/001_intake');
    cy.mockLogin('ccbc_auth_user');
  });

  it('triggers setup of everything', () => {
    cy.sqlFixture('e2e/001_application');
    cy.sqlFixture('e2e/001_application_received');
    cy.sqlFixture('e2e/001_analyst');
    cy.mockLogin('ccbc_auth_user');
    cy.visit('/analyst/application/1');
  });

  // Commenting out radio inputs until we pass in proper names or ids to select from

  // it('should allow to start and fill an application', () => {
  //   cy.visit('/applicantportal/dashboard');
  //   // Dashboard page

  //   cy.findByRole('heading', { name: /^Dashboard/i }).should('exist');
  //   // wait for our page component to stop re-rendering 6 times...
  //   cy.wait(1000);

  //   cy.get('body').happoScreenshot({ component: 'Dashboard Page' });

  //   cy.findByRole('button', { name: /Create application/i }).not('be.disabled');
  //   cy.findByRole('button', { name: /Create application/i }).click();

  //   // Project information page
  //   cy.findByRole('heading', { name: /^Project information/i }).should('exist');
  //   cy.get('[id="root_projectTitle"]');

  //   cy.intercept(
  //     {
  //       url: '/graphql',
  //       method: 'POST',
  //     },
  //     (req) => {
  //       req.on('before:response', (res) => {
  //         console.log(res);
  //         // Check if the response contains the specific error message
  //         if (
  //           res.body &&
  //           res.body.errors &&
  //           res.body.errors.some(
  //             (error) => error.message === 'Data is Out of Sync'
  //           )
  //         ) {
  //           // Erase the window location hash
  //           // cy.window().location.hash = '';
  //         }
  //         delete res.body.errors;
  //         return res;
  //       });
  //     }
  //   ).as('graphql');

  //   cy.get('[id="root_geographicAreaDescription"]').type('test');

  //   cy.get('[id="root_projectDescription"]').type('test');

  //   cy.contains('header > div', 'Last saved:');

  //   cy.get('body').happoScreenshot({ component: 'Project Information Page' });

  //   cy.contains('button', 'Save and continue').click();

  //   // Project area page

  //   cy.contains('h1', 'Project area');

  //   cy.contains('a', 'project zones');

  //   cy.get('input[id="root_geographicArea-0"]').parent().click({ force: true });

  //   cy.get('input[id="root_projectSpanMultipleLocations-0"]')
  //     .scrollIntoView()
  //     .parent()
  //     .click();

  //   cy.get('input[id="root_provincesTerritories-0"]').parent().click();

  //   cy.contains('header > div', 'Last saved:');

  //   cy.get('body').happoScreenshot({ component: 'Project Area Page' });

  //   cy.contains('button', 'Save and continue').click();

  //   // Existing network coverage page
  //   cy.contains('h1', 'Existing network coverage');

  //   cy.get('input[id="root_hasProvidedExitingNetworkCoverage-0"]').parent();

  //   cy.get('input[id="root_hasProvidedExitingNetworkCoverage-0"]')
  //     .parent()
  //     .click({ force: true });
  //   cy.get('input[id="root_hasProvidedExitingNetworkCoverage-1"]')
  //     .parent()
  //     .click({ force: true });
  //   cy.get('input[id="root_hasProvidedExitingNetworkCoverage-2"]')
  //     .parent()
  //     .click({ force: true });

  //   cy.get('input[id="root_hasPassiveInfrastructure-0"]').parent().click();

  //   cy.get('input[id="root_isInfrastructureAvailable-0"]').parent().click();

  //   cy.get('input[id="root_requiresThirdPartyInfrastructureAccess-0"]')
  //     .parent()
  //     .click();
  //   cy.get('input[id="root_requiresThirdPartyInfrastructureAccess-1"]')
  //     .parent()
  //     .click();

  //   cy.contains('header > div', 'Last saved:');

  //   cy.get('body').happoScreenshot({
  //     component: 'Existing Network Coverage Page',
  //   });

  //   cy.contains('button', 'Save and continue').click();

  //   // // Project funding page
  //   cy.findByRole('heading', { name: /^Project funding/i }).should('exist');

  //   cy.get('[id="root_fundingRequestedCCBC2223"]').type(123);
  //   cy.get('[id="root_fundingRequestedCCBC2324"]').type(123);
  //   cy.get('[id="root_fundingRequestedCCBC2425"]').type(123);
  //   cy.get('[id="root_fundingRequestedCCBC2526"]').type(123);
  //   cy.get('[id="root_fundingRequestedCCBC2627"]').type(123);

  //   cy.get('[id="root_applicationContribution2223"]').type(123);
  //   cy.get('[id="root_applicationContribution2324"]').type(123);
  //   cy.get('[id="root_applicationContribution2425"]').type(123);
  //   cy.get('[id="root_applicationContribution2526"]').type(123);
  //   cy.get('[id="root_applicationContribution2627"]').type(123);

  //   cy.contains('header > div', 'Last saved:');

  //   cy.get('body').happoScreenshot({ component: 'Project Funding Page' });

  //   cy.contains('button', 'Save and continue').click();

  //   // Other funding sources page
  //   cy.findByRole('heading', { name: /^Other funding sources/i }).should(
  //     'exist'
  //   );

  //   cy.get('[id="root_infrastructureBankFunding2223"]').type(123);
  //   cy.get('[id="root_infrastructureBankFunding2324"]').type(123);
  //   cy.get('[id="root_infrastructureBankFunding2425"]').type(123);
  //   cy.get('[id="root_infrastructureBankFunding2526"]').type(123);

  //   cy.get('input[id="root_otherFundingSources-0"]').parent().click();

  //   cy.get('[id="root_otherFundingSourcesArray_0_fundingPartnersName"]').type(
  //     'test'
  //   );

  //   cy.get(
  //     '[id="root_otherFundingSourcesArray_0_fundingSourceContactInfo"]'
  //   ).type('test');

  //   cy.get(
  //     'select[id="root_otherFundingSourcesArray_0_statusOfFunding"]'
  //   ).select('Submitted');

  //   cy.get('select[id="root_otherFundingSourcesArray_0_funderType"]').select(
  //     'Federal'
  //   );

  //   cy.get('[id="root_otherFundingSourcesArray_0_nameOfFundingProgram"]').type(
  //     'test'
  //   );

  //   cy.get(
  //     '[id="root_otherFundingSourcesArray_0_requestedFundingPartner2223"]'
  //   ).type(123);

  //   cy.get(
  //     '[id="root_otherFundingSourcesArray_0_requestedFundingPartner2324"]'
  //   ).type(123);

  //   cy.get(
  //     '[id="root_otherFundingSourcesArray_0_requestedFundingPartner2425"]'
  //   ).type(123);

  //   cy.get(
  //     '[id="root_otherFundingSourcesArray_0_requestedFundingPartner2526"]'
  //   ).type(123);

  //   cy.get(
  //     '[id="root_otherFundingSourcesArray_0_requestedFundingPartner2627"]'
  //   ).type(123);

  //   cy.contains('header > div', 'Last saved:');

  //   cy.get('body').happoScreenshot({ component: 'Other Funding Sources Page' });

  //   cy.contains('button', 'Save and continue').click();

  //   // // Technological solution page
  //   cy.findByRole('heading', { name: /^Technological solution/i }).should(
  //     'exist'
  //   );

  //   cy.get('[id="root_systemDesign"]');

  //   cy.get('[id="root_systemDesign"]').type('test', { force: true });

  //   cy.get('[id="root_scalability"]').type('test', { force: true });

  //   cy.get('input[id="root_backboneTechnology-0"]').parent().click();
  //   cy.get('input[id="root_backboneTechnology-1"]').parent().click();
  //   cy.get('input[id="root_backboneTechnology-2"]').parent().click();

  //   cy.get('input[id="root_lastMileTechnology-0"]').parent().click();
  //   cy.get('input[id="root_lastMileTechnology-1"]').parent().click();
  //   cy.get('input[id="root_lastMileTechnology-2"]').parent().click();
  //   cy.get('input[id="root_lastMileTechnology-3"]').parent().click();

  //   cy.contains('header > div', 'Last saved:');

  //   cy.get('body').happoScreenshot({
  //     component: 'Technological Solution Page',
  //   });

  //   cy.contains('button', 'Save and continue').click();

  //   // // Benefits page
  //   cy.findByRole('heading', { name: /^Benefits/i }).should('exist');

  //   cy.get('[id="root_projectBenefits"]').type('test', { force: true });

  //   cy.contains('header > div', 'Last saved:');

  //   cy.get('body').happoScreenshot({ component: 'Benefits Page' });

  //   cy.contains('button', 'Save and continue').click();

  //   // Project planning and management page
  //   cy.findByRole('heading', {
  //     name: /Project planning and management/i,
  //   }).should('exist');

  //   cy.get('#root_projectStartDate');

  //   cy.get('#root_projectCompletionDate');

  //   cy.get('[id="root_projectStartDate"]').type('2023-08-30');

  //   cy.get('[id="root_projectCompletionDate"]').type('2023-12-31');

  //   cy.get('[id="root_relationshipManagerApplicant"]').type('test');

  //   cy.get('[id="root_overviewOfProjectParticipants"]').type('test');

  //   cy.get('[id="root_operationalPlan"]').type('test');

  //   cy.contains('header > div', 'Last saved:');

  //   cy.get('body').happoScreenshot({
  //     component: 'Project Planning and Management Page',
  //   });

  //   cy.contains('button', 'Save and continue').click();

  //   // // Estimated project employment page
  //   cy.findByRole('heading', { name: /^Estimated project employment/i }).should(
  //     'not.exist'
  //   );

  //   // // Template uploads page
  //   cy.findByRole('heading', { name: /^Template uploads/i }).should('exist');

  //   cy.contains('header > div', 'Last saved:');

  //   cy.get('body').happoScreenshot({ component: 'Template Uploads Page' });

  //   cy.contains('button', 'Save and continue').click();

  //   // // Supporting documents page
  //   cy.findByRole('heading', { name: /^Supporting documents/i }).should(
  //     'exist'
  //   );

  //   cy.contains('a', 'connectingcommunitiesbc@gov.bc.ca');

  //   cy.contains('header > div', 'Last saved:');

  //   cy.get('body').happoScreenshot({ component: 'Supporting Documents Page' });

  //   cy.contains('button', 'Save and continue').click();

  //   // // Coverage page
  //   cy.findByRole('heading', { name: /^Coverage/i }).should('exist');

  //   cy.contains('a', 'Eligibility Mapping Tool');

  //   // Todo: file uploads

  //   cy.contains('header > div', 'Last saved:');

  //   cy.get('body').happoScreenshot({ component: 'Coverage Page' });

  //   cy.contains('button', 'Save and continue').click();

  //   // Organization Profile page
  //   cy.findByRole('heading', { name: /^Organization profile/i }).should(
  //     'exist'
  //   );

  //   cy.get('input[id="root_typeOfOrganization-0"]').parent().click();

  //   cy.get('input[id="root_typeOfOrganization-14"]').parent().click();

  //   cy.get('input[id="root_other"]').type('test');

  //   cy.get('input[id="root_organizationName"]').type('Test org name');

  //   cy.get('input[id="root_isNameLegalName-0"]').parent().click();

  //   cy.get('input[id="root_isSubsidiary-0"]').parent().click();

  //   cy.get('input[id="root_parentOrgName"]').type('test');

  //   cy.get('input[id="root_isIndigenousEntity-0"]').parent().click();

  //   cy.get('input[id="root_indigenousEntityDesc"]').type('test');

  //   // Todo: Datepicker test
  //   cy.get('#root_orgRegistrationDate');

  //   cy.get('input[id="root_businessNumber"]').type(123);

  //   cy.contains('header > div', 'Last saved:');

  //   cy.get('body').happoScreenshot({ component: 'Organization Profile Page' });

  //   cy.contains('button', 'Save and continue').click();

  //   // // Organization location page
  //   cy.findByRole('heading', { name: /^Organization location/i }).should(
  //     'exist'
  //   );

  //   cy.get('input[id="root_streetNumber"]').type(123);

  //   cy.get('input[id="root_streetName"]').type('test');

  //   cy.get('input[id="root_POBox"]').type('test');

  //   cy.get('input[id="root_city"]').type('test');

  //   cy.get('select[id="root_province"]').select('British Columbia');

  //   cy.get('input[id="root_postalCode"]').type('test');

  //   cy.get('input[id="root_isMailingAddress-1"]').parent().click();

  //   cy.get('input[id="root_mailingAddress_unitNumberMailing"]').type('test');

  //   cy.get('input[id="root_mailingAddress_streetNumberMailing"]').type('test');

  //   cy.get('input[id="root_mailingAddress_streetNameMailing"]').type('test');

  //   cy.get('input[id="root_mailingAddress_POBoxMailing"]').type('test');

  //   cy.get('input[id="root_mailingAddress_cityMailing"]').type('test');

  //   cy.get('select[id="root_mailingAddress_provinceMailing"]').select(
  //     'British Columbia'
  //   );

  //   cy.get('input[id="root_mailingAddress_postalCodeMailing"]').type('test');

  //   cy.contains('header > div', 'Last saved:');

  //   cy.get('body').happoScreenshot({ component: 'Organization Location Page' });

  //   cy.contains('button', 'Save and continue').click();

  //   // // Organization contact information page
  //   cy.findByRole('heading', {
  //     name: /Organization contact information/i,
  //   }).should('exist');

  //   cy.get('input[id="root_contactTelephoneNumber"]').type('123-4567');

  //   cy.get('input[id="root_contactExtension"]').type('123');

  //   cy.get('input[id="root_contactEmail"]').type('test@test.com');

  //   cy.get('input[id="root_contactWebsite"]').type('test');

  //   cy.contains('header > div', 'Last saved:');

  //   cy.get('body').happoScreenshot({
  //     component: 'Organization Contact Information Page',
  //   });

  //   cy.contains('button', 'Save and continue').click();

  //   // // Authorized contact page
  //   cy.findByRole('heading', { name: /^Authorized business contact/i }).should(
  //     'exist'
  //   );

  //   cy.get('input[id="root_authFamilyName"]').type('test');

  //   cy.get('input[id="root_authGivenName"]').type('test');

  //   cy.get('input[id="root_authPositionTitle"]').type('test');

  //   cy.get('input[id="root_authEmail"]').type('test@test.com');

  //   cy.get('input[id="root_authTelephone"]').type('123-456');

  //   cy.get('input[id="root_authExtension"]').type('123');

  //   cy.get('input[id="root_isAuthContactSigningOfficer-0"]').parent().click();

  //   cy.contains('header > div', 'Last saved:');

  //   cy.get('body').happoScreenshot({ component: 'Authorized Contact Page' });

  //   cy.contains('button', 'Save and continue').click();

  //   // // Alternate contact page
  //   cy.findByRole('heading', { name: /^Alternate business contact/i }).should(
  //     'exist'
  //   );

  //   cy.get('input[id="root_altFamilyName"]').type('test');

  //   cy.get('input[id="root_altGivenName"]').type('test');

  //   cy.get('input[id="root_altPositionTitle"]').type('test');

  //   cy.get('input[id="root_altEmail"]').type('test@test.com');

  //   cy.get('input[id="root_altTelephone"]').type('123-456');

  //   cy.get('input[id="root_altExtension"]').type('123');

  //   cy.get('input[id="root_isAltContactSigningOfficer-0"]').parent().click();

  //   cy.contains('header > div', 'Last saved:');

  //   cy.get('body').happoScreenshot({ component: 'Alternate Contact Page' });

  //   cy.contains('button', 'Save and continue').click();

  //   // // Review page
  //   cy.findByRole('heading', { name: /^Review/i }).should('exist');

  //   cy.get('input[id="root_acknowledgeIncomplete"]').parent().click();

  //   cy.contains('header > div', 'Last saved:');

  //   cy.get('body').happoScreenshot({ component: 'Review Page' });

  //   cy.contains('button', 'Save and continue').click();

  //   // // Acknowledgements page
  //   cy.findByRole('heading', { name: /^Acknowledgements/i }).should('exist');

  //   cy.get('input[id="root_acknowledgementsList-0"]').parent().click();

  //   cy.get('input[id="root_acknowledgementsList-1"]').parent().click();

  //   cy.get('input[id="root_acknowledgementsList-2"]').parent().click();

  //   cy.get('input[id="root_acknowledgementsList-3"]').parent().click();

  //   cy.get('input[id="root_acknowledgementsList-4"]').parent().click();

  //   cy.get('input[id="root_acknowledgementsList-5"]').parent().click();

  //   cy.get('input[id="root_acknowledgementsList-6"]').parent().click();

  //   cy.get('input[id="root_acknowledgementsList-7"]').parent().click();

  //   cy.get('input[id="root_acknowledgementsList-8"]').parent().click();

  //   cy.get('input[id="root_acknowledgementsList-9"]').parent().click();

  //   cy.get('input[id="root_acknowledgementsList-10"]').parent().click();

  //   cy.get('input[id="root_acknowledgementsList-11"]').parent().click();

  //   cy.get('input[id="root_acknowledgementsList-12"]').parent().click();

  //   cy.get('input[id="root_acknowledgementsList-13"]').parent().click();

  //   cy.get('input[id="root_acknowledgementsList-14"]').parent().click();

  //   cy.get('input[id="root_acknowledgementsList-15"]').parent().click();

  //   cy.get('input[id="root_acknowledgementsList-16"]').parent().click();

  //   cy.contains('header > div', 'Last saved:');

  //   cy.get('body').happoScreenshot({ component: 'Acknowledgements Page' });

  //   cy.contains('button', 'Save and continue').click();

  //   // // Sign Submission
  //   cy.findByRole('heading', { name: /^Submission/i }).should('exist');

  //   cy.get('[id="root_submissionCompletedFor"]').should(
  //     'have.text',
  //     'Test org name'
  //   );

  //   cy.get('input[id="root_submissionCompletedBy"]').type('test');
  //   cy.get('input[id="root_submissionTitle"]').type('test');

  //   cy.get('[id="root_submissionDate"]').should('have.text', '2022-10-09');

  //   cy.contains('header > div', 'Last saved:');

  //   cy.get('body').happoScreenshot({ component: 'Submission Page' });

  //   cy.contains('button', 'Submit').click();

  //   // // Success page
  //   cy.findByRole('heading', { name: /^Application submitted/i }).should(
  //     'exist'
  //   );

  //   cy.findByRole('heading', {
  //     name: /Thank you for applying to CCBC Intake 1/i,
  //   }).should('exist');

  //   cy.get('body').happoScreenshot({ component: 'Success Page' });

  //   cy.contains('button', 'Return to dashboard').click();
  // });

  it('should see dashboard and have disabled form out of intake', () => {
    const mockedDateString = '2025-10-10';
    const mockedDate = new Date(mockedDateString);
    cy.useMockedTime(mockedDate);
    cy.sqlFixture('e2e/001_application');
    cy.visit('/applicantportal/dashboard');

    // Dashboard page
    cy.contains('h1', 'Dashboard');
    // wait for our page component to stop re-rendering 6 times...
    cy.wait(1000);
    cy.get('body').happoScreenshot({ component: 'Out of Intake Dashboard' });

    cy.contains('a', 'View').click();

    // Project information page

    cy.get('[id="root_projectTitle"]').should('be.disabled');
    cy.get('[id="root_geographicAreaDescription"]').should('be.disabled');
    cy.get('[id="root_projectDescription"]').should('be.disabled');

    cy.get('body').happoScreenshot({
      component: 'Out of Intake Project Information Page',
    });

    cy.contains('button', 'Continue').click();

    // Project area page

    cy.contains('h1', 'Project area');

    cy.contains('a', 'project zones');

    cy.get('input').should('be.disabled');

    cy.get('body').happoScreenshot({
      component: 'Out of Intake Project Area Page',
    });

    cy.contains('button', 'Continue').click();

    // Existing network coverage page
    cy.contains('h1', 'Existing network coverage');

    cy.get('input').should('be.disabled');

    cy.get('body').happoScreenshot({
      component: 'Out of Intake Existing Network Coverage Page',
    });

    cy.contains('button', 'Continue').click();

    // // Project funding page
    cy.contains('h1', 'Project funding');

    cy.get('input').should('be.disabled');

    cy.get('body').happoScreenshot({
      component: 'Out of Intake Project Funding Page',
    });

    cy.contains('button', 'Continue').click();

    // Other funding sources page

    cy.contains('h1', 'Other funding sources');

    cy.get('input').should('be.disabled');

    cy.get('body').happoScreenshot({
      component: 'Out of Intake Other Funding Sources Page',
    });

    cy.contains('button', 'Continue').click();

    // Technological solution page
    cy.contains('h1', 'Technological solution');

    cy.get('body').happoScreenshot({
      component: 'Out of Intake Technological Solution Page',
    });

    cy.get('input').should('be.disabled');

    cy.contains('button', 'Continue').click();

    // Benefits page

    cy.contains('h1', 'Benefits');

    cy.get('textarea').should('be.disabled');

    cy.get('body').happoScreenshot({
      component: 'Out of Intake Benefits Page',
    });

    cy.contains('button', 'Continue').click();

    // // // Project planning and management page
    cy.contains('h1', 'Project planning and management');

    cy.get('input').should('be.disabled');

    cy.get('body').happoScreenshot({
      component: 'Out of Intake Project Planning and Management Page',
    });

    cy.contains('button', 'Continue').click();

    // // Template uploads page

    cy.contains('h1', 'Template uploads');

    cy.get('body').happoScreenshot({
      component: 'Out of Intake Template Uploads Page',
    });

    cy.contains('button', 'Continue').click();

    // // Supporting documents page
    cy.contains('h1', 'Supporting documents');

    cy.contains('a', 'connectingcommunitiesbc@gov.bc.ca');

    cy.get('body').happoScreenshot({
      component: 'Out of Intake Supporting Documents Page',
    });

    cy.contains('button', 'Continue').click();

    // // Coverage page

    cy.contains('h1', 'Coverage');

    cy.contains('a', 'Eligibility Mapping Tool');

    cy.get('body').happoScreenshot({
      component: 'Out of Intake Coverage Page',
    });

    cy.contains('button', 'Continue').click();

    // Organization Profile page

    cy.contains('h1', 'Organization profile');

    cy.get('input').should('be.disabled');

    cy.get('body').happoScreenshot({
      component: 'Out of Intake Organization Profile Page',
    });

    cy.contains('button', 'Continue').click();

    // Organization location page

    cy.contains('h1', 'Organization location');

    cy.get('input').should('be.disabled');

    cy.get('body').happoScreenshot({
      component: 'Out of Intake Organization Location Page',
    });

    cy.contains('button', 'Continue').click();

    // Organization contact information page

    cy.contains('h1', 'Organization contact information');

    cy.get('input').should('be.disabled');

    cy.get('body').happoScreenshot({
      component: 'Out of Intake Organization Contact Information Page',
    });

    cy.contains('button', 'Continue').click();

    // Authorized contact page

    cy.contains('h1', 'Authorized business contact');

    cy.get('input').should('be.disabled');

    cy.get('body').happoScreenshot({
      component: 'Out of Intake Authorized Contact Page',
    });

    cy.contains('button', 'Continue').click();

    // // Alternate contact page

    cy.contains('h1', 'Alternate business contact');

    cy.get('input').should('be.disabled');

    cy.get('body').happoScreenshot({
      component: 'Out of Intake Alternate Contact Page',
    });

    cy.contains('button', 'Continue').click();

    // // Review page

    cy.contains('h1', 'Review');

    cy.get('body').happoScreenshot({ component: 'Out of Intake Review Page' });

    cy.contains('button', 'Continue').click();

    // // Acknowledgements page

    cy.contains('h1', 'Acknowledgements');

    cy.get('body').happoScreenshot({
      component: 'Out of Intake Acknowledgements Page',
    });

    cy.contains('button', 'Continue').click();

    // // Sign Submission

    cy.contains('h1', 'Submission');

    cy.get('[id="root_submissionCompletedFor"]').should(
      'have.text',
      'Test org name'
    );

    cy.get('input[id="root_submissionCompletedBy"]').should('be.disabled');
    cy.get('input[id="root_submissionTitle"]').should('be.disabled');

    cy.get('[id="root_submissionDate"]').should('have.text', '2022-10-09');

    cy.get('body').happoScreenshot({
      component: 'Out of Intake Submission Page',
    });

    cy.contains('button', 'Submit').should('be.disabled');

    cy.contains('button', 'Return to dashboard').click();

    cy.url().should('contain', '/dashboard');
  });

  it('should see dashboard and have option to view upload', () => {
    cy.sqlFixture('e2e/001_application');
    cy.sqlFixture('e2e/001_application_received');
    cy.sqlFixture('e2e/001_rfi');
    cy.visit('/applicantportal/dashboard');
    cy.wait(1000);
    cy.get('body').happoScreenshot({ component: 'Dashboard with RFI' });
  });

  it('should see status change after analyst changes status', () => {
    // Setup for analyst side and fake status
    cy.sqlFixture('e2e/001_application');
    cy.sqlFixture('e2e/001_application_received');
    cy.sqlFixture('e2e/001_fake_status');
    cy.mockLogin('ccbc_analyst');
    cy.intercept('POST', '/graphql').as('graphql');
    cy.visit('/analyst/application/1');
    // Wait until fake status and select has been loaded
    cy.get('select[data-testid="change-status"');
    cy.contains('option', 'Fake Status').should('exist');
    cy.wait('@graphql');
    cy.get('select[data-testid="change-status"')
      .eq(0)
      .should('be.visible')
      .select('Fake Status');
    // When modal shows up, confirm status change
    cy.get('[data-testid="change-status-modal"]').should('exist');
    cy.get('button[data-testid="status-change-save-btn"]')
      .first()
      .should('be.visible')
      .click();
    cy.wait('@graphql');
    cy.get('select[data-testid="change-status"')
      .invoke('val')
      .should('eq', 'fake_status');
    cy.contains('select', 'Fake Status').should('be.visible');
    cy.get('select[data-testid="change-status"').should('be.visible');
    cy.mockLogin('ccbc_auth_user');
    cy.visit('/applicantportal/dashboard');
    cy.contains('div', 'fake_status').should('be.visible');
    cy.get('body').happoScreenshot({
      component: 'Dashboard with fake visible status',
    });
  });
});
