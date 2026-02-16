'use client'
import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import Modal from '@/components/modal';
import axios from 'axios';

type EducationModalProps = {
    onClose: () => void;
    updateId?: string;
};

export default function EducationModal({ onClose, updateId }: EducationModalProps) {
    const { user, setUser } = useUser();
    const [college, setCollege] = useState('');
    const [degree, setDegree] = useState('');
    const [fieldOfStudy, setFieldOfStudy] = useState('');
    const [dateOfJoining, setDateOfJoining] = useState('');
    const [dateOfCompletion, setDateOfCompletion] = useState('');
    const [currentlyStudying, setCurrentlyStudying] = useState(false);
    const [error, setError] = useState<Record<string, string>>({});

    useEffect(() => {
        if (updateId && user?.education) {
            const education = user.education.find(edu => edu._id === updateId);
            if (education) {
                setCollege(education.college || '');
                setDegree(education.degree || '');
                setFieldOfStudy(education.fieldOfStudy || '');
                setDateOfJoining(education.dateOfJoining ? new Date(education.dateOfJoining).toISOString().split('T')[0] : '');
                setDateOfCompletion(education.dateOfCompletion ? new Date(education.dateOfCompletion).toISOString().split('T')[0] : '');
                setCurrentlyStudying(education.currentlyStudying || false);
            }
        }
    }, [updateId, user?.education]);



    const handleUpdate = async () => {
        setError({});
        if (!college || !degree || !fieldOfStudy || !dateOfJoining || (!currentlyStudying && !dateOfCompletion)) {
            setError({
                college: !college ? 'College is required' : '',
                degree: !degree ? 'Degree is required' : '',
                fieldOfStudy: !fieldOfStudy ? 'Field of Study is required' : '',
                dateOfJoining: !dateOfJoining ? 'Date of joining is required' : '',
                dateOfCompletion: !dateOfCompletion && !currentlyStudying ? 'Date of completion is required' : ''
            });
            return;
        }

        try {
            const response = await axios.patch(`/api/profile/education/${updateId}`, {
                college,
                degree,
                fieldOfStudy,
                dateOfJoining,
                dateOfCompletion: currentlyStudying ? null : dateOfCompletion,
                currentlyStudying
            }, {
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });

            if (user) {
                setUser({ ...user, education: user.education?.map(edu => edu._id === updateId ? response.data.education : edu) as any });
                onClose();
            }
        } catch (error) {
            console.error("Error updating education:", error);
        }
    }


    const handleSave = async () => {
        setError({});

        if (!college || !degree || !fieldOfStudy || !dateOfJoining || (!currentlyStudying && !dateOfCompletion)) {
            setError({
                college: !college ? 'College is required' : '',
                degree: !degree ? 'Degree is required' : '',
                fieldOfStudy: !fieldOfStudy ? 'Field of Study is required' : '',
                dateOfJoining: !dateOfJoining ? 'Date of joining is required' : '',
                dateOfCompletion: !dateOfCompletion && !currentlyStudying ? 'Date of completion is required' : ''
            });
            return;
        }


        try {
            const response = await axios.patch('/api/profile/education', {
                college,
                degree,
                fieldOfStudy,
                dateOfJoining,
                dateOfCompletion: currentlyStudying ? null : dateOfCompletion,
                currentlyStudying
            }, {
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });

            if (user) {
                setUser({ ...user, education: [...(user.education || []), response.data.education] as any });
                onClose();
            }
        }
        catch (error) {
            console.error("Error adding education:", error);
        }



    }



    return (
        <Modal isOpen={true} onClose={onClose} >
            <div className='px-2'>
                <h6 className='text-md text-gray-400 font-semibold dark:text-gray-300'>Add Your Education</h6>
                <div className='flex flex-col items-center justify-center  '>
                    <div className='flex flex-col gap-2 mt-[20px] w-[300px]'>
                        <label className='text-xs font-semibold text-gray-500 dark:text-gray-400'>College*</label>
                        <input type='text' className={`border border-gray-300 rounded-md p-[8.5px_14px] h-[35px] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${error.college ? 'border-red-500 ring-1 ring-red-500' : ''}`} value={college} onChange={(e) => setCollege(e.target.value)} />
                    </div>
                    <div className='flex flex-col gap-2 mt-[6px] w-[300px]'>
                        <label className='text-xs font-semibold text-gray-500 dark:text-gray-400'>Degree*</label>
                        <input type='text' className={`border border-gray-300 rounded-md p-[8.5px_14px] h-[35px] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${error.degree ? 'border-red-500 ring-1 ring-red-500' : ''}`} value={degree} onChange={(e) => setDegree(e.target.value)} />
                    </div>
                    <div className='flex flex-col gap-2 mt-[6px] w-[300px]'>
                        <label className='text-xs font-semibold text-gray-500 dark:text-gray-400'>Field of Study*</label>
                        <input type='text' className={`border border-gray-300 rounded-md p-[8.5px_14px] h-[35px] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${error.fieldOfStudy ? 'border-red-500 ring-1 ring-red-500' : ''}`} value={fieldOfStudy} onChange={(e) => setFieldOfStudy(e.target.value)} />
                    </div>
                    <div className='flex flex-col gap-2 mt-[6px] w-[300px]'>
                        <label className='text-xs font-semibold text-gray-500 dark:text-gray-400'>Date of joining*</label>
                        <input type='date' className={`border text-sm w-full border-gray-300 rounded-md p-[8.5px_14px] h-[35px] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${error.dateOfJoining ? 'border-red-500 ring-1 ring-red-500' : ''}`} value={dateOfJoining} onChange={(e) => setDateOfJoining(e.target.value)} />
                    </div>
                    <div className='flex flex-col gap-2 mt-[20px] w-[300px]'>
                        <div className='flex items-center gap-2 pl-4'>
                            <input type='checkbox' className='w-[16px] h-[16px] dark:bg-gray-700 dark:border-gray-600' checked={currentlyStudying} onChange={(e) => setCurrentlyStudying(e.target.checked)} />
                            <p className='text-xs font-semibold text-gray-400 dark:text-gray-500 ' >Currently studing here / not completed</p>
                        </div>
                        <h6 className='text-xs text-gray-400  my-[6px] font-semibold text-center'>OR</h6>
                    </div>
                    <div className='flex flex-col gap-2 mt-[6px] w-[300px]'>
                        <label className='text-xs font-semibold text-gray-500 dark:text-gray-400'>Date of completion</label>
                        <input type='date' className={`border w-full text-sm border-gray-300 rounded-md p-[8.5px_14px] h-[35px] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${error.dateOfCompletion ? 'border-red-500 ring-1 ring-red-500' : ''}`} value={dateOfCompletion} onChange={(e) => setDateOfCompletion(e.target.value)} />
                    </div>

                </div>
                <div className='flex items-center gap-4 justify-end mt-[30px] uppercase'>
                    <button className='text-[12px] text-blue-600 uppercase' onClick={() => onClose()}>Cancel</button>
                    {updateId ? (
                        <button onClick={handleUpdate} className='text-[12px] bg-blue-600 text-white px-4 py-2 rounded uppercase'>Update</button>
                    ) : (
                        <button onClick={handleSave} className='text-[12px] bg-blue-600 text-white px-4 py-2 rounded uppercase'>Add</button>
                    )}
                </div>
            </div>
        </Modal>
    );
}
