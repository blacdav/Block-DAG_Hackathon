import { createConfig, http } from "wagmi";
import { mainnet } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";

describe("Web3 Configuration", () => {
  test("should create wagmi config with MetaMask connector", () => {
    const config = createConfig({
      chains: [mainnet],
      connectors: [metaMask()],
      transports: {
        [mainnet.id]: http(),
      },
    });

    expect(config).toBeDefined();
    expect(config.connectors[0].name).toBe("MetaMask");
  });
});
