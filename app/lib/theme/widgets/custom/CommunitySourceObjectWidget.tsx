import { WidgetProps } from '@rjsf/utils';
import SelectWidget from '../SelectWidget';

interface CommunitySourceObjectWidgetProps extends WidgetProps {
  children: React.ReactNode;
}

const CommunitySourceObjectWidget: React.FC<
  CommunitySourceObjectWidgetProps
> = (props) => {
  const { schema, value, formContext, onChange } = props;

  const { economicRegion, regionalDistrict, geographicName, comSourceId } =
    value ?? {};

  const economicRegionOptions = formContext.economicRegions;
  const regionalDistrictOptions = formContext.regionalDistricts;
  const geographicNameOptions = formContext.geographicNames;

  const deleteComSource = formContext?.deleteComSource as Function;

  return (
    <>
      <SelectWidget
        {...props}
        onChange={(val) => {
          if (onChange && typeof onChange === 'function') {
            onChange(val);
          }
        }}
        value={economicRegion}
        schema={{ ...schema, enum: economicRegionOptions }}
      />

      <SelectWidget
        {...props}
        value={regionalDistrict}
        schema={{ ...schema, enum: regionalDistrictOptions }}
      />

      <SelectWidget
        {...props}
        value={geographicName}
        schema={{ ...schema, enum: geographicNameOptions }}
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
        X
      </button>
    </>
  );
};

export default CommunitySourceObjectWidget;
