import axios from 'axios';
import { BASE_URL_API } from '../store';
import { isNullOrUndefined } from 'util';

export const addressApi = {
  address: (action, token) => async () => {
    var url = isNullOrUndefined(action.numberAddition)
      ? `/address/${action.postalCode}/${action.number}`
      : `/address/${action.postalCode}/${action.number}/${action.numberAddition}`;

    const response = await axios.get(url, {
      baseURL: BASE_URL_API,
      headers: { 'X-Auth': token }
    });
    if (response.statusText === 'OK' || response.status === 200) {
      return { data: response.data };
    } else {
      throw response.status;
    }
  }
};