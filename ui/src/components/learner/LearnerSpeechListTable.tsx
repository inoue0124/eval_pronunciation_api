/* eslint-disable */
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box'
import InputAdornment from '@material-ui/core/InputAdornment'
import SearchIcon from '@material-ui/icons/Search'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Table from '@material-ui/core/Table'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableFooter from '@material-ui/core/TableFooter'
import TablePagination from '@material-ui/core/TablePagination'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import ApiClient from '../../api'
import { SearchRequest } from '../../types/SearchRequest'
import { LearnerSpeech } from '../../types/LearnerSpeech'
import { Button, Checkbox, CircularProgress, Link } from '@material-ui/core'
import { useRecoilState } from 'recoil'
import { selectedLearnerSpeechIdsState } from '../../states/learnerSpeech/selectedLearnerSpeechIdsState'

type Props = {
  isAdmin: boolean
  learnerId?: number
  speeches?: LearnerSpeech[]
}

export const LearnerSpeechListTable: React.FC<Props> = ({ isAdmin, learnerId, speeches }) => {
  const api = new ApiClient()
  const router = useRouter()
  const [data, setData] = useState<LearnerSpeech[]>([])
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [page, setPage] = useState<number>(0)
  const [count, setCount] = useState<number>(0)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isAsc, setIsAsc] = useState<boolean>(false)
  const [isDownloading, setIsDownloading] = useState<boolean>(false)
  const [selected, setSelected] =
    speeches != undefined
      ? useState<number[]>(speeches.map((speech) => speech.id))
      : useRecoilState<number[]>(selectedLearnerSpeechIdsState)

  // 学習者音声リストが渡された場合はAPIを叩きに行かない
  const fetchData = async () => {
    if (speeches === undefined) {
      if (!isAdmin && learnerId === undefined) return
      const searchRequest: SearchRequest = {
        page: page + 1,
        limit: rowsPerPage,
        search_query: searchQuery,
        is_asc: isAsc,
      }
      const res = isAdmin
        ? await api.searchLearnerSpeeches(searchRequest)
        : await api.searchLearnerSpeechesByLearnerID(learnerId!, searchRequest)
      if (res != undefined) {
        setData(res.data)
        setCount(res.count)
      }
    } else {
      setData(speeches)
      setCount(speeches.length)
    }
  }
  useEffect(() => {
    fetchData()
  }, [page, rowsPerPage, searchQuery, isAsc])

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      const res = await api.downloadLearnerSpeeches(selected)
      console.log(res!)
      const blob = new Blob([res!])
      const a = document.createElement('a')
      a.href = window.URL.createObjectURL(blob)
      a.download = 'archive.zip'
      a.click()
      setIsDownloading(false)
    } catch (e) {
      setIsDownloading(false)
      alert(e)
    }
  }
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }
  const handleClickRow = (speech_id: number) => {
    router.push(
      isAdmin ? `/admin/learner-speech/${speech_id}` : `/teacher/learner/speech/${speech_id}`,
    )
  }
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
  }
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }
  const handleCheckAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = data.map((d) => d.id)
      setSelected(newSelecteds)
      return
    }
    setSelected([])
  }
  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected: number[] = []
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      )
    }
    setSelected(newSelected)
  }

  return (
    <Paper>
      <Toolbar>
        <Grid container direction="row" justifyContent="space-between" alignItems="center">
          <Box mr={2}>
            <Typography variant="h6" id="tableTitle" style={{ display: 'inline' }}>
              学習者音声一覧
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleDownload}
              disabled={selected.length === 0 || isDownloading}
              disableElevation
              style={{ marginLeft: 20 }}
            >
              {isDownloading && <CircularProgress size={20} style={{ marginRight: 10 }} />}
              選択音声をダウンロード
            </Button>
          </Box>
          {speeches === undefined && (
            <TextField
              style={{ width: 400 }}
              id="outlined-basic"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              value={searchQuery}
              onChange={handleSearch}
            />
          )}
        </Grid>
      </Toolbar>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {speeches === undefined && (
                <TableCell>
                  <Checkbox onChange={handleCheckAll} disabled={speeches != undefined} />
                </TableCell>
              )}
              <TableCell sortDirection={isAsc ? 'asc' : 'desc'}>
                <TableSortLabel
                  active={true}
                  direction={isAsc ? 'asc' : 'desc'}
                  onClick={() => {
                    setIsAsc(!isAsc)
                  }}
                >
                  音声ID
                </TableSortLabel>
              </TableCell>
              <TableCell>学習者ID</TableCell>
              <TableCell>課題ID</TableCell>
              <TableCell>教師音声ID</TableCell>
              <TableCell>録音タイプ</TableCell>
              <TableCell>ファイル</TableCell>
              <TableCell>GOPスコア</TableCell>
              <TableCell>DTWスコア</TableCell>
              <TableCell>作成日時</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((d) => (
              <TableRow key={d.id} hover={true}>
                {speeches === undefined && (
                  <TableCell>
                    <Checkbox
                      checked={selected.includes(d.id)}
                      onChange={(event) => {
                        handleCheck(event, d.id)
                      }}
                    />
                  </TableCell>
                )}
                <TableCell component="th" scope="row" onClick={() => handleClickRow(d.id)}>
                  {d.id}
                </TableCell>
                <TableCell onClick={() => handleClickRow(d.id)}>
                  <Link
                    href={
                      isAdmin
                        ? `/admin/learner/${d.learner_id}`
                        : `/teacher/learner/${d.learner_id}`
                    }
                  >
                    {d.learner_id}
                  </Link>
                </TableCell>
                <TableCell onClick={() => handleClickRow(d.id)}>
                  <Link href={isAdmin ? `/admin/unit/${d.unit_id}` : `/teacher/unit/${d.unit_id}`}>
                    {d.unit_id}
                  </Link>
                </TableCell>
                <TableCell onClick={() => handleClickRow(d.id)}>{d.teacher_speech_id}</TableCell>
                <TableCell onClick={() => handleClickRow(d.id)}>{d.type}</TableCell>
                <TableCell onClick={() => handleClickRow(d.id)}>
                  <Link href={d.object_key} target="_blank">
                    {d.object_key.split('/').pop()}
                  </Link>
                </TableCell>
                <TableCell onClick={() => handleClickRow(d.id)}>
                  {d.gop_average ? d.gop_average : '-'}
                </TableCell>
                <TableCell onClick={() => handleClickRow(d.id)}>
                  {d.dtw_average ? d.dtw_average : '-'}
                </TableCell>
                <TableCell onClick={() => handleClickRow(d.id)}>
                  {new Date(d.created_at).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                count={count}
                rowsPerPageOptions={[10, 30, 50]}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Paper>
  )
}
