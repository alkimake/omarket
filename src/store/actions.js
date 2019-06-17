import { ACTION_TYPES, MUTATION_TYPES } from '../util/constants'
import getWeb3 from '../util/web3/getWeb3'

export default {
  async [ACTION_TYPES.REGISTER_WEB3_INSTANCE] ({ state, commit }) {
    try {
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();

      const coinbase = await web3.eth.getCoinbase();
      const hasInjectedWeb3 = await web3.eth.net.isListening();

      return commit(MUTATION_TYPES.REGISTER_WEB3_INSTANCE, { result: { web3, accounts, networkId, coinbase, hasInjectedWeb3 } });

    } catch (error) {
      console.log(error);
      return commit(MUTATION_TYPES.REGISTER_WEB3_INSTANCE, { result: { web3Error: error } });
    }
  },
  [ACTION_TYPES.SET_CURRENT_VIEW] ({ commit }, newRoute) {
    commit(MUTATION_TYPES.SET_CURRENT_VIEW, newRoute)
  },
  [ACTION_TYPES.UPDATE_DAPP_READINESS] ({ commit }, isReady) {
    commit(MUTATION_TYPES.UPDATE_DAPP_READINESS, isReady)
  },
  [ACTION_TYPES.UPDATE_WEB3_PROPERTIES] ({ commit }, payload) {
    commit(MUTATION_TYPES.UPDATE_WEB3_PROPERTIES, payload)
  },
  [ACTION_TYPES.CHANGE_CURRENT_ROUTE_TO] ({ commit }, newRoute) {
    commit(MUTATION_TYPES.CHANGE_CURRENT_ROUTE_TO, newRoute)
  }
}
