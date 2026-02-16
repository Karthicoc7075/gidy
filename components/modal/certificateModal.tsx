'use client'
import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import Modal from '@/components/modal';
import axios from 'axios';


type CertificateModalProps = {
    onClose: () => void;
    updateId?: string;
};

export default function CertificateModal({ onClose, updateId }: CertificateModalProps) {
    const { user, setUser } = useUser();
    const [certificationName, setCertificationName] = useState('');
    const [provider, setProvider] = useState('');
    const [certificateUrl, setCertificateUrl] = useState('');
    const [certificateId, setCertificateId] = useState('');
    const [issuedDate, setIssuedDate] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState<Record<string, string>>({});
    const [isValid, setValid] = useState(true);


    useEffect(() => {
        if (updateId && user?.certifications) {
            const cert = user.certifications.find(cert => cert._id === updateId);
            if (cert) {
                setCertificationName(cert.certification || '');
                setProvider(cert.provider || '');
                setCertificateUrl(cert.certificateUrl || '');
                setCertificateId(cert.certificateId || '');
                setIssuedDate(cert.issueDate ? new Date(cert.issueDate).toISOString().split('T')[0] : '');
                setExpiryDate(cert.expiryDate ? new Date(cert.expiryDate).toISOString().split('T')[0] : '');
                setDescription(cert.description || '');
            }
        }
    }, [updateId, user?.certifications]);


    const handleUpdateCertificate = async () => {
        setError({});

        if (!certificationName || !provider || !certificateUrl || !issuedDate) {
            setError({
                certificationName: !certificationName ? 'Certification name is required' : '',
                provider: !provider ? 'Provider is required' : '',
                certificateUrl: !certificateUrl ? 'Certificate URL is required' : '',
                issuedDate: !issuedDate ? 'Issued date is required' : ''
            });
            return;
        }

        try {
            const response = await axios.patch(`/api/profile/certification/${updateId}`, {
                certification: certificationName,
                provider: provider,
                certificateUrl,
                certificateId,
                issueDate: issuedDate,
                expiryDate,
                description
            }, {
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });

            if (user) {
                const updatedCertifications = user.certifications?.map(cert => cert._id === updateId ? response.data.certification : cert) || [];
                setUser({ ...user, certifications: updatedCertifications as any });
            }
            onClose();
        }
        catch (error) {
            console.error("Error updating certification:", error);
        }
    }

    const handleAddCertificate = async () => {
        setError({});

        if (!certificationName || !provider || !certificateUrl || !issuedDate || !isValid) {
            setError({
                certificationName: !certificationName ? 'Certification name is required' : '',
                provider: !provider ? 'Provider is required' : '',
                certificateUrl: !certificateUrl ? 'Certificate URL is required' : '',
                issuedDate: !issuedDate ? 'Issued date is required' : ''
            });
            return;
        }

        try {
            const response = await axios.patch('/api/profile/certification', {
                certification: certificationName,
                provider: provider,
                certificateUrl,
                certificateId,
                issueDate: issuedDate,
                expiryDate,
                description
            }, {
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });

            if (user) {
                setUser({ ...user, certifications: [...(user.certifications || []), response.data.certification] as any });
            }
            onClose();
        }
        catch (error) {
            console.error("Error adding certification:", error);
        }
    }

    const validate = (value: string) => {
        try {
            new URL(value);
            setValid(true);
        } catch (error) {
            setValid(false);
        }
    };


    return (
        <Modal isOpen={true} onClose={onClose} >
            <div className='px-2'>
                <h6 className='text-md text-gray-400 font-semibold dark:text-gray-300'>Add Certification</h6>
                <div className='flex flex-col items-center justify-center  '>
                    <div className='flex flex-col gap-2 mt-[20px] w-[300px]'>
                        <label className='text-xs font-semibold text-gray-500 dark:text-gray-400'>Certification*</label>
                        <input type='text' className={`border border-gray-300 rounded-md p-[8.5px_14px] h-[35px] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${error.certificationName ? 'border-red-500 ring-1 ring-red-500' : ''}`} value={certificationName} onChange={(e) => setCertificationName(e.target.value)} />
                    </div>
                    <div className='flex flex-col gap-2 mt-[6px] w-[300px]'>
                        <label className='text-xs font-semibold text-gray-500 dark:text-gray-400'>Provider*</label>
                        <input type='text' className={`border border-gray-300 rounded-md p-[8.5px_14px] h-[35px] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${error.provider ? 'border-red-500 ring-1 ring-red-500' : ''}`} value={provider} onChange={(e) => setProvider(e.target.value)} />
                    </div>
                    <div className='flex flex-col gap-2 mt-[6px] w-[300px]'>
                        <label className='text-xs font-semibold text-gray-500 dark:text-gray-400'>Cartificate Url*</label>
                        <input type='text' className={`border border-gray-300 rounded-md p-[8.5px_14px] h-[35px] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${error.certificateUrl ? 'border-red-500 ring-1 ring-red-500' : ''}`} value={certificateUrl} onChange={(e) => setCertificateUrl(e.target.value)} />
                    </div>
                    <div className='flex flex-col gap-2 mt-[6px] w-[300px]'>
                        <label className='text-xs font-semibold text-gray-500 dark:text-gray-400'>Certificate ID</label>
                        <input type='text' className='border text-sm border-gray-300 rounded-md p-[8.5px_14px] h-[35px] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200' value={certificateId} onChange={(e) => setCertificateId(e.target.value)} />
                    </div>
                    <div className='flex flex-col gap-2 mt-[6px] w-[300px]'>
                        <label className='text-xs font-semibold text-gray-500 dark:text-gray-400'>Issued Date </label>
                        <input type='date' className={`border text-sm   border-gray-300 rounded-md p-[8.5px_14px] h-[35px] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${error.issuedDate ? 'border-red-500 ring-1 ring-red-500' : ''}`} value={issuedDate} onChange={(e) => setIssuedDate(e.target.value)} />
                    </div>
                    <div className='flex flex-col gap-2 mt-[6px] w-[300px]'>
                        <label className='text-xs font-semibold text-gray-500 dark:text-gray-400'>Expiry Date</label>
                        <input type='date' className='border text-sm  w-full  border-gray-300 rounded-md p-[8.5px_14px] h-[35px] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200' value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
                    </div>
                    <div className='flex flex-col gap-2 mt-[6px] w-[300px]'>
                        <label className='text-xs font-semibold text-gray-500 dark:text-gray-400'>Description  <span className='text-gray-400 text-[9px]'>  max characters (200 - 0)</span></label>
                        <input type='text' className='border text-sm w-full  border-gray-300 rounded-md p-[8.5px_14px] h-[35px] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200' value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                </div>
                <div className='flex items-center gap-4 justify-end mt-[30px] uppercase'>
                    <button onClick={onClose} className='text-[12px] text-blue-600 uppercase' >Cancel</button>
                    {updateId ? (
                        <button onClick={handleUpdateCertificate} className='text-[12px] bg-blue-600 text-white px-4 py-2 rounded uppercase'>Update</button>
                    ) : (
                        <button onClick={handleAddCertificate} className='text-[12px] bg-blue-600 text-white px-4 py-2 rounded uppercase'>Add</button>
                    )}
                </div>
            </div>
        </Modal>
    )

}