import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { Dashboard } from './pages/Dashboard';
import { CreateProjectPage } from './pages/CreateProjectPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { EditProjectPage } from './pages/EditProjectPage';
import { Layout } from './components/Layout';

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Dashboard,
});

const newProjectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/create',
  component: CreateProjectPage,
});

const projectDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/project/$id',
  component: ProjectDetailPage,
});

const editProjectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/project/$id/edit',
  component: EditProjectPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  newProjectRoute,
  projectDetailRoute,
  editProjectRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
