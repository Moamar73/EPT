import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';

const ManagersQuestionsSection = ({ submitFunction }) => {
  const [questionsBySubSection, setQuestionsBySubSection] = useState({});
  const [subSections, setSubSections] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const location = useLocation();
  const { manager, employee, evaluationType } = location.state || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [questionsRes, choicesRes, subSectionsRes, sectionsRes] =
          await Promise.all([
            axios.get(`${import.meta.env.VITE_API_LINK}/api/questions`),
            axios.get(`${import.meta.env.VITE_API_LINK}/api/choices`),
            axios.get(`${import.meta.env.VITE_API_LINK}/api/sub-sections`),
            axios.get(`${import.meta.env.VITE_API_LINK}/api/sections`),
          ]);

        const allQuestions = questionsRes.data;
        const allChoices = choicesRes.data;
        const allSubSections = subSectionsRes.data;
        const allSections = sectionsRes.data;

        const managerSection = allSections.find(
          (section) =>
            section.for_manager_to_evaluate_employee === 1 &&
            section.ismanager === 1
        );

        if (!managerSection) {
          console.warn('No matching section found.');
          setSubSections([]);
          return;
        }

        const filteredSubSections = allSubSections.filter(
          (sub) => sub.section_id === managerSection.id
        );

        const filteredQuestions = allQuestions.filter((q) =>
          filteredSubSections.some((sub) => sub.id === q.sub_section_id)
        );

        const questionsWithAnswers = filteredQuestions.map((q) => ({
          ...q,
          answers: allChoices.filter((c) => c.question_id === q.id),
        }));

        const grouped = questionsWithAnswers.reduce((acc, question) => {
          const key = question.sub_section_id;
          if (!acc[key]) acc[key] = [];
          acc[key].push(question);
          return acc;
        }, {});

        setQuestionsBySubSection(grouped);
        setSubSections(filteredSubSections);

        // Initialize default answers to first choice
        const initialAnswers = {};
        questionsWithAnswers.forEach((q) => {
          if (q.answers.length > 0) {
            initialAnswers[q.id] = q.answers[0].id;
          }
        });
        setUserAnswers({});
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [evaluationType]);

  useEffect(() => {
    console.log('userAnswers:', userAnswers);
  }, [userAnswers]);

  useGSAP(() => {
    const fields = gsap.utils.toArray('.question-field');

    gsap.fromTo(
      '#title',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, delay: 0.5, ease: 'power3.out' }
    );

    gsap.fromTo(
      fields,
      { y: 70, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: 1.2,
        stagger: 0.3,
        ease: 'power3.out',
      }
    );
  }, [questionsBySubSection]);

  const saveAnswers = async () => {
    if (!manager || !employee || !evaluationType) {
      console.error('Missing manager, employee, or evaluationType');
      return;
    }

    // Validate all questions answered
    const allQuestions = Object.values(questionsBySubSection).flat();
    const unanswered = allQuestions.filter((q) => !userAnswers[q.id]);
    if (unanswered.length > 0) {
      alert('Please answer all questions before submitting.');
      return;
    }

    try {
      const sendPromises = Object.entries(userAnswers).map(
        ([questionId, choiceId]) =>
          fetch(`${import.meta.env.VITE_API_LINK}/api/answers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: manager.user_id,
              question_id: Number(questionId),
              choice_id: choiceId,
              target_user_id: employee.num,
            }),
          }).then(async (res) => {
            if (!res.ok) {
              const errText = await res.text();
              throw new Error(`Error ${res.status}: ${errText}`);
            }
            return res.json();
          })
      );

      const results = await Promise.all(sendPromises);
      await axios.put(
        `${import.meta.env.VITE_API_LINK}/api/users/${employee.num}`,
        {
          managerAssessment_completed: 1,
        }
      );
      return true;
    } catch (error) {
      console.error('Error saving answers:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const saved = await saveAnswers();
    if (!saved) return;

    // After saving answers, update managerassessment_completed for employee.num
    try {
      await axios.put(
        `${import.meta.env.VITE_API_LINK}/api/users/${employee.num}`,
        {
          managerassessment_completed: 1,
        }
      );
    } catch (error) {
      console.error('Error updating managerassessment_completed:', error);
    }

    if (submitFunction) {
      submitFunction(e);
    }
  };

  return (
    <section className='py-14'>
      <div>
        <div className='flex items-center gap-4 font-bold text-[29px] max-sm:text-[24px]'>
          <picture>
            <img
              className='max-h-[50px] max-sm:max-h-[40px]'
              src='src/assets/Assessment-Program/AR02-icon.png'
              alt='assessment-icon'
            />
          </picture>
          <span>استبيانات التقييم</span>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-14 mt-8'>
          {subSections.map((subSection) => {
            const questions = questionsBySubSection[subSection.id] || [];

            return (
              <div key={subSection.id}>
                <h2 id='title' className='mt-8 mb-6 text-3xl font-semibold'>
                  {subSection.title}
                </h2>

                {questions.length > 0 ? (
                  questions.map((q) => (
                    <fieldset
                      className='question-field opacity-0 transition-opacity duration-300'
                      key={`Q${q.id}`}
                    >
                      <legend className='mb-5 font-medium text-lg'>
                        {q.text}
                      </legend>
                      <div
                        className='p-5 bg-[#ecf4f5] border border-[#f5f5f6] rounded-[18px] md:pl-[10%]'
                        role='group'
                        aria-labelledby={`legend-${q.id}`}
                      >
                        {q.answers.map((answer) => (
                          <label
                            className='flex items-center gap-3 mb-3 cursor-pointer text-base'
                            htmlFor={`A-${q.id}-${answer.id}`}
                            key={`A-${q.id}-${answer.id}`}
                          >
                            <input
                              className='w-4 h-4 accent-[#024954] ring-2 ring-white checked:ring-[#024954] focus:ring-offset-2 transition duration-150'
                              type='radio'
                              id={`A-${q.id}-${answer.id}`}
                              name={`Q${q.id}`}
                              value={answer.id}
                              checked={userAnswers[q.id] === answer.id}
                              onChange={() =>
                                setUserAnswers((prev) => ({
                                  ...prev,
                                  [q.id]: answer.id,
                                }))
                              }
                            />
                            <span>{answer.text}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  ))
                ) : (
                  <p className='text-gray-500'>
                    لا توجد أسئلة في هذا القسم الفرعي.
                  </p>
                )}
              </div>
            );
          })}

          <div className='flex flex-col gap-4 mt-10'>
            <button
              className='assessment-btn !w-fit px-4 mr-auto'
              type='button'
              onClick={saveAnswers}
            >
              الحفظ والعودة لاحقا
            </button>
            <button
              className='assessment-btn !w-fit px-16 max-xs:px-8 mx-auto'
              type='submit'
            >
              الارسال والانتقال للمرحلة التالية
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ManagersQuestionsSection;
