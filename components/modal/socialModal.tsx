'use client'
import { useState } from 'react';
import { useUser } from '@/context/UserContext';
import Modal from '@/components/modal';
import axios from 'axios';

const PLATFORMS = ['linkedin', 'github', 'instagram'];

type SocialModalProps = {
    onClose: () => void;
};

export default function SocialModal({ onClose }: SocialModalProps) {
    const { user, setUser } = useUser();
    const [platform, setPlatform] = useState('');
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');

    const isValidUrl = (value: string) => {
        try {
            new URL(value);
            return true;
        } catch {
            return false;
        }
    };

    const availablePlatforms = PLATFORMS.filter(
        (p) => !user?.socialLinks || !(user.socialLinks as Record<string, string>)[p]
    );

    const handleAdd = async () => {
        setError('');

        if (!platform) {
            setError('Please select a platform');
            return;
        }

        if (!url || !isValidUrl(url)) {
            setError('Please enter a valid URL');
            return;
        }

        try {
            const updatedLinks = {
                ...(user?.socialLinks || {}),
                [platform]: url,
            };

            const response = await axios.patch('/api/profile/socials', {
                socialLinks: updatedLinks,
            }, {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            });

            if (user) {
                setUser({ ...user, socialLinks: response.data.socialLinks });
                onClose();
            }
        } catch (err) {
            console.error('Error adding social link:', err);
            setError('Failed to add social link');
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose}>
            <div className='px-2'>
                <h6 className='text-md text-gray-400 font-semibold dark:text-gray-300'>Add Social Link</h6>
                <div className='flex flex-col items-center justify-center mt-[20px]'>
                    <div className='flex flex-col gap-2 w-[300px]'>
                        <label className='text-xs font-semibold text-gray-500 dark:text-gray-400'>Platform*</label>
                        <select
                            value={platform}
                            onChange={(e) => setPlatform(e.target.value)}
                            className='border border-gray-300 rounded-md p-[8.5px_14px] h-[35px] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200'
                        >
                            <option value=''>Select a platform</option>
                            {availablePlatforms.map((p) => (
                                <option key={p} value={p} className='capitalize'>
                                    {p.charAt(0).toUpperCase() + p.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='flex flex-col gap-2 mt-[6px] w-[300px]'>
                        <label className='text-xs font-semibold text-gray-500 dark:text-gray-400'>URL*</label>
                        <input
                            type='text'
                            placeholder='https://...'
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className={`border border-gray-300 rounded-md p-[8.5px_14px] h-[35px] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${error ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                        />
                    </div>
                    {error && <p className='text-red-500 text-xs mt-2'>{error}</p>}
                </div>
                <div className='flex items-center gap-4 justify-end mt-[30px] uppercase'>
                    <button onClick={onClose} className='text-[12px] text-blue-600 uppercase'>Cancel</button>
                    <button onClick={handleAdd} className='bg-blue-100 rounded-sm px-[12px] py-[6px] text-[10px] text-blue-600 uppercase dark:bg-blue-900 dark:text-blue-200'>Add</button>
                </div>
            </div>
        </Modal>
    );
}
