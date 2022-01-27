import { styled } from "@mui/material/styles";

const ConnectWallet = styled("button")`
  font-weight: bold;
  background-color: #2e2828;
  padding: 2px 12px;
  border-radius: 4px;
  color: white;
  transition: all 150ms ease;
  cursor: pointer;
  border: none;
  margin-left: 8px;

  &:hover {
    background-color: rgba(46, 40, 40, 0.6);
  }

  &.active {
    background-color: rgba(46, 40, 40, 0.5);
  }

  &.focusVisible {
    box-shadow: 0 4px 20px 0 rgba(61, 71, 82, 0.1),
      0 0 0 5px rgba(0, 127, 255, 0.5);
    outline: none;
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default ConnectWallet;