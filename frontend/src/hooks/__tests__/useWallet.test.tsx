import { renderHook, act } from "@testing-library/react";
import { useWallet } from "../useWallet";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import type { Mock } from "vitest";

vi.mock("wagmi", () => ({
  useAccount: vi.fn(),
  useConnect: vi.fn(),
  useDisconnect: vi.fn(),
}));

const mockUseAccount = useAccount as unknown as Mock;
const mockUseConnect = useConnect as unknown as Mock;
const mockUseDisconnect = useDisconnect as unknown as Mock;

describe("useWallet Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should return disconnected state initially", () => {
    mockUseAccount.mockReturnValue({
      isConnected: false,
      address: undefined,
    } as any);

    mockUseConnect.mockReturnValue({
      connect: vi.fn(),
      connectors: [{ name: "MetaMask" }],
    } as any);

    mockUseDisconnect.mockReturnValue({
      disconnect: vi.fn(),
    } as any);

    const { result } = renderHook(() => useWallet());

    expect(result.current.isConnected).toBe(false);
    expect(result.current.address).toBeUndefined();
    expect(result.current.connectors).toHaveLength(1);
  });

  test("should return connected state when wallet is connected", () => {
    const mockAddress = "0x742d35Cc6634C0532925a3b8D6B5d7f2C3E9F0D1";

    mockUseAccount.mockReturnValue({
      isConnected: true,
      address: mockAddress,
    } as any);

    const { result } = renderHook(() => useWallet());

    expect(result.current.isConnected).toBe(true);
    expect(result.current.address).toBe(mockAddress);
  });

  test("connectWallet should call wagmi connect", async () => {
    const mockConnect = vi.fn();

    mockUseConnect.mockReturnValue({
      connect: mockConnect,
      connectors: [{ name: "MetaMask", id: "metaMask" }],
    } as any);

    const { result } = renderHook(() => useWallet());

    await act(async () => {
      await result.current.connectWallet("metaMask");
    });

    expect(mockConnect).toHaveBeenCalledWith({ connector: expect.any(Object) });
  });

  test("disconnectWallet should call wagmi disconnect", async () => {
    const mockDisconnect = vi.fn();

    mockUseDisconnect.mockReturnValue({
      disconnect: mockDisconnect,
    } as any);

    const { result } = renderHook(() => useWallet());

    await act(async () => {
      await result.current.disconnectWallet();
    });

    expect(mockDisconnect).toHaveBeenCalled();
  });
});
