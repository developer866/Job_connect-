export interface Iuser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: "jobseeker" | "employer" | "admin";
  avatar?: string;
  createdAt: Date;
  // JobSeeker Fileds
  cv?: string;
  skills?: string[];
  location?: string;
  bio?: string;
  experince?: "entry" | "junior" | "mid";

  // Employer Fileds
  companyName?: string;
  companyLogo?: string;
  companyWebsite?: string;
  companyDescription?: string;
  companySize?: string;
  industry?: string;
  companyAddress?: string;
  cacNumber?: string; // business registration number
}

export interface IAuthRequest {
    userId:string
    role:string
}