# TradeMate CRM - Granular Task List (40hr Sprint)

## Phase 1: Project Initialization & Infrastructure (Hours: 0-4)
- [/] **Planning & Setup**
    - [x] Create Implementation Plan (ERD, Arch, Risks)
    - [x] Create Granular Task List (this file)
    - [ ] Initialize Git Repository (`git init`, `.gitignore`)
- [ ] **Backend Scaffold**
    - [ ] Initialize Spring Boot Project (Web, JPA, Security, Lombok, Validation)
    - [ ] Configure `application.properties` (PostgreSQL Local/Render env vars)
    - [ ] Create Database Docker Compose file (for local dev)
    - [ ] Verify local application startup (`mvn spring-boot:run`)
- [ ] **Frontend Scaffold**
    - [ ] Initialize Vite + React project (`npm create vite@latest`)
    - [ ] Install Tailwind CSS & Heroicons
    - [ ] Install Core Libs (Axios, React Router, TanStack Query, Zod)
    - [ ] Configure `vite.config.js` (Aliases, proxy)
    - [ ] Clean up boilerplate code
- [ ] **Deployment Skeleton**
    - [ ] Create Render.com Web Service (Backend)
    - [ ] Create Vercel Project (Frontend)
    - [ ] Verify "Hello World" deployment on both

## Phase 2: Backend Core - Auth & Users (Hours: 4-10)
- [ ] **Domain Model: User**
    - [ ] Create `User` Entity (id, username, email, password, role)
    - [ ] Create `UserRepository` interface
- [ ] **Security Layer**
    - [ ] Implement `UserDetails` and `UserDetailsService`
    - [ ] Configure `SecurityFilterChain` (CSRF disable, CORS, stateless session)
    - [ ] Implement JWT Utility (Generate, Validate, Extract Claims)
    - [ ] Create `JwtAuthenticationFilter`
- [ ] **Auth API**
    - [ ] Create `AuthRequest` and `AuthResponse` DTOs
    - [ ] Implement `AuthService` (Register: hash password; Login: validate + sign token)
    - [ ] Create `AuthController` (`/api/auth/register`, `/api/auth/login`)
    - [ ] **Verify**: CURL test registration and login -> receive token

## Phase 3: Backend Core - Clients & Jobs (Hours: 10-18)
- [ ] **Domain Model: Client**
    - [ ] Create `Client` Entity (Many-to-One with User)
    - [ ] Create `ClientRepository`
- [ ] **Client API**
    - [ ] Create Client DTOs (Create, Response)
    - [ ] Implement `ClientService` (CRUD logic, ownership check)
    - [ ] Create `ClientController` (`/api/clients`)
    - [ ] **Verify**: Create client, list clients (ensure scoping to user works)
- [ ] **Domain Model: Job**
    - [ ] Create `Job` Entity (Many-to-One with User & Client, Enums for Status)
    - [ ] Create `JobRepository`
- [ ] **Job API**
    - [ ] Create Job DTOs
    - [ ] Implement `JobService` (CRUD, Status Update)
    - [ ] Create `JobController` (`/api/jobs`)
    - [ ] Add filtering capability (by status, date)
    - [ ] **Verify**: Create Job, Move Status, List Jobs by Date

## Phase 4: Frontend Core - Auth & Layout (Hours: 18-26)
- [ ] **Infrastructure**
    - [ ] Setup `AuthProvider` context (Store token, persistence)
    - [ ] Setup Axios Interceptor (Attach Bearer token, handle 401s)
- [ ] **Auth UI**
    - [ ] Built Login Page (Formik + Zod validation)
    - [ ] Built Register Page
    - [ ] **Verify**: Login redirects to Dashboard
- [ ] **Layout System**
    - [ ] Create `MobileLayout` (Bottom nav or Hamburger menu)
    - [ ] Implement `PrivateRoute` wrapper
    - [ ] Create `Sidebar` (Desktop) / `Navbar` (Mobile)

## Phase 5: Frontend Core - Dashboard & Features (Hours: 26-34)
- [ ] **Dashboard**
    - [ ] Create `DashboardService` (fetch stats/today's jobs)
    - [ ] Build `StatCard` Components
    - [ ] Build `TodayJobsList` Component
- [ ] **Jobs Feature**
    - [ ] Job List View (Filter by Status, Search)
    - [ ] Job Details View
    - [ ] Create Job Form (Client selector, Date picker)
    - [ ] Status Toggle Component (Custom Select/Badge)
- [ ] **Clients Feature**
    - [ ] Client List View
    - [ ] Add/Edit Client Form

## Phase 6: Polish, Test, Refine (Hours: 34-40)
- [ ] **Refinement**
    - [ ] Add Loading Spinners / Skeletons
    - [ ] Add Toast Notifications (Success/Error feedback)
    - [ ] Fix Mobile Responsive issues
- [ ] **Testing**
    - [ ] Write Backend Unit Tests (Service Layer - 80% coverage)
    - [ ] Write Controller Tests (MockMvc)
    - [ ] Write Frontend Smoke Tests (Login flows)
- [ ] **Documentation**
    - [ ] Update README with setup instructions
    - [ ] Verify Swagger/OpenAPI auto-generated docs (`/swagger-ui.html`)
- [ ] **Final Deploy**
    - [ ] Push to Main
    - [ ] Verify Production functionality
