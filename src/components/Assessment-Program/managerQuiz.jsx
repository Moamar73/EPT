import React, { useEffect, useState } from 'react';
import SectionsNav from '../Assessment-Program/SectionsNav';
import ManagersQuestionsSection from '../Assessment-Program/managersQuestionSections';
import LoadingResults from '../Assessment-Program/LoadingResults';
import firstBG from '../../assets/Assessment-Program/AR01.png';
import secondBG from '../../assets/Assessment-Program/AR02.png';
import ManagerLoadingResults from './ManagerLoadingResults';
import { useNavigate } from 'react-router-dom';

const ManagerForm = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [managerAsses, setManagerAsses] = useState(() => {
    const saved = localStorage.getItem('selectedEmployee');
    return saved ? JSON.parse(saved) : null;
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
    // ✅ Redirect if manager assessment is completed
    if (managerAsses?.managerAssess.completed === true) {
      navigate('/managerEvaluation/results');
    }
  }, [managerAsses, navigate]);

  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);
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

        data = data.map((item, index) =>
          typeof item === 'string' ? { id: index + 1, title: item } : item
        );

        const filteredManagerSections = data.filter(
          (s) => Number(s.for_manager_to_evaluate_employee) === 1
        );

        const normalizedSections = [
          ...filteredManagerSections,
          {
            id: filteredManagerSections.length + 1,
            title: 'نتيجة الاختبار الموظف',
          },
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

  const filteredSections = sections;

  const handleNext = (e) => {
    e?.preventDefault();
    if (currentSection < filteredSections.length - 1) {
      setCurrentSection((prev) => prev + 1);
      setProgress((prev) => Math.min(prev + progressIncrease, 100));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentSection > 0) {
      setCurrentSection((prev) => prev - 1);
      setProgress((prev) => Math.max(prev - progressIncrease, 0));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isLastQuestionSection = currentSection === filteredSections.length - 2;

  return (
    <div
      className='drop-shadow-[0px_10px_5px_rgba(117,116,113,0.39)] max-w-screen-2xl mx-auto'
      lang='ar'
      dir='rtl'
    >
      <main
        className={`container-px py-6 min-h-screen bg-cover bg-right ${
          currentSection === 1 ? 'text-white' : ''
        }`}
        style={{
          backgroundImage: `url(${currentSection === 1 ? firstBG : secondBG})`,
        }}
      >
        <div className='p-4 rounded shadow'>
          {currentSection < filteredSections.length - 1 && (
            <ManagersQuestionsSection
              submitFunction={handleNext}
              title={filteredSections[currentSection].title}
              sectionId={filteredSections[currentSection].id}
            />
          )}

          {currentSection === filteredSections.length - 1 && (
            <ManagerLoadingResults />
          )}
        </div>
      </main>
    </div>
  );
};

export default ManagerForm;
