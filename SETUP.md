# Local Setup Guide 🚀

Follow these steps to get **SafeServe MBG** running on your local machine.

## Prerequisites
*   **Node.js**: v18 or higher.
*   **npm** or **pnpm**.
*   **Google Gemini API Key**: Obtain one from [Google AI Studio](https://aistudio.google.com/).

## Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/mrbrightsides/safeserve.git
    cd safeserve
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Variables**
    Create a `.env` file in the root directory and add your Gemini API key:
    ```env
    API_KEY=your_gemini_api_key_here
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    The app should now be running at `http://localhost:3000`.

## Key Commands
*   `npm run dev`: Start the development server.
*   `npm run build`: Build the production-ready bundle.
*   `npm run preview`: Preview the production build locally.

## Troubleshooting
*   **429 Errors**: If you encounter "Resource Exhausted" errors, the platform's internal circuit breaker will trigger a 30-second cooldown.
*   **Permission Issues**: The app requires **Camera** and **Geolocation** permissions for certain features (Hygiene Audits & Maps Grounding).

---
Live App: [safeserve-mbg.vercel.app](https://safeserve-mbg.vercel.app/)