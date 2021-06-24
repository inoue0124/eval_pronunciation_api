import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { SearchResponse } from '../types/SearchResponse'
import { TeacherSpeech } from '../types/TeacherSpeech'
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

  async searchTeacherSpeechesByTeacherID(
    teacher_id: number,
    page: number,
    limit: number,
    search_query?: string,
    is_asc?: boolean,
  ) {
    let endpoint: string = `/teachers/${teacher_id}/teacher-speeches`
    let params = {
      page,
      limit,
      search_query,
      is_asc,
    }
    let res: AxiosResponse<SearchResponse<TeacherSpeech>>
    try {
      res = await this.client.get(endpoint, {
        params,
      })
      return res.data
    } catch (e) {
      alert(e)
      return
    }
  }
}
