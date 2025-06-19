import { httpGet, httpPut } from './Endpoints'

const commonApi = (function (apiUrl) {
  return {
    getLineMaterialStatus: (lineCode, partNo, onSuccess, onFailure) =>
      httpGet(`${apiUrl}/api/lines/${lineCode}/etis/${partNo}`, onSuccess, onFailure),

    updateLineBom: (partNo, lineCode, onSuccess, onFailure) =>
      httpPut(`${apiUrl}/api/lines/updategama/partno/${partNo}/lineCode/${lineCode}`, {}, onSuccess, onFailure),
  }
})('http://mxsrvapps.gt.local/gtt/services/common')

export default commonApi
