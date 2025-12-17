# Floor Plan Analyzer

This application uses Next.js, Shadcn/UI, Tailwind CSS, and Anthropic's Claude API to analyze floor plan images and provide detailed information about rooms, dimensions, and areas.

## Features

- Upload floor plan images
- AI-powered analysis of room dimensions and areas
- Detailed breakdown of rooms and features
- Modern UI with Shadcn components
- Basic authentication protection

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Anthropic Claude API key (obtain from [Anthropic Console](https://console.anthropic.com/))

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd floor-plan-analyzer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` to add your Anthropic API key and set up basic authentication credentials:
   
   ```
   ANTHROPIC_API_KEY=your_api_key_here
   
   # Basic Authentication
   BASIC_AUTH_USERNAME=your_username
   BASIC_AUTH_PASSWORD=your_secure_password
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application. You'll be prompted to enter the username and password you set in the `.env` file.

## Deployment

This project is configured for deployment on Vercel:

1. Push your code to a GitHub repository.
2. Import the project in Vercel.
3. Set the environment variables in the Vercel dashboard:
   - `ANTHROPIC_API_KEY` - Your Claude API key
   - `BASIC_AUTH_USERNAME` - Username for basic auth
   - `BASIC_AUTH_PASSWORD` - Password for basic auth
   
   **Important**: These environment variables must be set in the Vercel dashboard under "Settings" > "Environment Variables". They cannot be defined in vercel.json.
   
4. Deploy!

## Security Notes

- The basic authentication is implemented using Next.js middleware
- API routes are excluded from authentication to allow proper functioning
- Be sure to use strong, unique credentials for the basic auth
- For production use, consider additional security measures beyond basic auth

## How it Works

1. Users upload a floor plan image through the form.
2. The image is sent to Claude API for analysis.
3. Claude identifies rooms, their dimensions, and areas in the floor plan.
4. The results are displayed in a structured format showing each room's details.

## Built With

- [Next.js](https://nextjs.org/) - React framework
- [Shadcn/UI](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Anthropic Claude API](https://www.anthropic.com/claude) - AI image analysis
