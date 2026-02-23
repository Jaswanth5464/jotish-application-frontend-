# Employee Management Dashboard

A comprehensive, interactive Employee Management Dashboard built with React, TypeScript, and Tailwind CSS. This project was developed to fulfill the requirements of a frontend assessment, demonstrating proficiency in modern web development practices, API integration, data visualization, and device hardware interaction.

## 🚀 Live Demo
**[View Live Application on Vercel](https://jotish-git-main-jaswanths-projects-d3e93672.vercel.app/)**

## 📁 Assessment Submission Links


- **Screenshots of important screens** (Login, Dashboard, Charts, Map, Camera)
        
- **A screen recording of the end-to-end working app**

- https://drive.google.com/file/d/1di0ORQdxEMp63owNmyfT1AeDK_zqsY7F/view?usp=sharing

## ✨ Key Features

Based on the assessment requirements, this application implements the following core features:

1. **Authentication System**
   - Protected routes using React Router.
   - Mock login interface (Demo credentials provided below).
   - Context API for global authentication state management.

2. **API Integration & Data Handling**
   - Fetches employee data from a remote endpoint (`https://backend.jotish.in/backend_dev/gettabledata.php`).
   - Robust error handling and data normalization to handle unexpected API response structures (ensuring the app doesn't crash if the API returns an object instead of an array).

3. **Employee Directory & Search**
   - Grid layout displaying employee cards.
   - Real-time search/filtering by Name, Department, or City.

4. **Detailed Employee Profiles**
   - Dynamic routing to view individual employee details.
   - Displays comprehensive information including salary, age, gender, and contact details.

5. **Hardware Integration (Webcam)**
   - Integrated `react-webcam` to capture profile photos directly from the browser.
   - Post-capture image manipulation (applying CSS filters like Grayscale, Sepia, Blur, etc.).
   - Ability to download the captured and filtered image.

6. **Data Visualization (Analytics)**
   - Interactive charts built with `recharts`.
   - **Bar Charts**: Top 10 Highest Salaries, Top 5 Cities by Employee Count.
   - **Pie Chart**: Department Distribution.
   - Key Performance Indicators (KPIs) for Total Employees, Average Salary, etc.

7. **Geographic Distribution (Map View)**
   - Interactive map built with `react-leaflet` and OpenStreetMap.
   - Plots employee locations based on their city.
   - Custom map markers with popups showing the employees residing in that specific city.

## 🛠️ Technology Stack

- **Framework**: React 19 (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v7
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Maps**: React Leaflet & Leaflet
- **Camera**: React Webcam

## 🔐 Demo Credentials

To access the application, use the following credentials on the login screen:
- **Username**: `testuser`
- **Password**: `Test123`

## 💻 Getting Started (Local Development)

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.

## 🚀 Deployment to Vercel

This project is fully configured for seamless deployment to Vercel. It includes a `vercel.json` file to handle Single Page Application (SPA) routing, ensuring that direct links to routes (like `/charts` or `/map`) work correctly without returning 404 errors.

### Steps to Deploy:
1. Push your code to a GitHub, GitLab, or Bitbucket repository.
2. Log in to [Vercel](https://vercel.com/).
3. Click **Add New...** > **Project**.
4. Import your repository.
5. Vercel will automatically detect that it's a Vite/React project.
6. Leave the default build settings (`npm run build` and `dist` output directory).
7. Click **Deploy**.

## 🧠 Assessment Architecture Notes

- **Robust API Parsing**: The `fetchEmployees` function in `src/services/api.ts` was specifically engineered to handle unpredictable backend responses. It checks if the response is an array, an object containing a data array, or a nested object, ensuring the UI components always receive a predictable `Employee[]` array. This prevents common runtime errors like `employees.filter is not a function`.
- **State Management**: React Context (`AuthContext`) is used for authentication state to avoid prop drilling, while local state (`useState`) is used for component-specific data like search terms and camera status.
- **Responsive Design**: Tailwind CSS utility classes are used extensively to ensure the application looks great on mobile, tablet, and desktop devices.
