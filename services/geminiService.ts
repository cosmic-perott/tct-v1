import { GoogleGenAI, Chat } from '@google/genai';

// 1 & 2. Import and initialize GoogleGenAI with Vertex AI enabled
// Safely access process.env in case it's not defined in the browser environment
const apiKey = globalThis.process?.env?.API_KEY || '';
const ai = new GoogleGenAI({ apiKey: apiKey, vertexai: true });

// 3. The exact project and agent path string updated to us-central1
const AGENT_PATH = "projects/project-b86e0955-d007-4347-bf5/locations/us-central1/agents/agent_1779541809524";

let chatSession: Chat | null = null;

export const initChat = () => {
  // Initialize the chat session using the agent path as the model
  chatSession = ai.chats.create({
    model: AGENT_PATH,
  });
};

export const sendMessageStream = async function* (message: string) {
  if (!chatSession) {
    initChat();
  }
  
  if (!chatSession) {
    throw new Error("Failed to initialize chat session.");
  }

  try {
    // 4. Stream the text chunks directly back
    const responseStream = await chatSession.sendMessageStream({ message });
    for await (const chunk of responseStream) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error) {
    console.error("Error communicating with Agent:", error);
    throw error;
  }
};

export const resetChat = () => {
  chatSession = null;
};
