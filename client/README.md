# Logic Looper 🧩

An enterprise-grade, high-performance procedural puzzle generation platform designed to challenge cognitive and logical reasoning. Built using an **Offline-First architecture**, **React 18**, **Node.js**, **Prisma ORM**, and **PostgreSQL**, this application renders complex structural grids smoothly while ensuring zero data loss during network disruptions.

## 🚀 Key Achievements (Impact Analytics)

* **Procedural Logic Engine:** Engineered and integrated 5+ distinct procedural logic modes (Binary Logic, Number Matrices, Spatial Mapping, Sequence Solvers, and Pattern Matching) via algorithmic optimization and bitwise operations.
* **Optimized Dashboard Architecture:** Designed a unified rendering interface supporting multiple simultaneous puzzle grids with seamless performance, leveraging specialized React state synchronization and component modularity.
* **Full-Stack Synchronization:** Architected a robust data layer leveraging Prisma ORM to efficiently sync local player state with a Neon-hosted PostgreSQL instance upon network restoration.
* **Production-Ready Delivery:** Developed the system under strict corporate software submission requirements, executing a comprehensive 15-point technical deliverable audit.

---

## 🛠️ Tech Stack & Architecture

### Frontend (Client)
* **Framework:** React.js (Vite configuration)
* **Styling:** Tailwind CSS (utility-first components)
* **State Management:** React Context API / Custom Hooks
* **Local Persistence:** Client-side IndexedDB

### Backend (Server)
* **Runtime:** Node.js (ES Module standard, `"type": "module"`)
* **Framework:** Express.js (v5.x router pipeline)
* **ORM:** Prisma ORM
* **Database:** PostgreSQL (Neon Serverless Adapter)
* **Real-time Protocol:** WebSockets (`ws` package)

---

## 📁 Repository Structure

```text
DAILY_PUZZLE_LOGIC_GAME/
│
├── client/                 # Frontend SPA (Vite + React)
│   ├── src/
│   │   ├── app/           # App level logic & store config
│   │   ├── components/    # Reusable structural UI blocks
│   │   ├── context/       # State sync & online/offline contexts
│   │   ├── engine/        # Matrix manipulation & procedural generators
│   │   ├── utils/         # Base API instances and network managers
│   │   └── main.jsx       # App bootstrap layer
│   └── package.json
│
├── server/                 # REST & Real-time Express Engine
│   ├── index.js           # Server application entry point
│   ├── prisma/            # Relational database schemas and migrations
│   └── package.json
│
└── shared/                # Cross-boundary shared utilities
    └── constants.js       # Shared static definitions & configuration mappings

⚙️ Local Development Setup

Follow these structured steps to provision, configure, and execute the complete full-stack environment locally for development and verification testing.
PrerequisitesRuntime:
 Node.js ($v18.x$ or higher)Database: PostgreSQL instance (Local installation or cloud-hosted via Neon)
 1. Clone Repository & Install DependenciesInitialize the local repository and install the isolated node modules required for both the client application and the backend service.

 # Clone the remote repository
  git clone https://github.com/your-username/logic-looper.git
  cd logic-looper

# Provision frontend dependencies
  cd client && npm install

# Provision backend dependencies
  cd ../server && npm install

2. Configure Environment Variables
   # Production-ready relational database connection string
  DATABASE_URL="postgresql://<username>:<password>@<host>:<port>/<db_name>?sslmode=require"

# Application runtime port allocation
    PORT=4000

3. Initialize Database & Generate ORM Artifacts
  cd server
   npm run build

4. Application Execution Pipeline
  cd server
  npm start

Target B: Initialize Frontend Development Server
  cd client
   npm run dev