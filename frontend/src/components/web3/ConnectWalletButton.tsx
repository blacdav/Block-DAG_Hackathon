import React, { useState } from "react";
import { useWallet } from "../../hooks/useWallet";

export const ConnectWalletButton: React.FC = () => {
  const { isConnected, address, connectors, connectWallet, disconnectWallet } =
    useWallet();
  const [showConnectors, setShowConnectors] = useState(false);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleConnect = async (connectorId: string) => {
    try {
      await connectWallet(connectorId);
      setShowConnectors(false);
    } catch (error) {
      console.error("Failed to connect:", error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">
          {formatAddress(address)}
        </span>
        <button
          onClick={handleDisconnect}
          className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowConnectors(!showConnectors)}
        className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Connect Wallet
      </button>

      {showConnectors && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
          <div className="p-2">
            {connectors.map((connector) => (
              <button
                key={connector.id}
                onClick={() => handleConnect(connector.id)}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                {connector.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
