import { WidgetProps } from '@rjsf/utils';
import { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import { TextField } from '@mui/material';
import styled from 'styled-components';

interface CommunitySourceWidgetProps extends WidgetProps {
  children: React.ReactNode;
}

const StyledDiv = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;
  margin-top: 8px;
`;

const CommunitySourceWidget: React.FC<CommunitySourceWidgetProps> = (props) => {
  const { value, formContext } = props;

  const {
    bcGeographicName,
    economicRegion,
    regionalDistrict,
    rowId: comSourceId,
  } = value ?? {};
  const [selectedEconomicRegion, setSelectedEconomicRegion] = useState<
    string | null
  >(economicRegion);
  const [selectedRegionalDistrict, setSelectedRegionalDistrict] = useState<
    string | null
  >(regionalDistrict);
  const [selectedGeographicName, setSelectedGeographicName] = useState({
    value: comSourceId,
    label: bcGeographicName,
  });

  const economicRegionOptions = formContext.economicRegions;
  const regionalDistrictOptions = formContext.regionalDistrictsByEconomicRegion;
  const geographicNameOptions = formContext.geographicNamesByRegionalDistrict;

  return (
    <StyledDiv>
      <Autocomplete
        onChange={(e, val) => {
          if (e) {
            setSelectedEconomicRegion(val);
          }
        }}
        style={{ width: '300px' }}
        value={economicRegion}
        options={economicRegionOptions}
        getOptionLabel={(option) => option}
        renderInput={(params) => (
          <TextField
            {...params}
            // sx={styles}
            label="Economic Region"
          />
        )}
      />

      <Autocomplete
        value={regionalDistrict}
        style={{ width: '300px' }}
        onChange={(e, val) => {
          if (e) {
            setSelectedRegionalDistrict(val);
          }
        }}
        options={
          regionalDistrictOptions[selectedEconomicRegion]
            ? [...regionalDistrictOptions[selectedEconomicRegion]]
            : []
        }
        getOptionLabel={(option) => option}
        renderInput={(params) => (
          <TextField
            {...params}
            // sx={styles}
            label="Regional District"
          />
        )}
      />

      <Autocomplete
        style={{ width: '300px' }}
        value={selectedGeographicName}
        renderInput={(params) => (
          <TextField {...params} label="Geographic Name" />
        )}
        options={
          geographicNameOptions[selectedRegionalDistrict]
            ? [...geographicNameOptions[selectedRegionalDistrict]]
            : []
        }
        isOptionEqualToValue={(option, val) => {
          return option.value === val;
        }}
        getOptionLabel={(option) => {
          return option.label;
        }}
        onChange={(e, val) => {
          if (e) {
            setSelectedGeographicName(val);
          }
        }}
      />
    </StyledDiv>
  );
};

export default CommunitySourceWidget;
