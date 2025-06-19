import axios from 'axios'

const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

const handleResponse = async (axiosCall, onSuccess, onFailure) => {
  try {
    const response = await axiosCall()
    const result = response.data

    console.log('[API]', result)

    if (result.isSuccess) {
      onSuccess(result.data)
    } else {
      const message = result.message || 'Ocurrió un error en la solicitud.'
      alert(message)
      if (onFailure) onFailure(message)
    }
  } catch (error) {
    console.error('[CRITICAL]', error)
    const message =
      error.response?.data?.message ||
      error.message ||
      'Error inesperado al procesar la solicitud.'
    alert(message)
    if (onFailure) onFailure(message)
  }
}

export const httpGet = (url, onSuccess, onFailure = null) =>
  handleResponse(() => axiosInstance.get(url), onSuccess, onFailure)

export const httpPost = (url, data, onSuccess, onFailure = null) =>
  handleResponse(() => axiosInstance.post(url, data), onSuccess, onFailure)

export const httpPut = (url, data, onSuccess, onFailure = null) =>
  handleResponse(() => axiosInstance.put(url, data), onSuccess, onFailure)

export const httpDel = (url, data, onSuccess, onFailure = null) =>
  handleResponse(() => axiosInstance.delete(url, { data }), onSuccess, onFailure)
