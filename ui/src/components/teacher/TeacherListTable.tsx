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
import { Teacher } from '../../types/Teacher'
import { SearchRequest } from '../../types/SearchRequest'

export const TeacherListTable: React.FC = () => {
  const api = new ApiClient()
  const router = useRouter()
  const [data, setData] = useState<Teacher[]>([])
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [page, setPage] = useState<number>(0)
  const [count, setCount] = useState<number>(0)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isAsc, setIsAsc] = useState<boolean>(false)
  useEffect(() => {
    ;(async function () {
      const searchRequest: SearchRequest = {
        page: page + 1,
        limit: rowsPerPage,
        search_query: searchQuery,
        is_asc: isAsc,
      }
      const res = await api.searchTeachers(searchRequest)
      if (res != undefined) {
        setData(res.data)
        setCount(res.count)
      }
    })()
  }, [page, rowsPerPage, searchQuery, isAsc])
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }
  const handleClickRow = (teacher_id: number) => {
    router.push(`/admin/teacher/${teacher_id}`)
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
              教師一覧
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
                  教師ID
                </TableSortLabel>
              </TableCell>
              <TableCell>名前</TableCell>
              <TableCell>性別</TableCell>
              <TableCell>年齢</TableCell>
              <TableCell>出身地</TableCell>
              <TableCell>作成日時</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data}
            {data.map((d) => (
              <TableRow key={d.user_id} onClick={() => handleClickRow(d.user_id)} hover={true}>
                <TableCell component="th" scope="row">
                  {d.user_id}
                </TableCell>
                <TableCell>{d.name}</TableCell>
                <TableCell>{d.gender}</TableCell>
                <TableCell>{d.birth_date}</TableCell>
                <TableCell>{d.birth_place}</TableCell>
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
