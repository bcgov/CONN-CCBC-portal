import { FieldProps } from '@rjsf/core';
import React from 'react';
import { StyledColLeft, StyledColRight, StyledColError } from '../index';

// Field to display a list of yes/no values instead of the enum for array type fields
const ArrayBooleanField: React.FC<FieldProps> = ({
  id,
  formData,
  rawErrors,
  schema,
}) => {
  const fieldSchema = schema as any;
  const enumValues = fieldSchema.items.enum;
  return (
    <>
      {enumValues.map((item, i) => {
        const value = formData && formData[i];
        const isError = rawErrors && rawErrors.length > 0;
        const isValueTrue = enumValues.includes(value);

        return (
          <tr key={item}>
            <StyledColLeft id={id}>{item}</StyledColLeft>
            {isError ? (
              <StyledColError id={`${id}-error`} />
            ) : (
              <StyledColRight id={`${id}-value`}>
                {isValueTrue ? 'Yes' : 'No'}
              </StyledColRight>
            )}
          </tr>
        );
      })}
    </>
  );
};

export default ArrayBooleanField;
