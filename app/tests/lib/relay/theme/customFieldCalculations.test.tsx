import {
  calculateApplicantFunding,
  calculateFundingRequestedCCBC,
  calculateInfrastructureFunding,
} from '../../../../lib/theme/customFieldCalculations';

describe('The customFieldCalculations', () => {
  it('should calculate correct value for calculateFundingRequestedCCBC', () => {
    const formData = calculateFundingRequestedCCBC({
      fundingRequestedCCBC2223: 1,
      fundingRequestedCCBC2324: 2,
      fundingRequestedCCBC2425: 3,
      fundingRequestedCCBC2526: 4,
      fundingRequestedCCBC2627: 5,
    });

    expect(formData).toEqual(
      expect.objectContaining({
        fundingRequestedCCBC2223: 1,
        fundingRequestedCCBC2324: 2,
        fundingRequestedCCBC2425: 3,
        fundingRequestedCCBC2526: 4,
        fundingRequestedCCBC2627: 5,
        totalFundingRequestedCCBC: 15,
      })
    );
  });

  it('should calculate correct value for calculateFundingRequestedCCBC with empty fields', () => {
    const formData = calculateFundingRequestedCCBC({
      fundingRequestedCCBC2223: 1,
    });

    expect(formData).toEqual(
      expect.objectContaining({
        fundingRequestedCCBC2223: 1,
        totalFundingRequestedCCBC: 1,
      })
    );
  });

  it('should calculate correct value for calculateApplicantFunding with empty fields', () => {
    const formData = calculateApplicantFunding({
      applicationContribution2223: 1,
    });

    expect(formData).toEqual(
      expect.objectContaining({
        applicationContribution2223: 1,
        totalApplicantContribution: 1,
      })
    );
  });

  it('should calculate correct value for calculateApplicantFunding', () => {
    const formData = calculateApplicantFunding({
      applicationContribution2223: 1,
      applicationContribution2324: 1,
      applicationContribution2425: 1,
      applicationContribution2526: 1,
      applicationContribution2627: 1,
    });

    expect(formData).toEqual(
      expect.objectContaining({
        applicationContribution2223: 1,
        applicationContribution2324: 1,
        applicationContribution2425: 1,
        applicationContribution2526: 1,
        applicationContribution2627: 1,
        totalApplicantContribution: 5,
      })
    );
  });

  it('should calculate correct value for calculateInfrastructureFunding with empty fields', () => {
    const formData = calculateInfrastructureFunding({
      infrastructureBankFunding2223: 1,
    });

    expect(formData).toEqual(
      expect.objectContaining({
        infrastructureBankFunding2223: 1,
        totalInfrastructureBankFunding: 1,
      })
    );
  });

  it('should calculate correct value for calculateInfrastructureFunding', () => {
    const formData = calculateInfrastructureFunding({
      infrastructureBankFunding2223: 1,
      infrastructureBankFunding2324: 1,
      infrastructureBankFunding2425: 1,
      infrastructureBankFunding2526: 1,
    });

    expect(formData).toEqual(
      expect.objectContaining({
        infrastructureBankFunding2223: 1,
        infrastructureBankFunding2324: 1,
        infrastructureBankFunding2425: 1,
        infrastructureBankFunding2526: 1,
        totalInfrastructureBankFunding: 4,
      })
    );
  });
});
