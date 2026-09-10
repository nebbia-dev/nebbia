import { Outlet, createRootRoute, createRoute, createRouter, lazyRouteComponent } from '@tanstack/react-router';
import { HomePage } from './HomePage';
import { CareersPage } from './_components/CareersPage';
import { WorkPage } from './_components/WorkPage';

const rootRoute = createRootRoute({
  component: () => <Outlet />,
  notFoundComponent: () => (
    <main className="grid min-h-screen place-items-center bg-[#1a1a1a] p-8 text-center text-white">
      <div><p className="text-xs uppercase opacity-60">404 / Persi nella nebbia</p><a className="mt-5 block text-5xl font-extralight" href="/">Torna alla luce →</a></div>
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

const careersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/candidati-ora',
  component: CareersPage,
});

const editorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/editor',
  component: lazyRouteComponent(() => import('./_components/ProtectedEditorPage'), 'ProtectedEditorPage'),
});

const routeTree = rootRoute.addChildren([indexRoute, workRoute, careersRoute, editorRoute]);

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
