import { useState, useEffect } from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableFooter from '@material-ui/core/TableFooter'
import TablePagination from '@material-ui/core/TablePagination'
import Paper from '@material-ui/core/Paper'
import ApiClient from '../../../api'
import { TeacherSpeech } from '../../../types/TeacherSpeech'

const SpeechListTable: React.FC = () => {
  const api = new ApiClient()
  const [teacherSpeeches, setTeacherSpeeches] = useState<TeacherSpeech[]>([])
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [page, setPage] = useState<number>(0)
  const [count, setCount] = useState<number>(0)
  useEffect(() => {
    ;(async function () {
      const res = await api.searchTeacherSpeechesByTeacherID(18, page + 1, rowsPerPage)
      if (res != undefined) {
        setTeacherSpeeches(res.data)
        setCount(res.count)
      }
    })()
  }, [page, rowsPerPage])
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
  }
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ユーザID</TableCell>
            <TableCell>教師ID</TableCell>
            <TableCell>テキスト</TableCell>
            <TableCell>ファイル名</TableCell>
            <TableCell>作成日時</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {teacherSpeeches.map((teacherSpeech) => (
            <TableRow key={teacherSpeech.id}>
              <TableCell component="th" scope="row">
                {teacherSpeech.id}
              </TableCell>
              <TableCell>{teacherSpeech.teacher_id}</TableCell>
              <TableCell>{teacherSpeech.text}</TableCell>
              <TableCell>{teacherSpeech.object_key}</TableCell>
              <TableCell>{new Date(teacherSpeech.created_at).toLocaleString()}</TableCell>
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
  )
}

export default SpeechListTable
