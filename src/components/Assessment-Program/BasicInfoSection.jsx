import { useEffect, useState } from 'react';
import Header from './Header';

const BasicInfoSection = ({ user, submitFunction }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  useEffect(() => {
    const checkIfRegistered = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_LINK}/api/user_info/${user.user_id}`
        );
        if (res.ok) {
          const data = await res.json();
          if (data && Object.keys(data).length > 0) {
            setAlreadyRegistered(true);
          }
        }
      } catch (error) {
        console.error('Error checking registration:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkIfRegistered();
  }, [user.user_id, submitFunction]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {
      user_id: user.user_id,
      full_name: formData.get('full_name'),
      email: formData.get('email'),
      mobile_number: formData.get('mobile_number'),
      current_position: formData.get('current_position'),
      years_in_same_position: parseInt(formData.get('years_in_same_position')),
      years_in_organization: parseInt(formData.get('years_in_organization')),
      previous_position: formData.get('previous_position'),
      studying_same_as_work: formData.get('studying_same_as_work') === 'true',
    };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_LINK}/api/user_info`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error('Submission failed');
      const data = await res.json();
      submitFunction();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  if (isLoading) {
    return (
      <p className='text-center py-10 text-lg'>جاري التحقق من البيانات...</p>
    );
  }

  if (alreadyRegistered) {
    return (
      <div className='text-center py-10 text-lg text-green-600 font-bold'>
        لقد قمت بالتسجيل مسبقاً، سيتم نقلك إلى الخطوة التالية.
      </div>
    );
  }

  return (
    <>
      <Header user={user} />
      <section className='py-10'>
        <div className='text-[24px] max-md:text-[20px] max-xs:text-[16px] max-w-[80%] max-md:max-w-[90%] max-xs:max-w-full relative'>
          <p className='mb-4'>
            سيقيم هذا الاستطلاع استشاريون في مجال التخصص ويساعدنا في دعم تطورك
            وتنمية مهاراتك
          </p>
          <p className='mb-1'>
            الرجاء الإجابة على الأسئلة بكل صدق وأمانة وبأفضل ما تستطيع
          </p>
          <span>شكرا لك</span>
          <span className='absolute bottom-0 translate-y-1/2 right-1/4 font-arabic-deco'>
            الفريق العلمي
          </span>
        </div>

        <div className='flex max-md:flex-col lg:gap-5 gap-3 lg:container-px items-stretch'>
          <div className='flex-center flex-1 font-bold text-[45px] max-md:text-[35px] md:pb-20 min-h-[225px]'>
            <h1>البيانات الشخصية</h1>
          </div>

          <form
            onSubmit={handleSubmit}
            className='flex-1 text-[18px] flex flex-col gap-2'
          >
            <input
              className='bg-[#024954] border border-[#f5f5f6] placeholder:text-[#e3d9d9] text-[#e3d9d9] w-full leading-none h-[45px] p-4'
              type='text'
              name='full_name'
              placeholder='الاسم'
              required
            />
            <input
              className='bg-[#024954] border border-[#f5f5f6] placeholder:text-[#e3d9d9] text-[#e3d9d9] w-full leading-none h-[45px] p-4'
              type='text'
              name='mobile_number'
              placeholder='رقم الموبايل'
              required
            />
            <input
              className='bg-[#024954] border border-[#f5f5f6] placeholder:text-[#e3d9d9] text-[#e3d9d9] w-full leading-none h-[45px] p-4'
              type='email'
              name='email'
              placeholder='الإيميل'
              required
            />
            <input
              className='bg-[#024954] border border-[#f5f5f6] placeholder:text-[#e3d9d9] text-[#e3d9d9] w-full leading-none h-[45px] p-4'
              type='text'
              name='current_position'
              placeholder='المنصب الحالي'
              required
            />
            <input
              className='bg-[#024954] border border-[#f5f5f6] placeholder:text-[#e3d9d9] text-[#e3d9d9] w-full leading-none h-[45px] p-4'
              type='number'
              name='years_in_same_position'
              placeholder='عدد السنوات في هذا المنصب'
              required
            />
            <input
              className='bg-[#024954] border border-[#f5f5f6] placeholder:text-[#e3d9d9] text-[#e3d9d9] w-full leading-none h-[45px] p-4'
              type='number'
              name='years_in_organization'
              placeholder='عدد السنوات في نفس الهيئة'
              required
            />
            <input
              className='bg-[#024954] border border-[#f5f5f6] placeholder:text-[#e3d9d9] text-[#e3d9d9] w-full leading-none h-[45px] p-4'
              type='text'
              name='previous_position'
              placeholder='المنصب السابق'
              required
            />
            <select
              className='bg-[#024954] border border-[#f5f5f6] text-[#e3d9d9] px-4 appearance-none w-full h-[45px]'
              name='studying_same_as_work'
              required
              defaultValue=''
            >
              <option value='' disabled hidden>
                هل دراستك في نفس تخصص عملك؟
              </option>
              <option value='true'>نعم</option>
              <option value='false'>لا</option>
            </select>

            <button className='assessment-btn mt-9' type='submit'>
              التالي
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default BasicInfoSection;
