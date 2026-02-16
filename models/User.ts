import mongoose, { Schema } from "mongoose";

export const EducationSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  college: String,
  degree: String,
  fieldOfStudy: String,
  location: String,
  dateOfJoining: Date,
  currentlyStudying: Boolean,
  dateOfCompletion: Date
});

export const CertificationSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  certification: String,
  provider: String,
  certificateUrl: String,
  certificateId: String,
  issueDate: Date,
  expiryDate: Date,
  description: String
});

export const ExperienceSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  role: String,
  companyName: String,
  location: String,
  dateOfJoining: Date,
  dateOfLeaving: Date,
  currentlyWorking: Boolean
});

const CareerVisionSchema = new Schema({
  longTermAspiration: String,
  aspirationalField: String,
  inspiration: String,
  currentGoal: String
});

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true,required: true },
  password: { type: String, required: true },
  descriptionType: {
    type: String,
    required: false
  },
  onboardingCompleted: {
    type: Boolean,
    default: false
  },
 
  bio: String,
  location: String,
  resumeUrl: String,
  profilePictureUrl: String,
  education: [EducationSchema],
  skills: [String],
  socialLinks: {
    linkedin: String,
    github: String,
    instagram: String,
  },
  certifications: [CertificationSchema],
  experiences: [ExperienceSchema],
  careerVision: CareerVisionSchema,
  league: { type: String, default: "Bronze" },
  rank: { type: Number, default: 0 },
  points: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
