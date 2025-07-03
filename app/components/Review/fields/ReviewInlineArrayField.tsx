import { FieldProps } from '@rjsf/utils';
import React from 'react';
import { StyledColLeft, StyledColRight } from 'components/Review/Components';

const ReviewInlineArrayField: React.FC<FieldProps> = ({
  idSchema,
  formData,
  schema,
  uiSchema,
  formContext,
}) => {
  const id = idSchema.$id;
  const fieldName = id?.split('_')?.[2];
  const pageName = id?.split('_')?.[1];
  const formErrorSchema = formContext?.errors ?? formContext.formErrorSchema;
  const hasError =
    formErrorSchema?.[pageName]?.[fieldName]?.__errors?.length > 0;
  const sortArray =
    (uiSchema?.['ui:options']?.sort as JSX.Element) && Array.isArray(formData);
  const sortedArray = sortArray
    ? [...formData].sort((a, b) => a - b)
    : formData;
  return (
    <tr>
      <StyledColLeft id={id}>{schema.title}</StyledColLeft>
      <StyledColRight
        id={hasError ? `${id}-error` : `${id}-value`}
        hasError={hasError}
      >
        {hasError
          ? null
          : sortedArray?.map((el, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <React.Fragment key={`${id}_${index}`}>
                {el.toString()}
                {index < sortedArray.length - 1 && (
                  <>
                    ,<br />
                  </>
                )}
              </React.Fragment>
            ))}
      </StyledColRight>
    </tr>
  );
};

export default ReviewInlineArrayField;
