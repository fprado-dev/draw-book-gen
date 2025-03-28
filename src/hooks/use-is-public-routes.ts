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
