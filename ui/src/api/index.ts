import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { Dtw } from '../types/Dtw'
import { Gop } from '../types/Gop'
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

  // GET /teachers
  async searchTeachers(searchRequest: SearchRequest) {
    const endpoint: string = `/teachers`
    let res: AxiosResponse<SearchResponse<Teacher>>
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

  // GET /teachers/{teacher_id}
  async getTeacherById(teacherId: number) {
    const endpoint: string = `/teachers/${teacherId}`
    const res: AxiosResponse<Teacher> = await this.client.get(endpoint)
    return res.data
  }

  // GET /teacher-speeches
  async searchTeacherSpeeches(searchRequest: SearchRequest) {
    const endpoint: string = `/teacher-speeches`
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

  // POST /teacher-speeches/archive
  async downloadTeacherSpeeches(speechIds: number[]) {
    const endpoint: string = `/teacher-speeches/archive`
    const res: AxiosResponse<ArrayBuffer> = await this.client.post(
      endpoint,
      {
        teacher_speech_ids: speechIds,
      },
      { responseType: 'arraybuffer' },
    )
    return res.data
  }

  // GET /units
  async searchUnits(searchRequest: SearchRequest) {
    const endpoint: string = `/units`
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
  async searchUnitsByTeacherID(teacherId: number, searchRequest: SearchRequest) {
    const endpoint: string = `/teachers/${teacherId}/units`
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

  // GET /learners
  async searchLearners(searchRequest: SearchRequest) {
    const endpoint: string = `/learners`
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
    const res: AxiosResponse<Learner> = await this.client.get(endpoint)
    return res.data
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

  // GET /learner-speeches
  async searchLearnerSpeeches(searchRequest: SearchRequest) {
    const endpoint: string = `/learner-speeches`
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

  // POST /learner-speeches
  async registerLearnerSpeech(
    unitId: number,
    teacherSpeechId: number,
    type: number,
    speech: Blob,
    gop_average: number,
    dtw_average: number,
    gop_seq: string,
    pitch_seq: string,
  ) {
    const endpoint: string = `/learner-speeches`
    const params = new FormData()
    params.append('unit_id', unitId.toString())
    params.append('teacher_speech_id', teacherSpeechId.toString())
    params.append('type', type.toString())
    params.append('speech', speech, 'speech.webm')
    params.append('gop_average', gop_average.toString())
    params.append('dtw_average', dtw_average.toString())
    params.append('gop_seq', gop_seq)
    params.append('pitch_seq', pitch_seq)
    let res: AxiosResponse<LearnerSpeech>
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

  // GET /learner-speeches/{learner_speech_id}
  async getLearnerSpeecheById(learnerSpeechId: number) {
    const endpoint: string = `/learner-speeches/${learnerSpeechId}`
    let res: AxiosResponse<LearnerSpeech>
    try {
      res = await this.client.get(endpoint)
      return res.data
    } catch (e) {
      alert(e)
      return
    }
  }

  // POST /learner-speeches/archive
  async downloadLearnerSpeeches(speechIds: number[]) {
    const endpoint: string = `/learner-speeches/archive`
    const res: AxiosResponse<ArrayBuffer> = await this.client.post(
      endpoint,
      {
        learner_speech_ids: speechIds,
      },
      { responseType: 'arraybuffer' },
    )
    return res.data
  }

  // POST /scores/gop
  async calculateGop(text: string, speech: Blob) {
    const endpoint: string = `/scores/gop`
    const params = new FormData()
    params.append('text', text)
    params.append('speech', speech, 'speech.webm')
    let res: AxiosResponse<Gop>
    res = await this.client.post(endpoint, params, {
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
    return res.data
  }

  // POST /scores/dtw
  async calculateDtw(refSpeech: Blob, speech: Blob) {
    const endpoint: string = `/scores/dtw`
    const params = new FormData()
    params.append('ref_speech', refSpeech, 'test.webm')
    params.append('speech', speech, 'ref_speech.webm')
    let res: AxiosResponse<Dtw>
    res = await this.client.post(endpoint, params, {
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
    return res.data
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
