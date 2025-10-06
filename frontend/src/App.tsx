import { WagmiProvider } from "wagmi";
import "./App.css";
import { config } from "./utils/web3";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectWalletButton } from "./components/web3/ConnectWalletButton";
import { FileUpload } from "./components/file/FileUpload";

const queryClient = new QueryClient();
function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gray-50 p-8">
          <header className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">PrivShare</h1>
              <ConnectWalletButton />
              {/* <UploadFile /> */}
            </div>
          </header>
          <main className="max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Upload File</h2>
              <FileUpload />
            </div>
          </main>
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
