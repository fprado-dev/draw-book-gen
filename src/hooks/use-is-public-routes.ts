import { usePathname } from 'next/navigation';

const publicRoutes = [
  '/sign-in',
  '/sign-up',
  '/404',
  '/forgot-password',
  '/sales',
];

export const useIsPublicRoute = () => {
  const pathname = usePathname();

  return publicRoutes.includes(pathname);
};

export const useIsEditorRoute = () => {
  const pathname = usePathname();
  const bookRoutePattern =
    /^\/books\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
  return bookRoutePattern.test(pathname);
};
