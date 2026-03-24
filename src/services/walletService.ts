import {
  isConnected,
  getAddress,
  signTransaction,
  isAllowed,
  setAllowed,
} from "@stellar/freighter-api";

export interface WalletInfo {
  publicKey: string | null;
  network: string;
}

export const walletService = {
  isAvailable: async () => {
    try {
      const result = await isConnected() as any;
      return !!(result === true || result?.isConnected);
    } catch (e) {
      console.warn("Freighter connection check failed", e);
      return false;
    }
  },

  isAllowed: async () => {
    try {
      const result = await isAllowed() as any;
      return !!(result === true || result?.isAllowed);
    } catch (e) {
      console.warn("Freighter permission check failed", e);
      return false;
    }
  },

  connect: async (): Promise<string | null> => {
    try {
      const connection = await isConnected() as any;
      const isConnectedBool = !!(connection === true || connection?.isConnected);
      if (!isConnectedBool) {
        throw new Error("FREIGHTER_NOT_INSTALLED");
      }

      // Check if already allowed, if not setAllowed
      const allowed = await isAllowed() as any;
      const isAllowedBool = !!(allowed === true || allowed?.isAllowed);
      if (!isAllowedBool) {
        const setAllowedResult = await setAllowed() as any;
        const isSetAllowedBool = !!(setAllowedResult === true || setAllowedResult?.isAllowed);
        if (!isSetAllowedBool) {
           throw new Error("USER_DECLINED");
        }
      }

      const result = await getAddress() as any;
      if (typeof result === "string") {
        return result;
      }
      if (result?.address) {
        return result.address;
      }
      if (result?.error) {
        throw new Error(result.error);
      }
      return null;
    } catch (error: any) {
      console.error("Failed to connect wallet:", error);
      if (error.message === "User declined access" || error.message === "USER_DECLINED") {
        throw new Error("USER_DECLINED");
      }
      throw error;
    }
  },

  sign: async (xdr: string, network: string) => {
    try {
      const result = await signTransaction(xdr, {
        network,
      }) as any;
      if (typeof result === "string") {
        return result;
      }
      if (result?.signedTxXdr) {
        return result.signedTxXdr;
      }
      if (result?.error) {
        throw new Error(result.error);
      }
      throw new Error("Signing failed");
    } catch (error) {
      console.error("Signing failed:", error);
      throw error;
    }
  },
};
