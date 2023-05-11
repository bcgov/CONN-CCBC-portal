const applicationGisDataSchema = {
  gis: {
    properties: {
      GIS_TOTAL_HH: {
        title: 'Total HH',
      },
      GIS_TOTAL_INDIG_HH: {
        title: 'Indigenous HH',
      },
      GIS_PERCENT_OVERLAP: {
        title: 'Overlap %',
      },
      number_of_households: {
        title: 'Number of Households',
      },
      GIS_PERCENT_OVERBUILD: {
        title: 'Overbuild %',
      },
      GIS_TOTAL_ELIGIBLE_HH: {
        title: 'Eligible HH',
      },
      GIS_TOTAL_INELIGIBLE_HH: {
        title: 'Ineligible HH',
      },
      GIS_TOTAL_ELIGIBLE_INDIG_HH: {
        title: 'Eligible Indigenous HH',
      },
      households_impacted_indigenous: {
        title: 'Total Impacted Indigenous Households',
      },
    },
  },
};

export default applicationGisDataSchema;
