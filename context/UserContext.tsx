"use client";


import { createContext, useContext, useEffect, useState } from "react";


type EducationSchema = {
  _id: string,
  college: string,
  degree: string,
  fieldOfStudy: string,
  location: string,
  dateOfJoining: Date,
  currentlyStudying: boolean,
  dateOfCompletion: Date
}

type CertificationSchema = {
  _id: string,
  certification: string,
  provider: string,
  certificateUrl: string,
  certificateId: string,
  issueDate: Date,
  expiryDate: Date,
  description: string
}

type ExperienceSchema = {
  _id: string,
  role: string,
  companyName: string,
  location: string,
  dateOfJoining: Date,
  dateOfLeaving: Date,
  currentlyWorking: boolean
}

type CareerVisionSchema = {
  longTermAspiration: string,
  aspirationalField: string,
  inspiration: string,
  currentGoal: string
}

export type User = {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePictureUrl?: string;
  descriptionType?: string;
  onboardingCompleted: boolean;
  bio: string,
  location: string,
  resumeUrl: string,
  education: [EducationSchema],
  skills: [string],
  socialLinks: {
    linkedin: string,
    github: string,
    instagram: string,
  },
  certifications: [CertificationSchema],
  experiences: [ExperienceSchema],
  careerVision: CareerVisionSchema,
  league: string,
  rank: number,
  points: number,
  token: string;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
};

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);





  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("gidy_user");
      if (storedUser && user === null) {
        const parsedUser = JSON.parse(storedUser);

        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Error loading user from localStorage:", error);
      localStorage.removeItem("gidy_user");
    } finally {
      setIsLoading(false);
    }
  }, []);


  useEffect(() => {
    if (isLoading) return;

    if (user) {

      const userToStore = {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        onboardingCompleted: user.onboardingCompleted,
        profilePictureUrl: user.profilePictureUrl,
        token: user.token,
      };


      localStorage.setItem("gidy_user", JSON.stringify(userToStore));
    } else {

      localStorage.removeItem("gidy_user");
    }
  }, [user, isLoading]);



  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside provider");
  return ctx;
};
