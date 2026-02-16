import React, { useRef, useEffect } from 'react';

interface ActionMenuProps {
    onEdit: () => void;
    onDelete: () => void;
    onClose: () => void;
    title: string;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ onEdit, onDelete, onClose, title }) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    return (
        <div ref={menuRef} className='absolute top-[34px] right-0  bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 p-2  z-10 w-max min-w-[140px]'>
            <div
                className='flex items-center gap-[4px]  px-[10px] py-[8px] text-xs text-gray-600 rounded-md dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer '
                onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                    onClose();
                }}
            >
                <svg className='text-blue-600' stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1rem" width="1rem" xmlns="http://www.w3.org/2000/svg"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path><path d="m15 5 4 4"></path></svg>
                <p>   Edit {title}</p>
            </div>
            <div className='flex items-center gap-[4px] px-[10px] py-[8px] rounded-md text-xs text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer'
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                    onClose();
                }}
            >
                <svg className='text-blue-600' stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1rem" width="1rem" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
                Delete
            </div>
        </div>
    );
};

export default ActionMenu;
