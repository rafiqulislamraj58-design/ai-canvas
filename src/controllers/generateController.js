import { GoogleGenerativeAI } from "@google/generative-ai";

// Gemini initialize kora hocche
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateCode = async (req, res) => {
  try {
    const { image, hint } = req.body;

    // Validation: Image thaktei hobe
    if (!image || !image.startsWith("data:image/png;base64,")) {
      return res.status(400).json({
        error: "Invalid request",
        message: "A base64 PNG image is required.",
      });
    }

    // Base64 string theke meta data tuku bad deya
    const base64Data = image.replace(/^data:image\/png;base64,/, "");

    const model = genAI.getGenerativeModel({ model: process.env.MODEL_NAME });

    const prompt = `Role: expert React and Tailwind engineer interpreting a hand-drawn wireframe.
Output: a single default-exported React functional component, Tailwind classes only, no external imports, no network calls.
Keep the code minimal and fast to generate. Avoid overly complex SVG decorations unless explicitly drawn.
Text and layout must follow what is drawn. Missing details are filled with sensible placeholders.
Reply with code only, no explanation outside the code.
${hint ? `Additional User Hint: ${hint}` : ""}`;

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: "image/png",
      },
    };

    // Gemini ke call kora hocche
    const result = await model.generateContent([prompt, imagePart]);
    let aiResponseText = result.response.text();

    // Strip Markdown code fences as per SRS requirements[cite: 5]
    aiResponseText = aiResponseText.replace(
      /^```(tsx|jsx|javascript|typescript)?\n/i,
      "",
    );
    aiResponseText = aiResponseText.replace(/```$/i, "");

    // Standard response body form[cite: 5]
    res.status(200).json({
      code: aiResponseText.trim(),
      note: "Code generated successfully via Gemini.",
    });
  } catch (error) {
    console.error("Gemini AI Generation Error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to generate code from the image.",
    });
  }
};
