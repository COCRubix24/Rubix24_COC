import { useState } from 'react'
import './Dashboard.css'
// import Headeruser from './Headeruser'
import Sidebaruser from './Sidebaruser'
import Mainuser from './Mainuser'
import ComplainthistoryPage from './complaint history/ComplainthistoryPage'
function Dashboarduser() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false)
  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle)
  }

  return (
    <div className='grid-container'>
      {/* <Headeruser OpenSidebar={OpenSidebar}/> */}
      <Sidebaruser openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar}/>
      <ComplainthistoryPage />
    </div>
  )
}

export default Dashboarduser;