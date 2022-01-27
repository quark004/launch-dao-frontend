import { styled } from "@mui/material/styles";

const StyledButtonLight = styled("button")`
background-color: rgba(255, 255, 255, 0.1);
padding: 12px 14px;
border-radius: 4px;
color: rgba(255, 255, 255, 0.4);
transition: all 150ms ease;
cursor: pointer;
border: none;
font-family: "Roboto", "Helvetica", "Arial", sans-serif;
font-size: 16px;
letter-spacing: 0.0159rem;
width: 100%;

&:hover {
  background-color: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 99, 132, 1);
}

&.active {
  background-color: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 99, 132, 1);
}

&.focusVisible {
  box-shadow: none;
  outline: none;
}

&.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
`;

export default StyledButtonLight;