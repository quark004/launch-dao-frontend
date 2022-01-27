import React from "react";
import "./explore.css";
import StyledInput from '../UI/StyledInput';
import StyledButtonDark from "../UI/StyledButtonDark";
import StyledButtonLight from "../UI/StyledButtonLight";
import { useNavigate } from "react-router-dom";

const Explore = ({ dao }) => {
  const navigate = useNavigate();

  const daoName = dao.tokenName;
  const ownerAddress = dao.owner;
  const totalSupply = dao.totalSupply;
  const tokenSymbol = dao.tokenSymbol;

  const decimal = 18;

  const formatAddress = (address) => {
    return (
      address.substring(0, 8) +
      "..." +
      address.substring(address.length - 8, address.length)
    );
  };

  const formatSupply = function (num, fixed) {
    if (num === null) {
      return null;
    } // terminate early
    if (num === 0) {
      return "0";
    } // terminate early

    num = num / Math.pow(10, decimal);

    fixed = !fixed || fixed < 0 ? 0 : fixed; // number of decimal places to show
    var b = num.toPrecision(2).split("e"), // get power
      k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3), // floor at decimals, ceiling at trillions
      c =
        k < 1
          ? num.toFixed(0 + fixed)
          : (num / Math.pow(10, k * 3)).toFixed(1 + fixed), // divide by power
      d = c < 0 ? c : Math.abs(c), // enforce -0 is 0
      e = d + ["", "K", "M", "B", "T"][k]; // append power
    return e;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: 450,
        alignItems: "stretch",
        alignSelf: "center",
      }}
    >
      <h1>{daoName}</h1>
      <div style={{ marginTop: 2 }}>
        <StyledInput
          disabled
          style={{ width: "100%" }}
          id="filled-basic"
          InputProps={{
            placeholder: "Owner Address",
            disableUnderline: true,
          }}
          variant="filled"
        />
        <StyledButtonLight
          onClick={() => {
            navigator.clipboard.writeText(ownerAddress)
          }}
        >{formatAddress(ownerAddress)}</StyledButtonLight>
      </div>

      <div style={{ display: "flex", marginTop: 12 }}>
        <StyledInput
          disabled
          id="filled-basic"
          InputProps={{
            placeholder: "Token Symbol",
            disableUnderline: true,
          }}
          variant="filled"
        />
        <StyledButtonLight>{tokenSymbol}</StyledButtonLight>
      </div>

      <div style={{ display: "flex", marginTop: 2, marginBottom: 12 }}>
        <StyledInput
          disabled
          id="filled-basic"
          InputProps={{
            placeholder: "Total Supply",
            disableUnderline: true,
          }}
          variant="filled"
        />
        <StyledButtonLight>{formatSupply(totalSupply)}</StyledButtonLight>
      </div>
      <StyledButtonDark onClick={() =>  navigate(`/dao/${dao.tokenAddress}`)}>View Dao</StyledButtonDark>
    </div>
  );
};

export default Explore;
