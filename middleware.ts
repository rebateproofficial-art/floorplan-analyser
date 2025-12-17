import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Make sure we're using the correct runtime for Vercel
export const runtime = 'experimental-edge';

export function middleware(request: NextRequest) {
  // Get the authorization header
  const authHeader = request.headers.get('authorization');
  
  // Skip auth for API routes to allow them to function
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Get credentials from environment variables
  const username = process.env.BASIC_AUTH_USERNAME;
  const password = process.env.BASIC_AUTH_PASSWORD;

  // If auth is not configured, skip the check
  if (!username || !password) {
    console.warn('Basic auth credentials not configured, skipping authentication');
    return NextResponse.next();
  }

  // Allow access if credentials are correct
  if (authHeader) {
    const authValue = authHeader.split(' ')[1];
    try {
      const [authUser, authPass] = atob(authValue).split(':');
      
      if (authUser === username && authPass === password) {
        return NextResponse.next();
      }
    } catch (error) {
      console.error('Error parsing auth header:', error);
    }
  }

  // Otherwise deny access
  const response = new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  });

  return response;
}

// Configure matcher to only run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Images, videos, fonts, etc. (static assets)
     * - API routes (already handled in the middleware function)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/.*|.*\\.(?:jpg|jpeg|gif|png|svg|webp)).*)',
  ],
}; 