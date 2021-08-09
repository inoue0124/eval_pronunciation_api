/* eslint-disable */
import { useState, useEffect } from 'react'
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
import { Link } from '@material-ui/core'

type Props = {
  isAdmin: boolean
  learnerId: number
  speeches?: LearnerSpeech[]
}

export const LearnerSpeechListTable: React.FC<Props> = ({ isAdmin, learnerId, speeches }) => {
  const api = new ApiClient()
  const [data, setData] = useState<LearnerSpeech[]>([])
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [page, setPage] = useState<number>(0)
  const [count, setCount] = useState<number>(0)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isAsc, setIsAsc] = useState<boolean>(false)

  // 学習者音声リストが渡された場合はAPIを叩きに行かない
  const fetchData = async () => {
    if (speeches === undefined) {
      const searchRequest: SearchRequest = {
        page: page + 1,
        limit: rowsPerPage,
        search_query: searchQuery,
        is_asc: isAsc,
      }
      const res = isAdmin
        ? await api.searchLearnerSpeeches(searchRequest)
        : await api.searchLearnerSpeechesByLearnerID(learnerId, searchRequest)
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
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
  }
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  return (
    <Paper>
      <Toolbar>
        <Grid container direction="row" justifyContent="space-between" alignItems="center">
          <Box mr={2}>
            <Typography variant="h6" id="tableTitle" component="div">
              音声一覧
            </Typography>
          </Box>
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
        </Grid>
      </Toolbar>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
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
              <TableCell>ファイルキー</TableCell>
              <TableCell>GOPスコア</TableCell>
              <TableCell>GOPファイルキー</TableCell>
              <TableCell>DTWスコア</TableCell>
              <TableCell>DTWファイルキー</TableCell>
              <TableCell>作成日時</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((d) => (
              <TableRow key={d.id}>
                <TableCell component="th" scope="row">
                  {d.id}
                </TableCell>
                <TableCell>{d.learner_id}</TableCell>
                <TableCell>
                  <Link href={`/teacher/unit/${d.unit_id}`}>{d.unit_id}</Link>
                </TableCell>
                <TableCell>{d.teacher_speech_id}</TableCell>
                <TableCell>{d.type}</TableCell>
                <TableCell>{d.object_key}</TableCell>
                <TableCell>{d.gop_average}</TableCell>
                <TableCell>{d.gop_file_key}</TableCell>
                <TableCell>{d.dtw_average}</TableCell>
                <TableCell>{d.dtw_file_key}</TableCell>
                <TableCell>{new Date(d.created_at).toLocaleString()}</TableCell>
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
