import { WidgetProps } from '@rjsf/utils';
import { useEffect, useState } from 'react';
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
  const { value, formContext, onChange } = props;

  const {
    rowId,
    bcGeographicName,
    economicRegion,
    regionalDistrict,
    geographicNameId,
  } = value ?? {};
  const [selectedEconomicRegion, setSelectedEconomicRegion] = useState<
    string | null
  >(economicRegion);
  const [selectedRegionalDistrict, setSelectedRegionalDistrict] = useState<
    string | null
  >(regionalDistrict);
  const [selectedGeographicName, setSelectedGeographicName] = useState({
    value: geographicNameId,
    label: bcGeographicName,
  });

  useEffect(() => {
    setSelectedEconomicRegion(economicRegion);
    setSelectedRegionalDistrict(regionalDistrict);
    setSelectedGeographicName({
      value: geographicNameId,
      label: bcGeographicName,
    });
  }, [geographicNameId, bcGeographicName, economicRegion, regionalDistrict]);

  const clearWidget = () => {
    setSelectedEconomicRegion(null);
    setSelectedRegionalDistrict(null);
    setSelectedGeographicName({ value: null, label: '' });
  };

  const economicRegionOptions = formContext.economicRegions;
  const regionalDistrictOptions = formContext.regionalDistrictsByEconomicRegion;
  const geographicNameOptions = formContext.geographicNamesByRegionalDistrict;

  return (
    <StyledDiv>
      <Autocomplete
        readOnly={!!rowId}
        data-testid="economic-region-autocomplete"
        onChange={(e, val, reason) => {
          if (reason === 'clear') {
            clearWidget();
          }
          if (e) {
            setSelectedEconomicRegion(val);
          }
        }}
        style={{ width: '200px' }}
        value={selectedEconomicRegion}
        options={economicRegionOptions}
        getOptionLabel={(option) => option}
        renderInput={(params) => (
          <TextField
            {...params}
            data-testid="economic-region-textfield"
            label="Economic Region"
          />
        )}
      />

      <Autocomplete
        readOnly={!!rowId}
        data-testid="regional-district-autocomplete"
        style={{ width: '200px' }}
        onChange={(e, val, reason) => {
          if (reason === 'clear') {
            setSelectedRegionalDistrict(null);
            setSelectedGeographicName({ value: null, label: '' });
          }
          if (e) {
            setSelectedRegionalDistrict(val);
          }
        }}
        value={selectedRegionalDistrict}
        options={
          regionalDistrictOptions[selectedEconomicRegion]
            ? [...regionalDistrictOptions[selectedEconomicRegion]]
            : []
        }
        getOptionLabel={(option) => option}
        renderInput={(params) => (
          <TextField
            {...params}
            data-testid="regional-district-textfield"
            label="Regional District"
          />
        )}
      />

      <Autocomplete
        readOnly={!!rowId}
        data-testid="geographic-name-autocomplete"
        style={{ width: '200px' }}
        renderInput={(params) => (
          <TextField
            {...params}
            id="geographic-name-textfield"
            data-testid="geographic-name-textfield"
            label="Geographic Name"
          />
        )}
        options={
          geographicNameOptions[selectedRegionalDistrict]
            ? [...geographicNameOptions[selectedRegionalDistrict]]
            : []
        }
        isOptionEqualToValue={(option, val) => {
          return option.value === val.value;
        }}
        getOptionLabel={(option) => {
          return option.label ?? '';
        }}
        value={selectedGeographicName}
        onChange={(e, val, reason) => {
          if (reason === 'clear') {
            setSelectedGeographicName({ value: null, label: '' });
            return;
          }
          if (e) {
            setSelectedGeographicName(val);
            onChange({
              bcGeographicName: val.label,
              economicRegion: selectedEconomicRegion,
              regionalDistrict: selectedRegionalDistrict,
              geographicNameId: val.value,
            });
          }
        }}
      />
    </StyledDiv>
  );
};

export default CommunitySourceWidget;
