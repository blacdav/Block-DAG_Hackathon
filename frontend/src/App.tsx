import { WagmiProvider } from "wagmi";
import "./App.css";
import { config } from "./utils/web3";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Header } from "./components/layout/Header";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

const queryClient = new QueryClient();
function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <MantineProvider>
          <div className="min-h-screen bg-[#BCB1FF] p-4 ">
            <div className="min-h-screen">
              <Header />
              {/* <HeroSection /> */}
            </div>
          </div>
        </MantineProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
