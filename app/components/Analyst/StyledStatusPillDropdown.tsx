import styled from 'styled-components';

/** Transient styling for application / CBC status pill dropdowns */
export interface StatusPillDropdownProps {
  $statusStyles: {
    primary: string;
    backgroundColor: string;
    pillWidth: string;
  };
}

export const StyledStatusPillDropdown = styled.select<StatusPillDropdownProps>`
  color: ${(props) => props.$statusStyles?.primary ?? '#414141'};
  border: none;
  border-radius: 16px;
  appearance: none;
  padding: 6px 12px;
  height: 32px;
  width: ${(props) => props.$statusStyles?.pillWidth ?? '140px'};
  background-color: ${(props) =>
    props.$statusStyles?.backgroundColor ?? '#E8E8E8'};
  background-image: ${(props) =>
    `url("data:image/svg+xml;utf8,<svg viewBox='0 0 140 140' width='24' height='24' xmlns='http://www.w3.org/2000/svg'><g><path d='m121.3,34.6c-1.6-1.6-4.2-1.6-5.8,0l-51,51.1-51.1-51.1c-1.6-1.6-4.2-1.6-5.8,0-1.6,1.6-1.6,4.2 0,5.8l53.9,53.9c0.8,0.8 1.8,1.2 2.9,1.2 1,0 2.1-0.4 2.9-1.2l53.9-53.9c1.7-1.6 1.7-4.2 0.1-5.8z' fill='${(props.$statusStyles?.primary ?? '#414141').replaceAll('#', '%23')}'/></g></svg>")`};
  background-repeat: no-repeat;
  background-position: right 5px top 5px;

  :focus {
    outline: none;
  }
`;

export const StyledStatusPillDropdownOption = styled.option`
  color: ${(props) => props.theme.color.text};
  background-color: ${(props) => props.theme.color.white};
`;
