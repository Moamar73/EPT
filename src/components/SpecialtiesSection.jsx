import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SpecialtiesSection = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // Handle category click navigation
  const handleCategoryClick = (categoryName) => {
    const params = new URLSearchParams();
    params.set('category', categoryName);
    navigate(`/courses?${params.toString()}`);
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_LINK}/api/categories`)
      .then((res) => {
        const categoryNames = res.data;
        const fetchDetails = categoryNames.map(async (cat, idx) => {
          // Fetch courses for the category
          if (cat.name === 'IT and Data') {
            cat.name = 'it'; // Rename for consistency
          }
          const coursesRes = await axios.get(
            `${
              import.meta.env.VITE_API_LINK
            }/api/categories/${encodeURIComponent(cat.name)}`
          );
          const courses = coursesRes.data;
          if (cat.name === 'IT and Data') {
            cat.name = 'it';
          }
          // Fetch unique subcategories for the category
          const subCatRes = await axios.get(
            `${
              import.meta.env.VITE_API_LINK
            }/api/courses/category/${encodeURIComponent(cat.name)}`
          );

          const subCategories = subCatRes.data; // assuming array of strings

          // Extract unique cities (handle multiple cities separated by commas)
          const allCities = courses.flatMap((c) =>
            c.city ? c.city.split(',').map((city) => city.trim()) : []
          );
          const uniqueCitiesSet = new Set(allCities.filter(Boolean));

          return {
            name: cat.name === 'it' ? 'IT and Data' : cat.name,
            icon: iconNames[idx % iconNames.length], // Use a different icon for each
            courses: courses.length,
            sections: subCategories.length,
            cities: uniqueCitiesSet.size,
            subCategories, // you can keep this if you want to use it later
          };
        });

        Promise.all(fetchDetails).then(setCategories);
      })
      .catch((err) => console.error('Error fetching categories', err));
  }, []);

  const iconNames = [
    'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'
    // Add more if you have more images
  ];

  return (
    <section className='bg-blue container-px xl:py-[60px] lg:py-[50px] py-[60px]'>
      <div>
        <h2 className='font-goldman xl:text-[48px] lg:text-[38px] md:text-[35px] text-[27px] text-white xl:mb-6 lg:mb-3 mb-6'>
          Specializations at your fingertips
        </h2>
        <p className='xl:text-[28px] lg:text-[21.6px] md:text-[19px] text-[17px] font-bold text-[#E6E6E6]'>
          A wide range of specialties that meet your needs. Choose what suits
          you now
        </p>
      </div>

      <div className='grid lg:grid-cols-5 md:grid-cols-3 xs:grid-cols-2 gap-5 xl:mt-[56px] lg:mt-[42px] mt-[56px] xl:text-[16px] lg:text-[12px] text-[16px]'>        {categories
          .slice(0, 10)
          .map(({ name, icon, courses, sections, cities }) => (
            <div
              className='group rounded-[10px] bg-white overflow-hidden cursor-pointer transition-transform hover:scale-105'
              key={name}
              onClick={() => handleCategoryClick(name)}
            >
              <div
                className='flex items-center xl:py-[10px] lg:py-2 py-[10px] xl:px-6 lg:px-4 px-6 gap-[10px] shadow-[0px_1px_4px_0px_#0000001A] 
              transition-colors duration-300 group-hover:bg-yellowHome'
              >
                <div className='rounded-[10px] flex-center xl:size-11 lg:size-10 size-11 shrink-0 border border-dashed border-[#4B4072]'>
                  <picture>
                    <source
                      srcSet={`optimized-imgs/Home/specialties/${icon}.webp`}
                      type='image/webp'
                    />
                    <img
                      className='xl:size-[34px] lg:size-[30px] size-[34px]'
                      src={`imgs/Home/specialties/${icon}.png`}
                      alt={name}
                      loading='lazy'
                    />
                  </picture>
                </div>
                <h3 className='text-blue font-bold group-hover:text-white transition-colors duration-300'>
                  {name}
                </h3>
              </div>

              <div className='flex flex-col xl:px-6 lg:px-4 px-6 xl:py-5 lg:py-[18px] py-5 gap-[10px]'>
                <div className='flex gap-[14px]'>
                  <div className='flex-center text-white bg-yellowHome min-w-[34px] min-h-[24px] rounded-md font-bold'>
                    {courses}
                  </div>
                  <span className='text-blue'>Courses</span>
                </div>
                <div className='flex gap-[14px]'>
                  <div className='flex-center text-white bg-[#4ECF9A] min-w-[34px] min-h-[24px] rounded-md font-bold'>
                    {sections}
                  </div>
                  <span className='text-blue'>Sections</span>
                </div>
                <div className='flex gap-[14px]'>
                  <div className='flex-center text-white bg-[#FC767C] min-w-[34px] min-h-[24px] rounded-md font-bold'>
                    {cities}
                  </div>
                  <span className='text-blue'>Cities</span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
};

export default SpecialtiesSection;
