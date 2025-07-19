import { useNavigate, useLocation } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const courseData = location.state?.courseData;
  const selectedCity = location.state?.selectedCity;
  const selectedDate = location.state?.selectedDate;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
        company: e.target.company.value,
        name: e.target.name.value,
        phoneNumber: e.target["phone-number"].value,
        email: e.target.email.value,
    };
    navigate('/pdf', { state: { formData, courseData, selectedCity, selectedDate } });
  };

  return (
    <section className="max-w-screen-2xl mx-auto bg-[#F2F2F2] pt-16 pb-28 font-goldman container-px">
        <div className="flex gap-5 mx-auto w-fit items-start mb-5">
            <img className="mt-5 max-w-[50px]" src="imgs/Register/Formal.svg" alt="formal-icon" />
            <h1 className="xs:max-w-[350px] max-w-[280px] max-[382px]:max-w-[250px] xs:text-[25px] text-[21px] max-[382px]:text-[18px]">Get a
                <span className="text-red xs:text-[40px] text-[32px] max-[382px]:text-[27px]"> formal letter</span> under
                <span className="xs:text-[40px] text-[32px] max-[382px]:text-[27px]"> your name</span> in
                <span className="text-yellow xs:text-[40px] text-[32px] max-[382px]:text-[27px]"> 5 Seconds</span></h1>
        </div>
        <form onSubmit={handleSubmit} className="lg:max-w-[65%] sm:max-w-[80%] w-full mx-auto flex flex-col gap-8 xs:text-[20px] max-[382px]:text-[14px]" action="">
            <input className="px-3 py-4 w-full" type="text" name="company" id="" placeholder="Your Company Name" required />
            <input className="px-3 py-4 w-full" type="text" name="name" id="" placeholder="Your Name" required />
            <input className="px-3 py-4 w-full" type="text" name="phone-number" id="" placeholder="Phone Number" required />
            <input className="px-3 py-4 w-full" type="email" name="email" id="" placeholder="email" required />
            <button className="btn-yellow !rounded-none !text-[20px] !px-12 mx-auto block mt-2" type="submit">Submit</button>
        </form>
    </section>
  )
}

export default Register