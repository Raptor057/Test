import { httpPut } from './Endpoints'

const packagingApi = (function (apiUrl) {
  return {
    SetStationBlocked: (is_blocked, lineName, onSuccess, onFailure) =>
      httpPut(`${apiUrl}/api/StationBlocked/${is_blocked}/${lineName}`, {}, onSuccess, onFailure),
  }
})('http://mxsrvapps.gt.local/gtt/services/packaging')

export default packagingApi
