import Web3 from "web3";

const getWeb3 = (options) =>
  new Promise((resolve, reject) => {
    let web3;
    let fallback;
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener("load", async () => {
      // Modern dapp browsers...
      if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
          // Request account access if needed
          await window.ethereum.enable();
          // Acccounts now exposed
        } catch (error) {
          reject(error);
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        // Use Mist/MetaMask's provider.
        web3 = window.web3;
        console.log("Injected web3 detected.");
      }

      switch (options.fallback.type) {
      case 'ws':
        console.log('Connecting ws provider.')
        var provider = new Web3.providers.WebsocketProvider(options.fallback.url)

        fallback = new Web3(provider)

        provider.on('error', e => console.log('WS Error', e));
        provider.on('end', e => {
          console.log('WS closed');
          console.log('Attempting to reconnect...');
          provider = new Web3.providers.WebsocketProvider(options.fallback.url);

          provider.on('connect', function () {
            // TODO trigger reconnect
            console.log('WSS Reconnected');
          });

          fallback.setProvider(provider);
        });

        await connectWebSocket(provider);

        break
      case 'https':
      case 'http':
        console.log('Connecting fallback http provider.')
        var provider = new Web3.providers.HttpProvider(
          options.fallback.url,
        )
        provider.isHttp = true;
        fallback = new Web3(provider)
        // web3.eth.cacheSendTransaction = (txObject) => put({type: 'SEND_WEB3_TX', txObject, stackId, web3})
      default:
          // Invalid options; throw.
          // throw "Invalid web3 fallback provided."
      }

      if (!web3 && !fallback) {
        reject(new Error('missing web3 privider'));
      }

      resolve({web3, fallback});

      // // Fallback to localhost; use dev console port by default...
      // else {
      //   const provider = new Web3.providers.HttpProvider(
      //     "http://127.0.0.1:8545"
      //   );
      //   const web3 = new Web3(provider);
      //   console.log("No web3 instance injected, using Local web3.");
      //   resolve(web3);
      // }
    });
  });


export function connectWebSocket(provider) {
  return new Promise((resolve, reject) => {
    provider.on('connect', e => resolve());
    provider.on('error', e => reject());
  });
}


export default getWeb3;
