'use client'
import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import Modal from '@/components/modal';
import axios from 'axios';
import { set } from 'mongoose';


type BioModalProps = {
    onClose: () => void;
};

export default function BioModal({ onClose }: BioModalProps) {
    const { user, setUser } = useUser();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [location, setLocation] = useState('');
    const [bio, setBio] = useState('');
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [resume, setResume] = useState<File | null>(null);
    const [error, setError] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            setFirstName(user.firstName || '');
            setLastName(user.lastName || '');
            setEmail(user.email || '');
            setLocation(user.location || '');
            setBio(user.bio || '');
            setImagePreview(user.profilePictureUrl || null);
        }
    }
        , [user]);

    const updateProfile = async () => {
        setError({});

        if (!firstName || !lastName) {
            setError({
                firstName: !firstName ? 'First name is required' : '',
                lastName: !lastName ? 'Last name is required' : '',
            });
            return;
        }
        setLoading(true);
        const formData = new FormData();
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('location', location);
        formData.append('bio', bio);
        if (profilePicture) formData.append('image', profilePicture);
        if (resume) formData.append('file', resume);

        try {
            const response = await axios.patch('/api/profile/main', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user?.token}`,
                },
            });
            setUser({ ...user, ...response.data.user });
            setLoading(false);
            onClose();
        }
        catch (error) {
            console.error('Error updating profile:', error);
            setError({ general: 'Failed to update profile. Please try again.' });
            setLoading(false);
        }
    }


    const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setResume(e.target.files[0]);
        }
    };

    const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setProfilePicture(e.target.files[0]);
        }
    }
console.log('Current user data in BioModal:', profilePicture);
    return (
        <Modal isOpen={true} onClose={onClose} >
            <div className='px-2'>
                <div className='flex flex-col items-center justify-center  '>
                    <div className='relative '>
                        <input type='file' accept='image/*' onChange={handleProfilePictureUpload} className='absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10' />
                        <img src={
    imagePreview || 
    (profilePicture instanceof File ? URL.createObjectURL(profilePicture) : profilePicture) || 
    'https://d2d0jobwzy0nc3.cloudfront.net/static/UserProfile_MaleIcon'
  }  alt='Profile' className='w-[100px] h-[100px] rounded-full border border-blue-400' />
                        <div className='w-[20px] h-[20px] rounded-full bg-blue-400 flex items-center justify-center absolute bottom-[8px] right-[8px]' >
                            <svg className='text-white' width={'10px'} height={'10px'} fill='currentColor' focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="EditIcon" ><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z"></path></svg>
                        </div>
                    </div>
                    <div className='flex flex-col gap-2 mt-[6px] w-[300px]'>
                        <label className='text-xs font-semibold text-gray-500 dark:text-gray-400'>First Name*</label>
                        <input type='text' className={`border border-gray-300 rounded-md p-[8.5px_14px] h-[35px] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${error.firstName ? 'border-red-500 ring-red-500' : ''}`} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                    <div className='flex flex-col gap-2 mt-[6px] w-[300px]'>
                        <label className='text-xs font-semibold text-gray-500 dark:text-gray-400'>Last Name*</label>
                        <input type='text' className={`border border-gray-300 rounded-md p-[8.5px_14px] h-[35px] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${error.lastName ? 'border-red-500 ring-red-500' : ''}`} value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>
                    <div className='flex flex-col gap-2 mt-[6px] w-[300px]'>
                        <label className='text-xs font-semibold text-gray-500 dark:text-gray-400'>Email ID*</label>
                        <input type='text' className={`border border-gray-200 rounded-md p-[8.5px_14px] h-[35px] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${error.email ? 'border-red-500 ring-red-500' : ''}`} value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className='flex flex-col gap-2 mt-[6px] w-[300px]'>
                        <label className='text-xs font-semibold text-gray-500 dark:text-gray-400'>Location</label>
                        <input type='text' className='border border-gray-300 rounded-md p-[8.5px_14px] h-[35px] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200' value={location} onChange={(e) => setLocation(e.target.value)} />
                    </div>
                    <div className='flex flex-col gap-2 mt-[6px] w-[300px]'>
                        <label className='text-xs font-semibold text-gray-500 dark:text-gray-400'>Bio <span className='text-gray-400 text-[9px]'>  max characters (500 - 0)</span></label>
                        <input type='text' className={`border border-gray-300 rounded-md p-[8.5px_14px] h-[35px] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 `} value={bio} onChange={(e) => setBio(e.target.value)} />
                    </div>
                    <div className='relative flex flex-col gap-2 mt-[20px] w-[300px] border border-dashed border-gray-300 rounded-md p-[16px_14px] justify-center items-center dark:border-gray-600 '>
                        {
                            resume ? (
                                <div className='flex flex-col items-center '>
                                    <svg className='text-gray-400' stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 384 512" height="1.8rem" width="1.8rem" xmlns="http://www.w3.org/2000/svg" ><path d="M64 464c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16H224v80c0 17.7 14.3 32 32 32h80V448c0 8.8-7.2 16-16 16H64zM64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V154.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0H64zm56 256c-13.3 0-24 10.7-24 24s10.7 24 24 24H264c13.3 0 24-10.7 24-24s-10.7-24-24-24H120zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24H264c13.3 0 24-10.7 24-24s-10.7-24-24-24H120z"></path></svg>
                                    <button className='text-blue-500 px-[12px] py-[6px] rounded-sm text-sm uppercase ' >{resume.name}</button>
                                </div>
                            ) :
                                (
                                    <div className='flex flex-col items-center '>
                                        <svg className='text-gray-400' width={'2.5rem'} height={'2.5rem'} stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M320 367.79h76c55 0 100-29.21 100-83.6s-53-81.47-96-83.6c-8.89-85.06-71-136.8-144-136.8-69 0-113.44 45.79-128 91.2-60 5.7-112 43.88-112 106.4s54 106.4 120 106.4h56"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M320 255.79l-64-64-64 64m64 192.42V207.79"></path></svg>
                                        <button className='bg-gray-300 text-white px-[12px] py-[6px] rounded-sm text-sm uppercase dark:bg-gray-600' >Upload Resume</button>
                                    </div>
                                )
                        }
                        <input type='file' accept='application/pdf ' onChange={(e) => handleResumeUpload(e)} className='absolute inset-0 opacity-0  cursor-pointer w-full h-full z-10 bg-red-100 ' />
                    </div>
                </div>
                <div className='flex items-center gap-4 justify-end mt-[30px] uppercase'>
                    <button onClick={onClose} className='text-[12px] text-blue-600 uppercase dark:text-blue-200' >Cancel</button>
                    <button onClick={updateProfile} className='bg-blue-100 rounded-sm px-[12px] py-[6px] text-[10px] text-blue-600 uppercase dark:bg-blue-200 dark:text-blue-700     ' >
                        {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-900 dark:border-blue-400  "></div> : 'Update'}
                    </button>
                </div>
            </div>
        </Modal>
    )

}