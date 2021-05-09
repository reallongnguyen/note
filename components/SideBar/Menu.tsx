import { FC } from 'react'
import { DocumentTextOutline, TrashBinOutline } from 'react-ionicons'

interface MenuItemProps {
  name: string
  icon: string
  active?: boolean
}

const MenuItem: FC<MenuItemProps> = ({ active, name, icon }) => (
  <div
    className={`
      w-full h-14 flex flex-col items-center justify-center cursor-pointer select-none
      hover:brightness-125 hover:bg-gray-600 filter
      transition duration-75
      ${active ? 'bg-gray-600 text-gray-200' : 'text-gray-300'}
    `}
  >
    {icon === 'document' && (
      <DocumentTextOutline width="1.2rem" style={{ color: 'inherit' }} />
    )}
    {icon === 'trash-bin' && (
      <TrashBinOutline width="1.2rem" style={{ color: 'inherit' }} />
    )}
    <div
      className={`
      text-xs font-light
      ${active ? 'text-gray-300' : 'text-gray-400'}
    `}
    >
      {name}
    </div>
  </div>
)

const Menu: FC = () => (
  <>
    <MenuItem name="Note" icon="document" active />
    <MenuItem name="Trash" icon="trash-bin" />
  </>
)

export default Menu
