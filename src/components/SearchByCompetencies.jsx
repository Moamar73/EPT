import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { isMonday, isAfter, startOfToday, format } from 'date-fns';

const SearchByCompetencies = () => {  const [selectedValues, setSelectedValues] = useState({});
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [competencies, setCompetencies] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState("one week");
  const navigate = useNavigate();

  const cities = [
    'London',
    'Paris',
    'Damascus',
    'Manchester',
    'Istanbul',
    'Amsterdam',
    'Rome',
    'Madrid',
    'Barcelona',
    'Athens',
    'Dubai',    'Sharm El Sheikh',
  ];

  const durations = ['one week', 'two weeks'];

  // Fetch main categories on component mount
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_LINK}/api/courses/main-category`)
      .then((res) => res.json())
      .then((data) => {
        const categoryNames = data.map((cat) => cat.category);
        setMainCategories(categoryNames);
      })
      .catch((error) => {
        setMainCategories(['HR']); // Fallback
      });
  }, []);

  // Fetch competencies for selected main category
  useEffect(() => {
    const mainCategory = selectedValues['Main Categories'];
    if (!mainCategory) return;

    fetch(
      `${import.meta.env.VITE_API_LINK}/api/courses/competencies/${encodeURIComponent(
        mainCategory
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        setCompetencies(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        setCompetencies([
          'Leadership',
          'Communication',
          'Project Management',
          'Technical Skills',
        ]); // Fallback
      });
  }, [selectedValues['Main Categories']]);

  const fetchSubCategories = (mainCategory) => {
    if (!mainCategory) return;
    fetch(
      `${
        import.meta.env.VITE_API_LINK
      }/api/courses/category/${encodeURIComponent(mainCategory)}`
    )
      .then((res) => res.json())
      .then((data) => {
        const subCategoryList = data.map((item) => item.sub_category);
        setSubCategories(subCategoryList);
      })
      .catch((error) => {
        console.error('Error fetching subcategories:', error);
      });
  };

  const handleChange = (e, title) => {
    const value = e.target.value;
    setSelectedValues((prev) => ({
      ...prev,
      [title]: value,
    }));

    if (title === 'Main Categories') {
      fetchSubCategories(value);
    }
  };
  const handleSearch = (e) => {
    e.preventDefault();

    const mainCategory = selectedValues['Main Categories'];
    const subCategory = selectedValues['Sub Categories'];
    const city = selectedValues['City'];
    const date = selectedDate;
    const competency1 = selectedValues['competency 1'];
    const competency2 = selectedValues['Competency 2'];
    const duration = selectedDuration;    // Build URL parameters for the courses page (excluding date for security)
    const params = new URLSearchParams();
    
    if (mainCategory) params.set('category', mainCategory);
    if (subCategory) params.set('subCategory', subCategory);
    if (city) params.set('city', city);
    // Date is now passed through state instead of URL
    
    // Set duration parameter directly
    if (duration) {
      params.set('duration', duration);
    }

    // Collect selected competencies into an array
    const competencies = [];
    if (competency1 && competency1 !== 'competency 1')
      competencies.push(competency1);
    if (competency2 && competency2 !== 'Competency 2')
      competencies.push(competency2);

    // Send competencies as a JSON array if any are selected
    if (competencies.length > 0) {
      params.set('competencies', JSON.stringify(competencies));
    }

    // Navigate to courses page with date passed through state
    navigate(`/courses?${params.toString()}`, {
      state: {
        selectedDate: date,
        searchSource: 'competencies'
      }
    });
  };

  return (
    <section className='container-px shadow-[0px_3px_4px_0px_#00000026] py-[58.5px] font-arial mb-1'>
      <div className='font-goldman xl:text-[32px] text-[27px] max-[490px]:text-[23px]'>
        <h3>
          Search Based On <span className='text-red'>Competencies</span>
        </h3>
      </div>      <form onSubmit={handleSearch}>        <div className="flex gap-14 pb-6 pt-8">
                    <label className="cursor-pointer flex items-center text-[#8E8988] font-bold" htmlFor="One-Week">
                      <input 
                        className="appearance-none peer" 
                        type="radio" 
                        name="duration" 
                        id="One-Week" 
                        value="one week" 
                        checked={selectedDuration === "one week"}
                        onChange={(e) => setSelectedDuration(e.target.value)}
                      />
                        <div className="w-[24px] h-[24px] rounded-full bg-[#B5AFAE] border-[3.5px] border-[#8E8988] 
                        peer-checked:bg-red peer-checked:border-[#2C3C58] mr-[10px]"></div>
                        <span className="peer-checked:text-[#2C3C58]">One Week</span>
                    </label>
                    <label className="cursor-pointer flex items-center text-[#8E8988] font-bold" htmlFor="Two-Week">
                      <input 
                        className="appearance-none peer" 
                        type="radio" 
                        name="duration" 
                        id="Two-Week" 
                        value="two weeks"
                        checked={selectedDuration === "two weeks"}
                        onChange={(e) => setSelectedDuration(e.target.value)}
                      />
                        <div className="w-[24px] h-[24px] rounded-full bg-[#B5AFAE] border-[3.5px] border-[#8E8988] 
                        peer-checked:bg-red peer-checked:border-[#2C3C58] mr-[10px]"></div>
                        <span className="peer-checked:text-[#2C3C58]">Two Weeks</span>
                    </label>
                </div>
        <div className='flex w-full max-lg:flex-col'>
          <div className='text-gray-400 grid grid-cols-5 max-md:grid-cols-4 max-sm:grid-cols-2 xl:gap-x-11 lg:gap-x-8 md:gap-x-8 gap-x-6 gap-y-6 flex-grow'>
            {[
              {
                title: 'Main Categories',
                options: mainCategories.length ? mainCategories : [''],
                cols: '2',
              },
              {
                title: 'competency 1',
                options: competencies.length ? competencies : [''],
                cols: '2 max-sm:order-3',
              },
              {
                title: 'City',
                options: cities,
                cols: '1 max-md:order-5 max-md:col-span-2 max-sm:col-span-1',
              },
              {
                title: 'Sub Categories',
                options: subCategories.length ? subCategories : [''],
                cols: '2',
              },
              {
                title: 'Competency 2',
                options: competencies.length ? competencies : [''],
                cols: '2 max-sm:order-4',
              },
              {
                title: 'Date',
                isCalendar: true,
                cols: '1 max-md:order-6 max-md:col-span-2 max-sm:col-span-1',
              },
            ].map(({ title, options, cols, isCalendar }) =>
              isCalendar ? (
                <div className={`col-span-${cols} relative`} key={title}>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    filterDate={(date) =>
                      isMonday(date) && isAfter(date, startOfToday())
                    }
                    placeholderText='Date'
                    dateFormat='yyyy-MM-dd'
                    minDate={startOfToday()}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode='select'
                    className='border-b-2 border-gray-400 pb-[2px] outline-none bg-transparent capitalize text-gray-400 cursor-pointer w-full appearance-none'
                  />
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                    <div className="inline-block border-l-[5px] border-r-[5px] border-t-[8px] border-l-transparent border-r-transparent border-gray-400"></div>
                  </span>
                </div>
              ) : (
                <select
                  name={title}
                  className={`border-b-2 border-gray-400 pb-[2px] outline-none bg-transparent col-span-${cols} capitalize ${
                    selectedValues[title] ? 'text-gray-800 border-gray-800' : ''
                  }`}
                  defaultValue={title}
                  key={title}
                  onChange={(e) => handleChange(e, title)}
                >
                  <option disabled hidden>
                    {title}
                  </option>
                  {options?.map((option) => (
                    <option className='text-gray-800' value={option} key={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )
            )}
          </div>

          <div className='lg:ml-11 max-lg:mt-9'>
            <button
              type='submit'
              className='btn-red inline-block lg:h-full flex-center h-[60px] xl:w-[180px] w-[120px]'
            >
              Search
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default SearchByCompetencies;
