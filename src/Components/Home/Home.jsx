import React, { useState, useEffect, useRef } from "react";
import "./home.css";
import Waves from "./Waves";
import { Link, Checkbox } from "@mui/material";
import StyledInput from "../UI/StyledInput";
import ConnectWallet from "../UI/ConnectWallet";
import ExploreContainer from "../Explore/ExploreContainer";
import { useNavigate, useLocation } from "react-router-dom";
import { useConnect, useAccount } from "wagmi";
import LaunchDAOSubgraphClient from "../../utils/launchDAOSubgraph";
import { ethers } from "ethers";
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

const Home = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [daoCreated, setDaoCreated] = useState(false);
  // useEffect(() => {
  //   console.log(state);
  //   if (state.created) {
  //     setDaoCreated(true);
  //   }
  // }, [state]);

  const [{ data, error }, connect] = useConnect();
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  });
  const [daos, setDaos] = useState([]);
  const exploreRef = useRef(null);

  useEffect(() => {
    // check if dao is already created
    if (data.connected) {
      //navigate("/create-dao");
    }
  }, [data, navigate]);

  const executeScroll = () =>
    exploreRef.current.scrollIntoView({ behavior: "smooth" });

  const [daoAddress, setDaoAddress] = useState("");
  const handleDaoAddressChange = (e) => {
    setDaoAddress(e.target.value);
  };

  return (
    <>
      <div className="container">
        <div className="inner-header">
          <h1>Launch Dao</h1>
          <div
            style={{
              marginBottom: "24vh",
              display: "flex",
              alignItems: "center",
              width: "600px",
              position: "relative",
            }}
          >
            <div style={{ position: "absolute", left: -64 }}>
              <div style={{ fontSize: "12px" }}>
                Search for <br /> your dao
              </div>
            </div>

            <StyledInput
              style={{ width: "100%" }}
              id="filled-basic"
              InputProps={{
                placeholder: "Contract address",
                disableUnderline: true,
              }}
              variant="filled"
              value={daoAddress}
              onChange={handleDaoAddressChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && ethers.utils.isAddress(daoAddress)) {
                  navigate(`/dao/${daoAddress}`);
                }
              }}
            />

            <div
              style={{
                position: "absolute",
                left: 0,
                bottom: -32,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Checkbox
                sx={{
                  color: "rgba(255, 255, 255, 0.1)",
                  "& .MuiSvgIcon-root": { fontSize: 12 },
                  "&.Mui-checked": {
                    color: "rgba(255, 255, 255, 0.5)",
                  },
                }}
              />
              <div style={{ fontSize: "12px" }}>Remember my address</div>
            </div>

            <div
              style={{
                position: "absolute",
                display: "flex",
                alignItems: "center",
                right: "-123px",
              }}
            >
              <div style={{ margin: "0 1rem" }}>or</div>
              <div style={{ fontSize: "22px" }}>
                <Link
                  underline="hover"
                  style={{ color: "white", cursor: "pointer" }}
                  onClick={executeScroll}
                >
                  Explore
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: "auto" }}>
          <Waves />
        </div>
        <div className="content flex">
          <p>Launch you own dao within clicks</p>

          <ConnectWallet
            onClick={() =>
              navigate("/create-dao", {
                state: { create: true, onDaoCreate: () => setDaoCreated(true) },
              })
            }
          >
            Click here to get started{" "}
          </ConnectWallet>
        </div>
      </div>
      <ExploreContainer exploreRef={exploreRef} />
      <Modal
        open={daoCreated}
        onClose={() => setDaoCreated(false)}
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

export default Home;
