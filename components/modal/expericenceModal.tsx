'use client'
import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import Modal from '@/components/modal';
import axios from 'axios';


type ExperienceModalProps = {
    onClose: () => void;
    updateId?: string;
};

export default function ExperienceModal({ onClose, updateId }: ExperienceModalProps) {
    const { user, setUser } = useUser();

    const [role, setRole] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [location, setLocation] = useState('');
    const [dateOfJoining, setDateOfJoining] = useState('');
    const [dateOfLeaving, setDateOfLeaving] = useState('');
    const [currentlyWorking, setCurrentlyWorking] = useState(false);
    const [error, setError] = useState<Record<string, string>>({});


    useEffect(() => {
        if (updateId && user?.experiences) {
            const experience = user.experiences.find(exp => exp._id === updateId);
            if (experience) {
                setRole(experience.role || '');
                setCompanyName(experience.companyName || '');
                setLocation(experience.location || '');
                setDateOfJoining(experience.dateOfJoining ? new Date(experience.dateOfJoining).toISOString().split('T')[0] : '');
                setDateOfLeaving(experience.dateOfLeaving ? new Date(experience.dateOfLeaving).toISOString().split('T')[0] : '');
                setCurrentlyWorking(experience.currentlyWorking || false);
            }
        }
    }, [updateId, user?.experiences]);


    const handleUpdateExperience = async () => {
        setError({});

        if (!role || !companyName || !location || !dateOfJoining || (!currentlyWorking && !dateOfLeaving)) {
            setError({
                role: !role ? 'Role is required' : '',
                companyName: !companyName ? 'Company Name is required' : '',
                location: !location ? 'Location is required' : '',
                dateOfJoining: !dateOfJoining ? 'Date of joining is required' : '',
                dateOfLeaving: !dateOfLeaving && !currentlyWorking ? 'Date of leaving is required' : ''
            });
            return;
        }

        try {

            const response = await axios.patch(`/api/profile/experience/${updateId}`, {
                role,
                companyName,
                location,
                dateOfJoining,
                dateOfLeaving: currentlyWorking ? null : dateOfLeaving,
                currentlyWorking
            }, {
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });


            if (user) {
                setUser({ ...user, experiences: user.experiences?.map(exp => exp._id === updateId ? response.data.experience : exp) as any });
            }
            onClose();
        }
        catch (error) {
            console.error("Error updating experience:", error);
        }
    }


    const handleAddExperience = async () => {
        setError({});

        if (!role || !companyName || !location || !dateOfJoining || (!currentlyWorking && !dateOfLeaving)) {
            setError({
                role: !role ? 'Role is required' : '',
                companyName: !companyName ? 'Company Name is required' : '',
                location: !location ? 'Location is required' : '',
                dateOfJoining: !dateOfJoining ? 'Date of joining is required' : '',
                dateOfLeaving: !dateOfLeaving && !currentlyWorking ? 'Date of leaving is required' : ''
            });
            return;
        }

        try {
            const response = await axios.patch('/api/profile/experience', {
                role,
                companyName,
                location,
                dateOfJoining,
                dateOfLeaving: currentlyWorking ? null : dateOfLeaving,
                currentlyWorking
            }, {
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });



            if (user) {
                setUser({ ...user, experiences: [...(user.experiences || []), response.data.experience] as any });
            }
            onClose();
        }
        catch (error) {
            console.error("Error adding experience:", error);
        }
    }


    return (
        <Modal isOpen={true} onClose={onClose} >
            <div className='px-2'>
                <h6 className='text-md text-gray-400 font-semibold dark:text-gray-300'>Add Experience</h6>
                <div className='flex flex-col items-center justify-center  '>
                    <div className='flex flex-col gap-2 mt-[20px] w-[300px]'>
                        <label className='text-xs font-semibold text-gray-500 dark:text-gray-400'>Role*</label>
                        <input type='text' className={`border border-gray-300 rounded-md p-[8.5px_14px] h-[35px] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${error.role ? 'border-red-500 ring-1 ring-red-500' : ''}`} value={role} onChange={(e) => setRole(e.target.value)} />
                    </div>
                    <div className='flex flex-col gap-2 mt-[6px] w-[300px]'>
                        <label className='text-xs font-semibold text-gray-500 dark:text-gray-400'>Company Name*</label>
                        <input type='text' className={`border border-gray-300 rounded-md p-[8.5px_14px] h-[35px] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${error.companyName ? 'border-red-500 ring-1 ring-red-500' : ''}`} value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                    </div>
                    <div className='flex flex-col gap-2 mt-[6px] w-[300px]'>
                        <label className='text-xs font-semibold text-gray-500 dark:text-gray-400'>Location*</label>
                        <input type='text' className={`border border-gray-300 rounded-md p-[8.5px_14px] h-[35px] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${error.location ? 'border-red-500 ring-1 ring-red-500' : ''}`} value={location} onChange={(e) => setLocation(e.target.value)} />
                    </div>
                    <div className='flex flex-col gap-2 mt-[6px] w-[300px]'>
                        <label className='text-xs font-semibold text-gray-500 dark:text-gray-400'>Date of joining</label>
                        <input type='date' className={`border text-sm  w-full border-gray-300 rounded-md p-[8.5px_14px] h-[35px] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${error.dateOfJoining ? 'border-red-500 ring-1 ring-red-500' : ''}`} value={dateOfJoining} onChange={(e) => setDateOfJoining(e.target.value)} />
                    </div>
                    <div className='flex flex-col gap-2 mt-[6px]   w-[300px] '>
                        <label className='text-xs font-semibold text-gray-500 dark:text-gray-400 '>Date of leaving</label>
                        <input type='date' className={`border text-sm w-full  border-gray-300 rounded-md p-[8.5px_14px] h-[35px] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${error.dateOfLeaving ? 'border-red-500 ring-1 ring-red-500' : ''}`} value={dateOfLeaving} onChange={(e) => setDateOfLeaving(e.target.value)} />
                    </div>
                    <div className='flex justify-center items-center  gap-2 mt-[6px] w-[300px]'>
                        <input type='checkbox' className='border-2 border-gray-300 rounded-md p-[8.5px_14px] h-[40px] dark:border-gray-600 dark:bg-gray-700' checked={currentlyWorking} onChange={(e) => setCurrentlyWorking(e.target.checked)} />
                        <label className='text-xs font-semibold text-gray-500 dark:text-gray-400'>Currently working in this role</label>
                    </div>
                </div>
                <div className='flex items-center gap-4 justify-end mt-[30px] uppercase'>
                    <button onClick={onClose} className='text-[12px] text-blue-600 uppercase' >Cancel</button>
                    {updateId ? (
                        <button onClick={handleUpdateExperience} className='text-[12px] bg-blue-600 text-white px-4 py-2 rounded uppercase'>Update</button>
                    ) : (
                        <button onClick={handleAddExperience} className='text-[12px] bg-blue-600 text-white px-4 py-2 rounded uppercase'>Add</button>
                    )}
                </div>
            </div>
        </Modal>
    )

}