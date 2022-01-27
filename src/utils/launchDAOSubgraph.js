import { ApolloClient, InMemoryCache, gql, HttpLink } from '@apollo/client';

const pageSize = 10;
const getAllDAOEntitiesQuery = `
  query{
        daoEntities (first: ${pageSize}, skip: ** ){
          id
          tokenAddress
          owner
          totalSupply
          tokenName
          tokenSymbol
        }
  }
`;

const getDAOEntityByAddrQuery = `
  query{
        daoEntities (where: {tokenAddress: "**" } ){
          id
          tokenAddress
          owner
          totalSupply
          tokenName
          tokenSymbol
        }
  }
`;

class LaunchDAOSubgraph {
  constructor() {
    const link = new HttpLink({
      uri: 'https://api.thegraph.com/subgraphs/name/quark004/launch-dao',
    });
    const client = new ApolloClient({
      link: link,
      cache: new InMemoryCache(),
    });
    this.client = client;
  }

  async getAllDAOEntities(pageNum) {
    const getAllDAOEntitiesQueryFinal = getAllDAOEntitiesQuery.replace('**', pageNum);
    const data = await this.client.query({
      query: gql(getAllDAOEntitiesQueryFinal),
    });

    return data;
  }

  async getDAOEntityBy(tokenAddress) {
    const getDAOEntityQueryFinal = getDAOEntityByAddrQuery.replace('**', tokenAddress);
    const data = await this.client.query({
      query: gql(getDAOEntityQueryFinal),
    });
    return data.data.daoEntities[0];
  }
}

export default LaunchDAOSubgraph;
