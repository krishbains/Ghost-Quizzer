import { clerkMiddleware } from '@clerk/nextjs/server';

const protectedPaths = [
  '/host/', 
  '/dashboard/', // We'll handle subpaths in custom matcher
];

function isProtectedRoute(req: Request) {
  const url = new URL(req.url);
  const path = url.pathname;

  return protectedPaths.some((protectedPath) => {
    if (protectedPath.endsWith('/')) {
      return path.startsWith(protectedPath); // Prefix match for paths like /host/game/abc123
    }
    return path === protectedPath; // Exact match
  });
}

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
