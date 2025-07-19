import { AlarmClock } from "lucide-react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"

const ApplyNowButton = ({ courseData, selectedCity, selectedDate }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/register', { state: { courseData, selectedCity, selectedDate } });
  }
  return (
     <button
      className="w-full h-full flex-center bg-yellow font-goldman flex-nowrap text-nowrap p-4"
      onClick={handleClick}
    >
      <AlarmClock className="inline-block mr-3" color="#374957" />
      Apply Now
    </button>
  )
}

export default ApplyNowButton