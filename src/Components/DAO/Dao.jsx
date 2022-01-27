import React, { useEffect, useState } from "react";
import erc20Client from "../../utils/erc20Subgraph.js";
import LaunchDAOSubgraphClient from "../../utils/launchDAOSubgraph.js";
import Data from "../Data.jsx";
import BN from "bn.js";
import { useProvider, useContract, useEnsLookup } from "wagmi";
import { namehash } from "@ethersproject/hash";
import ensABI from "../../contract/ensABI.json";
import getENSNames from "../../contract/getENSNames.json";
import { useParams } from "react-router-dom";
import StyledButtonLight from "../UI/StyledButtonLight.jsx";
import StyledButtonDark from "../UI/StyledButtonDark.jsx";

const Dao = () => {
  const [chartData, setChartData] = useState([]);
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [url, setUrl] = useState("");
  const [twitter, setTwitter] = useState("");
  const [discord, setDiscord] = useState("");
  const [snapshot, setSnapshot] = useState("");
  const { tokenAddress } = useParams();

  const [contractNotFound, setContractNotFound] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const provider = useProvider();
  const ensContract = useContract({
    addressOrName: "0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41",
    contractInterface: ensABI,
    signerOrProvider: provider,
  });
  const getENSNamesContract = useContract({
    addressOrName: "0x3671aE578E63FdF66ad4F3E12CC0c0d71Ac7510C",
    contractInterface: getENSNames,
    signerOrProvider: provider,
  });

  const [{ data, error, loading }, lookupAddress] = useEnsLookup({
    address: tokenAddress,
  });
  const getEnsData = async () => {
    if (error || !data) {
      console.log("ens err", error);
      return;
    }
    const node = namehash(data);
    if (ensContract) {
      const url = await ensContract.text(node, "url");
      const twitter = await ensContract.text(node, "com.twitter");
      const discord = await ensContract.text(node, "com.discord");
      const snapshot = await ensContract.text(node, "com.snapshot");
      setUrl(url);
      setTwitter(twitter);
      setDiscord(discord);
      setSnapshot(snapshot);
    }
  };

  const getTokens = async (daoAddress) => {
    const Client = new erc20Client();
    // console.log(daoAddress);
    const { data } = await Client.getTokens(daoAddress);
    if (!data || !data.tokens.length) {
      setLoadingData(false);
      setContractNotFound(true);
      return;
    }
    setTokenName(data.tokens[0].name);
    setTokenSymbol(data.tokens[0].symbol);
    let chartData = data?.tokens[0]?.balances.map((balance) => ({
      name: balance.account.id,
      value: new BN(balance.value).div(new BN("1000000000000000000")),
    }));
    const respp = await getENSNamesContract.getNames(
      chartData.map((x) => x.name)
    );
    chartData = chartData.map((x, index) => ({
      name: respp[index] || x.name,
      value: x.value,
    }));
    const totalAllocatedTokens = chartData?.reduce(
      (prev, curr) => {
        let pVal = prev.value;
        let cVal = curr.value;
        return { value: pVal.add(cVal) };
      },
      { name: "", value: new BN("0") }
    );
    const ClientLD = new LaunchDAOSubgraphClient();
    const resp = await ClientLD.getDAOEntityBy(tokenAddress);
    const totalSupplyBN = new BN(resp?.totalSupply).div(
      new BN("1000000000000000000")
    );
    setChartData([
      ...chartData,
      {
        name: "Unallocated",
        value: totalSupplyBN.sub(totalAllocatedTokens.value),
      },
    ]);
    setLoadingData(false);
  };

  useEffect(() => {
    if (!loading)
    getEnsData();
  }, [loading]);

  useEffect(() => {
    getTokens(tokenAddress);
  }, []);

  if (loadingData) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          alignItems: "center",
          alignSelf: "center",
        }}
      >
        <h1>Loading</h1>
      </div>
    );
  }

  if (contractNotFound) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "70%",
          alignItems: "center",
          alignSelf: "center",
          height: "100vh",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <h1>Could not find requested DAO</h1>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        alignItems: "center",
        alignSelf: "center",
      }}
    >
      <h1>{tokenName}</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          paddingTop: "32px",
          minHeight: 600,
          minWidth: 600,
          alignItems: "stretch",
          alignSelf: "center",
        }}
      >
        <Data chartData={chartData} />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          alignItems: "center",
          alignSelf: "center",
          justifyContent: "space-around",
          padding: "48px 0",
        }}
      >
        <h3 style={{margin: 0, marginBottom: '8px'}}>Token Symbol: {tokenSymbol}</h3>
        <div style={{display: 'flex', maxWidth: '600px', width: '100%', marginBottom: '32px'}}>
        <StyledButtonDark style={{flex: 1}} onClick={() => window.open(
          `https://app.uniswap.org/#/swap?inputCurrency=${tokenAddress}`
        )}>Buy on Uniswap</StyledButtonDark>
        </div>


        <h3 style={{margin: 0, marginBottom: '8px'}}>ENS Information</h3>
        {(url || twitter || discord || snapshot) ? (
          <div style={{ display: "flex" }}>
            {url && (
              <StyledButtonLight
                onClick={() => window.open(url)}
                style={{ marginRight: "8px" }}
              >
                Url
              </StyledButtonLight>
            )}
            {twitter && (
              <StyledButtonLight
                onClick={() => window.open(twitter)}
                style={{ marginRight: "8px" }}
              >
                Twitter
              </StyledButtonLight>
            )}
            {discord && (
              <StyledButtonLight
                onClick={() => window.open(discord)}
                style={{ marginRight: "8px" }}
              >
                Discord
              </StyledButtonLight>
            )}
            {snapshot && (
              <StyledButtonLight
                onClick={() => window.open(snapshot)}
                style={{ marginRight: "8px" }}
              >
                Snapshot
              </StyledButtonLight>
            )}
          </div>
        ) : (
          <text>ENS data unavailale</text>
        )}
      </div>
    </div>
  );
};

export default Dao;
