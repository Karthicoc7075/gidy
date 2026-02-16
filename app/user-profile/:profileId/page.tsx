'use client'
import React, { useState, useRef, useEffect } from 'react'
import { useUser } from '@/context/UserContext'
import EducationForm from '@/components/modal/educationModal'
import SkillsModal from '@/components/modal/skillsModal'
import ExperienceModal from '@/components/modal/expericenceModal'
import CertificateModal from '@/components/modal/certificateModal'
import CareerModal from '@/components/modal/careerModal'
import BioModal from '@/components/modal/bioModal'
import SocialModal from '@/components/modal/socialModal'
import axios from 'axios'
import ActionMenu from '@/components/ActionMenu'
import DeleteModal from '@/components/modal/deleteModal'
import SocialEditModal from '@/components/modal/socialEditModal'
import moment from 'moment'
import { useParams } from 'next/navigation';


export default function UserProfile() {
    const { user, setUser } = useUser();
    const params = useParams();
  
    const profileId = params?.profileId as string;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [activeModal, setActiveModal] = useState<string | null>(null);
  
    const menuModalRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [loading, setLoading] = useState(false);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [deleteItem, setDeleteItem] = useState<{ type: string, name: string, id: string } | null>(null);
    const [updateId, setUpdateId] = useState<string | undefined>(undefined);


    const progressData = [
        { task: "Complete Your Bio ✍️", desc: "Tell us about yourself in a few words!", process: 20, show: user?.bio ? true : false, modalName: 'bio' },
        { task: "Add Your Education 🎓", desc: "Highlight your academic achievements and qualifications!", process: 16, show: user?.education && user?.education.length > 0 ? true : false, modalName: 'education' },
        { task: "Add Your Skills 🎯", desc: "Show what you're best at! More skills make your profile stronger.", process: 16, show: user?.skills && user?.skills.length > 0 ? true : false, modalName: 'skills' },
        { task: "Upload Your Certificates 📜", desc: "Boost your profile with relevant certifications and training.", process: 16, show: user?.certifications && user?.certifications.length > 0 ? true : false, modalName: 'certificate' },
        { task: "Add Your Experience 💼", desc: "Showcase your work history and professional background.", process: 16, show: user?.experiences && user?.experiences.length > 0 ? true : false, modalName: 'experience' },
        { task: "Upload Your Resume 📄", desc: "A strong resume increases your chances. Upload now!", process: 16, show: user?.resumeUrl ? true : false, modalName: 'bio' },
    ]

    const process = progressData.reduce((acc, item) => item.show ? acc + item.process : acc, 0);







    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                menuModalRef.current &&
                !menuModalRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsMenuOpen(false);
            }
        }

        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const generateBio = async () => {
        setLoading(true);

        const res = await axios.post('/api/ai/generate-bio', {
        }, {
            headers: {
                Authorization: `Bearer ${user?.token}`
            }
        });


        setUser({ ...user, bio: res.data } as any);

        setLoading(false);
    };


    const handleDelete = async (deleteItem: { type: string, name: string, id: string }) => {
        if (!deleteItem) return;
        try {
            await axios.delete(`/api/profile/${deleteItem.type.toLowerCase()}/${deleteItem.id}`, {
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });
            if (deleteItem.type === 'Experience') {
                setUser({ ...user, experiences: user?.experiences?.filter(exp => exp._id !== deleteItem.id) } as any);
            } else if (deleteItem.type === 'Education') {
                setUser({ ...user, education: user?.education?.filter(edu => edu._id !== deleteItem.id) } as any);
            } else if (deleteItem.type === 'Certification') {
                setUser({ ...user, certifications: user?.certifications?.filter(cer => cer._id !== deleteItem.id) } as any);
            }
            setDeleteItem(null);

        } catch (error) {
            console.error("Error deleting item:", error);
        }
    }

    return (
        <div className='flex justify-center items-center'>




            <div className='max-w-[1200px] w-full p-[15px]'>
                <div className='bg-white dark:bg-gray-800 dark:text-gray-200 mt-[10px] pt-[25px] pr-[15px] pb-[15px] pl-[25px] rounded-xl  shadow-[0px_8px_24px_rgba(0,0,0,0.1)]  ' >

                    <div className='flex' >
                        <div className='border border-dashed border-gray-300 rounded-full p-[2px] '>
                            <img className='w-[50px] h-[50px] rounded-full' src={user?.profilePictureUrl || "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"} alt="" />
                        </div>
                        <div className='flex flex-1 justify-between items-center gap-[15px] py-[8px] px-[12px] pr-0  '>
                            <div className='flex items-center gap-[8px]'>
                                <h2 className='text-lg font-semibold'>{user?.firstName} {user?.lastName}</h2>
                                <p className='text-xs font-semibold '>( {user?.descriptionType} )</p>
                            </div>
                            <div className='relative flex items-center' >
                                <div className='flex gap-2  ml-2'>
                                    {user?.socialLinks?.github && <a href={user?.socialLinks?.github} target="_blank" rel="noopener noreferrer">
                                        <svg className='text-gray-700' width={'1.8rem'} height={'1.8rem'} focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="GitHubIcon" ><path d="M12 1.27a11 11 0 00-3.48 21.46c.55.09.73-.28.73-.55v-1.84c-3.03.64-3.67-1.46-3.67-1.46-.55-1.29-1.28-1.65-1.28-1.65-.92-.65.1-.65.1-.65 1.1 0 1.73 1.1 1.73 1.1.92 1.65 2.57 1.2 3.21.92a2 2 0 01.64-1.47c-2.47-.27-5.04-1.19-5.04-5.5 0-1.1.46-2.1 1.2-2.84a3.76 3.76 0 010-2.93s.91-.28 3.11 1.1c1.8-.49 3.7-.49 5.5 0 2.1-1.38 3.02-1.1 3.02-1.1a3.76 3.76 0 010 2.93c.83.74 1.2 1.74 1.2 2.94 0 4.21-2.57 5.13-5.04 5.4.45.37.82.92.82 2.02v3.03c0 .27.1.64.73.55A11 11 0 0012 1.27"></path></svg>
                                    </a>}
                                    {user?.socialLinks?.instagram && <a href={user?.socialLinks?.instagram} target="_blank" rel="noopener noreferrer">
                                        <svg className='text-gray-700' width={'1.8rem'} height={'1.8rem'} focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="InstagramIcon"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path></svg>
                                    </a>}

                                    {user?.socialLinks?.linkedin && <a href={user?.socialLinks?.linkedin} target="_blank" rel="noopener noreferrer">
                                        <svg className='text-gray-700' width={'1.8rem'} height={'1.8rem'} focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="LinkedInIcon"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"></path></svg>
                                    </a>}


                                </div>

                                <button ref={buttonRef} onClick={() => setIsMenuOpen(!isMenuOpen)} className='p-[4px] rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 '  >
                                    <svg className='text-gray-400' stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.6rem" width="1.6rem" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg>
                                </button>
                                {isMenuOpen && (<div ref={menuModalRef} className='absolute  top-[30px] p-[2px] mt-[1rem] right:0 md:-right-24 bg-white shadow-lg rounded-md border-2  border-gray-200 w-[124px] dark:bg-gray-800 dark:border-gray-700  dark:text-gray-200 z-10'>
                                    <div onClick={() => setActiveModal('bio')} className='flex  items-center gap-[4px] px-[10px] py-[8px] rounded-md  text-xs text-gray-600  hover:bg-blue-50 cursor-pointer dark:text-gray-300 dark:hover:bg-gray-700 '>

                                        <svg  className='text-blue-600 dark:text-gray-200' stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 640 512" height="1rem" width="1rem" xmlns="http://www.w3.org/2000/svg"><path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h274.9c-2.4-6.8-3.4-14-2.6-21.3l6.8-60.9 1.2-11.1 7.9-7.9 77.3-77.3c-24.5-27.7-60-45.5-99.9-45.5zm45.3 145.3l-6.8 61c-1.1 10.2 7.5 18.8 17.6 17.6l60.9-6.8 137.9-137.9-71.7-71.7-137.9 137.8zM633 268.9L595.1 231c-9.3-9.3-24.5-9.3-33.8 0l-37.8 37.8-4.1 4.1 71.8 71.7 41.8-41.8c9.3-9.4 9.3-24.5 0-33.9z"></path></svg>
                                        Profile
                                    </div>
                                    <div className='flex  items-center gap-[4px] px-[10px] py-[8px] text-xs text-gray-600 hover:bg-blue-50 cursor-pointer dark:text-gray-300 dark:hover:bg-gray-700'>
                                        <svg className='text-blue-600 dark:text-gray-200' stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1rem" width="1rem" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M13 4v4c-6.575 1.028 -9.02 6.788 -10 12c-.037 .206 5.384 -5.962 10 -6v4l8 -7l-8 -7z"></path></svg>
                                        Share Profile
                                    </div>
                                    <div className='flex items-center gap-[4px] px-[10px] py-[8px]  text-xs text-gray-600 hover:bg-blue-50 dark:text-gray-300 cursor-pointer' onClick={() => setActiveModal('social')}>
                                        <svg className='text-blue-600 dark:text-gray-200' stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="1rem" width="1rem" xmlns="http://www.w3.org/2000/svg"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path></svg>
                                        Add Social
                                    </div>
                                    <div className='flex items-center gap-[4px] px-[10px] py-[8px]  text-xs text-gray-600 hover:bg-blue-50 dark:text-gray-300 cursor-pointer' onClick={() => setActiveModal('social-edit')}>
                                        <svg className='text-blue-600 dark:text-gray-200' stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1rem" width="1rem" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.486 2 2 5.589 2 10c0 2.908 1.898 5.515 5 6.934V22l5.34-4.005C17.697 17.852 22 14.32 22 10c0-4.411-4.486-8-10-8zm0 14h-.333L9 18v-2.417l-.641-.247C5.67 14.301 4 12.256 4 10c0-3.309 3.589-6 8-6s8 2.691 8 6-3.589 6-8 6z"></path><path d="M8.503 11.589v1.398h1.398l3.87-3.864-1.399-1.398zm5.927-3.125-1.398-1.398 1.067-1.067 1.398 1.398z"></path></svg>
                                        Edit Social
                                    </div>
                                    <div className='flex items-center gap-[4px] px-[10px] py-[8px] text-xs text-gray-600 hover:bg-blue-50  dark:text-gray-300 cursor-pointer' onClick={() => setActiveModal('career')}>
                                        <svg className='text-blue-600 dark:text-gray-200'stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1rem" width="1rem" xmlns="http://www.w3.org/2000/svg"><path d="M439 32v165h18V32h-18zm-18 12.99L327.6 80l93.4 35V44.99zM165.9 103c-5 0-10.2 2.3-15.3 7-6.2 5.8-11.5 15.1-13.8 26.3-2.3 11.3-1 22 2.5 29.7 3.5 7.8 8.6 12.3 14.6 13.5 6 1.3 12.4-.9 18.7-6.6 6.1-5.8 11.5-15.1 13.8-26.4 2.2-11.3.9-22-2.5-29.7-3.5-7.8-8.6-12.2-14.6-13.5-1.1-.2-2.3-.3-3.4-.3zm-38.4 78.5c-3.4 1.2-6.9 2.5-10.7 4.1-24.85 15.7-42.2 31.2-59.84 55.7-11.19 15.5-11.74 42-12.58 61.5l20.8 9.2c.87-27.8.36-39.3 13.27-55.3 9.83-12.2 19.33-25 37.55-28.9 1.6 28.9-2.6 73.7-14 119.6 20.5 2.8 37.6-.7 57-6.3 50.7-25.3 74.1-3.8 109.3 45.7l20.5-32.1c-24.6-28.9-48.5-75.1-117.2-57.3 5-27.3 5.6-45.4 8.6-72.6.6-12 .8-23.9 1.1-35.7-8.9 6.8-19.9 10.4-31 8.1-9.5-2-17.3-7.9-22.8-15.7zm144.2 7.3c-18.2 17.8-22.2 31-50.2 38.4l-22.5-24c-.4 12.8-.8 25.9-1.9 39.2 9.5 8.7 19.2 15.7 22.7 14.6 31.3-9.4 40.3-20.3 61.4-41.9l-9.5-26.3zM409 215v96h-96v96h-96v78.1c102.3.2 167.8 1.1 270 1.8V215h-78zM140.7 363.9c-13.6 2.5-27.8 3.3-43.44.9-10.89 37.5-26.76 74.3-48.51 102.5l38.63 15.3c27.02-37.9 36.82-70.6 53.32-118.7z"></path></svg>
                                        Career Vision
                                    </div>
                                    <div className='flex items-center gap-[4px] px-[10px] py-[8px]  text-xs text-gray-600 hover:bg-blue-50  dark:text-gray-300 cursor-pointer' >
                                        <svg className='text-blue-600 dark:text-gray-200' stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1rem" width="1rem" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M262.29 192.31a64 64 0 1057.4 57.4 64.13 64.13 0 00-57.4-57.4zM416.39 256a154.34 154.34 0 01-1.53 20.79l45.21 35.46a10.81 10.81 0 012.45 13.75l-42.77 74a10.81 10.81 0 01-13.14 4.59l-44.9-18.08a16.11 16.11 0 00-15.17 1.75A164.48 164.48 0 01325 400.8a15.94 15.94 0 00-8.82 12.14l-6.73 47.89a11.08 11.08 0 01-10.68 9.17h-85.54a11.11 11.11 0 01-10.69-8.87l-6.72-47.82a16.07 16.07 0 00-9-12.22 155.3 155.3 0 01-21.46-12.57 16 16 0 00-15.11-1.71l-44.89 18.07a10.81 10.81 0 01-13.14-4.58l-42.77-74a10.8 10.8 0 012.45-13.75l38.21-30a16.05 16.05 0 006-14.08c-.36-4.17-.58-8.33-.58-12.5s.21-8.27.58-12.35a16 16 0 00-6.07-13.94l-38.19-30A10.81 10.81 0 0149.48 186l42.77-74a10.81 10.81 0 0113.14-4.59l44.9 18.08a16.11 16.11 0 0015.17-1.75A164.48 164.48 0 01187 111.2a15.94 15.94 0 008.82-12.14l6.73-47.89A11.08 11.08 0 01213.23 42h85.54a11.11 11.11 0 0110.69 8.87l6.72 47.82a16.07 16.07 0 009 12.22 155.3 155.3 0 0121.46 12.57 16 16 0 0015.11 1.71l44.89-18.07a10.81 10.81 0 0113.14 4.58l42.77 74a10.8 10.8 0 01-2.45 13.75l-38.21 30a16.05 16.05 0 00-6.05 14.08c.33 4.14.55 8.3.55 12.47z"></path></svg> Settings
                                    </div>
                                </div>)}
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className='mb-4'>
                            <p className='text-sm  my-[15px]'>{user?.bio}</p>
                            <button onClick={generateBio} className='px-[12px] py-[6px] bg-blue-400 text-white text-sm rounded-md hover:bg-blue-700 '>
                                {loading ? "Generating..." : user?.bio ? "Regenerate Bio" : "Generate Bio"}
                            </button>
                        </div>
                        <div className='flex flex-col sm:flex-row justify-between items-start  gap-[15px] '>

                            <div className='flex gap-2 text-blue-600 dark:text-blue-400 text-sm  items-center'>
                                <svg  stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.4rem" width="1.4rem" xmlns="http://www.w3.org/2000/svg"><g id="Mail"><path d="M19.435,4.065H4.565a2.5,2.5,0,0,0-2.5,2.5v10.87a2.5,2.5,0,0,0,2.5,2.5h14.87a2.5,2.5,0,0,0,2.5-2.5V6.565A2.5,2.5,0,0,0,19.435,4.065Zm-14.87,1h14.87a1.489,1.489,0,0,1,1.49,1.39c-2.47,1.32-4.95,2.63-7.43,3.95a6.172,6.172,0,0,1-1.06.53,2.083,2.083,0,0,1-1.67-.39c-1.42-.75-2.84-1.51-4.25-2.26-1.14-.6-2.3-1.21-3.44-1.82A1.491,1.491,0,0,1,4.565,5.065Zm16.37,12.37a1.5,1.5,0,0,1-1.5,1.5H4.565a1.5,1.5,0,0,1-1.5-1.5V7.6c2.36,1.24,4.71,2.5,7.07,3.75a5.622,5.622,0,0,0,1.35.6,2.872,2.872,0,0,0,2-.41c1.45-.76,2.89-1.53,4.34-2.29,1.04-.56,2.07-1.1,3.11-1.65Z"></path></g></svg>

                                {user?.email}
                            </div>

                            <div className='flex flex-col w-[100%] md:w-[260px] gap-2  '>
                                <div className='flex justify-between  dark:bg-gray-700 px-[1rem] py-[6px] border border-gray-200 rounded-md gap-[1rem] bg-[#FBFCFD]'>
                                    <img src="https://d2d0jobwzy0nc3.cloudfront.net/leagues/league-mhabbrl1lralz2?v=1770968830092" className='w-[50px] h-[50px] object-cover' />
                                    <div className='flex flex-col  gap-4' >
                                        <p className='text-xs text-gray-400'>League</p>
                                        <h6 className='text-sm text-gray-700 dark:text-gray-200 font-semibold text-center'>{user?.league || "Bronze"}</h6>
                                    </div>
                                    <div className='flex flex-col  gap-4 ' >
                                        <p className='text-xs text-gray-400'>Rank</p>
                                        <h6 className='text-sm text-gray-700 dark:text-gray-200 font-semibold text-center'>{user?.rank || 0}</h6>
                                    </div>
                                    <div className='flex flex-col  gap-4' >
                                        <p className='text-xs text-gray-400'>Points</p>
                                        <h6 className='text-sm text-gray-700 dark:text-gray-200 font-semibold text-center'>{user?.points || 0}</h6>
                                    </div>
                                </div>
                                <div className='flex items-center justify-end pt-4 px-1 '>
                                    <h4 className='text-sm text-yellow-400'>View My Rewards  </h4>
                                    <svg className="text-yellow-400" width={"1.4rem"} height={"1.4rem"} fill='currentColor' focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="KeyboardArrowRightIcon"><path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z"></path></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex justify-between gap-4  items-center flex-wrap bg-white dark:bg-gray-800 dark:text-gray-200 mt-[10px] pt-[25px] pr-[15px] pb-[15px] pl-[25px] rounded-xl  shadow-[0px_8px_24px_rgba(0,0,0,0.1)]  ' >
                    {user?.careerVision ? (
                        <div className='flex flex-col gap-4 w-full '>
                            <div className='flex justify-between items-center w-full'>
                                <div className='flex flex-col gap-2'>
                                    <h6 className='text-sm text-gray-400'> You're Career Vison</h6>
                                    <h2 className='text-xl font-semibold' >{user?.careerVision.longTermAspiration}</h2>
                                </div>
                                <div className='flex justify-center items-center bg-gray-100 dark:bg-gray-600 rounded-full w-[38px] h-[38px] '>
                                    <h2>✨</h2>
                                </div>
                            </div>
                            <span className='h-[1px] w-full bg-gray-100 '></span>

                            <div className='flex flex-col md:flex-row gap-4 md:gap-0 justify-between  w-[80%]'>
                                <div className='flex flex-col gap-1 md:gap-2'>
                                    <h6 className='text-sm text-gray-400'>What you’re growing into right now</h6>
                                    <h2 className='text-md font-semibold text-gray-700 dark:text-gray-200'>{user?.careerVision.currentGoal}</h2>
                                </div>
                                <div className='flex flex-col gap-1 md:gap-2 '>
                                    <h6 className='text-xs text-gray-400'>he space you want to grow in</h6>
                                    <h2 className='text-md font-semibold text-gray-700 dark:text-gray-200'>{user?.careerVision.aspirationalField}</h2>
                                </div>
                                <div className='flex flex-col gap-1 md:gap-2 '>
                                    <h6 className='text-xs text-gray-400'>Inspired by</h6>
                                    <h2 className='text-md font-semibold text-gray-700 dark:text-gray-200'>{user?.careerVision.inspiration}</h2>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className='flex flex-col md:flex-row justify-between items-center w-full '>
                            <div className='max-w-[420px]'>
                                <h3 className='text-lg font-semibold '>Tell us where you want to go</h3>
                                <p className='text-sm text-gray-400'>Add your career goals and what inspires you. This helps us tailor recommendations, learning paths, and opportunities just for you.</p>
                            </div>
                            <button onClick={() => { setUpdateId(undefined); setActiveModal('career') }} className='bg-black text-white rounded-lg px-4 py-2 h-[40px] dark:bg-gray-700 dark:hover:bg-gray-600 ' >✨ Add your career goals</button>
                        </div>
                    )}
                </div>

                <div className=' grid grid-cols-[100%] md:grid-cols-[49%_50%] lg:grid-cols-[34%_65%] gap-2 mt-[12px] justify-between items-start '>
                    <div className='flex flex-col gap-2 '>
                        <div className='flex flex-col justify-between  bg-white dark:bg-gray-800 dark:text-gray-200 pt-[20px] pr-[15px] pb-[15px] pl-[20px] rounded-xl  shadow-[0px_8px_24px_rgba(0,0,0,0.1)]  ' >
                            <div className='flex flex-col'>
                                <h5 className='text-sm font-semibold '>🎓 Level Up Profile</h5>
                                <p className='text-xs '>Just a few clicks away from awesomeness, complete your profile!</p>
                            </div>
                            <div className='flex w-full flex-col gap-2 mt-[10px]'>
                                <h5 className='text-sm font-semibold '>Progress: {process}%</h5>
                                <div className='w-full h-[10px] rounded-full bg-gray-300 '>
                                    <div style={{ width: `${process}%` }} className={`  h-full rounded-full bg-green-600 `}></div>
                                </div>
                            </div>
                            <div className='flex flex-col w-full gap-2 mt-[15px]    ' >
                                {
                                    progressData.map((item, index) => (
                                        !item.show && (
                                            <div className='flex justify-between p-[15px]  bg-[#F6F7F9] rounded-md  w-full items-center dark:bg-gray-700 dark:text-gray-200 ' key={index}>
                                                <div className='flex flex-col'>
                                                    <h6 className='text-xs font-semibold'>{item.task}  <span className='text-green-400'> (+{item.process}%)</span></h6>
                                                    <p className='text-xs'>{item.desc}</p>
                                                </div>
                                                <button onClick={() => { setUpdateId(undefined); setActiveModal(item.modalName) }} className='' > <svg className='text-blue-400' height="1.6rem" width="1.6rem" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-miterlimit="10" stroke-width="32" d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 176v160m80-80H176"></path></svg></button>
                                            </div>
                                        )
                                    ))
                                }

                            </div>
                        </div>
                        <div className='flex  flex-col gap-4  bg-white dark:bg-gray-800 dark:text-gray-200  pt-[20px] pr-[20px] pb-[15px] pl-[15px] rounded-xl  shadow-[0px_8px_24px_rgba(0,0,0,0.1)]  ' >
                            <div className='flex flex-1 justify-between '>
                                <h3 className='text-sm font-semibold '>Skills</h3>
                                <button onClick={() => { setUpdateId(undefined); setActiveModal('skills') }} className='' > <svg className='text-gray-400' height="1.6rem" width="1.6rem" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-miterlimit="10" stroke-width="32" d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 176v160m80-80H176"></path></svg></button>

                            </div>
                            {user?.skills && user.skills.length > 0 ? (
                                <div className='flex flex-wrap gap-2'>
                                    {user.skills.map((skill, index) => (
                                        <div key={index} className='bg-blue-50 dark:bg-gray-700 border border-blue-200 dark:border-gray-600 text-xs px-3 py-1 rounded-full'>{skill}</div>
                                    ))
                                    }
                                </div>
                            ) : (
                                <p className='text-xs text-center'>✍️ Add Your Skills!</p>
                            )}
                        </div>
                    </div>
                    <div className='flex flex-col gap-2   '>
                        <div className='flex  flex-col gap-4  bg-white dark:bg-gray-800 dark:text-gray-200  pt-[20px] pr-[20px] pb-[15px] pl-[15px] rounded-xl  shadow-[0px_8px_24px_rgba(0,0,0,0.1)]  ' >
                            <div className='flex flex-1 justify-between '>
                                <h3 className='text-sm font-semibold '>Experience</h3>
                                <button onClick={() => { setUpdateId(undefined); setActiveModal('experience') }} className='' > <svg className='text-gray-400' height="1.6rem" width="1.6rem" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-miterlimit="10" stroke-width="32" d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 176v160m80-80H176"></path></svg></button>

                            </div>
                            {
                                user?.experiences && user.experiences.length > 0 ? (
                                    user.experiences.map((experience, index) => (
                                        <div className='flex justify-between items-center w-full '>
                                            <div className='flex gap-2 py-[6px]  items-center'>
                                                <div className='h-[69px] w-[60px] border border-blue-300 dark:border-gray-600  bg-blue-50 dark:bg-gray-700 rounded-md flex  items-center justify-center gap-4'>
                                                    <svg className='text-blue-400 dark:text-blue-300' stroke="currentColor" fill="none" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true" height="1.6rem" width="1.6rem" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"></path></svg>
                                                </div>
                                                <div className='flex flex-col '>

                                                    <h5 className='text-sm font-semibold capitalize '>{experience?.companyName}</h5>
                                                    <h6 className='text-sm font-medium'>{experience?.role}, {experience?.location}</h6>
                                                    <p className='text-xs'>Started: {moment(experience?.dateOfJoining).format("MMM YYYY")} - {experience?.dateOfLeaving ? moment(experience?.dateOfLeaving).format("MMM YYYY") : "Present"}</p>
                                                </div>
                                            </div>
                                            <div className='relative'>
                                                <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === `exp-${index}` ? null : `exp-${index}`); }} className='p-[4px] rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 '  >
                                                    <svg className='text-gray-400' stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.6rem" width="1.6rem" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg>
                                                </button>
                                                {openMenuId === `exp-${index}` && (
                                                    <ActionMenu
                                                        onEdit={() => { setActiveModal('experience'); setUpdateId(experience._id); setOpenMenuId(null); }}
                                                        onDelete={() => { setDeleteItem({ type: 'Experience', name: `${experience.role} experience`, id: experience._id }); setActiveModal('delete'); setOpenMenuId(null); }}
                                                        onClose={() => setOpenMenuId(null)}
                                                        title={'experience'}

                                                    />
                                                )}
                                            </div>

                                        </div>
                                    ))) : (
                                    <p className='text-xs texuuuytgf. ghj t-center'>✍️ Add Your Experiences!</p>
                                )

                            }
                        </div>
                        <div className='flex  flex-col gap-4  bg-white dark:bg-gray-800 dark:text-gray-200  pt-[20px] pr-[20px] pb-[15px] pl-[15px] rounded-xl  shadow-[0px_8px_24px_rgba(0,0,0,0.1)]  ' >
                            <div className='flex flex-1 justify-between '>
                                <h3 className='text-sm font-semibold '>Education</h3>
                                <button onClick={() => { setUpdateId(undefined); setActiveModal('education') }} className='' > <svg className='text-gray-400' height="1.6rem" width="1.6rem" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-miterlimit="10" stroke-width="32" d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 176v160m80-80H176"></path></svg></button>

                            </div>
                            {
                                user?.education && user.education.length > 0 ? (
                                    user.education.map((education, index) => (
                                        <div className='flex justify-between items-center w-full '>
                                            <div className='flex gap-2 py-[6px]  items-center'>
                                                <div className='h-[69px] w-[60px] border border-gray-300  bg-gray-50 dark:bg-gray-700 rounded-md flex  items-center justify-center gap-4'>
                                                    <svg className='text-gray-400' stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1.6rem" width="1.6rem" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M22 9l-10 -4l-10 4l10 4l10 -4v6"></path><path d="M6 10.6v5.4a6 3 0 0 0 12 0v-5.4"></path></svg>
                                                </div>
                                                <div className='flex flex-col '>
                                                    <h5 className='text-sm font-semibold'>{education?.college}</h5>
                                                    <h6 className='text-sm font-medium'>{education?.degree}, {education?.fieldOfStudy}</h6>
                                                    <p className='text-xs'>Started: {moment(education?.dateOfJoining).format("MMM YYYY")} - Ended: {education?.dateOfCompletion ? moment(education?.dateOfCompletion).format("MMM YYYY") : "Present"}</p>
                                                </div>
                                            </div>
                                            <div className='relative'>
                                                <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === `edu-${index}` ? null : `edu-${index}`); }} className='p-[4px] rounded-full hover:bg-gray-100 dark:hover:bg-gray-700  '  >
                                                    <svg className='text-gray-400' stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.6rem" width="1.6rem" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg>
                                                </button>
                                                {openMenuId === `edu-${index}` && (
                                                    <ActionMenu
                                                        onEdit={() => { setActiveModal('education'); setUpdateId(education._id); setOpenMenuId(null); }}
                                                        onDelete={() => { setDeleteItem({ type: 'Education', name: education.degree, id: education._id }); setActiveModal('delete'); setOpenMenuId(null); }}
                                                        onClose={() => setOpenMenuId(null)}
                                                        title='eduction'
                                                    />
                                                )}    </div>


                                        </div>
                                    ))) : (
                                    <p className='text-xs text-center'>🎓 Add Your Education!</p>
                                )
                            }
                        </div>
                        <div className='flex  flex-col gap-4  bg-white dark:bg-gray-800 dark:text-gray-200  pt-[20px] pr-[20px] pb-[15px] pl-[15px] rounded-xl  shadow-[0px_8px_24px_rgba(0,0,0,0.1)]  ' >
                            <div className='flex flex-1 justify-between '>
                                <h3 className='text-sm font-semibold '>Certifications</h3>
                                <button onClick={() => { setUpdateId(undefined); setActiveModal('certificate') }} className='' > <svg className='text-gray-400' height="1.6rem" width="1.6rem" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-miterlimit="10" stroke-width="32" d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 176v160m80-80H176"></path></svg></button>

                            </div>
                            {user?.certifications && user?.certifications.length > 0 ? (
                                user?.certifications.map((certification, index) => (
                                    <div className='flex justify-between items-center w-full '>
                                        <div className='flex gap-2 py-[6px]  items-start'>
                                            <div className='h-[69px] w-[60px] border border-blue-300  bg-gray-50 dark:bg-gray-700 rounded-md flex  items-center justify-center gap-4'>
                                                <svg className='text-blue-400' stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 256 256" height="1.6rem" width="1.6rem" xmlns="http://www.w3.org/2000/svg"><path d="M246,128a54,54,0,1,0-92,38.32V224a6,6,0,0,0,8.68,5.37L192,214.71l29.32,14.66A6,6,0,0,0,224,230a5.93,5.93,0,0,0,3.15-.9A6,6,0,0,0,230,224V166.32A53.83,53.83,0,0,0,246,128Zm-96,0a42,42,0,1,1,42,42A42,42,0,0,1,150,128Zm68,86.29-23.32-11.66a6,6,0,0,0-5.36,0L166,214.29v-39a53.87,53.87,0,0,0,52,0ZM134,192a6,6,0,0,1-6,6H40a14,14,0,0,1-14-14V56A14,14,0,0,1,40,42H216a14,14,0,0,1,14,14,6,6,0,0,1-12,0,2,2,0,0,0-2-2H40a2,2,0,0,0-2,2V184a2,2,0,0,0,2,2h88A6,6,0,0,1,134,192Zm-16-56a6,6,0,0,1-6,6H72a6,6,0,0,1,0-12h40A6,6,0,0,1,118,136Zm0-32a6,6,0,0,1-6,6H72a6,6,0,0,1,0-12h40A6,6,0,0,1,118,104Z"></path></svg>

                                            </div>
                                            <div className='flex flex-col'>
                                                <h5 className='text-sm font-semibold'>{certification?.certification}</h5>
                                                <p className='text-[12px] font-medium' >{certification?.provider}</p>
                                                <p className='text-[10px]'>{certification?.description}</p>
                                                <p className='text-xs'>ID NO: {certification?.certificateId} <a href={certification?.certificateUrl} className='text-blue-500'>Certificate Link</a></p>

                                                <p className='text-xs'>Provided on: {moment(certification?.issueDate).format("MMM YYYY")} | Vaild till: {certification?.expiryDate ? moment(certification?.expiryDate).format("MMM YYYY") : "Present"}</p>
                                            </div>
                                        </div>
                                        <div className='relative'>
                                            <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === `cer-${index}` ? null : `cer-${index}`); }} className='p-[4px] rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 '  >
                                                <svg className='text-gray-400' stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.6rem" width="1.6rem" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg>
                                            </button>
                                            {openMenuId === `cer-${index}` && (
                                                <ActionMenu
                                                    onEdit={() => { setActiveModal('certificate'); setUpdateId(certification._id); setOpenMenuId(null); }}
                                                    onDelete={() => { setDeleteItem({ type: 'Certification', name: certification.certification, id: certification._id }); setActiveModal('delete'); setOpenMenuId(null); }}
                                                    onClose={() => setOpenMenuId(null)}
                                                    title='certification'
                                                />
                                            )}
                                        </div>
                                    </div>
                                ))) : (
                                <p className='text-xs text-center'>📜 Add Your Certifications!</p>
                            )
                            }
                        </div>
                    </div>
                </div>

                {
                    activeModal === 'education' && (
                        <EducationForm onClose={() => setActiveModal(null)} updateId={updateId} />

                    )
                }
                {
                    activeModal === 'skills' && (
                        <SkillsModal onClose={() => setActiveModal(null)} />

                    )
                }
                {
                    activeModal === 'experience' && (
                        <ExperienceModal onClose={() => setActiveModal(null)} updateId={updateId} />

                    )
                }
                {
                    activeModal === 'certificate' && (
                        <CertificateModal onClose={() => setActiveModal(null)} updateId={updateId} />

                    )
                }
                {
                    activeModal === 'career' && (
                        <CareerModal onClose={() => setActiveModal(null)} />

                    )
                }
                {
                    activeModal === 'bio' && (
                        <BioModal onClose={() => setActiveModal(null)} />

                    )
                }
                {
                    activeModal === 'social' && (
                        <SocialModal onClose={() => setActiveModal(null)} />
                    )
                }
                {
                    activeModal === 'delete' && deleteItem && (
                        <DeleteModal
                            item={deleteItem}
                            onDelete={() => { handleDelete(deleteItem) }}
                            onClose={() => setActiveModal(null)}
                        />
                    )
                }

                {
                    activeModal === 'social-edit' && (
                        <SocialEditModal onClose={() => setActiveModal(null)} />
                    )
                }
            </div >
        </div >
    )
}
