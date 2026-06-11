import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = (process.env.BACKEND_INTERNAL_URL || "http://localhost:8000") + "/api";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3001";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  const { platform } = await params;
  const { searchParams } = request.nextUrl;

  const code = searchParams.get("code") || searchParams.get("oauth_token") || "";
  const state = searchParams.get("state") || searchParams.get("oauth_verifier") || "";
  const oauthError = searchParams.get("error") || searchParams.get("error_description") || "";

  const uiBase = `${FRONTEND_URL}/auth/callback/${platform}`;

  // Pass OAuth provider errors straight through to the UI
  if (oauthError) {
    return NextResponse.redirect(`${uiBase}?error=${encodeURIComponent(oauthError)}`);
  }

  if (!code) {
    return NextResponse.redirect(
      `${uiBase}?error=${encodeURIComponent("Authorization code is missing from callback URL.")}`
    );
  }

  // Read the JWT from the cookie set at login
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return NextResponse.redirect(
      `${uiBase}?error=${encodeURIComponent("You must be logged in. Please log in and try again.")}`
    );
  }

  try {
    const backendRes = await fetch(
      `${BACKEND_URL}/integrations/${platform}/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await backendRes.json();

    if (!backendRes.ok) {
      const message = data?.message || "OAuth authentication failed";
      return NextResponse.redirect(
        `${uiBase}?error=${encodeURIComponent(message)}`
      );
    }

    if (data.pending && data.accessToken) {
      // isBetweenSteps — redirect to page-picker UI with the access token
      const response = NextResponse.redirect(`${uiBase}?step=select_page`);
      // Store the access token in a short-lived cookie for the page-picker UI to read
      response.cookies.set("oauth_access_token", data.accessToken, {
        httpOnly: false, // must be readable by client JS
        maxAge: 600,     // 10 minutes
        path: "/",
        sameSite: "lax",
      });
      return response;
    }

    // Direct success — integration saved, go to success UI
    return NextResponse.redirect(`${uiBase}?step=success`);
  } catch (err: any) {
    console.error(`Route Handler error during ${platform} OAuth callback:`, err);
    return NextResponse.redirect(
      `${uiBase}?error=${encodeURIComponent(err?.message || "Unexpected server error during authentication.")}`
    );
  }
}
