import axios from "axios";
import {
  appConfig
} from "./AppConfig";
import qs from "qs";

const client = {
  async get(apiName, params) {
    try {

      const _path = appConfig.apiUri + apiName;
      const resp = await axios.get(_path, {
        params: params
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      if (resp.status >= 400 && resp.status <= 500) {
        return Promise.reject({
          "status": resp.status,
          "Message": resp.data.status.message
        });
      }
      return Promise.resolve(resp.data);
    } catch (err) {
      if (err.response)
        return Promise.reject({
          "status": err.response.status,
          "Message": err.response.data.message
        });
      else
        return Promise.reject({
          "status": 500,
          "Message": "Internal Server Error"
        });
    }
  },
  async post(apiName, body) {
    try {

      const _path = appConfig.apiUri + apiName;

      var config = {
        method: 'post',
        url: _path,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(body)
      };

      const resp = await axios(config);

      if (resp.status >= 400 && resp.status <= 500) {
        console.log("called");
        return Promise.reject({
          "status": resp.status,
          "Message": resp.data.message
        });
      }

      return Promise.resolve(resp.data);
    } catch (err) {
      console.log(err);
      if (err.response) {
        console.log("error")
        return Promise.reject({
          "status": err.response.status,
          "Message": err.response.data.message
        });
      } else
        return Promise.reject({
          "status": 500,
          "Message": "Internal Server Error"
        });
    }
  }
}

export default client;