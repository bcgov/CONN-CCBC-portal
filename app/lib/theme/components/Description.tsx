import { JSONSchema7 } from 'json-schema';
import styled from 'styled-components';

const StyledH3 = styled('h3')`
  font-size: 21px;
  font-weight: 400;
  line-height: 24.61px;
`;

interface Props {
  rawDescription: string;
  schema: JSONSchema7;
}

/**
 * rjsf's DescriptionField does not have access to the schema,
 * so we need to use the rawDescription and implement the description field logic here instead
 */
const Description: React.FC<Props> = ({ rawDescription, schema }) => {
  if (!rawDescription) return null;

  if (schema.type === 'object' || schema.type === 'array')
    return <StyledH3>{rawDescription}</StyledH3>;

  return <div>{rawDescription}</div>;
};

export default Description;
