interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    request: (...args: any[]) => Promise<any>;
    on: (event: string, callback: (...args: any[]) => void) => void;
    removeAllListeners: () => void;
    selectedAddress?: string;
    networkVersion?: string;
  };
}