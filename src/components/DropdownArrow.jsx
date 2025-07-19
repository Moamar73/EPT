const DropdownArrow = ({ className = "w-4 h-4", color = "currentColor", isOpen = false }) => {
  return (
    <svg 
      className={`${className} transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
      fill="none" 
      stroke={color} 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M19 9l-7 7-7-7" 
      />
    </svg>
  );
};

export default DropdownArrow;
