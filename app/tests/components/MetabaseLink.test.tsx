import { render, screen } from '@testing-library/react'; 
import MetabaseLink from 'components/Analyst/Project/ProjectInformation/MetabaseLink';

const renderStaticLayout = (href?, text?, width?) => {
  return render(<MetabaseLink href={href} text={text} width={width}/>);
};

describe('The SubHeaderNavbarLinks component', () => {
  it('should render Metabase link for GIS screen', () => {
    renderStaticLayout('linkto:metabase_link_to_gis_dashboard','Click here to see GIS dashboard', 600);
    const link = screen.getByRole('link', { name: 'Click here to see GIS dashboard' });
    expect(link).toHaveAttribute(
      'href',
      'linkto:metabase_link_to_gis_dashboard'
    );
  });

  it('should render Metabase link for SoW screen', () => {
    renderStaticLayout('linkto:metabase_link_to_sow_dashboard','Click here to see SoW dashboard');
    const link = screen.getByRole('link', { name: 'Click here to see SoW dashboard' });
    expect(link).toHaveAttribute(
      'href',
      'linkto:metabase_link_to_sow_dashboard'
    );
  });
});
