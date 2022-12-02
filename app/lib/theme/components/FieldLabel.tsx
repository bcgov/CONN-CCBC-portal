interface Props {
  altOptionalText: string;
  htmlFor: string;
  hideOptional: boolean;
  label: string;
  required: boolean;
  tagName?: 'label' | 'dt';
  bold: boolean;
}

const FieldLabel: React.FC<Props> = ({
  altOptionalText,
  bold,
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
    return (
      <label htmlFor={htmlFor} style={{ fontWeight: bold ? 700 : 400 }}>
        {displayedLabel}
      </label>
    );

  return <dt>{displayedLabel}</dt>;
};

export default FieldLabel;
