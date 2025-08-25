import { FieldTemplateProps } from '@rjsf/utils';
import React from 'react';
import styled from 'styled-components';
import Description from './components/Description';
import FieldLabel from './components/FieldLabel';

const StyledHR = styled.hr`
  margin-top: ${(props) => props.theme.spacing.small};
  margin-bottom: ${(props) => props.theme.spacing.small};
`;

interface StyledDivProps {
  isSubField: boolean;
  children?: React.ReactNode;
}

const StyledDiv = styled.div<StyledDivProps>`
  margin-left: ${(props) => (props.isSubField ? '60px' : '0')};
`;

const FieldTemplate: React.FC<FieldTemplateProps> = ({
  children,
  errors,
  rawErrors,
  label,
  displayLabel,
  formContext,
  required,
  uiSchema,
  rawDescription,
  schema,
  id,
}) => {
  const uiOptions = uiSchema?.['ui:options'];
  const hideOptional: any = uiOptions?.hideOptional;
  const boldTitle = uiOptions?.boldTitle as boolean;
  const showCreatedAt = Boolean(uiOptions?.showCreatedAt);
  const altOptionalText = uiOptions?.altOptionalText;
  const customTitle = uiOptions?.customTitle as React.JSX.Element;
  const isAddHorizontalLine = uiOptions?.addHorizontalLine as boolean;
  const showLabel = displayLabel && !customTitle;
  const createdAt = formContext?.createdAt;
  const isSubField = (uiOptions?.isSubField as boolean) ?? false;

  return (
    <StyledDiv isSubField={isSubField}>
      {showLabel && (
        <FieldLabel
          bold={boldTitle}
          createdAt={createdAt}
          showCreatedAt={showCreatedAt}
          label={label}
          altOptionalText={altOptionalText && String(altOptionalText)}
          hideOptional={hideOptional}
          required={required}
          htmlFor={id}
        />
      )}
      {customTitle}
      {/*
        For objects, the description is rendered in the ObjectFieldTemplate,
        as displayLabel will be false and we want the description to be below the label
      */}
      {schema.type !== 'object' && (
        <Description rawDescription={rawDescription} schema={schema} />
      )}
      {children}
      {rawErrors && rawErrors.length > 0 ? (
        <div className="error-div">{errors}</div>
      ) : null}
      {isAddHorizontalLine && <StyledHR />}
    </StyledDiv>
  );
};

export default FieldTemplate;
