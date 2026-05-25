import { NextRequest, NextResponse } from 'next/server';
import { GoogleAuth } from 'google-auth-library';

// Your specific Agent ID updated to us-central1
const AGENT_ID = 'projects/project-b86e0955-d007-4347-bf5/locations/us-central1/agents/agent_1779541809524';
const LOCATION = 'us-central1'; 

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, userId, sessionId, message } = body;

    // 1. Handle Google Cloud Authentication securely on the server
    // This configuration utilizes Application Default Credentials (ADC).
    // It will automatically use your authenticated Cloud Shell account layout 
    // or the deployment container's environment default credentials block.
    const auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });
    
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();

    if (!accessToken.token) {
      throw new Error("Failed to retrieve access token from Google Auth.");
    }

    const baseUrl = `https://${LOCATION}-aiplatform.googleapis.com/v1/${AGENT_ID}`;

    // 2. Route: Create Session
    if (action === 'create_session') {
      const response = await fetch(`${baseUrl}:query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken.token}`,
        },
        body: JSON.stringify({
          classMethod: 'async_create_session',
          input: { user_id: userId }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`ADK Session Error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      return NextResponse.json(data);
    }

    // 3. Route: Stream Query
    if (action === 'stream_query') {
      const response = await fetch(`${baseUrl}:streamQuery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken.token}`,
        },
        body: JSON.stringify({
          classMethod: 'async_stream_query',
          input: {
            user_id: userId,
            session_id: sessionId,
            message: message
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`ADK Stream Error (${response.status}): ${errorText}`);
      }

      // Stream the response directly back to the frontend to bypass CORS
      return new NextResponse(response.body, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    return NextResponse.json({ error: 'Invalid action specified' }, { status: 400 });

  } catch (error: any) {
    console.error('Backend Proxy Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}
