const setups = ['ccbc_analyst', 'ccbc_admin', 'super_admin'];

describe('The analyst application summary page', () => {
  setups.forEach((role) => {
    describe(`As ${role}`, () => {
      beforeEach(() => {
        cy.mockLogin(role);
        const mockedDateString = '2022-10-10';
        const mockedDate = new Date(mockedDateString);
        cy.useMockedTime(mockedDate);
        cy.sqlFixture('e2e/reset_db');
        cy.sqlFixture('e2e/001_intake');
        cy.sqlFixture('e2e/001_analyst');
      });

      describe('with application status (uses application data)', () => {
        beforeEach(() => {
          cy.sqlFixture('e2e/001_application_summary_received');
        });

        it('displays summary data from application for received status', () => {
          cy.visit('/analyst/application/1/summary');
          cy.contains('h2', 'Summary');

          // Check that funding values are displayed (basic data presence)
          cy.get('[data-testid="root_funding_applicantAmount-value"]').should(
            'be.visible'
          );
          cy.get(
            '[data-testid="root_funding_totalProjectBudget-value"]'
          ).should('be.visible');
          cy.get(
            '[data-testid="root_funding_fundingRequestedCcbc-value"]'
          ).should('be.visible');
          cy.get(
            '[data-testid="root_funding_bcFundingRequested-value"]'
          ).should('be.visible');
          cy.get('[data-testid="root_funding_federalFunding-value"]').should(
            'be.visible'
          );

          // Check project dates are displayed
          cy.get(
            '[data-testid="root_eventsAndDates_proposedStartDate-value"]'
          ).should('be.visible');
          cy.get(
            '[data-testid="root_eventsAndDates_proposedCompletionDate-value"]'
          ).should('be.visible');

          // Community data
          cy.get('[data-testid="root_counts_communities-value"]').should(
            'be.visible'
          );
          cy.get(
            '[data-testid="root_counts_indigenousCommunities-value"]'
          ).should('be.visible');

          // Check basic funding amounts (from fixture data)
          cy.contains('$1,000,000'); // totalFundingRequestedCCBC
          cy.contains('$250,000'); // totalApplicantContribution
          cy.contains('$1,250,000'); // totalProjectCost

          cy.get('body').happoScreenshot({
            component: `Analyst application summary - application status - ${role}`,
          });
        });
      });

      describe('with conditionally approved status (uses conditional approval data)', () => {
        beforeEach(() => {
          cy.sqlFixture('e2e/001_application_summary_conditionally_approved');
        });

        it('displays summary data from conditional approval for conditionally approved status', () => {
          cy.visit('/analyst/application/1/summary');
          cy.contains('h2', 'Summary');

          // Check that funding values are displayed
          cy.get(
            '[data-testid="root_funding_bcFundingRequested-value"]'
          ).should('be.visible');
          cy.get('[data-testid="root_funding_federalFunding-value"]').should(
            'be.visible'
          );
          cy.get(
            '[data-testid="root_funding_fundingRequestedCcbc-value"]'
          ).should('be.visible');

          // Check conditional approval amounts (from fixture data)
          cy.contains('$987,654'); // provincialRequested
          cy.contains('$1,234,567'); // federalRequested
          cy.contains('(Conditional Approval)'); // conditional approval source

          // Application data still used for other fields
          cy.get('[data-testid="root_funding_applicantAmount-value"]').should(
            'be.visible'
          );
          cy.get(
            '[data-testid="root_eventsAndDates_proposedStartDate-value"]'
          ).should('be.visible');

          // Community data still from template 9
          cy.get('[data-testid="root_counts_communities-value"]').should(
            'be.visible'
          );

          cy.get('body').happoScreenshot({
            component: `Analyst application summary - conditionally approved status - ${role}`,
          });
        });
      });

      describe('with approved status (uses SOW data)', () => {
        beforeEach(() => {
          cy.sqlFixture('e2e/001_application_summary_approved');
        });

        it('displays summary data from SOW for approved status', () => {
          cy.visit('/analyst/application/1/summary');
          cy.contains('h2', 'Summary');

          // Check that SOW funding data is displayed
          cy.get(
            '[data-testid="root_funding_bcFundingRequested-value"]'
          ).should('be.visible');
          cy.get('[data-testid="root_funding_federalFunding-value"]').should(
            'be.visible'
          );
          cy.get(
            '[data-testid="root_funding_fundingRequestedCcbc-value"]'
          ).should('be.visible');
          cy.get('[data-testid="root_funding_applicantAmount-value"]').should(
            'be.visible'
          );
          cy.get(
            '[data-testid="root_funding_totalProjectBudget-value"]'
          ).should('be.visible');

          // Check SOW funding amounts (from fixture data)
          cy.contains('$650,000'); // amountRequestedFromProvince
          cy.contains('$350,000'); // amountRequestedFromFederalGovernment
          cy.contains('$300,000'); // totalApplicantContribution
          cy.contains('$1,400,000'); // totalProjectCost

          // Check SOW project dates are displayed
          cy.get(
            '[data-testid="root_eventsAndDates_effectiveStartDate-value"]'
          ).should('be.visible');
          cy.get(
            '[data-testid="root_eventsAndDates_proposedStartDate-value"]'
          ).should('be.visible');
          cy.get(
            '[data-testid="root_eventsAndDates_proposedCompletionDate-value"]'
          ).should('be.visible');

          // Check funding agreement date
          cy.get(
            '[data-testid="root_eventsAndDates_dateAgreementSigned-value"]'
          ).should('be.visible');

          // Check community data from SOW
          cy.get('[data-testid="root_counts_communities-value"]').should(
            'be.visible'
          );
          cy.get(
            '[data-testid="root_counts_indigenousCommunities-value"]'
          ).should('be.visible');
          cy.get(
            '[data-testid="root_counts_totalHouseholdsImpacted-value"]'
          ).should('be.visible');

          // Check SOW community numbers (from fixture data)
          cy.contains('8'); // communitiesNumber
          cy.contains('3'); // indigenousCommunitiesNumber
          cy.contains('600'); // numberOfHouseholds

          cy.get('body').happoScreenshot({
            component: `Analyst application summary - approved status - ${role}`,
          });
        });
      });

      describe('with approved status but missing SOW data', () => {
        beforeEach(() => {
          cy.sqlFixture('e2e/001_application_summary_approved_no_sow');
        });

        it('displays error messages when SOW data is missing', () => {
          cy.visit('/analyst/application/1/summary');
          cy.contains('h2', 'Summary');

          cy.get('svg[data-testid="HelpIcon"]').first().trigger('mouseover');
          cy.contains(
            'This value is informed from SOW tab 8 cell E15 which has not been uploaded to the portal.'
          ).should('be.visible');

          // Check that some fields still show values
          cy.get('[data-testid="root_counts_communities-value"]').should(
            'be.visible'
          );
          cy.get(
            '[data-testid="root_eventsAndDates_dateAgreementSigned-value"]'
          ).should('be.visible');

          cy.get('body').happoScreenshot({
            component: `Analyst application summary - approved no SOW - ${role}`,
          });
        });
      });

      describe('expand/collapse functionality', () => {
        beforeEach(() => {
          cy.sqlFixture('e2e/001_application_summary_received');
        });

        it('can expand and collapse all sections', () => {
          cy.visit('/analyst/application/1/summary');
          cy.contains('h2', 'Summary');

          // Test expand all button
          cy.contains('button', 'Expand all').click();

          // Test collapse all button
          cy.contains('button', 'Collapse all').click();

          // Check tooltip functionality by hovering over the info icon
          cy.get('svg[data-testid="InfoIcon"]').trigger('mouseover');
          cy.contains('The fields on this page are read-only');

          cy.get('body').happoScreenshot({
            component: `Analyst application summary - expand collapse - ${role}`,
          });
        });
      });

      describe('navigation links', () => {
        beforeEach(() => {
          cy.sqlFixture('e2e/001_application_summary_received');
        });

        it('has working navigation links to other sections', () => {
          cy.visit('/analyst/application/1/summary');
          cy.contains('h2', 'Summary');

          // Check links in description paragraph are present and have correct href
          cy.get('a[href="/analyst/application/1?expandAll=true"]').should(
            'contain',
            'Application'
          );
          cy.get(
            'a[href="/analyst/application/1/project?section=conditionalApproval"]'
          ).should('contain', 'Conditional Approval');
          cy.get(
            'a[href="/analyst/application/1/project?section=projectInformation"]'
          ).should('contain', 'SOW');
        });
      });

      describe('with different data scenarios', () => {
        it('displays announcement status correctly', () => {
          cy.sqlFixture('e2e/001_application_summary_announced');
          cy.visit('/analyst/application/1/summary');

          // Check announcement data is displayed
          cy.get(
            '[data-testid="root_eventsAndDates_announcedByProvince-value"]'
          ).should('be.visible');
          cy.contains('Yes'); // announced should be true

          cy.get('body').happoScreenshot({
            component: `Analyst application summary - announced - ${role}`,
          });
        });

        it('displays milestone data when available', () => {
          cy.sqlFixture('e2e/001_application_summary_with_milestones');
          cy.visit('/analyst/application/1/summary');

          // Check milestone data is displayed
          cy.get(
            '[data-testid="root_milestone_percentProjectMilestoneComplete-value"]'
          ).should('be.visible');
          cy.contains('75%'); // from fixture overallMilestoneProgress: 0.75

          cy.get('body').happoScreenshot({
            component: `Analyst application summary - with milestones - ${role}`,
          });
        });
      });
    });
  });
});
