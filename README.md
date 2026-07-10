# JobConnect 🚀

> Nigeria's premier job board connecting junior tech talent with startups and SMEs.

![JobConnect](https://img.shields.io/badge/Status-In%20Development-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)

---

## Problem Statement

Fresh graduates and junior developers in Nigeria struggle to find legitimate entry-level job opportunities. Existing platforms are flooded with senior roles, making it hard for fresh graduates to find roles that match their level. On the employer side, small startups and SMEs struggle to reach quality junior talent without paying for expensive job posting platforms.

**JobConnect bridges this gap** — a dedicated job board for Nigerian tech talent, connecting fresh graduates and junior developers with startups and SMEs looking to hire affordably.

---

## Features

### Jobseeker
- Register and build profile
- Upload CV via Cloudinary
- Browse and search jobs with filters
- Apply for jobs with cover letter
- Track application status in real time
- Get notified instantly when application status changes

### Employer
- Register company profile with business details
- Post jobs with full specifications
- Review and manage applications
- Accept or reject candidates
- Real-time notifications when someone applies
- Dashboard with application analytics

### Admin
- Approve or reject job postings
- Manage all users
- View platform analytics and statistics
- Real-time notifications for new job submissions

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | Web framework |
| TypeScript | Type safety |
| MongoDB | Database |
| Mongoose | ODM for MongoDB |
| JWT | Authentication tokens |
| bcrypt | Password hashing |
| Socket.io | Real-time notifications |
| Cloudinary | CV and image uploads |
| Nodemailer | Email notifications |
| Swagger | API documentation |

### Frontend (In Development)
| Technology | Purpose |
|---|---|
| Next.js 14 | React framework with App Router |
| Tailwind CSS | Styling |
| Socket.io Client | Real-time notifications |
| Chart.js | Dashboard analytics |

### DevOps
| Service | Purpose |
|---|---|
| Render | Backend deployment |
| Vercel | Frontend deployment |
| MongoDB Atlas | Cloud database |

---

## Backend Architecture

### Folder Structure

```
jobconnect-server/
├── config/
│   ├── db.ts              # MongoDB connection
│   ├── socket.ts          # Socket.io initialization
│   ├── swagger.ts         # API documentation setup
│   └── cloudinary.ts      # Cloudinary configuration
├── controllers/
│   ├── authController.ts      # Register, login, profile
│   ├── jobController.ts       # Job CRUD operations
│   ├── applicationController.ts # Application management
│   ├── notificationController.ts # Notification management
│   └── adminController.ts     # Admin operations
├── middleware/
│   └── auth.ts            # JWT protection + RBAC
├── models/
│   ├── User.ts            # User schema (jobseeker + employer)
│   ├── Job.ts             # Job schema
│   ├── Application.ts     # Application schema
│   └── Notification.ts    # Notification schema
├── routes/
│   ├── authRoute.ts       # Auth endpoints
│   ├── jobRoute.ts        # Job endpoints
│   ├── applicationRoutes.ts # Application endpoints
│   ├── notificationRoutes.ts # Notification endpoints
│   └── adminRoutes.ts     # Admin endpoints
├── types/
│   └── index.ts           # Shared TypeScript interfaces
├── .env                   # Environment variables
├── .gitignore
├── server.ts              # Entry point
├── tsconfig.json
└── package.json
```

### Database Schema

#### User Model
```
{
  name, email, password, role, avatar, createdAt,

  // Jobseeker fields
  cv, skills[], location, bio, experience,

  // Employer fields
  companyName, companyLogo, companyWebsite,
  companyDescription, companySize, industry,
  companyAddress, cacNumber
}
```

#### Job Model
```
{
  title, description, requirements[],
  location, type, salary{ min, max, currency },
  skills[], experience, status,
  employer (ref: User),
  applications[] (ref: Application),
  deadline, createdAt
}
```

#### Application Model
```
{
  job (ref: Job),
  jobseeker (ref: User),
  employer (ref: User),
  status, coverLetter, cv,
  createdAt, updatedAt
}
```

#### Notification Model
```
{
  recipient (ref: User),
  type, message, read,
  link, createdAt
}
```

### API Endpoints

#### Auth Routes — `/api/auth`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register jobseeker or employer |
| POST | `/auth/login` | Public | Login any user |
| GET | `/auth/profile` | Protected | Get logged in user profile |

#### Job Routes — `/api/jobs`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/jobs` | Public | Get all approved jobs with filters |
| GET | `/jobs/:id` | Public | Get single job details |
| POST | `/jobs` | Employer | Create a new job |
| GET | `/jobs/my-jobs` | Employer | Get employer's own jobs |
| PATCH | `/jobs/:id` | Employer | Update a job |
| DELETE | `/jobs/:id` | Employer | Delete a job |

#### Application Routes — `/api/applications`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/jobs/:id/apply` | Jobseeker | Apply for a job |
| GET | `/applications` | Employer | Get all applications for their jobs |
| GET | `/applications/my-applications` | Jobseeker | Get own applications |
| GET | `/applications/:id` | Protected | Get single application |
| PATCH | `/applications/:id` | Employer | Update application status |

#### Notification Routes — `/api/notifications`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/notifications` | Protected | Get user notifications |
| PATCH | `/notifications/read-all` | Protected | Mark all as read |
| PATCH | `/notifications/:id` | Protected | Mark single as read |
| DELETE | `/notifications/:id` | Protected | Delete notification |

#### Admin Routes — `/api/admin`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/admin/stats` | Admin | Get platform statistics |
| GET | `/admin/jobs` | Admin | Get all jobs |
| GET | `/admin/jobs/pending` | Admin | Get pending jobs |
| PATCH | `/admin/jobs/:id` | Admin | Approve or reject job |
| GET | `/admin/users` | Admin | Get all users |
| DELETE | `/admin/users/:id` | Admin | Delete a user |

### Authentication & Authorization

JobConnect uses **JWT (JSON Web Tokens)** for authentication and **Role-Based Access Control (RBAC)** for authorization.

**Three roles:**
- `jobseeker` — can browse jobs, apply, track applications
- `employer` — can post jobs, review applications, update status
- `admin` — can approve jobs, manage users, view stats

**How it works:**
1. User registers/logs in → receives JWT token
2. Token included in `Authorization: Bearer <token>` header
3. `protect` middleware verifies token on protected routes
4. `authorize(...roles)` middleware checks user role

### Real-time Notifications (Socket.io)

Every user joins a personal room named after their user ID:
```
socket.on("join-user", (userId) => socket.join(userId))
```

Events emitted:
| Event | Trigger | Recipient |
|---|---|---|
| `new-notification` | Someone applies for a job | Employer |
| `new-notification` | Application status changes | Jobseeker |
| `new-notification` | Job approved/rejected | Employer |
| `new-job-pending` | Employer posts a job | Admin |

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account

### Installation

```bash
# Clone the repository
git clone https://github.com/developer866/jobconnect.git
cd jobconnect/jobconnect-server

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

### Environment Variables

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Run the server

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

### API Documentation

Once running, visit:
```
http://localhost:5000/api-docs
```

---

## User Flow

### Jobseeker Flow
```
Register → Complete profile → Browse jobs
→ Apply with cover letter → Track status
→ Get notified when accepted/rejected
```

### Employer Flow
```
Register company → Post job → Awaits admin approval
→ Job goes live → Receive applications
→ Review candidates → Accept or reject
→ Candidate gets notified instantly
```

### Admin Flow
```
Login → View pending jobs → Approve or reject
→ Employer gets notified → Monitor platform stats
```

---

## Author

**Ayeni Opeyemi Joseph**
- Portfolio: [ayeni-opeyemi.vercel.app](https://ayeni-opeyemi.vercel.app)
- GitHub: [@developer866](https://github.com/developer866)
- Email: opeyemijoseph090@gmail.com

---

## License

MIT
