const benefits = {
  benefits: {
    title: 'Benefits',
    type: 'object',
    description:
      'Quantify any estimation or claim about the effects of the proposed project to the targeted areas',
    required: ['projectBenefits', 'numberOfHouseholds'],
    properties: {
      projectBenefits: {
        title: `Projects will be assessed based on their household connectivity impacts and on their social and economic benefits. The effects of the project on program’s primary objectives will be derived from Template 1: Eligibility and Impacts Calculator. Please note: templates will be uploaded later. In addition, if the project
        includes backbone infrastructure, the Template 5: List of Points of Presences must also be filled out. Please summarize below the benefits that the project will bring to the targeted areas. To support their claims of social and economic benefits, applicants should provide letters of support and upload Template 6: Community and Rural Development Benefits. This template should include a listing for the letters of support and their associated benefits. Please see the guide for more information.
        
        Sustainability. Description of the social and economic benefits as a result of the proposed project, such as improvements to community connectivity, facilitation of commercial or industrial development, improvement of public services or social programs delivery, improvement of small businesses, enhancement of entrepreneurship capacity, applicant’s corporate social responsibility policy and its philanthropic practices, etc. 
        
        In the case of internal corporate policies, social responsibility and philanthropic practices, describe how your organization promotes gender equality and diversity or how your organization gives back to the community.`,
        type: 'string',
      },
      numberOfHouseholds: {
        title:
          'Total number of households targeted by this project. This value should match the value in Template 1.',
        type: 'string',
      },
    },
  },
};

export default benefits;
