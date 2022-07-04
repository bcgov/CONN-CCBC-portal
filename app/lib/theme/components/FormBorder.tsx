interface Props {
  title?: string;
  children?: any;
  subtitle: string;
}

const FormBorder: React.FC<Props> = ({ subtitle, title, children }) => {
  return (
    <fieldset className="formFieldset">
      {title && (
        <legend>
          {subtitle ? (
            <h3 style={{ marginBottom: 0 }}>{title}</h3>
          ) : (
            <h1>{title}</h1>
          )}
        </legend>
      )}
      {children}
    </fieldset>
  );
};

export default FormBorder;
