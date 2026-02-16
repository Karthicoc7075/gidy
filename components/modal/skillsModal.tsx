'use client'
import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import Modal from '@/components/modal';
import axios from 'axios';


const skillsData = [
  "JavaScript",
  "React",
  "Node.js",
  "Python",
  "Django",
  "Java",
  "Spring Boot",
  "C++",
  "SQL",
  "MongoDB",
  "AWS",
  "Docker",
  "Kubernetes",
  "Git",
  "Agile Methodologies",

]

type SkillsModalProps = {
  onClose: () => void;
};

export default function SkillsModal({ onClose }: SkillsModalProps) {
  const { user, setUser } = useUser();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [open, setOpen] = useState(false);



  useEffect(() => {
    if (user?.skills) {
      setSelected(user.skills);
    }
  }, [user]);

  const filteredOptions = skillsData.filter(
    (skill: string) =>
      skill.toLowerCase().includes(search.toLowerCase()) &&
      !selected.includes(skill)
  );

  const addSkill = (skill: string) => {
    setSelected([...selected, skill]);
    setSearch("");
    setOpen(false);
  };

  const removeSkill = (skill: string) => {
    setSelected(selected.filter((item) => item !== skill));
  };


  const handleAddSkills = async () => {
    try {
      await axios.patch('/api/profile/skills', {
        skills: selected
      }, {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      });

      if (user) {
        setUser({ ...user, skills: [...selected] as any });
      }
      onClose();
    } catch (error) {
      console.error("Error adding skills:", error);
    }
  }
  return (
    <Modal isOpen={true} onClose={onClose} >
      <div className='px-2'>
        <h6 className='text-md text-gray-400 font-semibold dark:text-gray-300'>Add Skills</h6>
        <div className='relative flex flex-col items-center justify-center w-full mt-[20px]  '>
          <div
            className="flex flex-wrap gap-2 p-2 border-b-2 bg-white dark:bg-gray-700 dark:border-gray-600 cursor-text w-full"
            onClick={() => setOpen(true)}
          >
            {selected.map((skill) => (
              <div
                key={skill}
                className="flex items-center bg-gray-200 dark:bg-gray-600 dark:text-gray-200 pl-4 pr-2 py-1 rounded-full text-xs"
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="ml-2 text-white bg-gray-400 rounded-full w-6 h-6 flex items-center justify-center text-xl font-bold hover:text-grey-500"
                >
                  ×
                </button>
              </div>
            ))}

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Skills"
              className="flex-1 outline-none min-w-[100px] bg-transparent dark:text-white"
            />

            {
              selected.length > 0 && (
                <button
                  onClick={() => {
                    setSelected([]);
                    setOpen(false);
                  }}
                  className="w-6 h-6 flex items-center justify-center text-xl font-bold text-gray-400 hover:text-gray-500"
                >
                  <svg
                    className="text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </button>
              )
            }
          </div>

          {open && (
            <div className="absolute top-11 w-full bg-white dark:bg-gray-700 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg z-10">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((skill) => (
                  <div
                    key={skill}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      addSkill(skill)
                    }}
                    className="py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 cursor-pointer "
                  >
                    {skill}
                  </div>
                ))
              ) : (
                <div className="p-2 text-gray-400">No results found</div>
              )}
            </div>
          )}
        </div>
        <div className='flex items-center gap-4 justify-end mt-[30px] uppercase'>
          <button onClick={onClose} className='text-[12px] text-blue-600 uppercase' >Cancel</button>
          <button onClick={handleAddSkills} className='bg-blue-50 rounded-sm px-[20px] py-[6px] text-[10px] text-blue-600 uppercase' >Add</button>
        </div>
      </div>
    </Modal>
  )

}