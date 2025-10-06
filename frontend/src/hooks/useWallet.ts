import { useAccount, useConnect, useDisconnect } from "wagmi";

export const useWallet = () => {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const connectWallet = async (connectorId: string) => {
    const connector = connectors.find(
      (c) => c.id === connectorId || c.name === connectorId
    );
    if (!connector) {
      throw new Error(`Connector ${connectorId} not found`);
    }
    await connect({ connector });
  };

  const disconnectWallet = async () => {
    await disconnect();
  };

  return {
    isConnected,
    address,
    connectors,
    connectWallet,
    disconnectWallet,
  };
};
