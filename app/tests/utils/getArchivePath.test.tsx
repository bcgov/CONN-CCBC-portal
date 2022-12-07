import getArchivePath from 'utils/getArchivePath';

const CCBC_ID = 'CCBC-010001';
const FILE_NAME = 'test.xml';

describe('The getArchivePath function', () => {
  it('returns the correct path for eligibilityAndImpactsCalculator', () => {
    expect(
      getArchivePath('eligibilityAndImpactsCalculator', CCBC_ID, FILE_NAME)
    ).toMatchObject({
      path: '/CCBC-010001/Step 2 - Templates/',
      name: 'CCBC-010001 - Template 1 - test.xml',
    });
  });

  it('returns the correct path for detailedBudget', () => {
    expect(getArchivePath('detailedBudget', CCBC_ID, FILE_NAME)).toMatchObject({
      path: '/CCBC-010001/Step 2 - Templates/',
      name: 'CCBC-010001 - Template 2 - test.xml',
    });
  });

  it('returns the correct path for financialForecast', () => {
    expect(
      getArchivePath('financialForecast', CCBC_ID, FILE_NAME)
    ).toMatchObject({
      path: '/CCBC-010001/Step 2 - Templates/',
      name: 'CCBC-010001 - Template 3 - test.xml',
    });
  });

  it('returns the correct path for lastMileIspOffering', () => {
    expect(
      getArchivePath('lastMileIspOffering', CCBC_ID, FILE_NAME)
    ).toMatchObject({
      path: '/CCBC-010001/Step 2 - Templates/',
      name: 'CCBC-010001 - Template 4 - test.xml',
    });
  });

  it('returns the correct path for popWholesalePricing', () => {
    expect(
      getArchivePath('popWholesalePricing', CCBC_ID, FILE_NAME)
    ).toMatchObject({
      path: '/CCBC-010001/Step 2 - Templates/',
      name: 'CCBC-010001 - Template 5 - test.xml',
    });
  });

  it('returns the correct path for communityRuralDevelopmentBenefitsTemplate', () => {
    expect(
      getArchivePath(
        'communityRuralDevelopmentBenefitsTemplate',
        CCBC_ID,
        FILE_NAME
      )
    ).toMatchObject({
      path: '/CCBC-010001/Step 2 - Templates/',
      name: 'CCBC-010001 - Template 6 - test.xml',
    });
  });

  it('returns the correct path for wirelessAddendum', () => {
    expect(
      getArchivePath('wirelessAddendum', CCBC_ID, FILE_NAME)
    ).toMatchObject({
      path: '/CCBC-010001/Step 2 - Templates/',
      name: 'CCBC-010001 - Template 7 - test.xml',
    });
  });

  it('returns the correct path for supportingConnectivityEvidence', () => {
    expect(
      getArchivePath('supportingConnectivityEvidence', CCBC_ID, FILE_NAME)
    ).toMatchObject({
      path: '/CCBC-010001/Step 2 - Templates/',
      name: 'CCBC-010001 - Template 8 - test.xml',
    });
  });

  it('returns the correct path for geographicNames', () => {
    expect(getArchivePath('geographicNames', CCBC_ID, FILE_NAME)).toMatchObject(
      {
        path: '/CCBC-010001/Step 2 - Templates/',
        name: 'CCBC-010001 - Template 9 - test.xml',
      }
    );
  });

  it('returns the correct path for equipmentDetails', () => {
    expect(
      getArchivePath('equipmentDetails', CCBC_ID, FILE_NAME)
    ).toMatchObject({
      path: '/CCBC-010001/Step 2 - Templates/',
      name: 'CCBC-010001 - Template 10 - test.xml',
    });
  });

  it('returns the correct path for copiesOfRegistration', () => {
    expect(
      getArchivePath('copiesOfRegistration', CCBC_ID, FILE_NAME)
    ).toMatchObject({
      path: '/CCBC-010001/Step 4 - Supporting Documents/Incorporation documents/',
      name: 'CCBC-010001 - test.xml',
    });
  });

  it('returns the correct path for preparedFinancialStatements', () => {
    expect(
      getArchivePath('preparedFinancialStatements', CCBC_ID, FILE_NAME)
    ).toMatchObject({
      path: '/CCBC-010001/Step 4 - Supporting Documents/Independently prepared financial statements/',
      name: 'CCBC-010001 - test.xml',
    });
  });

  it('returns the correct path for logicalNetworkDiagram', () => {
    expect(
      getArchivePath('logicalNetworkDiagram', CCBC_ID, FILE_NAME)
    ).toMatchObject({
      path: '/CCBC-010001/Step 4 - Supporting Documents/Logical network diagram/',
      name: 'CCBC-010001 - test.xml',
    });
  });

  it('returns the correct path for projectSchedule', () => {
    expect(getArchivePath('projectSchedule', CCBC_ID, FILE_NAME)).toMatchObject(
      {
        path: '/CCBC-010001/Step 4 - Supporting Documents/Project schedule (Gantt chart)/',
        name: 'CCBC-010001 - test.xml',
      }
    );
  });

  it('returns the correct path for communityRuralDevelopmentBenefits', () => {
    expect(
      getArchivePath('communityRuralDevelopmentBenefits', CCBC_ID, FILE_NAME)
    ).toMatchObject({
      path: '/CCBC-010001/Step 4 - Supporting Documents/Supporting documents for benefits/',
      name: 'CCBC-010001 - test.xml',
    });
  });

  it('returns the correct path for otherSupportingMaterials', () => {
    expect(
      getArchivePath('otherSupportingMaterials', CCBC_ID, FILE_NAME)
    ).toMatchObject({
      path: '/CCBC-010001/Step 4 - Supporting Documents/Other supporting documents/',
      name: 'CCBC-010001 - test.xml',
    });
  });

  it('returns the correct path for geographicCoverageMap', () => {
    expect(
      getArchivePath('geographicCoverageMap', CCBC_ID, FILE_NAME)
    ).toMatchObject({
      path: '/CCBC-010001/Step 1 - Eligibility Mapping & Statistics/Coverage map/',
      name: 'CCBC-010001 - test.xml',
    });
  });

  it('returns the correct path for coverageAssessmentStatistics', () => {
    expect(
      getArchivePath('coverageAssessmentStatistics', CCBC_ID, FILE_NAME)
    ).toMatchObject({
      path: '/CCBC-010001/Step 1 - Eligibility Mapping & Statistics/Statistics email confirmation/',
      name: 'CCBC-010001 - test.xml',
    });
  });

  it('returns the correct path for currentNetworkInfastructure', () => {
    expect(
      getArchivePath('currentNetworkInfastructure', CCBC_ID, FILE_NAME)
    ).toMatchObject({
      path: '/CCBC-010001/Step 1 - Eligibility Mapping & Statistics/Current network infrastructure/',
      name: 'CCBC-010001 - test.xml',
    });
  });

  it('returns the correct path for upgradedNetworkInfrastructure', () => {
    expect(
      getArchivePath('upgradedNetworkInfrastructure', CCBC_ID, FILE_NAME)
    ).toMatchObject({
      path: '/CCBC-010001/Step 1 - Eligibility Mapping & Statistics/Upgraded network infrastructure/',
      name: 'CCBC-010001 - test.xml',
    });
  });
});
