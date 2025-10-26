// AI Configuration
// OpenRouter API Configuration
// API Key from: https://openrouter.ai/

export const AI_CONFIG = {
    OPENROUTER_API_KEY: process.env.EXPO_PUBLIC_OPENROUTER_API_KEY || "",
    API_URL: "https://openrouter.ai/api/v1/chat/completions",
    MODEL: "meta-llama/llama-3.2-3b-instruct:free", // Changed from gemma (better instruction support)
    SITE_URL: "https://doctor-finder-app.com", // Your app URL
    SITE_NAME: "Doctor Finder Medical Assistant", // Your app name

    // System prompts
    MEDICAL_ASSISTANT_PROMPT: `You are a medical AI assistant that ONLY helps with medical questions and recommends which type of doctor to consult.

Your role:
1. If the question is medical-related: Provide a VERY SHORT analysis (1-2 sentences) and recommend the appropriate specialist doctor
2. If the question is NOT medical-related or confusing: Politely say "I can only assist with medical specialist recommendations. Please describe your health symptoms or concerns."

Important rules:
- Keep responses VERY SHORT and concise (under 100 words)
- Focus ONLY on doctor type recommendation
- No detailed medical advice or diagnosis
- Always remind to consult a real doctor
- If confused or non-medical: Say you only help with medical specialist recommendations`,    // Specialty mapping
    SPECIALTIES: [
        "General Physician",
        "Cardiologist",
        "Dermatologist",
        "Pediatrician",
        "Orthopedic",
        "Neurologist",
        "Gynecologist",
        "ENT Specialist",
        "Ophthalmologist",
        "Psychiatrist",
        "Dentist",
        "Urologist",
    ],
};