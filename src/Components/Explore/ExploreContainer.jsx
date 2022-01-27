import React, { useEffect } from "react";
import Explore from "./Explore";
import "./explore.css";
import StyledButtonDark from "../UI/StyledButtonDark";
import LaunchDAOSubgraphClient from "../../utils/launchDAOSubgraph";

const ExploreContainer = (props) => {
  const [daos, setDaos] = React.useState([]);
  const [pageNum, setPageNum] = React.useState(0);

  const getAllDAOEntitiesFunc = async () => {
    // console.log("pageNum", pageNum);
    const Client = new LaunchDAOSubgraphClient();
    const { data } = await Client.getAllDAOEntities(pageNum);
    // console.log('daossss', data.daoEntities.length);
    if (data && data.daoEntities.length > 0) {
      setDaos([...daos, ...data?.daoEntities]);
      setPageNum(pageNum+1);
    }
  };

  useEffect(() => {
    getAllDAOEntitiesFunc();
  }, []);

  return (
    <div className="container-cards" ref={props.exploreRef}>
      <div className="explore-array">
        {daos.map((dao, index) => (
          <div
            style={{
              gridColumn: `${(index % 2) + 1} / span 1`,
              marginLeft: index % 2 ? "64px" : 0,
            }}
          >
            <Explore dao={dao} key={index}/>
          </div>
        ))}
      </div>
      <StyledButtonDark style={{margin: '32px 0'}} onClick={() => getAllDAOEntitiesFunc()}>Load More</StyledButtonDark>
    </div>
  );
};

export default ExploreContainer;
