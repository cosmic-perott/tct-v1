// Using the exact AGENT_ID provided
const AGENT_ID = 'projects/project-b86e0955-d007-4347-bf5/locations/global/agents/agent_1779541809524';

let currentSessionId: string | null = null;
// Generate a unique user ID for this browser session
const userId = "user-" + Math.random().toString(36).substring(7);

const getBaseUrl = () => {
  const parts = AGENT_ID.split('/');
  // Extract location (e.g., 'global') from the ID
  const locationId = parts.length > 3 ? parts[3] : 'us-central1';
  
  // Construct the endpoint as per ADK instructions
  return `https://${locationId}-aiplatform.googleapis.com/v1/${AGENT_ID}`;
};

export const initChat = async () => {
  const baseUrl = getBaseUrl();
  
  // Step 1: Create a Session
  const response = await fetch(`${baseUrl}:query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      classMethod: 'async_create_session',
      input: { user_id: userId }
    })
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Failed to create ADK session (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  currentSessionId = data.output.id;
};

export const sendMessageStream = async function* (message: string) {
  if (!currentSessionId) {
    await initChat();
  }

  const baseUrl = getBaseUrl();
  
  // Step 2: Stream Query using the session ID
  const response = await fetch(`${baseUrl}:streamQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      classMethod: 'async_stream_query',
      input: {
        user_id: userId,
        session_id: currentSessionId,
        message: message
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Failed to stream query from ADK (${response.status}): ${errorText}`);
  }

  if (!response.body) {
    throw new Error("Response body is null");
  }

  const decoder = new TextDecoder();
  let buffer = '';
  
  // @ts-ignore - async iteration over ReadableStream is supported in modern browsers
  for await (const chunk of response.body) {
    buffer += decoder.decode(chunk, { stream: true });
    
    // Split by newline to handle NDJSON, keeping the last incomplete line in the buffer
    const lines = buffer.split('\n');
    buffer = lines.pop() || ''; 
    
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const data = JSON.parse(line);
        
        // Extract the text part from the ADK response structure
        if (data.content && data.content.parts && data.content.parts.length > 0) {
          const text = data.content.parts[0].text;
          if (text) {
            yield text;
          }
        }
      } catch (e) {
        console.warn("Failed to parse ADK chunk line:", line);
      }
    }
  }

  // Process any remaining data in the buffer
  if (buffer.trim()) {
    try {
      const data = JSON.parse(buffer);
      if (data.content && data.content.parts && data.content.parts.length > 0) {
        const text = data.content.parts[0].text;
        if (text) {
          yield text;
        }
      }
    } catch (e) {
      console.warn("Failed to parse final ADK chunk:", buffer);
    }
  }
};

export const resetChat = () => {
  currentSessionId = null;
};
