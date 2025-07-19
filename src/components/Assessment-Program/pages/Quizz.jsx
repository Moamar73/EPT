import React, { useEffect, useState } from 'react';
import SectionsNav from '../SectionsNav';
import BasicInfoSection from '../BasicInfoSection';
import QuestionsSection from '../QuestionsSection';
import LoadingResults from '../LoadingResults';
import firstBG from '../../../assets/Assessment-Program/AR01.png';
import secondBG from '../../../assets/Assessment-Program/AR02.png';
import { useNavigate } from 'react-router-dom';

const Quizz = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'user') {
        const updatedUser = event.newValue ? JSON.parse(event.newValue) : null;
        setUser(updatedUser);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    if (user?.assessment_completed === 1) {
      navigate('/results');
    }
  }, [user, navigate]);

  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState(1);
  const [progress, setProgress] = useState(8);

  const progressIncrease = user && user.isAdmin ? 22 : 30;

  useEffect(() => {
    async function fetchSections() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_LINK}/api/sections`
        );
        if (!res.ok) throw new Error('Failed to fetch sections');

        let data = await res.json();

        // Normalize section format (handle string vs object)
        data = data.map((item, index) =>
          typeof item === 'string' ? { id: index + 1, title: item } : item
        );

        // Add fixed start and end sections
        const normalizedSections = [
          { id: 0, title: 'المعلومات الأساسية' },
          ...data,
          { id: data.length + 1, title: 'نتيجة الاختبار الذاتي' },
        ];

        setSections(normalizedSections);
      } catch (err) {
        console.error(err);

        setSections([
          { id: 0, title: 'المعلومات الأساسية' },
          { id: 1, title: 'قسم تجريبي 1' },
          { id: 2, title: 'قسم تجريبي 2' },
          { id: 3, title: 'نتيجة الاختبار الذاتي' },
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchSections();
  }, []);

  if (loading) return <div>جاري التحميل...</div>;

  // Correct filtering logic to exclude unwanted sections
  const filteredSections = sections.filter((section) => {
    // Defensive fallback to 0 if undefined
    const forManagerEval = Number(
      section.for_manager_to_evaluate_employee || 0
    );
    const isManagerSection = Number(section.ismanager || 0);

    // Exclude sections meant only for managers to evaluate employees
    if (forManagerEval === 1) return false;

    // Show manager-only sections only if user has manager role (role_id 3 or 4)
    if (isManagerSection === 1) {
      return user && (Number(user.role_id) === 3 || Number(user.role_id) === 4);
    }

    // Otherwise show section
    return true;
  });

  const handleNext = (e) => {
    e?.preventDefault();
    if (currentSection < filteredSections.length) {
      setCurrentSection((prev) => prev + 1);
      setProgress((prev) => Math.min(prev + progressIncrease, 100));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentSection > 1) {
      setCurrentSection((prev) => prev - 1);
      setProgress((prev) => Math.max(prev - progressIncrease, 0));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div
      className='drop-shadow-[0px_10px_5px_rgba(117,116,113,0.39)] max-w-screen-2xl mx-auto'
      lang='ar'
      dir='rtl'
    >
      <SectionsNav
        currentSection={currentSection}
        user={user}
        progress={progress}
        sections={filteredSections}
      />

      <main
        className={`container-px py-6 min-h-screen bg-cover bg-right ${
          currentSection === 1 ? 'text-white' : ''
        }`}
        style={{
          backgroundImage: `url(${currentSection === 1 ? firstBG : secondBG})`,
        }}
      >
        <div className='p-4 rounded shadow'>
          {currentSection === 1 && (
            <BasicInfoSection submitFunction={handleNext} user={user} />
          )}

          {currentSection > 1 && currentSection < filteredSections.length && (
            <QuestionsSection
              submitFunction={handleNext}
              title={filteredSections[currentSection - 1].title}
              sectionId={filteredSections[currentSection - 1].id}
            />
          )}

          {currentSection === filteredSections.length && <LoadingResults />}
        </div>

        <div className='flex justify-between mt-6'>
          <button
            onClick={handlePrev}
            disabled={currentSection === 1}
            className='px-4 py-2 bg-gray-300 rounded disabled:opacity-50'
          >
            السابق
          </button>

          <button
            onClick={handleNext}
            disabled={currentSection === filteredSections.length}
            className='px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50'
          >
            التالي
          </button>
        </div>
      </main>
    </div>
  );
};

export default Quizz;
