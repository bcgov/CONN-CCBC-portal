import { WidgetProps } from '@rjsf/utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import { TextField } from '@mui/material';
import styled from 'styled-components';
import { Button } from '@button-inc/bcgov-theme';

interface CommunitySourceWidgetProps extends WidgetProps {
  children: React.ReactNode;
}

interface StyledDivProps {
  children?: React.ReactNode;
}

const StyledDiv = styled.div<StyledDivProps>`
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

interface StyledOptionMenuProps {
  children?: React.ReactNode;
}

const StyledOptionMenu = styled.li<StyledOptionMenuProps>`
  display: flex;
  border: 1px dashed lightgrey;
  margin: 0;
  padding: 0;
`;

interface StyledLabelDivProps {
  children?: React.ReactNode;
}

const StyledLabelDiv = styled.div<StyledLabelDivProps>`
  width: 40%;
  padding: 8px;
  border-right: 1px dashed lightgrey;
`;

interface StyledIdDivProps {
  children?: React.ReactNode;
}

const StyledIdDiv = styled.div<StyledIdDivProps>`
  width: 20%;
  padding: 8px;
`;

const StyledDisplayContainer = styled.div`
  display: flex;
  padding: 5px 0;
`;

interface StyledDisplayFieldProps {
  width?: string;
  children?: React.ReactNode;
}

const StyledDisplayField = styled.div<StyledDisplayFieldProps>`
  width: ${(props) => props?.width || '200px'};
  padding: 1px;
`;

const DisplayRow = ({ label, type = null, value = null }) => (
  <>
    <StyledDisplayField>{label}</StyledDisplayField>
    {type && <StyledDisplayField width="150px">{type}</StyledDisplayField>}
    {value && <StyledDisplayField width="50px">{value}</StyledDisplayField>}
  </>
);

const CommunitySourceWidget: React.FC<CommunitySourceWidgetProps> = (props) => {
  const { value, formContext, onChange } = props;

  const {
    rowId,
    bcGeographicName,
    economicRegion,
    regionalDistrict,
    geographicNameId,
    geographicType,
  } = value ?? {};
  const [selectedEconomicRegion, setSelectedEconomicRegion] = useState<string>(
    economicRegion ?? ''
  );
  const [selectedRegionalDistrict, setSelectedRegionalDistrict] =
    useState<string>(regionalDistrict ?? '');
  const [selectedGeographicName, setSelectedGeographicName] = useState({
    value: geographicNameId,
    label: bcGeographicName,
    type: geographicType,
  });
  const [economicRegionInputValue, setEconomicRegionInputValue] = useState('');
  const [regionalDistrictInputValue, setRegionalDistrictValue] = useState('');
  const [geographicNameInputValue, setGeographicNameInputValue] = useState('');

  useEffect(() => {
    setSelectedEconomicRegion(economicRegion);
    setSelectedRegionalDistrict(regionalDistrict);
    setSelectedGeographicName({
      value: geographicNameId ?? null,
      label: bcGeographicName ?? '',
      type: geographicType ?? '',
    });
  }, [
    geographicNameId,
    bcGeographicName,
    economicRegion,
    regionalDistrict,
    geographicType,
  ]);

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
    setSelectedGeographicName({ value: null, label: '', type: '' });
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
  const { allCommunitiesSourceData } = formContext;

  const allGeographicNameOptions = useMemo(
    () =>
      allCommunitiesSourceData.map((source) => ({
        ...source,
        label: source.bcGeographicName,
        type: source.geographicType,
        value: source.geographicNameId,
      })),
    [allCommunitiesSourceData]
  );

  const isGeographicNameOptionDisabled = (option) => {
    return selectedGeographicNameIdList.includes(option.value);
  };

  const getGeographicNameOptions = (selectedRegDis, selEcoReg) => {
    if (!selectedRegDis && !selEcoReg) {
      return allGeographicNameOptions;
    }

    if (!selectedRegDis && geographicNameOptions[selEcoReg]) {
      return Object.entries(geographicNameOptions[selEcoReg]).flatMap(
        ([key, options]: [string, Set<any>]) =>
          [...options].map((option) => ({
            ...option,
            key,
          }))
      );
    }

    if (geographicNameOptions[selEcoReg][selectedRegDis]) {
      return [...geographicNameOptions[selEcoReg][selectedRegDis]];
    }
    return [];
  };

  const getOptionLabel = (option) => {
    if (!option?.label) {
      return '';
    }
    return `${option.label} | ${option.type} | ${option.value}`;
  };

  return (
    <StyledDiv>
      {rowId ? (
        <DisplayRow label={selectedEconomicRegion} />
      ) : (
        <Autocomplete
          key={`economic-region-${rowId}`}
          data-testid="economic-region-autocomplete"
          onChange={(e, val, reason) => {
            if (reason === 'clear') {
              clearWidget();
            }
            if (e) {
              setSelectedRegionalDistrict(null);
              setSelectedGeographicName({ value: null, label: '', type: '' });
              setSelectedEconomicRegion(val);
            }
          }}
          onInputChange={(e, val) => {
            setEconomicRegionInputValue(val);
          }}
          style={{ width: '200px' }}
          value={selectedEconomicRegion}
          inputValue={economicRegionInputValue}
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
      )}

      {rowId ? (
        <DisplayRow label={selectedRegionalDistrict} />
      ) : (
        <Autocomplete
          key={`regional-district-${rowId}`}
          data-testid="regional-district-autocomplete"
          style={{ width: '200px' }}
          onChange={(e, val, reason) => {
            if (reason === 'clear') {
              setSelectedRegionalDistrict('');
              setSelectedGeographicName({ value: null, label: '', type: '' });
            }
            if (e) {
              setSelectedGeographicName({ value: null, label: '', type: '' });
              setSelectedRegionalDistrict(val);
            }
          }}
          onInputChange={(e, val) => {
            setRegionalDistrictValue(val);
          }}
          value={selectedRegionalDistrict}
          inputValue={regionalDistrictInputValue}
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
      )}

      {rowId ? (
        <StyledDisplayContainer>
          <DisplayRow
            label={selectedGeographicName.label}
            type={selectedGeographicName.type}
            value={selectedGeographicName.value}
          />
        </StyledDisplayContainer>
      ) : (
        <Autocomplete
          key={`geographic-name-${rowId}`}
          data-testid="geographic-name-autocomplete"
          style={{ width: '400px' }}
          renderInput={(params) => (
            <TextField
              {...params}
              id="geographic-name-textfield"
              data-testid="geographic-name-textfield"
              label="Geographic Name, Type & ID"
            />
          )}
          renderOption={(renderProps, { label, type, value: id }) => (
            <StyledOptionMenu {...renderProps} key={id}>
              <StyledLabelDiv>{label}</StyledLabelDiv>
              <StyledLabelDiv>{type}</StyledLabelDiv>
              <StyledIdDiv>{id}</StyledIdDiv>
            </StyledOptionMenu>
          )}
          options={getGeographicNameOptions(
            selectedRegionalDistrict,
            selectedEconomicRegion
          )}
          filterOptions={(options, { inputValue }) =>
            options.filter(
              ({ label, value: optionValue }) =>
                label.toLowerCase().includes(inputValue.toLowerCase()) ||
                optionValue.toString().includes(inputValue)
            )
          }
          isOptionEqualToValue={(option, val) => option.value === val.value}
          getOptionDisabled={isGeographicNameOptionDisabled}
          getOptionLabel={getOptionLabel}
          value={selectedGeographicName}
          inputValue={geographicNameInputValue}
          onChange={(e, val, reason) => {
            if (reason === 'clear') {
              setSelectedGeographicName({ value: null, label: '', type: '' });
              return;
            }
            if (e) {
              setSelectedGeographicName(val);
              if (!selectedEconomicRegion)
                setSelectedEconomicRegion(val.economicRegion);
              if (!selectedRegionalDistrict)
                setSelectedRegionalDistrict(val.regionalDistrict);
              onChange({
                bcGeographicName: val.label,
                geographicNameId: val.value,
                geographicType: val.type,
                economicRegion: selectedEconomicRegion || val.economicRegion,
                regionalDistrict:
                  selectedRegionalDistrict || val.regionalDistrict,
              });
            }
          }}
          onInputChange={(e, val) => setGeographicNameInputValue(val)}
        />
      )}
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
