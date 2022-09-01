import styled from 'styled-components';

const StyledSpan = styled('span')`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;
const CalendarIcon = ({ onClick }: any) => {
  return (
    <StyledSpan onClick={onClick}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="2.75"
          y="5.75"
          width="18.5"
          height="16.5"
          rx="1.25"
          stroke="black"
          strokeWidth="1.5"
        />
        <path
          d="M4 5.5H20C20.8284 5.5 21.5 6.17157 21.5 7V9.5H2.5V7C2.5 6.17157 3.17157 5.5 4 5.5Z"
          fill="black"
          stroke="black"
        />
        <mask id="path-3-inside-1_2485_9855" fill="white">
          <rect x="6" y="1" width="4" height="6" rx="1" />
        </mask>
        <rect
          x="6"
          y="1"
          width="4"
          height="6"
          rx="1"
          fill="white"
          stroke="black"
          strokeWidth="3"
          mask="url(#path-3-inside-1_2485_9855)"
        />
        <mask id="path-4-inside-2_2485_9855" fill="white">
          <rect x="14" y="1" width="4" height="6" rx="1" />
        </mask>
        <rect
          x="14"
          y="1"
          width="4"
          height="6"
          rx="1"
          fill="white"
          stroke="black"
          strokeWidth="3"
          mask="url(#path-4-inside-2_2485_9855)"
        />
      </svg>
    </StyledSpan>
  );
};

export default CalendarIcon;
