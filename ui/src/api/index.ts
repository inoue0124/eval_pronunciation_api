import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { SearchRequest } from '../types/SearchRequest'
import { SearchResponse } from '../types/SearchResponse'
import { TeacherSpeech } from '../types/TeacherSpeech'
import { Unit } from '../types/Unit'
import { getCookie } from '../util/cookie'

export default class ApiClient {
  client: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + getCookie().token,
    },
    responseType: 'json',
  })

  // POST /teachers/${teacher_id}/teacher-speeches
  async searchTeacherSpeechesByTeacherID(teacher_id: number, searchRequest: SearchRequest) {
    const endpoint: string = `/teachers/${teacher_id}/teacher-speeches`
    let res: AxiosResponse<SearchResponse<TeacherSpeech>>
    try {
      res = await this.client.get(endpoint, {
        params: searchRequest,
      })
      return res.data
    } catch (e) {
      alert(e)
      return
    }
  }

  // POST /teacher-speeches
  async registerTeacherSpeech(text: string, speech: File) {
    const endpoint: string = `/teacher-speeches`
    const params = new FormData()
    params.append('text', text)
    params.append('speech', speech)
    let res: AxiosResponse<TeacherSpeech>
    try {
      res = await this.client.post(endpoint, params, {
        headers: {
          'content-type': 'multipart/form-data',
        },
      })
      return res.data
    } catch (e) {
      alert(e)
      return
    }
  }

  // POST /teachers/${teacher_id}/units
  async searchUnitsByTeacherID(teacher_id: number, searchRequest: SearchRequest) {
    const endpoint: string = `/teachers/${teacher_id}/units`
    let res: AxiosResponse<SearchResponse<Unit>>
    try {
      res = await this.client.get(endpoint, {
        params: searchRequest,
      })
      return res.data
    } catch (e) {
      alert(e)
      return
    }
  }
}
