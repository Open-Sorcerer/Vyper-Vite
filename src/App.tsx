import './App.css'
import SplineObject from "./components/SplineObject";
import { Address, ProviderRpcClient } from "everscale-inpage-provider";
import { VenomConnect } from "venom-connect";
import { useState, useEffect } from "react";
import venomBg from "./assets/venom-bg.svg";

const initTheme = "light" as const;

function App() {
  const [venomConnect, setVenomConnect] = useState<any>();
  const [venomProvider, setVenomProvider] = useState<any>();

  const [address, setAddress] = useState();
  const [balance, setBalance] = useState();

  const initVenomConnect = async () => {
    console.log("Step 1: Init VenomConnect");
    return new VenomConnect({
      theme: initTheme,
      checkNetworkId: 1000,
      providersOptions: {
        venomwallet: {
          walletWaysToConnect: [
            {
              package: ProviderRpcClient,
              packageOptions: {
                fallback:
                  VenomConnect.getPromise("venomwallet", "extension") ||
                  (() => Promise.reject()),
                forceUseFallback: true,
              },
              id: "extension",
              type: "extension",
            },
          ],
          defaultWalletWaysToConnect: ["mobile", "ios", "android"],
        },
      },
    });
  };

  const checkAuth = async (_venomConnect: any) => {
    console.log("Step 3: Checking Auth");
    const auth = await _venomConnect?.checkAuth();
    console.log("Auth", auth);
    console.log("Step 4: Checked Auth");

    if (auth) await getAddress(_venomConnect);
  };

  const getAddress = async (provider: any) => {
    const providerState = await provider?.getProviderState?.();

    const address =
      providerState?.permissions.accountInteraction?.address.toString();

    console.log("Step 5: Got Address", address);
    return address;
  };

  const getBalance = async (provider: any, _address: string) => {
    try {
      const providerBalance = await provider?.getBalance?.(_address);

      console.log("Step 6: Got Balance", providerBalance);

      return providerBalance;
    } catch (error) {
      return undefined;
    }
  };

  const onInitButtonClick = async () => {
    const initedVenomConnect = await initVenomConnect();
    setVenomConnect(initedVenomConnect);
    console.log("Step 2: Inited VenomConnect", initedVenomConnect);
    await checkAuth(initedVenomConnect);
  };

  const onConnect = async (provider: any) => {
    setVenomProvider(provider);
    console.log("provider", provider);

    check(provider);
    console.log("address", address);
    console.log("balance", balance);
  };

  const check = async (_provider: any) => {
    const _address = _provider ? await getAddress(_provider) : undefined;
    const _balance =
      _provider && _address ? await getBalance(_provider, _address) : undefined;

    setAddress(_address);

    setBalance(_balance);

    if (_provider && _address)
      setTimeout(() => {
        check(_provider);
      }, 100);
  };

  const onConnectButtonClick = async () => {
    console.log("We clicked connect");
    venomConnect?.connect();
  };

  const onDisconnectButtonClick = async () => {
    console.log("Disconnecting");
    venomProvider?.disconnect();
  };

  const print = async () => {
    console.log("print");
  };

  useEffect(() => {
    const off = venomConnect?.on("connect", onConnect);

    return () => {
      off?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [venomConnect]);

  useEffect(() => {
    onInitButtonClick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-screen">
    <div className="h-full w-full flex flex-col min-h-screen items-center justify-between bg-auto bg-no-repeat bg-right-top bg-scroll backdrop-contrast-200 backdrop-saturate-200"
      style={{ backgroundImage: venomBg }}
    >
      <button className="w-60 h-16 flex flex-start flex-wrap items-center gap-4 absolute top-5 right-10 px-5 py-2 bg-gradient-to-tr from-black to-[#363636]  rounded-full translate-y-5 shadow-lg shadow-black/40 hover:shadow-xl hover:shadow-black/40 transition-all" onClick={!address ? onConnectButtonClick : onDisconnectButtonClick}>
        <div className="h-10 w-10 rounded-full bg-lime-600"></div>
        <span className="text-white text-md font-semibold truncate">{!address ? "Connect Wallet" : address}</span>
      </button>
      <div className="w-1/2 flex flex-col justify-start items-start gap-5 absolute left-0 top-1/2 transform -translate-y-1/2 p-10">
        <span className="text-white text-3xl font-semibold">Venom</span>
        <span className="bg-clip-text text-5xl font-bold text-transparent bg-gradient-to-r from-lime-500 via-cyan-500 to-violet-500">
          Boilerplate
        </span>
        <p className="text-2xl font-semibold text-gray-400">
          Safe, reliable, and 100% yours. Manage your assets with Venom&apos;s
          non-custodial wallet.
        </p>
      </div>
      <div className="hidden md:flex absolute left-1/3 top-20">
        <SplineObject
          scene={"https://prod.spline.design/DBMV3V6tanMlskYw/scene.splinecode"}
        />
      </div>
    </div>
  </div>
  )
}

export default App
