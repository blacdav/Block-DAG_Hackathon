import { createConfig, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { metaMask, walletConnect } from "wagmi/connectors";

const projectId = import.meta.env.VITE_REACT_APP_WALLETCONNECT_PROJECT_ID;
export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    metaMask(),
    walletConnect({
      projectId: projectId || "demo-project-id",
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});
