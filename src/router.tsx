import { Outlet, createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { HomePage } from './HomePage';
import { WorkPage } from './WorkPage';

const rootRoute = createRootRoute({
  component: () => <Outlet />,
  notFoundComponent: () => (
    <main className="grid min-h-screen place-items-center bg-[#1a1a1a] p-8 text-center text-white">
      <div><p className="text-xs uppercase opacity-60">404 / Persi nella nebbia</p><a className="mt-5 block text-5xl font-extralight tracking-tight" href="/">Torna alla luce →</a></div>
    </main>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const workRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/works/$workSlug',
  component: WorkPage,
});

const routeTree = rootRoute.addChildren([indexRoute, workRoute]);

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
