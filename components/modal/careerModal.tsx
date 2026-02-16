'use client'
import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import Modal from '@/components/modal';
import axios from 'axios';

const careerVisionOptions = [
    "Student",
    "Final-Year Student",
    "Fresher / Graduate",
    "Intern",
    "Working Professional",
    "Career Switcher",
    "Freelancer",
    "Consultant",
    "Job Seeker",
    "Startup Founder",
    "Hiring Manager",
    "Recruiter"
];

const professionalTitles = [
    "Advisory Partner",
    "AI / ML Architect",
    "Author / Speaker",
    "Board Member",
    "Chief Compliance Officer (CCO)",
    "Chief Information Officer (CIO)",
    "Chief Information Security Officer (CISO)",
    "Chief Operating Officer (COO)",
    "Chief Product Officer (CPO)",
    "Chief Risk Officer (CRO)",
    "Chief Technology Officer (CTO)",
    "Cloud Architect",
    "Co-Founder",
    "Data Architect",
    "Director of Engineering",
    "Director of GRC",
    "Director of Information Security",
    "Director of People / HR",
    "Director of Product",
    "Distinguished Engineer",
    "Engineering Leader",
    "Engineering Manager",
    "Executive (C-Suite)"
];



const fieldOptions = [
    "AI / ML Engineering",
    "Application Security",
    "Artificial Intelligence (AI)",
    "Automation & Intelligent Systems",
    "Business, Product & Strategy",
    "Cloud & Infrastructure",
    "Cloud Security",
    "Compliance & Regulatory Strategy",
    "Consulting & Advisory",
    "Corporate Innovation",
    "Customer Success"
];


const professionalLevelOptions = [
    "Entry Level Professional",
    "Executive",
    "Founder",
    "Independent Professional",
    "Intern",
    "Lead Professional",
    "Manager",
    "Mid Level Professional",
    "Principal",
    "Senior Professional",
    "Staff Professional",
    "Student"
];

type CareerModalProps = {
    onClose: () => void;
};

export default function CareerModal({ onClose }: CareerModalProps) {
    const { user, setUser } = useUser();
    const [careerVision, setCareerVision] = useState('');
    const [longTermAspiration, setLongTermAspiration] = useState('');
    const [aspirationalField, setAspirationalField] = useState('');
    const [inspiration, setInspiration] = useState('');
    const [currentGoal, setCurrentGoal] = useState('');
    const [error, setError] = useState<Record<string, string>>({});


    useEffect(() => {
        setCareerVision(user?.descriptionType || '');
        if (user?.careerVision) {

            setLongTermAspiration(user.careerVision.longTermAspiration || '');
            setAspirationalField(user.careerVision.aspirationalField || '');
            setInspiration(user.careerVision.inspiration || '');
            setCurrentGoal(user.careerVision.currentGoal || '');
        }
    }, [user]);

    const handleSubmit = async () => {
        setError({});

        if (!careerVision || !longTermAspiration || !aspirationalField || !inspiration || !currentGoal) {
            setError({
                careerVision: !careerVision ? 'Career vision is required' : '',
                longTermAspiration: !longTermAspiration ? 'Long-term aspiration is required' : '',
                aspirationalField: !aspirationalField ? 'Aspirational field is required' : '',
                inspiration: !inspiration ? 'Inspiration is required' : '',
                currentGoal: !currentGoal ? 'Current goal is required' : ''
            });
            return;
        }

        try {
            const response = await axios.patch('/api/profile/career', {
                descriptionType: careerVision,
                careerVision: {
                    longTermAspiration,
                    aspirationalField,
                    inspiration,
                    currentGoal
                }
            }, {
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });

            if (user) {
                setUser({ ...user, descriptionType: response.data.descriptionType, careerVision: response.data.careerVision });
            }
            onClose();
        }
        catch (error) {
            console.error("Error updating career vision:", error);
        }

    }
    return (
        <Modal isOpen={true} onClose={onClose} >
            <div className='px-2'>
                <h6 className='text-md text-gray-400 font-semibold dark:text-gray-300'>Career Vision</h6>
                <div className='flex flex-col items-center gap-4 justify-center w-full mt-[10px] '>
                    <div className='flex flex-col gap-2 mt-[20px] w-full'>
                        <label className='text-xs font-bold text-gray-800 capitalize dark:text-gray-200 '>What best describes you? *</label>
                        <select value={careerVision} onChange={(e) => setCareerVision(e.target.value)} className='border border-gray-300 rounded-md px-4 h-[35px] w-full text-sm font-semibold dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200' >
                            <option value="" selected>Select an option</option>
                            {careerVisionOptions.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                    <div className='flex flex-col gap-2 mt-[6px] w-full'>
                        <label className='text-xs font-bold text-gray-800 capitalize dark:text-gray-200 '>What is your long-term career aspiration?*</label>
                        <select value={longTermAspiration} onChange={(e) => setLongTermAspiration(e.target.value)} className='border border-gray-300 rounded-md px-4 h-[35px] w-full text-sm font-semibold dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200' >
                            <option value="" disabled selected>E.g., CEO, CTO, Founder</option>
                            {professionalLevelOptions.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                    <div className='flex flex-col gap-2 mt-[6px] w-full '>
                        <label className='text-xs font-bold text-gray-800 capitalize dark:text-gray-200 '>Aspirational Field*</label>
                        <select value={aspirationalField} onChange={(e) => setAspirationalField(e.target.value)} className='border border-gray-300 rounded-md px-4 h-[35px] w-full text-sm font-semibold dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200' >
                            <option value="" disabled selected>Select your field</option>
                            {fieldOptions.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                    <div className='flex flex-col gap-2 mt-[6px] w-full '>
                        <label className='text-xs font-bold text-gray-800 capitalize dark:text-gray-200 '>What are you aiming for right now?*</label>
                        <select value={currentGoal} onChange={(e) => setCurrentGoal(e.target.value)} className='border border-gray-300 rounded-md px-4 h-[35px] w-full text-sm font-semibold placeholder-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200' >
                            <option value="" disabled selected className='text-gray-300' >Enter the name of your inspiration</option>
                            {professionalTitles.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                    <div className='flex flex-col gap-2 mt-[6px] w-full '>
                        <label className='text-xs font-bold  text-gray-800 capitalize dark:text-gray-200 '  >Who is your inspiration?*</label>
                        <input type='text' value={inspiration} onChange={(e) => setInspiration(e.target.value)} className='border border-gray-300 rounded-md px-4 h-[35px] w-full text-sm font-semibold dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200' />

                    </div>

                </div>
                <div className='flex items-center gap-4 justify-end mt-[30px] uppercase'>
                    <button onClick={onClose} className='text-[12px] text-blue-600 uppercase' >Cancel</button>
                    <button onClick={handleSubmit} className='bg-blue-50 rounded-sm px-[20px] py-[6px] text-[10px] text-blue-600 uppercase' >Add</button>
                </div>
            </div>
        </Modal>
    )

}