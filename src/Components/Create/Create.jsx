import React, { useEffect, useState } from "react";
import StyledInput from "../UI/StyledInput";
import StyledButtonDark from "../UI/StyledButtonDark";
import {
  useConnect,
  useAccount,
  useContract,
  useSigner,
  useNetwork,
} from "wagmi";
import contractConfig from "../../../src/contract/config.json";
import daoContractABI from "../../../src/contract/daoContractABI.json";
import BN from "bn.js";
import { useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Create = () => {
  const navigate = useNavigate();
  const [creating, setCreating] = React.useState(false);
  const [{ data, error }, connect] = useConnect();
  const [
    { data: networkData, error: networkError, loading: networkLoading },
    switchNetwork,
  ] = useNetwork();
  const [chainError, setChainError] = React.useState(false);

  const [daoCreated, setDaoCreated] = useState(false);

  useEffect(() => {
    if (networkData && networkData.chain && networkData.chain.id) {
      console.log(networkData.chain.id);
      if (networkData.chain.id !== contractConfig.chainId) {
        console.log(networkData.chain.id, contractConfig.chainId);
        setChainError(true);
        return;
      }
      setChainError(false);
    }
  }, [networkData]);

  const [
    { data: accountData, error: accountError, loading: accountLoading },
    disconnect,
  ] = useAccount({
    fetchEns: false,
  });

  const [daoName, setDaoName] = React.useState("");
  const [tokenSymbol, setTokenSymbol] = React.useState("");
  const [totalTokens, setTotalTokens] = React.useState("1000000");
  const [initialSupply, setInitialSupply] = React.useState("10000");

  useEffect(() => {
    if (accountLoading) return;
    if (daoName === "" && tokenSymbol === "" && accountData?.ens?.name) {
      setDaoName(accountData.ens.name);
      setTokenSymbol(accountData.ens.name.split(".")[0].toUpperCase());
    }
  }, [accountLoading, accountData]);

  const [
    { data: signerData, error: signerError, loading: signerLoading },
    getSigner,
  ] = useSigner();
  const contract = useContract({
    addressOrName: contractConfig.daoContractAddress,
    contractInterface: daoContractABI,
    signerOrProvider: signerData,
  });

  const createDAO = async () => {
    setCreating(true);
    const exp = new BN("1000000000000000000");

    const supply = new BN(totalTokens).mul(exp);
    const ownerSupply = new BN(initialSupply).mul(exp);

    // console.log(daoName, tokenSymbol, supply, ownerSupply);

    const tx = await contract.createLaunchToken(
      daoName,
      tokenSymbol,
      supply.toString(),
      ownerSupply.toString()
    );
    const resp = await tx.wait();
    // console.log(resp);
    setCreating(false);
    setDaoCreated(true);
  };

  if (chainError) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: 600,
          alignItems: "stretch",
          alignSelf: "center",
        }}
      >
        <h1>You need to switch to {contractConfig.network} to continue</h1>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <StyledButtonDark
            onClick={() => switchNetwork(contractConfig.chainId)}
          >
            Switch
          </StyledButtonDark>
        </div>
      </div>
    );
  }

  if (!data.connected) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: 600,
          alignItems: "stretch",
          alignSelf: "center",
        }}
      >
        <h1>Connect with Metamask to continue</h1>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          {data.connectors.map((x) => (
            <StyledButtonDark key={x.id} onClick={() => connect(x)}>
              Connect Wallet
            </StyledButtonDark>
          ))}
        </div>
      </div>
    );
  }

  if (accountLoading)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: 600,
          alignItems: "stretch",
          alignSelf: "center",
        }}
      >
        <h1>Trying to fetch your data from ENS...</h1>
      </div>
    );

  const handleInput = (e, field) => {
    if (field === "daoName") {
      setDaoName(e.target.value);
    } else if (field === "tokenSymbol") {
      setTokenSymbol(e.target.value);
    } else if (field === "totalTokens") {
      setTotalTokens(e.target.value);
    } else if (field === "initialSupply") {
      setInitialSupply(e.target.value);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: 600,
          alignItems: "stretch",
          alignSelf: "center",
        }}
      >
        <h1>Use your ENS domain to launch your dao</h1>
        <div style={{ display: "flex" }}>
          <StyledInput
            disabled
            style={{}}
            id="filled-basic"
            InputProps={{
              placeholder: "Dao Name",
              disableUnderline: true,
            }}
            variant="filled"
          />
          <StyledInput
            style={{ flex: 1 }}
            id="filled-basic"
            InputProps={{
              placeholder: "My Dao",
              disableUnderline: true,
            }}
            variant="filled"
            value={daoName}
            onChange={(event) => handleInput(event, "daoName")}
          />
        </div>
        <div style={{ display: "flex" }}>
          <StyledInput
            disabled
            style={{}}
            id="filled-basic"
            InputProps={{
              placeholder: "Token Symbol",
              disableUnderline: true,
            }}
            variant="filled"
          />
          <StyledInput
            style={{ flex: 1 }}
            id="filled-basic"
            InputProps={{
              placeholder: "$DAO",
              disableUnderline: true,
            }}
            variant="filled"
            value={tokenSymbol}
            onChange={(e) => handleInput(e, "tokenSymbol")}
          />
        </div>

        <div style={{ marginTop: 12 }}>
          <StyledInput
            disabled
            style={{ width: "100%" }}
            id="filled-basic"
            InputProps={{
              placeholder: "Your Address",
              disableUnderline: true,
            }}
            variant="filled"
          />
          <StyledInput
            disabled
            style={{ width: "100%	" }}
            id="filled-basic"
            InputProps={{
              placeholder: accountData.address,
              disableUnderline: true,
            }}
            variant="filled"
          />
        </div>

        <div style={{ display: "flex", marginTop: 12 }}>
          <StyledInput
            disabled
            id="filled-basic"
            InputProps={{
              placeholder: "Total Supply",
              disableUnderline: true,
            }}
            variant="filled"
          />
          <StyledInput
            style={{ flex: 1 }}
            id="filled-basic"
            InputProps={{
              placeholder: "1000000",
              disableUnderline: true,
            }}
            variant="filled"
            value={totalTokens}
            onChange={(e) => handleInput(e, "totalTokens")}
          />
        </div>

        <div style={{ display: "flex", marginBottom: 12 }}>
          <StyledInput
            disabled
            id="filled-basic"
            InputProps={{
              placeholder: "Initial Owner Supply",
              disableUnderline: true,
            }}
            variant="filled"
          />
          <StyledInput
            style={{ flex: 1 }}
            id="filled-basic"
            InputProps={{
              placeholder: "10000",
              disableUnderline: true,
            }}
            variant="filled"
            value={initialSupply}
            onChange={(e) => handleInput(e, "initialSupply")}
          />
        </div>
        <StyledButtonDark onClick={() => !creating && createDAO()}>
          {creating ? "Creating" : "Create"}
        </StyledButtonDark>
      </div>

      <Modal
        open={daoCreated}
        onClose={() => {
					setDaoCreated(false);
					navigate("..");
				}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Dao Created
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Visit back in some time to see your dao.
          </Typography>
        </Box>
      </Modal>
    </>
  );
};
export default Create;
