const ProjectBenefits = () => {
  return (
    <div>
      <p>
        Sustainability. Please summarize the benefits that the Project will
        bring to the targeted areas. Describe the benefits and sustainability of
        the Project in terms of:
      </p>
      <ul>
        <li>Social and economic benefits</li>
        <li>Improvements to community connectivity</li>
        <li>Facilitation of commercial or industrial development</li>
        <li>Improvement of public services or social programs delivery</li>
        <li>Improvement of small businesses</li>
        <li>Enhancement of entrepreneurship capacity</li>
        <li>
          The Applicant organization’s corporate social responsibility policy
          and philanthropic practices, including how the organization promotes
          reconciliation, gender equality and diversity or how your organization
          gives back to the community.
        </li>
      </ul>
      <p>
        To support claims of social and economic benefits, Applicants should
        provide letters of support and the accompanying Template 6: Community
        and Rural Development Benefits at the uploads section.
      </p>
    </div>
  );
};

const IndigenousEntity = () => {
  return (
    <div>
      <p>
        Is this Applicant organization an Indigenous identity? An Indigenous
        identity may include:
      </p>
      <ul>
        <li>
          A for-profit or non-profit organization run by and for First Nations,
          M&eacute;tis, or Inuit peoples;
        </li>
        <li>
          A band council within the meaning of section 2 of the Indian Act;
        </li>
        <li>
          An Indigenous government authority established by a Self-Government
          Agreement or a Comprehensive Land Claim Agreement
        </li>
      </ul>
    </div>
  );
};

const NumberOfHouseholds = () => {
  return (
    <div>
      Final number of Eligible Households targeted by this proposal. This value
      should match cell G50 in Template 1 – Eligibility Summary.
    </div>
  );
};

const HouseholdsImpactedIndigenous = () => {
  return (
    <div>
      Number of households on Indigenous lands impacted by this proposal. This
      value should match cell G55 in Template 1 – Eligibility Summary.
    </div>
  );
};

export {
  HouseholdsImpactedIndigenous,
  IndigenousEntity,
  NumberOfHouseholds,
  ProjectBenefits,
};
