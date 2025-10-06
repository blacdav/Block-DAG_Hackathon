import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ConnectWalletButton } from "../ConnectWalletButton";
import { useWallet } from "../../../hooks/useWallet";
import type { Mock } from "vitest";

vi.mock("../../../hooks/useWallet");

const mockUseWallet = useWallet as unknown as Mock;

describe("ConnectWalletButton", () => {
  const defaultMockProps = {
    isConnected: false,
    address: undefined,
    connectors: [{ id: "metaMask", name: "MetaMask" }],
    connectWallet: vi.fn(),
    disconnectWallet: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseWallet.mockReturnValue(defaultMockProps);
  });

  test("should show connect button when disconnected", () => {
    render(<ConnectWalletButton />);

    expect(screen.getByText("Connect Wallet")).toBeInTheDocument();
    expect(screen.queryByText(/0x/)).not.toBeInTheDocument();
  });

  test("should show connected address when wallet is connected", () => {
    const mockAddress = "0x742d35Cc6634C0532925a3b8D6B5d7f2C3E9F0D1";

    mockUseWallet.mockReturnValue({
      ...defaultMockProps,
      isConnected: true,
      address: mockAddress,
    });

    render(<ConnectWalletButton />);

    expect(screen.getByText(/0x742d...F0D1/)).toBeInTheDocument();
    expect(screen.getByText("Disconnect")).toBeInTheDocument();
  });

  test("should open connector menu when connect button is clicked", async () => {
    render(<ConnectWalletButton />);

    const connectButton = screen.getByText("Connect Wallet");
    fireEvent.click(connectButton);

    await waitFor(() => {
      expect(screen.getByText("MetaMask")).toBeInTheDocument();
    });
  });

  test("should call connectWallet when a connector is selected", async () => {
    const mockConnectWallet = vi.fn();

    mockUseWallet.mockReturnValue({
      ...defaultMockProps,
      connectWallet: mockConnectWallet,
    });

    render(<ConnectWalletButton />);

    fireEvent.click(screen.getByText("Connect Wallet"));

    await waitFor(() => {
      fireEvent.click(screen.getByText("MetaMask"));
    });

    expect(mockConnectWallet).toHaveBeenCalledWith("metaMask");
  });

  test("should call disconnectWallet when disconnect is clicked", () => {
    const mockDisconnectWallet = vi.fn();
    const mockAddress = "0x742d35Cc6634C0532925a3b8D6B5d7f2C3E9F0D1";

    mockUseWallet.mockReturnValue({
      ...defaultMockProps,
      isConnected: true,
      address: mockAddress,
      disconnectWallet: mockDisconnectWallet,
    });

    render(<ConnectWalletButton />);

    fireEvent.click(screen.getByText("Disconnect"));

    expect(mockDisconnectWallet).toHaveBeenCalled();
  });
});
