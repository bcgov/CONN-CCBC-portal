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
            <h2>{title}</h2>
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
