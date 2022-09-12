import { FieldProps } from '@rjsf/core';
import { JSONSchema7 } from 'json-schema';
import { useMemo } from 'react';
import styled from 'styled-components';
import { StyledH4, StyledTitleRow } from '../Table';
import React from 'react';

const ReviewArrayField: React.FC<FieldProps> = (props) => {
  const { id, formData, schema, registry, errorSchema, uiSchema, idSchema } =
    props;
  console.log(props);

  const idSchemas = useMemo(
    () =>
      formData?.map((_, index) => {
        return {
          ...idSchema,
          $id: `${idSchema.$id}_${index}`,
        };
      }),
    [idSchema, formData]
  );

  const SchemaField = registry.fields.SchemaField;
  return formData?.map((el, index) => {
    return (
      <React.Fragment key={`${id}_${index}`}>
        <tr>
          <StyledTitleRow colSpan={2}>
            <StyledH4>
              {index + 1}. {uiSchema?.['ui:itemTitle']}
            </StyledH4>
          </StyledTitleRow>
        </tr>
        <SchemaField
          {...props}
          key={`${id}_${index}`}
          schema={schema.items as JSONSchema7}
          formData={el}
          errorSchema={errorSchema[index]}
          uiSchema={uiSchema?.items}
          idSchema={idSchemas[index]}
        />
      </React.Fragment>
    );
  });
};

export default ReviewArrayField;
