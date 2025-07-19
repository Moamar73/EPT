import React, { useEffect, useState } from 'react';
import logoEPT from '../../assets/Assessment-Program/Logo-EPT.png';

const Header = () => {
  const [organization, setOrganization] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.organization_id) {
      fetch(
        `${import.meta.env.VITE_API_LINK}/api/organizations/${
          user.organization_id
        }`
      )
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch organization data');
          return res.json();
        })
        .then((data) => setOrganization(data))
        .catch((error) => {
          console.error('Error fetching organization:', error);
        });
    }
  }, []);

  return (
    <header className='flex justify-between items-center h-[80px] max-sm:h-header-sm container-px max-w-screen-2xl mx-auto'>
      {/* Organization logo, dynamic */}
      {organization && organization.logo_image ? (
        <img
          className='max-h-full py-1 w-36'
          src={organization.logo_image}
          alt={`${organization.title} logo`}
        />
      ) : (
        // fallback placeholder or nothing while loading
        <img className='max-h-full py-1' src={logoEPT} alt='default logo' />
      )}

      {/* First static picture */}
      <img className='max-h-full py-1' src={logoEPT} alt='logo' />
    </header>
  );
};

export default Header;
