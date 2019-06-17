export const NETWORKS = {
  '1': 'Main Net',
  '2': 'Deprecated Morden test network',
  '3': 'Ropsten test network',
  '4': 'Rinkeby test network',
  '42': 'Kovan test network',
  '4447': 'Truffle Develop Network',
  '5777': 'Ganache Blockchain',
  '666': 'Daniel Private Blockchain' // This is a test private blockchain. You can change it to your own private blockchain if you have one.
}

export const APPROVED_NETWORK_ID = '5777'

export const MUTATION_TYPES = {
  CHANGE_CURRENT_ROUTE_TO: 'changeCurrentRouteTo',
  REGISTER_WEB3_INSTANCE: 'registerWeb3Instance',
  UPDATE_WEB3_PROPERTIES: 'updateWeb3Properties',
  SET_CURRENT_VIEW: 'setCurrentView',
  UPDATE_DAPP_READINESS: 'updateDAppReadiness',
}

export const ACTION_TYPES = MUTATION_TYPES
