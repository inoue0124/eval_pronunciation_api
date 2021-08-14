import Link from 'next/link'
import { UnitListTable } from '../../../components/unit/UnitListTable'
import AddIcon from '@material-ui/icons/Add'
import { Button } from '@material-ui/core'
import { SideMenu } from '../../../layout/admin'

const UnitList: React.FC = () => {
  return (
    <SideMenu>
      <UnitListTable isAdmin={true} />
    </SideMenu>
  )
}

export default UnitList
