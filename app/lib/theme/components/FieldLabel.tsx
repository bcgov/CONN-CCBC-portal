interface Props {
  altOptionalText: string;
  htmlFor: string;
  hideOptional: boolean;
  label: string;
  required: boolean;
  tagName?: 'label' | 'dt';
}

const FieldLabel: React.FC<Props> = ({
  altOptionalText,
  hideOptional,
  htmlFor,
  label,
  required,
  tagName = 'label',
}) => {
  if (!label) {
    return null;
  }
  const optionalText = ` (${altOptionalText || 'optional'})`;
  const displayedLabel = `${
    label + (required || hideOptional ? '' : optionalText)
  } `;

  if (tagName === 'label')
    return <label htmlFor={htmlFor}>{displayedLabel}</label>;

  return <dt>{displayedLabel}</dt>;
};

export default FieldLabel;
