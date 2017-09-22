// remove

import { ACTIVE_COIN_GET_ADDRESSES } from '../storeType';
import Config from '../../config';

export function getAddressesByAccountState(json, coin, mode) {
  if (mode === 'full' ||
      mode === 'basilisk') {
    let publicAddressArray = [];

    for (let i = 0; i < json.result.length; i++) {
      publicAddressArray.push({
        address: json.result[i],
        amount: 'N/A',
      });
    }

    json.result = publicAddressArray;
  }

  return {
    type: ACTIVE_COIN_GET_ADDRESSES,
    addresses: { public: json.result },
  }
}

export function getAddressesByAccount(coin, mode) {
  const payload = {
    userpass: `tmpIgRPCUser@${sessionStorage.getItem('IguanaRPCAuth')}`,
    coin: coin,
    agent: 'bitcoinrpc',
    method: 'getaddressesbyaccount',
    account: '*',
  };

  return dispatch => {
    return fetch(`http://127.0.0.1:${Config.iguanaCorePort}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    .catch(function(error) {
      console.log(error);
      dispatch(updateErrosStack('activeHandle'));
      dispatch(
        triggerToaster(
          'getAddressesByAccount',
          'Error',
          'error'
        )
      );
    })
    .then(response => response.json())
    .then(json => {
      dispatch(
        getAddressesByAccountState(
          json,
          coin,
          mode
        )
      );
    })
  }
}