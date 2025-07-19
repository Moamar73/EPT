import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import { Link } from 'react-router-dom';
import imgPlaceholder from '../assets/img.png';

// Helper function to slugify course titles
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-') // Replace spaces and non-word chars with -
    .replace(/^-+|-+$/g, '');  // Remove leading/trailing dashes
}

const PopularCourses = () => {
  const [popularCourses, setPopularCourses] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_LINK}/api/popular-courses`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setPopularCourses(data);
      })
      .catch((error) => {
        console.error('Error fetching popular courses:', error);
      });
  }, []);

  return (
    <section className='container-px xl:py-[75px] py-[60px]'>
      <div className='text-center mb-[60px]'>
        <h2 className='font-bold text-[28px] text-red mb-[14px]'>
          Our Popular Courses
        </h2>
        <h3 className='text-blue font-goldman xl:text-[45px] xs:text-[35px] text-[32px]'>
          Pick up One of The Most Popular Courses
        </h3>
      </div>

      <Swiper
        modules={[Navigation]}
        navigation
        slidesPerView={1}
        spaceBetween={10}
        breakpoints={{
          480: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 5 },
          1280: { slidesPerView: 5 },
        }}
      >
        {popularCourses.map((course) => (
          <SwiperSlide key={course.id}>
            <div
              className='text-white xl:text-[18px] lg:text-[14px] text-[18px] xl:h-[334px] lg:h-[300px] h-[334px] rounded-[10px] overflow-hidden
              xl:px-5 lg:px-4 px-5 xl:py-[34px] lg:py-[30px] py-[34px] bg-cover bg-center relative group'
              style={{
                backgroundImage: `url(${
                  course.thumbnail ? course.thumbnail : imgPlaceholder
                })`,
              }}
            >
              <div className='absolute left-0 top-0 h-full w-full bg-gradient-to-b from-transparent to-black group-hover:opacity-0 transition-opacity duration-[220ms]'></div>
              <div className='relative z-10 h-full w-full flex flex-col justify-end xl:gap-[18px] lg:gap-[15px] gap-[18px]'>                <h4>{course.title}</h4>
                <Link
                  to={`/courses/${slugify(course.title)}`}
                  className='text-blue rounded-lg bg-white xl:w-[127px] lg:w-[110px] w-[127px] text-center xl:py-[6.5px] lg:py-[5px] py-[6.5px]'
                >
                  See More
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default PopularCourses;
