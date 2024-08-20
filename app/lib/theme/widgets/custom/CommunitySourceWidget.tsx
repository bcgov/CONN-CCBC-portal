import { WidgetProps } from '@rjsf/utils';
import { useState } from 'react';
import styled from 'styled-components';
import SelectWidget from '../SelectWidget';

interface CommunitySourceWidgetProps extends WidgetProps {
  children: React.ReactNode;
}

const StyledDiv = styled.div`
  display: flex;
  flex-direction: row;
`;

const CommunitySourceWidget: React.FC<CommunitySourceWidgetProps> = (props) => {
  const { schema, value, formContext } = props;

  const { economicRegion, regionalDistrict, rowId: comSourceId } = value ?? {};
  const [selectedEconomicRegion, setSelectedEconomicRegion] = useState<
    string | null
  >(economicRegion);
  const [selectedRegionalDistrict, setSelectedRegionalDistrict] = useState<
    string | null
  >(regionalDistrict);
  const [selectedGeographicName] = useState<number | null>(comSourceId);

  const economicRegionOptions = formContext.economicRegions;
  const regionalDistrictOptions = formContext.regionalDistrictsByEconomicRegion;
  const geographicNameOptions = formContext.geographicNamesByRegionalDistrict;

  const deleteComSource = formContext?.deleteComSource as Function;

  return (
    <StyledDiv>
      <SelectWidget
        {...props}
        onChange={(val) => {
          setSelectedEconomicRegion(val);
        }}
        value={economicRegion}
        placeholder="Select Economic Region"
        schema={{ ...schema, enum: economicRegionOptions }}
      />

      <SelectWidget
        {...props}
        value={regionalDistrict}
        placeholder="Select Regional District"
        onChange={(val) => {
          setSelectedRegionalDistrict(val);
        }}
        schema={{
          ...schema,
          enum: regionalDistrictOptions[selectedEconomicRegion] ?? [],
        }}
      />

      <SelectWidget
        {...props}
        value={selectedGeographicName}
        placeholder="Select Geographic Name"
        schema={{
          ...schema,
          enum: geographicNameOptions[selectedRegionalDistrict] ?? [],
        }}
      />

      <button
        onClick={(e) => {
          e.preventDefault();
          if (deleteComSource) {
            deleteComSource(comSourceId);
          }
        }}
        type="button"
      >
        Remove
      </button>
    </StyledDiv>
  );
};

export default CommunitySourceWidget;
