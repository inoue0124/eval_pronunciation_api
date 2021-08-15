/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { NextPage } from 'next'
import { Unit } from '../../../types/Unit'
import ApiClient from '../../../api'
import { getCookie } from '../../../util/cookie'
import { SearchRequest } from '../../../types/SearchRequest'
import { Card, makeStyles, Typography, Link } from '@material-ui/core'

const useStyles = makeStyles(() => ({
  root: {
    marginTop: 20,
  },
  container: {
    maxWidth: 500,
    margin: '0 auto',
  },
  card: {
    padding: 20,
    marginBottom: 20,
  },
}))

const UnitList: NextPage = () => {
  const api = new ApiClient()
  const classes = useStyles()
  const [units, setUnits] = useState<Unit[]>([])
  const [teacherId, setTeacherId] = useState<number>()

  useEffect(() => {
    ;(async function () {
      const learner = JSON.parse(getCookie().learner)
      setTeacherId(learner.teacher_id)
      const searchRequest: SearchRequest = {
        page: 1,
        limit: 100,
        search_query: '',
        is_asc: false,
      }
      const res = await api.searchUnitsByTeacherID(learner.teacher_id, searchRequest)
      if (res != undefined) {
        setUnits(res.data)
      }
    })()
  }, [])

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        {units.map((unit) => (
          <Link href={`/learner/unit/${unit.id}?ti=${teacherId}`} key={unit.id}>
            <Card className={classes.card}>
              <Typography color="textPrimary">課題ID：{unit.id}</Typography>
              <Typography color="textPrimary">課題名：{unit.name}</Typography>
              <Typography color="textPrimary">
                作成日時：{new Date(unit.created_at).toLocaleString()}
              </Typography>
            </Card>
          </Link>
        ))}
        <Link href={`/learner/speech`}>
          <Card className={classes.card} key="speech">
            <Typography color="textPrimary">過去に録音したデータを見る</Typography>
          </Card>
        </Link>
      </div>
    </div>
  )
}

export default UnitList
