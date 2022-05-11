interface Props {
  title?: string;
  children?: any;
}

const FormBorder: React.FC<Props> = ({ title, children }) => {
  return (
    <>
      <fieldset>
        {title && (
          <legend>
            <h1>{title}</h1>
          </legend>
        )}
        {children}
      </fieldset>
      <style jsx>
        {`
          fieldset > legend {
            // margin: 0 1em;
            // padding: 0 1em;
          }
          fieldset {
            border: none;
          }
        `}
      </style>
    </>
  );
};

export default FormBorder;
