'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { useUser } from '@/context/UserContext'
function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { setUser } = useUser();
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const handleModalClick = () => {
    setIsOpen(prev => !prev);
  }

  const handleMenuClick = () => {
    setIsMobileMenuOpen(prev => !prev);
  }


  return (
    <div className='relative'>
      <div className='relative flex gap-[1rem] justify-between h-[50px] lg:h-[60px] bg-white dark:bg-gray-800  px-[1.5rem] items-center shadow-xs '>
        <div className='flex justify-center items-center w-[24px] h-[24px] md:hidden cursor-pointer' onClick={handleMenuClick}>
          <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="MenuIcon"><path d="M3 18h18v-2H3zm0-5h18v-2H3zm0-7v2h18V6z"></path></svg>
        </div>
        {
          isMobileMenuOpen && (
            <div className='fixed top-0 mt-[4rem] left-0 w-[220px] h-[100vh] p-[20px] bg-white dark:bg-gray-800 rounded-md '>
              <div className='flex-1 flex justify-end' >
                <svg onClick={handleMenuClick} focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="CloseIcon" width={"1rem"} height={"1rem"} ><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>
              </div>
              <div className='flex flex-col gap-[1rem] mt-[2rem]'>
                <div className='flex  gap-[.8rem] text-xs text-gray-600 dark:text-gray-300  font-semibold hover:text-gray-900 dark:hover:text-white'>
                  <svg className='text-blue-500  ' width={"1rem"} height={"1rem"} stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"></path></svg>
                  Jobs
                </div>
                <div className='flex  gap-[.8rem] text-xs text-gray-600 dark:text-gray-300  font-semibold hover:text-gray-900 dark:hover:text-white'>
                  <svg className='text-blue-500  ' width={"1rem"} height={"1rem"} stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0011 15.9V19H7v2h10v-2h-4v-3.1a5.01 5.01 0 003.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm7 6c-1.65 0-3-1.35-3-3V5h6v6c0 1.65-1.35 3-3 3zm7-6c0 1.3-.84 2.4-2 2.82V7h2v1z"></path></svg>
                  Hackathons
                </div>
                <div className='flex  gap-[.8rem] text-xs text-gray-600 dark:text-gray-300  font-semibold hover:text-gray-900 dark:hover:text-white'>
                  <svg className='text-blue-500  ' width={"1rem"} height={"1rem"} focusable="false" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" data-testid="DashboardCustomizeOutlinedIcon"><path d="M3 11h8V3H3zm2-6h4v4H5zm8-2v8h8V3zm6 6h-4V5h4zM3 21h8v-8H3zm2-6h4v4H5zm13-2h-2v3h-3v2h3v3h2v-3h3v-2h-3z"></path></svg>
                  Projects
                </div>
                <div className='flex  gap-[.8rem] text-xs text-gray-600 dark:text-gray-300  font-semibold hover:text-gray-900 dark:hover:text-white'>
                  <svg className='text-blue-500 ' width={"1rem"} height={"1rem"} focusable="false" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" data-testid="FactCheckOutlinedIcon"><g fill-rule="evenodd"><path d="M20 3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 16H4V5h16z"></path><path d="M19.41 10.42 17.99 9l-3.17 3.17-1.41-1.42L12 12.16 14.82 15zM5 7h5v2H5zm0 4h5v2H5zm0 4h5v2H5z"></path></g></svg>
                  Tasks
                </div>
                <div className
                  ='flex  gap-[.8rem] text-xs text-gray-600 dark:text-gray-300  font-semibold hover:text-gray-900 dark:hover:text-white'>
                  <svg className='text-blue-500  ' width={"1rem"} height={"1rem"} stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M14.763.075A.5.5 0 0 1 15 .5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V14h-1v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V10a.5.5 0 0 1 .342-.474L6 7.64V4.5a.5.5 0 0 1 .276-.447l8-4a.5.5 0 0 1 .487.022ZM6 8.694 1 10.36V15h5V8.694ZM7 15h2v-1.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5V15h2V1.309l-7 3.5V15Z"></path><path d="M2 11h1v1H2v-1Zm2 0h1v1H4v-1Zm-2 2h1v1H2v-1Zm2 0h1v1H4v-1Zm4-4h1v1H8V9Zm2 0h1v1h-1V9Zm-2 2h1v1H8v-1Zm2 0h1v1h-1v-1Zm2-2h1v1h-1V9Zm0 2h1v1h-1v-1ZM8 7h1v1H8V7Zm2 0h1v1h-1V7Zm2 0h1v1h-1V7ZM8 5h1v1H8V5Zm2 0h1v1h-1V5Zm2 0h1v1h-1V5Zm0-2h1v1h-1V3Z"></path></svg>
                  Organization
                </div>


              </div>
            </div>)
        }
        <div className='flex items-center gap-2 mr-auto md:mr-0 '>
          <div>
            {
              theme === 'dark' ? (
                <Image src={'/assets/images/gidy_dark.png'} alt='Gidy' width={100} height={30} />
              ) : (
                <Image src={'/assets/images/gidy_light.png'} alt='Gidy' width={100} height={30} />
              )
            }
          </div>

        </div>
        <div className=' flex-1 justify-center items-center gap-[22px] lg:justify-start lg:ml-[4rem] hidden md:flex'>
          <a href="#" className='text-xs text-gray-600 dark:text-gray-300  hover:text-gray-900 dark:hover:text-white'>Jobs</a>
          <a href="#" className='text-xs text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'>Hackathons</a>
          <a href="#" className='text-xs text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'>Projects</a>
          <a href="#" className='text-xs text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'>Tasks</a>
          <a href="#" className='text-xs text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'>Organization</a>
        </div>
        <div className='relative flex items-center gap-[8px]'>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className='flex justify-center items-center w-[30px] h-[30px] rounded-full hover:bg-gray-100 dark:hover:bg-gray-700'>
            {mounted && theme === 'dark' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-yellow-400">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
          <div className=' flex justify-center items-center w-[30px] h-[30px] rounded-full bg-blue-400 text-white'>K</div>
          <button ref={buttonRef} onClick={handleModalClick} className='flex justify-center items-center pb-[4px] dark:text-gray-300'>
            <svg className='dark:text-gray-300'  width="24" height="24" viewBox="0 0 24 24 ">
              <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
            </svg>

          </button>
          {isOpen && (<div ref={modalRef} className='absolute top-[40px] mt-[1rem] right-0 bg-white dark:bg-gray-800 shadow-lg rounded-md  z-100'>
            <div className='flex justify-between items-center gap-[8px] px-[12px] py-[8px] border-b border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'>
              Profile
              <svg className='text-blue-600' stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height=".8rem" width=".8rem" xmlns="http://www.w3.org/2000/svg"><path d="M406.5 399.6C387.4 352.9 341.5 320 288 320H224c-53.5 0-99.4 32.9-118.5 79.6C69.9 362.2 48 311.7 48 256C48 141.1 141.1 48 256 48s208 93.1 208 208c0 55.7-21.9 106.2-57.5 143.6zm-40.1 32.7C334.4 452.4 296.6 464 256 464s-78.4-11.6-110.5-31.7c7.3-36.7 39.7-64.3 78.5-64.3h64c38.8 0 71.2 27.6 78.5 64.3zM256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-272a40 40 0 1 1 0-80 40 40 0 1 1 0 80zm-88-40a88 88 0 1 0 176 0 88 88 0 1 0 -176 0z"></path></svg>
            </div>
            <div className='flex justify-between items-center gap-[8px] px-[12px] py-[8px] border-b border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white cursor-pointer'
              onClick={() => { setUser(null); window.location.href = '/signin'; }}
            >
              Logout
              <svg className='text-red-600' focusable="false" fill='currentColor' aria-hidden="true" viewBox="0 0 24 24" height=".8rem" width=".8rem" data-testid="LogoutOutlinedIcon"><path d="m17 8-1.41 1.41L17.17 11H9v2h8.17l-1.58 1.58L17 16l4-4zM5 5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h7v-2H5z"></path></svg>
            </div>
            <div className='flex justify-between items-center gap-[8px] px-[12px] py-[8px] border-b border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'>
              Feedback
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height=".8rem" width=".8rem" xmlns="http://www.w3.org/2000/svg"><path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"></path><path d="M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"></path></svg>
            </div>
          </div>)}
        </div>
      </div>

    </div>
  )
}

export default Navbar