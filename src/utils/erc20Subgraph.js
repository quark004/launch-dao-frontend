import { ApolloClient, InMemoryCache, gql, HttpLink } from '@apollo/client';

const pageSize = 3;
let id;
let getTokensQuery = `
  query{
    tokens(where: {id: "**"}) {
      name
      symbol
      balances {
        account {
          id
        }
        value
      }
    }
  }
`;

class LaunchDAOSubgraph {
  constructor() {
    const link = new HttpLink({
      uri: 'https://api.thegraph.com/subgraphs/name/quark004/launch-dao-erc20',
    });
    const client = new ApolloClient({
      link: link,
      cache: new InMemoryCache(),
    });
    this.client = client;
  }

  async getTokens(_id) {
    id = _id;
    const getTokensQueryFilled = getTokensQuery.replace('**', _id);
    const data = await this.client.query({
      query: gql(getTokensQueryFilled),
    });

    return data;
  }
}

export default LaunchDAOSubgraph;
