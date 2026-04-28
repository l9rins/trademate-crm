# Software Test Plan — TradeMate CRM

## 1. Introduction

### 1.1 Purpose
This Software Test Plan defines the testing strategy, scope, and procedures for validating the TradeMate CRM system after the Vertical Slice Architecture refactoring. It ensures all functional requirements remain operational post-refactoring.

### 1.2 Project Overview
TradeMate CRM is a full-stack customer relationship management platform built for tradespeople. It consists of a **Spring Boot 3.3** backend (Java 21) and a **React + Vite** frontend, backed by PostgreSQL and secured via JWT authentication.

### 1.3 Scope
This plan covers:
- **Backend**: All REST API endpoints across 4 feature slices (Auth, Client, Job, Dashboard)
- **Frontend**: All UI components across 5 feature modules (Auth, Dashboard, Clients, Jobs, Settings)
- **Integration**: Cross-slice dependencies and shared infrastructure

### 1.4 Objectives
- Verify no functional regression after architecture refactoring
- Validate all CRUD operations for Clients and Jobs
- Confirm authentication and authorization flows work correctly
- Ensure UI components render and interact properly

---

## 2. Test Strategy

### 2.1 Testing Levels

| Level | Scope | Tools |
|-------|-------|-------|
| Unit Testing | Individual components, services, utilities | Vitest, React Testing Library |
| Integration Testing | API endpoint validation, cross-slice dependencies | Manual + Automated |
| System Testing | End-to-end user workflows | Manual browser testing |
| Regression Testing | Full re-validation post-refactoring | Automated + Manual |

### 2.2 Testing Approach
- **Automated Unit Tests**: Cover core business logic in each feature slice
- **Manual Functional Tests**: Validate UI workflows that require visual/interaction verification
- **Build Verification**: Ensure production builds complete without errors

### 2.3 Test Environment

| Component | Technology | Version |
|-----------|-----------|---------|
| Backend Runtime | Java | 21 |
| Backend Framework | Spring Boot | 3.3.0 |
| Frontend Runtime | Node.js | 18+ |
| Frontend Framework | React + Vite | 19.x / 5.x |
| Test Runner (Frontend) | Vitest | 4.1.5 |
| Test Utilities | React Testing Library | 16.x |
| Database | PostgreSQL (Neon) | 15+ |
| Browser | Chrome/Edge | Latest |

---

## 3. Test Items

### 3.1 Backend Feature Slices

#### Auth Slice (`com.trademate.features.auth`)
| ID | Test Case | Type | Priority |
|----|-----------|------|----------|
| BE-AUTH-01 | User registration with valid credentials | Functional | Critical |
| BE-AUTH-02 | User registration with duplicate username/email | Negative | High |
| BE-AUTH-03 | User login with valid credentials returns JWT | Functional | Critical |
| BE-AUTH-04 | User login with invalid credentials returns 401 | Negative | High |
| BE-AUTH-05 | Logout endpoint returns 204 No Content | Functional | Medium |
| BE-AUTH-06 | JWT token is valid and contains correct username | Functional | Critical |

#### Client Slice (`com.trademate.features.client`)
| ID | Test Case | Type | Priority |
|----|-----------|------|----------|
| BE-CLI-01 | List all clients for authenticated user | Functional | Critical |
| BE-CLI-02 | Create new client with valid data | Functional | Critical |
| BE-CLI-03 | Update existing client | Functional | High |
| BE-CLI-04 | Delete client by ID | Functional | High |
| BE-CLI-05 | Client list is scoped to authenticated user only | Security | Critical |

#### Job Slice (`com.trademate.features.job`)
| ID | Test Case | Type | Priority |
|----|-----------|------|----------|
| BE-JOB-01 | List all jobs for authenticated user | Functional | Critical |
| BE-JOB-02 | Create new job with valid data | Functional | Critical |
| BE-JOB-03 | Create job with client association | Functional | High |
| BE-JOB-04 | Update existing job (title, status, date) | Functional | High |
| BE-JOB-05 | Delete job by ID | Functional | High |
| BE-JOB-06 | Default status is PENDING on creation | Functional | Medium |

#### Dashboard Slice (`com.trademate.features.dashboard`)
| ID | Test Case | Type | Priority |
|----|-----------|------|----------|
| BE-DASH-01 | Dashboard returns correct totalJobs count | Functional | High |
| BE-DASH-02 | Dashboard returns correct pendingJobs count | Functional | High |
| BE-DASH-03 | Dashboard returns correct completedJobs count | Functional | High |
| BE-DASH-04 | Dashboard returns correct totalClients count | Functional | High |
| BE-DASH-05 | Dashboard returns today's scheduled jobs | Functional | Medium |

### 3.2 Frontend Feature Modules

#### Auth Module (`features/auth`)
| ID | Test Case | Type | Priority |
|----|-----------|------|----------|
| FE-AUTH-01 | Login form renders with username and password fields | UI | Critical |
| FE-AUTH-02 | Login with valid credentials navigates to dashboard | Functional | Critical |
| FE-AUTH-03 | Login failure shows error toast | Functional | High |
| FE-AUTH-04 | Registration form validates required fields | Validation | High |
| FE-AUTH-05 | AuthContext stores token in localStorage | Functional | Critical |
| FE-AUTH-06 | Logout clears localStorage and redirects | Functional | Critical |

#### Dashboard Module (`features/dashboard`)
| ID | Test Case | Type | Priority |
|----|-----------|------|----------|
| FE-DASH-01 | Dashboard shows loading skeleton on initial load | UI | Medium |
| FE-DASH-02 | Dashboard displays all 4 metric cards | UI | High |
| FE-DASH-03 | Metric cards show correct values from API | Functional | Critical |
| FE-DASH-04 | User greeting displays logged-in username | Functional | High |
| FE-DASH-05 | Error state renders when API fails | Functional | High |
| FE-DASH-06 | "Initialize Job" button links to /jobs | Navigation | Medium |

#### Clients Module (`features/clients`)
| ID | Test Case | Type | Priority |
|----|-----------|------|----------|
| FE-CLI-01 | Client list renders with correct data | UI | Critical |
| FE-CLI-02 | Search filters clients by name/email/phone | Functional | High |
| FE-CLI-03 | Create client sheet opens on button click | UI | High |
| FE-CLI-04 | Empty state shown when no clients exist | UI | Medium |
| FE-CLI-05 | Edit client populates form with existing data | Functional | High |
| FE-CLI-06 | Delete confirmation dialog appears before deletion | Functional | High |

#### Jobs Module (`features/jobs`)
| ID | Test Case | Type | Priority |
|----|-----------|------|----------|
| FE-JOB-01 | Job list renders with correct data | UI | Critical |
| FE-JOB-02 | Search filters jobs by title/client/address | Functional | High |
| FE-JOB-03 | Create job sheet opens on button click | UI | High |
| FE-JOB-04 | Status badges render correct colors | UI | Medium |
| FE-JOB-05 | Jobs without clients show "No Client" fallback | Functional | Medium |
| FE-JOB-06 | Optimistic updates reflect immediately in UI | Functional | High |

#### Settings Module (`features/settings`)
| ID | Test Case | Type | Priority |
|----|-----------|------|----------|
| FE-SET-01 | Settings page renders with tab navigation | UI | Medium |
| FE-SET-02 | Profile tab shows editable username/email | UI | Medium |
| FE-SET-03 | Save button calls API to update profile | Functional | Medium |

### 3.3 Shared Infrastructure

| ID | Test Case | Type | Priority |
|----|-----------|------|----------|
| SHARED-01 | API client attaches Bearer token to requests | Functional | Critical |
| SHARED-02 | API client handles 401 by clearing token | Security | High |
| SHARED-03 | JWT filter correctly authenticates valid tokens | Security | Critical |
| SHARED-04 | SecurityConfig allows /api/auth/** without auth | Security | Critical |
| SHARED-05 | CORS configuration allows frontend origins | Infrastructure | High |

---

## 4. Pass/Fail Criteria

### 4.1 Pass Criteria
- All automated tests pass (27/27)
- Frontend production build succeeds without errors
- All Critical priority test cases pass
- No data loss or corruption during CRUD operations

### 4.2 Fail Criteria
- Any Critical test case fails
- Frontend build produces errors
- Authentication/authorization bypass is possible
- Data integrity issues in database operations

---

## 5. Test Deliverables
- This Software Test Plan document
- Automated test suite (Vitest + React Testing Library)
- Full Regression Test Report (`FullRegressionReport.md`)
- Git commit history documenting all changes

---

## 6. Schedule

| Phase | Activity | Status |
|-------|----------|--------|
| Phase 1 | Branch creation & setup | ✅ Complete |
| Phase 2 | Vertical Slice refactoring | ✅ Complete |
| Phase 3 | Test plan development | ✅ Complete |
| Phase 4 | Automated test implementation | ✅ Complete |
| Phase 5 | Full regression testing | ✅ Complete |
| Phase 6 | Report generation | ✅ Complete |
