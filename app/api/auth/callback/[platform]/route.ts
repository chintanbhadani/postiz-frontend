import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ platform: string }> }
) {
  const { platform } = await params;
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  // If the provider returned an error instead of a code
  const error = searchParams.get('error');
  if (error) {
    return NextResponse.redirect(new URL(`/channels?error=${error}`, request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/channels?error=no_code', request.url));
  }

  // Get the cookies from the incoming request (needs jwt to auth with backend)
  const cookieStore = await cookies();
  const jwt = cookieStore.get('jwt')?.value;

  if (!jwt) {
    return NextResponse.redirect(new URL('/channels?error=unauthorized', request.url));
  }

  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3005/api';

    // Forward the code and state to our NestJS backend
    await axios.get(`${backendUrl}/integrations/${platform}/callback`, {
      params: { code, state },
      headers: {
        Cookie: `jwt=${jwt}`
      }
    });

    // Successfully saved the integration in the backend
    return NextResponse.redirect(new URL('/channels?success=true', request.url));
  } catch (err: any) {
    console.error('Failed to complete OAuth handshake:', err?.response?.data || err.message);
    const msg = err?.response?.data?.message || 'integration_failed';
    return NextResponse.redirect(new URL(`/channels?error=${msg}`, request.url));
  }
}
