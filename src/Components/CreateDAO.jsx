import { useContext, useEffect, useState } from 'react';
import { useAccount, useContract, useSigner } from 'wagmi';

import contractConfig from '../contract/config.json';
import daoContractABI from '../contract/daoContractABI.json';
import BN from 'bn.js';

const defaultTotalSupply = new BN('1000000000000000000000000');
const defaultInitialOwnerSupply = new BN('10000000000000000000000');
const CreateDAO = () => {
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [initialOwnerSupply, setInitialOwnerSupply] = useState(
    defaultInitialOwnerSupply.toString()
  );
  const [totalSupply, setTotalSupply] = useState(defaultTotalSupply.toString());

  const [{ data, error, loading }, getSigner] = useSigner();

  const contract = useContract({
    addressOrName: contractConfig.daoContractAddress,
    contractInterface: daoContractABI,
    signerOrProvider: data,
  });
  const [{ data: accountData }] = useAccount({ fetchEns: true });

  const createDAO = async () => {
    const tx = await contract.createLaunchToken(
      tokenName,
      tokenSymbol,
      1000000,
      100000
    );
    const resp = await tx.wait();
    // console.log(resp);
  };

  useEffect(() => {
    if (accountData?.ens?.name) {
      setTokenName(accountData.ens.name);
      setTokenSymbol(accountData.ens.name.split('.')[0].toUpperCase());
    }
  }, [accountData]);

  return null;
  // return (
  //   <Modal
  //     id="create-dao"
  //     isOpen={modalState}
  //     onClose={() => setModalState(false)}
  //   >
  //     {/* <ModalOverlay /> */}
  //     <ModalContent>
  //       <ModalHeader>Create a DAO</ModalHeader>
  //       <ModalCloseButton />
  //       <ModalBody>
  //         <FormControl>
  //           <FormLabel htmlFor="tokenName">Token Name</FormLabel>
  //           <Input
  //             id="tokenName"
  //             type="text"
  //             value={tokenName}
  //             onChange={(e) => setTokenName(e.target.value)}
  //           />
  //         </FormControl>
  //         <FormControl>
  //           <FormLabel htmlFor="tokenSymbol">Token Symbol</FormLabel>
  //           <Input
  //             id="tokenSymbol"
  //             type="text"
  //             value={tokenSymbol}
  //             onChange={(e) => setTokenSymbol(e.target.value)}
  //           />
  //         </FormControl>
  //         <FormControl>
  //           <FormLabel htmlFor="totalSupply">Total Supply</FormLabel>
  //           <Input
  //             id="initialOwnerSupply"
  //             type="text"
  //             value={totalSupply}
  //             disabled
  //             onChange={(e) => setTotalSupply(e.target.value)}
  //           />
  //         </FormControl>
  //         <FormControl>
  //           <FormLabel htmlFor="initialOwnerSupply">
  //             Initial Owner Tokens
  //           </FormLabel>
  //           <Input
  //             id="initialOwnerSupply"
  //             type="text"
  //             value={initialOwnerSupply}
  //             disabled
  //             onChange={(e) => setInitialOwnerSupply(e.target.value)}
  //           />
  //         </FormControl>
  //       </ModalBody>

  //       <ModalFooter>
  //         <Button variant="ghost" onClick={createDAO}>
  //           Create
  //         </Button>
  //       </ModalFooter>
  //     </ModalContent>
  //   </Modal>
  // );
};

export default CreateDAO;
