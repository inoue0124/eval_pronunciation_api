import { UnitListTable } from '../../../components/unit/UnitListTable'
import { SideMenu } from '../../../layout/admin'

const UnitList: React.FC = () => {
  return (
    <SideMenu>
      <UnitListTable isAdmin={true} />
    </SideMenu>
  )
}

export default UnitList
