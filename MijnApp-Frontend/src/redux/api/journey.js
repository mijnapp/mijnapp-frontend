import axios from 'axios';
import { configuration } from '../../helpers/configuration';

export const journeyApi = {
  checkPreconditions: (journeyId, token) => async () => {
    const response = await axios.get('/journey/' + journeyId + '/checkPreconditions', {
      baseURL: configuration.BASE_URL_API(),
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (response.statusText === 'OK' || response.status === 200) {
      return { data: response.data };
    } else {
      throw response.status;
    }
  },
};
