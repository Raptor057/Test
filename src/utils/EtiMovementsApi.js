import { httpPost, httpDel, httpGet } from './Endpoints'

const etiMovementsApi = (function (apiUrl) {
  return {
    loadEti: (pointOfUseCode, etiNo, lineCode, operatorNo, partNo, workOrderCode, onSuccess, onFailure) =>
      httpPost(
        `${apiUrl}/api/lines/${lineCode}/etis`,
        { EtiInput: etiNo, PointOfUseCode: pointOfUseCode },
        onSuccess,
        onFailure
      ),

    unloadEti: (pointOfUseCode, etiNo, lineCode, operatorNo, onSuccess, onFailure) =>
      httpDel(
        `${apiUrl}/api/lines/${lineCode}/etis`,
        { EtiInput: etiNo, IsReturn: false },
        onSuccess,
        onFailure
      ),

    getEtiInfo: (etiNo, onSuccess, onFailure) =>
      httpGet(`${apiUrl}/api/etis/${etiNo}`, onSuccess, onFailure),
  }
})('http://mxsrvapps.gt.local/gtt/services/etimovements')

export default etiMovementsApi
