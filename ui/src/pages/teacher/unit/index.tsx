import Link from 'next/link'
import { UnitListTable } from '../../../components/teacher/unit/UnitListTable'
import AddIcon from '@material-ui/icons/Add'
import { Button } from '@material-ui/core'
import { SideMenu } from '../../../layout/teacher'

const UnitList: React.FC = () => {
  return (
    <SideMenu>
      <div className="mb-1" style={{ textAlign: 'right' }}>
        <Link href="unit/new">
          <Button variant="contained" color="primary" startIcon={<AddIcon />} disableElevation>
            新規追加
          </Button>
        </Link>
      </div>
      <UnitListTable />
    </SideMenu>
  )
}

export default UnitList
