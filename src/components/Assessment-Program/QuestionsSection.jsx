import React, { useEffect, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';
import AchievementGaugeTailwind from '../Assessment-Program/ChartsSrc/Components/Charts/ApexCharts/AchievementGaugeTailwind';

const QuestionsSection = ({ sectionId, submitFunction }) => {
  const [questionsBySubSection, setQuestionsBySubSection] = useState({});
  const [subSections, setSubSections] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [totalScore, setTotalScore] = useState(null); // New state to hold total score
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [qRes, cRes, sRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_LINK}/api/questions`),
          axios.get(`${import.meta.env.VITE_API_LINK}/api/choices`),
          axios.get(`${import.meta.env.VITE_API_LINK}/api/sub-sections`),
        ]);

        const allQuestions = qRes.data;
        const allChoices = cRes.data;
        const allSubSections = sRes.data;

        const filteredSubSections = allSubSections.filter(
          (sub) => sub.section_id === sectionId
        );

        const filteredQuestions = allQuestions.filter((q) =>
          filteredSubSections.some((sub) => sub.id === q.sub_section_id)
        );

        const questionsWithAnswers = filteredQuestions.map((q) => ({
          ...q,
          answers: allChoices
            .filter((c) => c.question_id === q.id)
            .map((c) => ({
              id: c.id,
              text: c.text,
              is_correct: c.is_correct,
            })),
        }));

        const grouped = questionsWithAnswers.reduce((acc, question) => {
          const key = question.sub_section_id;
          if (!acc[key]) acc[key] = [];
          acc[key].push(question);
          return acc;
        }, {});

        setQuestionsBySubSection(grouped);
        setSubSections(filteredSubSections);
      } catch (err) {
        console.error('Error fetching questions/choices/subsections:', err);
      }
    };

    fetchData();
  }, [sectionId]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const targetUserId = 0;

    try {
      // 1. Save the answers
      const sendPromises = Object.entries(userAnswers).map(
        ([questionId, choiceId]) => {
          return fetch(`${import.meta.env.VITE_API_LINK}/api/answers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: user.user_id,
              question_id: Number(questionId),
              choice_id: choiceId,
              target_user_id: targetUserId,
            }),
          }).then((res) => {
            if (!res.ok)
              throw new Error(
                `Failed to save answer for question ${questionId}`
              );
            return res.json();
          });
        }
      );

      await Promise.all(sendPromises);

      // 2. Update assessment_completed = 1
      await axios.put(
        `${import.meta.env.VITE_API_LINK}/api/users/${user.user_id}`,
        {
          assessment_completed: 1,
        }
      );
    } catch (error) {
      console.error('Error saving answers or updating user:', error);
    }

    // 3. Proceed to next section
    if (submitFunction) {
      submitFunction(e);
    }
  };

  return (
    <section className='py-14'>
      <div>
        {/* Section Header */}
        <div className='flex items-center gap-4 font-bold text-[29px] max-sm:text-[24px]'>
          <picture>
            <source
              srcSet='optimized-imgs/Assessment-Program/AR02-icon.webp'
              type='image/webp'
            />
            <img
              className='max-h-[50px] max-sm:max-h-[40px]'
              src='imgs/Assessment-Program/AR02-icon.png'
              alt='assessment-icon'
            />
          </picture>
          <span>استبيانات التقييم</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='flex flex-col gap-14 mt-8'>
          {subSections.map((subSection) => {
            const questions = questionsBySubSection[subSection.id] || [];

            return (
              <div key={subSection.id}>
                <h2 id='title' className='mb-6 text-3xl font-semibold'>
                  {subSection.title}
                </h2>

                {questions.map((q) => (
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
                            required
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
                ))}
              </div>
            );
          })}

          {/* Buttons */}
          <div className='flex flex-col gap-4 mt-10'>
            <button
              className='assessment-btn !w-fit px-4 mr-auto'
              type='button'
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

export default QuestionsSection;
