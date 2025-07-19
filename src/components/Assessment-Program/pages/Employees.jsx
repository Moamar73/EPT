import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '../Header';
import checkIcon from '../../../assets/Assessment-Program/check.png';

const Employees = () => {
  const location = useLocation();
  const user = location.state || {};
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_LINK}/api/users/managers/${
            user.user_id
          }/${user.organization_id}`
        );
        const data = await res.json();
        const formatted = data.map((emp, index) => {
          const selfCompleted = emp.assessment_completed === 1;
          const managerCompleted = emp.managerAssessment_completed === 1;
          const finalAvailable = selfCompleted && managerCompleted;

          return {
            id: index + 1,
            num: emp.id,
            name: `${emp.first_name} ${emp.last_name}`,
            selfAssess: {
              completed: selfCompleted,
              text: selfCompleted ? 'مكتملة ' : 'لم تكتمل بعد',
            },
            managerAssess: {
              completed: managerCompleted,
              text: managerCompleted
                ? 'مكتملة (متاحة للاطلاع)'
                : 'بالإنتظار ,انقر هنا للتكمله',
              red: false,
            },
            bottomLine: { completed: false, text: 'بالإنتظار' },
            finalAssess: {
              completed: finalAvailable,
              text: finalAvailable ? 'مكتملة ' : 'بالإنتظار',
            },
          };
        });

        setEmployees(formatted);
        localStorage.setItem('employees', JSON.stringify(formatted));
      } catch (err) {
        console.error('Error fetching employees:', err);
      }
    };

    if (user.user_id && user.organization_id) {
      fetchEmployees();
    }
  }, [user]);

  return (
    <div className='max-w-screen-2xl mx-auto' lang='ar' dir='rtl'>
      <Header />
      <main className='container-px py-6'>
        <nav className='flex justify-between items-center max-[826px]:text-[14px] max-sm:text-[12px] text-center'>
          <ul className='flex gap-7 max-[826px]:gap-2'>
            <li>
              <Link
                className='inline-block p-3 pt-1 max-sm:p-2 max-sm:pt-1'
                to='/login'
              >
                تسجيل الخروج
              </Link>
            </li>
            <li>
              <Link
                className='inline-block p-3 pt-1 max-sm:p-2 max-sm:pt-1'
                to='/quizz'
              >
                الاختبارات الذاتية
              </Link>
            </li>
            <li>
              <Link
                className='inline-block p-3 pt-1 max-sm:p-2 max-sm:pt-1 rounded-t-[9px] bg-[rgba(117,116,113,0.189)] text-[#013b41]'
                to='/employees'
              >
                تقييم الموظفين
              </Link>
            </li>
          </ul>
          <span>رقم الموظف {user.user_id}</span>
        </nav>

        <section>
          <div className='overflow-x-auto'>
            <table className='w-full border-collapse text-center whitespace-nowrap text-nowrap max-xl:text-[14px]'>
              <thead>
                <tr className='bg-[#05707f] text-white h-[55px] border border-[#ffd32c]'>
                  <th className='p-3'>م</th>
                  <th className='p-3'>رقم الموظف</th>
                  <th className='p-3'>اسم الموظف</th>
                  <th className='p-3 px-6'>حالة التقييم الذاتي</th>
                  <th className='p-3 px-6'>تقييم المدير المباشر</th>
                  <th className='p-3 px-6'>المحصلة النهائية</th>
                  <th className='p-3 px-6'>التقييم النهائي والنصائح</th>
                </tr>
              </thead>
              <tbody className='text-[#023d45]'>
                {employees.map((employee) => (
                  <tr
                    className='border border-[#ffd32c] h-[55px] even:bg-[#f2f5f5]'
                    key={employee.num}
                  >
                    <td className='p-3'>{employee.id}</td>
                    <td className='p-3'>{employee.num}</td>
                    <td className='p-3'>{employee.name}</td>

                    {/* Self Assessment */}
                    <td
                      className={`p-3 px-6 ${
                        !employee.selfAssess.completed
                          ? 'text-gray-500 italic'
                          : 'text-black'
                      }`}
                    >
                      {employee.selfAssess.completed && (
                        <img
                          className='inline-block ml-1 max-h-[25px]'
                          src={checkIcon}
                          alt='check icon'
                        />
                      )}
                      {employee.selfAssess.text}
                    </td>

                    {/* Manager Assessment */}
                    <td
                      className={`p-3 px-6 ${
                        !employee.managerAssess.completed
                          ? 'text-gray-500 italic'
                          : 'text-black'
                      }`}
                    >
                      {employee.managerAssess.completed && (
                        <img
                          className='inline-block ml-1 max-h-[25px]'
                          src={checkIcon}
                          alt='check icon'
                        />
                      )}
                      <Link
                        to='/managerEvaluation'
                        state={{
                          manager: user,
                          employee: employee,
                          evaluationType: 'manager',
                        }}
                        onClick={() =>
                          localStorage.setItem(
                            'selectedEmployee',
                            JSON.stringify(employee)
                          )
                        }
                        className='hover:underline'
                      >
                        {employee.managerAssess.text}
                      </Link>
                    </td>
                    {/* Final Assessment */}
                    <td
                      className={`p-3 px-6 ${
                        !employee.finalAssess.completed
                          ? 'text-gray-500 italic'
                          : 'text-black'
                      }`}
                    >
                      {employee.finalAssess.completed && (
                        <img
                          className='inline-block ml-1 max-h-[25px]'
                          src={checkIcon}
                          alt='check icon'
                        />
                      )}
                      {employee.finalAssess.text}
                    </td>
                    {/* Bottom Line (Tips for Employee) */}
                    <td
                      className={`p-3 px-6 ${
                        employee.bottomLine.text === 'بالإنتظار'
                          ? 'text-gray-500 italic'
                          : 'text-black'
                      }`}
                    >
                      {employee.selfAssess.completed &&
                      employee.managerAssess.completed ? (
                        <Link
                          to='/tipsForEmployee'
                          state={{
                            manager: user,
                            employee: employee,
                          }}
                          onClick={() =>
                            localStorage.setItem(
                              'selectedEmployee',
                              JSON.stringify(employee)
                            )
                          }
                          className='hover:underline text-green-700 font-semibold'
                        >
                          تم، اضغط هنا
                        </Link>
                      ) : (
                        employee.bottomLine.text
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Employees;
