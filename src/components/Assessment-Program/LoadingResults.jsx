import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import LoadingGif from "../../assets/Assessment-Program/001.gif"

const LoadingResults = () => {
  const navigate = useNavigate()

  useEffect(() => {
    setTimeout(() => {
        navigate("/results")
    }, 6000)
  }, [])

  return (
    <div className="py-10">
        <div>
            <div className="flex items-center gap-4 font-bold text-[29px] max-sm:text-[24px]">
                <picture>
                    <source srcSet="optimized-imgs/Assessment-Program/AR02-icon.webp" type="image/webp" />
                    <img className="max-h-[50px] max-sm:max-h-[40px]" src="imgs/Assessment-Program/AR02-icon.png" alt="assessment-icon" />
                </picture>
                <span>استبيانات التقييم</span>
            </div>

            <div className="flex-center py-10">
                <img className="max-h-[350px]" src={LoadingGif} alt="loading results" />
            </div>
        </div>
    </div>
  )
}

export default LoadingResults