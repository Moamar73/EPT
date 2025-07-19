import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import secondBG from '../../../assets/Assessment-Program/AR02.png';
import Header from '../Header';
import SectionsNav from '../SectionsNav';
import BasicAreaChartTailwind from '../ChartsSrc/Components/Charts/ApexCharts/BasicAreaChartTailwind';
import PieChartTailwind from '../ChartsSrc/Components/Charts/ApexCharts/PieChartTailwind';
import BarChartTailwind from '../ChartsSrc/Components/Charts/ApexCharts/BarChartTailwind';
import BarChart2Tailwind from '../ChartsSrc/Components/Charts/GoogleCharts/BarChart2Tailwind';
import AchievementGaugeTailwind from '../ChartsSrc/Components/Charts/ApexCharts/AchievementGaugeTailwind';
import HalfDonutChartTailwind from '../ChartsSrc/Components/Charts/ChartsJs/HalfDonutChartTailwind';
import { resultsSections } from '../quizzData';

const ManagerResultsForEmployee = () => {
  const [currentSection, setCurrent] = useState(2);
  const [progress, setProgress] = useState(8);
  const [subsectionResults, setSubsectionResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const navigate = useNavigate();
  useEffect(() => {
    if (!user?.user_id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    fetch(
      `${import.meta.env.VITE_API_LINK}/api/sections/${
        user.user_id
      }/manager/subsection-results`
    )
      .then((res) => res.json())
      .then((data) => {
        setSubsectionResults(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching results:', err);
        setIsLoading(false);
      });
  }, [user?.user_id]); // Changed dependency to just user_id

  const groupBySection = (data) => {
    const grouped = {};
    data.forEach((item) => {
      const section = item.section_title;
      if (!grouped[section]) grouped[section] = [];
      grouped[section].push(item);
    });
    return grouped;
  };

  const toGaugeProps = (item) => {
    const correct = Number(item.correct_answers);
    const total = Number(item.total_questions_answered);
    const percent = total > 0 ? (correct / total) * 100 : 0;

    return {
      title: item.sub_section_title,
      percent,
      points: `${correct}/${total}`,
      desc: '', // Optional description
      color: percent >= 70 ? '#4caf50' : '#f44336',
    };
  };

  const categorizedResults = groupBySection(subsectionResults);

  const handleSubmit = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setProgress((prev) => prev + 30);
    setCurrent((prev) => prev + 1);
  };

  // Compute average % per section for overall charts
  const getSectionAverages = () => {
    const sectionSums = {};
    const sectionCounts = {};

    subsectionResults.forEach((item) => {
      const section = item.section_title;
      const correct = Number(item.correct_answers);
      const total = Number(item.total_questions_answered);
      const percent = total > 0 ? (correct / total) * 100 : 0;

      if (!sectionSums[section]) {
        sectionSums[section] = 0;
        sectionCounts[section] = 0;
      }

      sectionSums[section] += percent;
      sectionCounts[section] += 1;
    });

    const averages = Object.keys(sectionSums).map((section) => ({
      section,
      average: Number(
        (sectionSums[section] / sectionCounts[section]).toFixed(2)
      ),
    }));

    return averages;
  };

  const reorderSections = (sections) => {
    const targetTitle = 'نتيجة تقييم المدير';
    const filtered = sections.filter((s) => s !== targetTitle);

    const indexToInsert = 1; // second place
    filtered.splice(indexToInsert, 0, targetTitle);

    return filtered;
  };

  const orderedSections = reorderSections(resultsSections);
  const sectionAverages =
    subsectionResults.length > 0 ? getSectionAverages() : [];

  // Loading component
  const LoadingSpinner = () => (
    <div className='flex items-center justify-center py-20'>
      <div className='flex flex-col items-center gap-4'>
        <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-[#03727d]'></div>
        <p className='text-[#03727d] text-lg font-semibold'>جاري تحميل النتائج...</p>
      </div>
    </div>
  );

  return (
    <div className='max-w-screen-2xl mx-auto' lang='ar' dir='rtl'>
      <Header />

      <main
        className='container-px py-6 min-h-screen bg-cover bg-right'
        style={{ backgroundImage: `url(${secondBG})` }}
      >
        <SectionsNav
          currentSection={2}
          user={user}
          progress={progress}
          sections={resultsSections}
        />

        <section className='py-14'>
          <div className='flex items-start gap-4 font-bold text-[29px] max-sm:text-[24px] max-xs:text-[20px]'>
            <h1>نتائج تقييم الموظف </h1>
          </div>          <div className='py-14 flex flex-col gap-5'>
            {isLoading ? (
              <LoadingSpinner />
            ) : subsectionResults.length === 0 ? (
              <p className='text-center text-gray-500 mt-10 text-lg'>
                لا توجد نتائج بعد
              </p>
            ) : (
              <>
                {/* Overall Charts */}
                <div className='grid lg:grid-cols-5 grid-cols-1 gap-4'>
                  <div className='lg:col-span-2 col-span-1'>
                    <PieChartTailwind averages={sectionAverages} />
                  </div>
                  <div className='lg:col-span-3 col-span-1'>
                    <BarChart2Tailwind averages={sectionAverages} />
                  </div>
                </div>

                {Object.entries(categorizedResults).map(
                  ([sectionTitle, sectionData], idx) => {
                    const donutLabels = sectionData.map(
                      (item) => item.sub_section_title
                    );
                    const donutValues = sectionData.map(
                      (item) => item.total_questions_answered
                    );
                    const areaChartSeries = [
                      {
                        name: `${sectionTitle} (%)`,
                        data: sectionData.map((item) => {
                          const correct = Number(item.correct_answers);
                          const total = Number(item.total_questions_answered);
                          return total > 0
                            ? Math.round((correct / total) * 100)
                            : 0;
                        }),
                      },
                    ];

                    const areaChartOptions = {
                      chart: {
                        id: `${sectionTitle}-area`,
                        toolbar: { show: false },
                      },
                      xaxis: {
                        categories: sectionData.map(
                          (item) => item.sub_section_title
                        ),
                        labels: {
                          style: {
                            fontSize: '14px',
                            colors: '#1e0101',
                          },
                        },
                      },
                      yaxis: {
                        max: 100,
                        min: 0,
                        labels: {
                          style: {
                            fontSize: '14px',
                            colors: '#1e0101',
                          },
                          formatter: (val) => `${val}%`,
                        },
                      },
                      dataLabels: {
                        enabled: true,
                        formatter: (val) => `${val}%`,
                      },
                      colors: ['#03727d'],
                      stroke: {
                        curve: 'smooth',
                        width: 2,
                      },
                      fill: {
                        type: 'gradient',
                        gradient: {
                          shadeIntensity: 1,
                          opacityFrom: 0.7,
                          opacityTo: 0.3,
                          stops: [0, 100],
                        },
                      },
                      title: {
                        text: `نسب النجاح في ${sectionTitle}`,
                        align: 'center',
                        style: {
                          fontSize: '16px',
                          color: '#03727d',
                          fontWeight: 'bold',
                        },
                      },
                    };

                    return (
                      <div
                        key={idx}
                        className='flex flex-col gap-5 p-6 bg-[#eff1f1] rounded-xl drop-shadow-[0px_10px_5px_rgba(117,116,113,0.39)]'
                      >
                        <h2 className='font-semibold mb-6 text-[#03727d] xs:text-[24px] text-[19px]'>
                          نتائج تقييم وحدات {sectionTitle}
                        </h2>

                        <div className='grid lg:grid-cols-6 md:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-[10px]'>
                          {sectionData.map((item, i) => (
                            <AchievementGaugeTailwind
                              {...toGaugeProps(item)}
                              key={i}
                            />
                          ))}
                        </div>

                        <div className='grid lg:grid-cols-9 grid-cols-1 gap-3'>
                          <div className='lg:col-span-4 col-span-1'>
                            <HalfDonutChartTailwind
                              chartData={donutValues}
                              chartLabels={donutLabels}
                            />
                          </div>
                          <div className='lg:col-span-5 col-span-1'>
                            <BasicAreaChartTailwind
                              chartSeries={areaChartSeries}
                              chartOptions={areaChartOptions}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}

                {/* Total Competency Summary */}
                <div className='mt-6'>
                  <BarChartTailwind sectionAverages={sectionAverages} />
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ManagerResultsForEmployee;
