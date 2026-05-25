export const initChat = () => {
  // Initialization is handled per-request via the backend proxy
};

export const sendMessageStream = async function* (message: string) {
  // Construct absolute URL to prevent 'Failed to parse URL' errors in sandboxed environments
  const proxyUrl = new URL('/api/chat', window.location.origin).toString();

  const response = await fetch(proxyUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      instances: [
        { text: message }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Backend Proxy Error (${response.status}): ${errorText}`);
  }

  if (!response.body) {
    throw new Error("Response body is null");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value, { stream: true });
    if (chunk) {
      yield chunk;
    }
  }
};

export const resetChat = () => {
  // Stateless connection
};
