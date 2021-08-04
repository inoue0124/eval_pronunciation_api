import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { Learner } from '../types/Learner'
import { LearnerSpeech } from '../types/LearnerSpeech'
import { SearchRequest } from '../types/SearchRequest'
import { SearchResponse } from '../types/SearchResponse'
import { SessionResponse } from '../types/SessionResponse'
import { Teacher } from '../types/Teacher'
import { TeacherSpeech } from '../types/TeacherSpeech'
import { Unit } from '../types/Unit'
import { User } from '../types/User'
import { getCookie, deleteCookie } from '../util/cookie'

export default class ApiClient {
  client: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + getCookie().EVAL_SPEECH_SESSION,
    },
    responseType: 'json',
    withCredentials: true,
  })

  // POST /session
  async login(email: string, password: string) {
    const endpoint: string = `/session`
    const res: AxiosResponse<SessionResponse> = await this.client.post(endpoint, {
      email,
      password,
    })
    return res.data
  }

  // DELETE /session
  async logout() {
    deleteCookie('EVAL_SPEECH_SESSION')
    deleteCookie('logged_user')
  }

  // POST /users
  async register(email: string, password: string, type: number) {
    const endpoint: string = `/users`
    const res: AxiosResponse<SessionResponse> = await this.client.post(endpoint, {
      email,
      password,
      type,
    })
    return res.data
  }

  // POST /teachers
  async registerTeacher(name: string, gender: number, birthDate: string, birthPlace: string) {
    const endpoint: string = `/teachers`
    const res: AxiosResponse<Teacher> = await this.client.post(endpoint, {
      name,
      gender,
      birth_date: birthDate,
      birth_place: birthPlace,
    })
    return res.data
  }

  // GET /teachers/${teacher_id}/teacher-speeches
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

  // POST /units
  async registerUnit(name: string, speechIds: number[]) {
    const endpoint: string = `/units`
    let res: AxiosResponse<Unit>
    try {
      res = await this.client.post(endpoint, {
        name,
        speech_ids: speechIds,
      })
      return res.data
    } catch (e) {
      alert(e)
      return
    }
  }

  // GET /units/{unit_id}
  async getUnitById(unitId: number) {
    const endpoint: string = `/units/${unitId}`
    const res: AxiosResponse<Unit> = await this.client.get(endpoint)
    return res.data
  }

  // GET /teachers/${teacher_id}/units
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

  // POST /learners
  async registerLearner(
    teacherId: number,
    name: string,
    gender: number,
    birthDate: string,
    birthPlace: string,
    yearOfLearning: number,
  ) {
    const endpoint: string = `/learners`
    const res: AxiosResponse<Learner> = await this.client.post(endpoint, {
      teacher_id: teacherId,
      name,
      gender,
      birth_date: birthDate,
      birth_place: birthPlace,
      year_of_learning: yearOfLearning,
    })
    return res.data
  }

  // GET /learners/{learner_id}
  async getLearnerById(learnerId: number) {
    const endpoint: string = `/learners/${learnerId}`
    let res: AxiosResponse<Learner>
    try {
      res = await this.client.get(endpoint)
      return res.data
    } catch (e) {
      alert(e)
      return
    }
  }

  // GET /teachers/${teacher_id}/learners
  async searchLearnersByTeacherID(teacher_id: number, searchRequest: SearchRequest) {
    const endpoint: string = `/teachers/${teacher_id}/learners`
    let res: AxiosResponse<SearchResponse<Learner>>
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

  // GET /learners/${learner_id}/learner-speeches
  async searchLearnerSpeechesByLearnerID(learner_id: number, searchRequest: SearchRequest) {
    const endpoint: string = `/learners/${learner_id}/learner-speeches`
    let res: AxiosResponse<SearchResponse<LearnerSpeech>>
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

  // 国名取得API https://restcountries.eu/
  async fetchCountries() {
    const endpoint: string = `https://restcountries.eu/rest/v2/all`
    const res = await axios.get(endpoint)
    const countries: Country[] = res.data.map((d: any) => ({ ja: d.translations.ja, en: d.name }))
    return countries
  }
}

export type Country = {
  ja: string
  en: string
}
