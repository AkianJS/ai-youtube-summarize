# 🎥 AI YouTube Summary

Welcome to **AI YouTube Summary**! This tool allows you to input a YouTube URL and get a summary of the video, powered by AI. 

## 🛠️ Installation & Setup

### 1. Clone the Repository

To get started, clone the repository by running the following command:

```bash
git clone https://github.com/AkianJS/ai-youtube-summarize.git
```

### 2. Install Dependencies

This project uses `pnpm` for package management. If you don't have it installed, you can install it globally by running:

```bash
npm install -g pnpm
```

Once `pnpm` is installed, navigate to the cloned directory and install the project dependencies:

```bash
cd ai-youtube-summarize
pnpm install
```

### 3. Set Up Environment Variables

To make the app work in development, you'll need to create a `.env` file in the root of the project and add your `GROQ_API_KEY`. Here's how:

1. In the project root, create a `.env` file:
    ```bash
    touch .env
    ```

2. Open the `.env` file and add the following line, replacing `<your-groq-api-key>` with your actual GROQ API key:
    ```bash
    GROQ_API_KEY=<your-groq-api-key>
    ```

### 4. Run the Development Server

To start the development server, run the following command:

```bash
pnpm run dev
```

Now open [http://localhost:3000](http://localhost:3000) in your browser to see the app in action.

## 📋 How to Use

Once you have the app running, you can summarize YouTube videos by pasting their URLs into the provided input field. The AI will process the video and provide a summary of its content.
