import UserButton from '../UserButton/UserButton'
import Image from '../Image/Image'
import {useNavigate} from 'react-router'
import './TopBar.css'
function TopBar() {

  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();
{
    navigate(`/search?search=${e.target[0].value}`)
  }
}

  return (
    <div className="topBar">
      {/* search */}
      <form onSubmit={handleSubmit} className="search">
        <Image path="/general/search.svg" alt="" />
        <input type="text" placeholder='Search' />
      </form>

      {/* user */}
      <div className="user">
        <UserButton />
      </div>
    </div>
  )
}

export default TopBar
