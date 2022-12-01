import Typography from 'typography';
import { TypographyStyle } from 'react-typography';

const typography = new Typography({
  baseFontSize: '16px',
  baseLineHeight: 1.25,
  headerFontFamily: ['BCSans', 'Verdana', 'Arial', 'sans-serif'],
  bodyFontFamily: ['BCSans', 'Verdana', 'Arial', 'sans-serif'],
  scaleRatio: 2.074,
});

const BCGovTypography = () => {
  return <TypographyStyle typography={typography} />;
};

export default BCGovTypography;
