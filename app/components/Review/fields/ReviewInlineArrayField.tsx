import { FieldProps } from '@rjsf/utils';
import React from 'react';
import {
  StyledColLeft,
  StyledColRight,
  StyledColError,
} from 'components/Review/Components';

const ReviewInlineArrayField: React.FC<FieldProps> = ({
  idSchema,
  formData,
  schema,
  formContext,
}) => {
  const id = idSchema.$id;
  const fieldName = id?.split('_')?.[2];
  const pageName = id?.split('_')?.[1];
  const formErrorSchema = formContext?.errors ?? formContext.formErrorSchema;
  const errors = formErrorSchema?.[pageName]?.[fieldName]?.__errors;
  return (
    <tr>
      <StyledColLeft id={id}>{schema.title}</StyledColLeft>
      {errors ? (
        <StyledColError id={`${id}-error`} />
      ) : (
        <StyledColRight id={`${id}-value`}>
          {formData?.map((el, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <React.Fragment key={`${id}_${index}`}>
              {el.toString()}
              {index < formData.length - 1 && (
                <>
                  ,<br />
                </>
              )}
            </React.Fragment>
          ))}
        </StyledColRight>
      )}
    </tr>
  );
};

export default ReviewInlineArrayField;
