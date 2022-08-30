interface Props {
  label: string;
  required: boolean;
  htmlFor: string;
  tagName?: 'label' | 'dt';
  hideOptional: boolean;
}

const FieldLabel: React.FC<Props> = ({
  label,
  required,
  htmlFor,
  tagName = 'label',
  hideOptional,
}) => {
  if (!label) {
    return null;
  }
  const displayedLabel =
    label + (required || hideOptional ? '' : ` (optional)`) + ' ';

  if (tagName === 'label')
    return <label htmlFor={htmlFor}>{displayedLabel}</label>;

  return <dt>{displayedLabel}</dt>;
};

export default FieldLabel;
