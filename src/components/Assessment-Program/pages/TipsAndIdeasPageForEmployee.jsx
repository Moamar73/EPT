import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import secondBG from '../../../assets/Assessment-Program/AR02.png';

const TipsAndIdeasPageManger = () => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const selectedEmployeeString = localStorage.getItem('selectedEmployee');
  const selectedEmployee = selectedEmployeeString
    ? JSON.parse(selectedEmployeeString)
    : null;
  useEffect(() => {
    const fetchSavedTips = async (userId) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_LINK}/api/users/tips/${
            selectedEmployee.num
          }`
        );
        if (!response.ok) return null; // if no saved tips or error
        const data = await response.json();
        return data.tips;
      } catch (error) {
        console.error('Error fetching saved tips:', error);
        return null;
      }
    };

    const fetchTipsFromFinalResults = async (userId) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_LINK}/api/sections/finalResults/${
            selectedEmployee.num
          }`
        );
        if (!response.ok) throw new Error('Failed to fetch tips');

        const data = await response.json();

        const dynamicTips = data.map(
          (tip) =>
            `✅ في قسم ${tip.section_title} - ${tip.sub_section_title}: أجبت على ${tip.correct_answers} من أصل ${tip.total_questions_answered} أسئلة بشكل صحيح.`
        );

        const staticTips = [
          '✅ احرص على مراجعة نتائج التقييمات بعناية لتحديد نقاط القوة.',
          '✅ ضع خطة تطوير شخصية تستند إلى النتائج.',
          '✅ ناقش النتائج مع مديرك للحصول على توجيهات.',
          '✅ شارك الأفكار مع زملائك لتبادل الخبرات.',
          '✅ لا تتردد في طلب التدريب أو الموارد لتطوير مهاراتك.',
        ];

        const allTips = [...dynamicTips, ...staticTips];
        return allTips;
      } catch (error) {
        console.error('Error fetching tips from final results:', error);
        return [];
      }
    };

    const saveTipsToUser = async (userId, tipsString) => {
      try {
        await fetch(
          `${import.meta.env.VITE_API_LINK}/api/users/${
            selectedEmployee.num
          }/saveTips`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tips: tipsString }),
          }
        );
      } catch (error) {
        console.error('Failed to save tips to user:', error);
      }
    };

    const loadTips = async () => {
      const storedUser = localStorage.getItem('selectedEmployee');
      if (!storedUser) {
        setLoading(false);
        return;
      }
      const user = JSON.parse(storedUser);

      let savedTipsString = await fetchSavedTips(selectedEmployee.num);

      if (savedTipsString && savedTipsString.trim() !== '') {
        // saved tips exist, split by new lines and set
        setTips(savedTipsString.split('\n'));
        setLoading(false);
      } else {
        // no saved tips, fetch fresh ones and save them
        const freshTips = await fetchTipsFromFinalResults(selectedEmployee.num);
        setTips(freshTips);
        await saveTipsToUser(selectedEmployee.num, freshTips.join('\n'));
        setLoading(false);
      }
    };

    loadTips();
  }, []);

  return (
    <div className='max-w-screen-2xl mx-auto' lang='ar' dir='rtl'>
      <Header />

      <main
        className='container-px py-6 min-h-screen bg-cover bg-right'
        style={{ backgroundImage: `url(${secondBG})` }}
      >
        <button
          className='assessment-btn !w-fit px-8 mx-auto block mb-6'
          onClick={() => navigate('/employees', { state: user })}
        >
          العودة لقائمة الموظفين
        </button>
        <section className='py-14 text-right'>
          <h1 className='text-3xl font-bold text-[#03727d] mb-10'>
            نصائح وأفكار هامة
          </h1>

          {loading ? (
            <p className='text-xl text-gray-600'>جارٍ تحميل النصائح...</p>
          ) : (
            <div className='space-y-6'>
              {tips.map((tip, index) => (
                <div
                  key={index}
                  className='bg-white shadow-md rounded-lg p-4 border-r-4 border-[#03727d]'
                >
                  <p className='text-xl text-gray-800'>{tip}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default TipsAndIdeasPageManger;
