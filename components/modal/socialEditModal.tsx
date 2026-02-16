'use client'
import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import Modal from '@/components/modal';
import axios from 'axios';
import { on } from 'events';

type SocialEditModalProps = {
    onClose: () => void;
};

export default function SocialEditModal({ onClose }: SocialEditModalProps) {
    const [socialList, setSocialList] = useState<Record<string, string>>({});
    const { user, setUser } = useUser();
    const [isValid, setValid] = useState<Record<string, boolean>>({});



    const isValidUrl = (value: string) => {
        try {
            new URL(value);
            return true;
        } catch (error) {
            return false;
        }
    };

    useEffect(() => {
        if (user?.socialLinks) {
            setSocialList(user.socialLinks);
        }

    }, [user]);
    const updateSocials = async () => {
        try {
            const response = await axios.patch('/api/profile/socials',
                {
                    socialLinks: socialList
                }
                , {
                    headers: {
                        Authorization: `Bearer ${user?.token}`
                    }
                });

            if (user) {
                setUser({ ...user, socialLinks: response.data.socialLinks });
                onClose();
            }
        } catch (error) {
            console.error('Error updating socials:', error);
        }
    }
    return (
        <Modal isOpen={true} onClose={onClose} >
            <div className='px-2'>
                <h6 className='text-md text-gray-400 font-semibold dark:text-gray-300'>Edit Socials</h6>
                <div className='relative flex flex-col items-center justify-center w-full mt-[20px]  '>
                    {Object.keys(socialList).map((platform) => (
                        <div key={platform} className='flex items-center gap-2 w-full'>
                            <span className='text-sm capitalize text-gray-600 dark:text-gray-300'>{platform}</span>
                            <input
                                type="text"
                                value={socialList[platform]}
                                onChange={(e) => setSocialList({ ...socialList, [platform]: e.target.value })}
                                className='border border-gray-300 rounded-md px-2 py-1 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200'
                            />

                            <div className=' ml-4 flex gap-1 '>
                                <button onClick={() => {
                                    if (isValidUrl(socialList[platform])) {
                                        setValid({ ...isValid, [platform]: true });
                                    }
                                }} className='text-blue-500 text-sm mr-2'>
                                    {
                                        isValid[platform] === false ? <p className='text-red-600' >X</p> : (<svg className='text-green-500' width={'1rem'} height={'1rem'} fill='currentColor' focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DoneIcon" ><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"></path></svg>)
                                    }
                                </button>
                                <button onClick={() => {
                                    const updatedLinks = { ...socialList };
                                    delete updatedLinks[platform];
                                    setSocialList(updatedLinks);
                                }} className='text-red-500 text-sm'><svg className={"text-red-600 "} width={'1rem'} height={'1rem'} fill={"currentColor"} focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteIcon" ><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z"></path></svg></button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='flex items-center gap-4 justify-end mt-[30px] uppercase'>
                    <button onClick={onClose} className='text-[12px] text-blue-600 uppercase' >Cancel</button>
                    <button onClick={updateSocials} className='bg-blue-100 rounded-sm px-[12px] py-[6px] text-[10px] text-blue-600 uppercase dark:bg-blue-900 dark:text-blue-200' >Update</button>
                </div>
            </div>
        </Modal>
    );
}