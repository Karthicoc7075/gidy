'use client'
import React from 'react';
import Modal from '@/components/modal';

interface DeleteModalProps {
    onClose: () => void;
    onDelete: () => void;
    item: { type: string; name: string; id: string };
}

export default function DeleteModal({ onClose, onDelete, item }: DeleteModalProps) {
    return (
        <Modal isOpen={true} onClose={onClose}>
            <div className='px-2'>
                <h6 className='text-md text-gray-400 font-semibold dark:text-gray-300'>Delete {item.type}</h6>
                <div className='flex flex-col gap-4 py-4   '>
                    <h6 className='text-sm text-gray-400 dark:text-gray-300'>Are you sure you want to delete <span className='font-semibold text-black dark:text-white'>{item.name}?</span></h6>
                    <div className='flex items-center gap-4 justify-end mt-[30px] uppercase'>
                        <button onClick={onClose} className='text-[12px] text-blue-600 uppercase' >Cancel</button>
                        <button onClick={onDelete} className='bg-red-500 rounded-sm font-medium px-[12px] py-[6px] text-xs text-white uppercase hover:bg-red-600' >Delete</button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
