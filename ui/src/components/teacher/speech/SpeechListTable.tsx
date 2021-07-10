import { useState, useEffect } from 'react'
import Box from '@material-ui/core/Box'
import Checkbox from '@material-ui/core/Checkbox'
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
import ApiClient from '../../../api'
import { TeacherSpeech } from '../../../types/TeacherSpeech'
import { SearchRequest } from '../../../types/SearchRequest'
import { selectedSpeechIdsState } from '../../../states/addUnit/selectedSpeechIdsState'
import { useRecoilState, useRecoilValue } from 'recoil'
import { addedSpeechState } from '../../../states/addTeacherSpeech/addedSpeechState'

export const SpeechListTable: React.FC = () => {
  const api = new ApiClient()
  const [data, setData] = useState<TeacherSpeech[]>([])
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [page, setPage] = useState<number>(0)
  const [count, setCount] = useState<number>(0)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isAsc, setIsAsc] = useState<boolean>(false)
  const [selected, setSelected] = useRecoilState<number[]>(selectedSpeechIdsState)
  const addedSpeech = useRecoilValue<TeacherSpeech | null>(addedSpeechState)
  useEffect(() => {
    ;(async function () {
      const searchRequest: SearchRequest = {
        page: page + 1,
        limit: rowsPerPage,
        search_query: searchQuery,
        is_asc: isAsc,
      }
      const res = await api.searchTeacherSpeechesByTeacherID(18, searchRequest)
      if (res != undefined) {
        setData(res.data)
        setCount(res.count)
      }
    })()
  }, [page, rowsPerPage, searchQuery, isAsc, addedSpeech])
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
  const handleCheckAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = data.map((d) => d.id)
      setSelected(newSelecteds)
      return
    }
    setSelected([])
  }
  const handleCheck = (_: React.ChangeEvent<HTMLInputElement>, id: number) => {
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
        <Grid container direction="row" justify="space-between" alignItems="center">
          <Box mr={2}>
            <Typography variant="h6" id="tableTitle" component="div">
              教師音声一覧
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
              <TableCell>
                <Checkbox onChange={handleCheckAll} />
              </TableCell>
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
              <TableCell>教師ID</TableCell>
              <TableCell>テキスト</TableCell>
              <TableCell>ファイル名</TableCell>
              <TableCell>作成日時</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((d) => (
              <TableRow key={d.id}>
                <TableCell>
                  <Checkbox
                    checked={selected.includes(d.id)}
                    onChange={(event) => {
                      handleCheck(event, d.id)
                    }}
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  {d.id}
                </TableCell>
                <TableCell>{d.teacher_id}</TableCell>
                <TableCell>{d.text}</TableCell>
                <TableCell>{d.object_key}</TableCell>
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
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Paper>
  )
}
