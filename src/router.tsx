import { Outlet, createRootRoute, createRoute, createRouter, lazyRouteComponent } from '@tanstack/react-router';
import { HomePage } from './HomePage';
import { CareersPage } from './_components/CareersPage';
import { WorkPage } from './_components/WorkPage';
import { useDocumentLanguage } from './language';

function NotFoundPage() {
  const isEnglish = window.location.pathname.startsWith('/en');
  useDocumentLanguage(isEnglish ? 'en' : 'it');

  return (
    <main className="grid min-h-screen place-items-center bg-[#1a1a1a] p-8 text-center text-white">
      <div>
        <p className="text-xs uppercase opacity-60">404 / {isEnglish ? 'Lost in the fog' : 'Persi nella nebbia'}</p>
        <a className="mt-5 block text-5xl font-extralight" href={isEnglish ? '/en' : '/'}>{isEnglish ? 'Back to the light' : 'Torna alla luce'} →</a>
      </div>
    </main>
  );
}

const rootRoute = createRootRoute({
  component: () => <Outlet />,
  notFoundComponent: NotFoundPage,
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

const englishIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/en',
  component: () => <HomePage language="en" />,
});

const englishWorkRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/en/works/$workSlug',
  component: () => <WorkPage language="en" />,
});

const careersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/candidati-ora',
  component: CareersPage,
});

const englishCareersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/en/apply-now',
  component: () => <CareersPage language="en" />,
});

const editorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/editor',
  component: lazyRouteComponent(() => import('./_components/ProtectedEditorPage'), 'ProtectedEditorPage'),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  workRoute,
  careersRoute,
  englishIndexRoute,
  englishWorkRoute,
  englishCareersRoute,
  editorRoute,
]);

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
