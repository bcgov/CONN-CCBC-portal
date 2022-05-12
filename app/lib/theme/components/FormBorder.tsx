interface Props {
  title?: string;
  children?: any;
}

const FormBorder: React.FC<Props> = ({ title, children }) => {
  return (
    <>
      <fieldset className="formFieldset">
        {title && (
          <legend>
            <h1>{title}</h1>
          </legend>
        )}
        {children}
      </fieldset>
    </>
  );
};

export default FormBorder;
