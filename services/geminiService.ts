let currentSessionId: string | null = null;
// Generate a unique user ID for this browser session
const userId = "user-" + Math.random().toString(36).substring(7);

// The local backend proxy endpoint
const PROXY_URL = '/api/agent';

export const initChat = async () => {
  // Step 1: Create a Session via the backend proxy
  const response = await fetch(PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'create_session',
      userId: userId
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Failed to create session via proxy (${response.status}): ${errorData.error || response.statusText}`);
  }

  const data = await response.json();
  if (data.output && data.output.id) {
    currentSessionId = data.output.id;
  } else {
    throw new Error("Invalid session response format from proxy.");
  }
};

export const sendMessageStream = async function* (message: string) {
  if (!currentSessionId) {
    await initChat();
  }

  // Step 2: Stream Query via the backend proxy
  const response = await fetch(PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'stream_query',
      userId: userId,
      sessionId: currentSessionId,
      message: message
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Failed to stream query via proxy (${response.status}): ${errorData.error || response.statusText}`);
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
