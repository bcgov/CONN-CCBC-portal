import { WidgetProps } from '@rjsf/utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import { TextField } from '@mui/material';
import styled from 'styled-components';
import { Button } from '@button-inc/bcgov-theme';

interface CommunitySourceWidgetProps extends WidgetProps {
  children: React.ReactNode;
}

const StyledDiv = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;
  margin-top: 8px;
  margin-bottom: 8px;
  align-items: center;
`;

const StyledButton = styled(Button)`
  height: 40px;
  padding: 5px;
  margin: 2px;
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
  const [selectedEconomicRegion, setSelectedEconomicRegion] = useState<string>(
    economicRegion ?? ''
  );
  const [selectedRegionalDistrict, setSelectedRegionalDistrict] =
    useState<string>(regionalDistrict ?? '');
  const [selectedGeographicName, setSelectedGeographicName] = useState({
    value: geographicNameId,
    label: bcGeographicName,
  });

  useEffect(() => {
    setSelectedEconomicRegion(economicRegion);
    setSelectedRegionalDistrict(regionalDistrict);
    setSelectedGeographicName({
      value: geographicNameId ?? null,
      label: bcGeographicName ?? '',
    });
  }, [geographicNameId, bcGeographicName, economicRegion, regionalDistrict]);

  const selectedGeographicNameIdList = useMemo(() => {
    return [
      ...formContext.cbcCommunitiesData.map(
        (community) =>
          community.communitiesSourceDataByCommunitiesSourceDataId
            .geographicNameId
      ),
      ...formContext.addedCommunities,
    ];
  }, [formContext.cbcCommunitiesData, formContext.addedCommunities]);

  const clearWidget = useCallback(() => {
    setSelectedEconomicRegion(null);
    setSelectedRegionalDistrict(null);
    setSelectedGeographicName({ value: null, label: '' });
    // check if the form value has been touched, and if so clear it
    if (Object.keys(value).length > 0) {
      onChange({});
    }
  }, [
    setSelectedEconomicRegion,
    setSelectedRegionalDistrict,
    setSelectedGeographicName,
    value,
    onChange,
  ]);

  const economicRegionOptions = formContext.economicRegions;
  const regionalDistrictOptions = formContext.regionalDistrictsByEconomicRegion;
  const geographicNameOptions = formContext.geographicNamesByRegionalDistrict;

  const isGeographicNameOptionDisabled = (option) => {
    return selectedGeographicNameIdList.includes(option.value);
  };

  const getGeographicNameOptions = (selectedRegDis, selEcoReg) => {
    if (!selectedRegDis && !selEcoReg) {
      return [];
    }

    if (!selectedRegDis && geographicNameOptions[selEcoReg]['null']) {
      return [...geographicNameOptions[selEcoReg]['null']];
    }

    if (geographicNameOptions[selEcoReg][selectedRegDis]) {
      return [...geographicNameOptions[selEcoReg][selectedRegDis]];
    }
    return [];
  };

  return (
    <StyledDiv>
      <Autocomplete
        readOnly={!!rowId}
        key={`economic-region-${rowId}`}
        data-testid="economic-region-autocomplete"
        onChange={(e, val, reason) => {
          if (reason === 'clear') {
            clearWidget();
          }
          if (e) {
            setSelectedRegionalDistrict(null);
            setSelectedGeographicName({ value: null, label: '' });
            setSelectedEconomicRegion(val);
          }
        }}
        style={{ width: '200px' }}
        value={selectedEconomicRegion}
        inputValue={selectedEconomicRegion ?? ''}
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
        key={`regional-district-${rowId}`}
        data-testid="regional-district-autocomplete"
        style={{ width: '200px' }}
        onChange={(e, val, reason) => {
          if (reason === 'clear') {
            setSelectedRegionalDistrict('');
            setSelectedGeographicName({ value: null, label: '' });
          }
          if (e) {
            setSelectedRegionalDistrict(val);
          }
        }}
        value={selectedRegionalDistrict}
        inputValue={selectedRegionalDistrict ?? ''}
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
        key={`geographic-name-${rowId}`}
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
        options={getGeographicNameOptions(
          selectedRegionalDistrict,
          selectedEconomicRegion
        )}
        isOptionEqualToValue={(option, val) => {
          return option.value === val.value;
        }}
        getOptionDisabled={isGeographicNameOptionDisabled}
        getOptionLabel={(option) => {
          return option.label ?? '';
        }}
        value={selectedGeographicName}
        inputValue={selectedGeographicName?.label ?? ''}
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
      {!rowId && (
        <StyledButton
          variant="secondary"
          type="button"
          onClick={(e) => {
            e.preventDefault();
            clearWidget();
          }}
          data-testid="clear-community-button"
        >
          Clear
        </StyledButton>
      )}
    </StyledDiv>
  );
};

export default CommunitySourceWidget;
