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
import { Unit } from '../../types/Unit'
import { getCookie } from '../../util/cookie'

type Props = {
  isAdmin: boolean
  teacherId?: number
}

export const UnitListTable: React.FC<Props> = ({ isAdmin, teacherId }) => {
  const api = new ApiClient()
  const router = useRouter()
  const [data, setData] = useState<Unit[]>([])
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [page, setPage] = useState<number>(0)
  const [count, setCount] = useState<number>(0)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isAsc, setIsAsc] = useState<boolean>(false)
  useEffect(() => {
    ;(async function () {
      const user = JSON.parse(getCookie().logged_user)
      const searchRequest: SearchRequest = {
        page: page + 1,
        limit: rowsPerPage,
        search_query: searchQuery,
        is_asc: isAsc,
      }
      const res = isAdmin
        ? teacherId
          ? await api.searchUnitsByTeacherID(teacherId, searchRequest)
          : await api.searchUnits(searchRequest)
        : await api.searchUnitsByTeacherID(user.id, searchRequest)
      if (res != undefined) {
        setData(res.data)
        setCount(res.count)
      }
    })()
  }, [page, rowsPerPage, searchQuery, isAsc])
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }
  const handleClickRow = (learner_id: number) => {
    router.push(isAdmin ? `/admin/unit/${learner_id}` : `/teacher/unit/${learner_id}`)
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
              課題一覧
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
                  課題ID
                </TableSortLabel>
              </TableCell>
              {isAdmin && <TableCell>教師ID</TableCell>}
              <TableCell>課題名</TableCell>
              <TableCell>音声ID一覧</TableCell>
              <TableCell>作成日時</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((d) => (
              <TableRow key={`unit_${d.id}`} onClick={() => handleClickRow(d.id)} hover={true}>
                <TableCell component="th" scope="row">
                  {d.id}
                </TableCell>
                {isAdmin && <TableCell>{d.teacher_id}</TableCell>}
                <TableCell>{d.name}</TableCell>
                <TableCell>
                  {d.teacher_speeches.map((ts) => (
                    <>
                      {ts.id}
                      <span> </span>
                    </>
                  ))}
                </TableCell>
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
