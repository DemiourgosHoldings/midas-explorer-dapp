import { RouteObject } from 'react-router-dom';
import { ErrorElement } from 'components/ErrorElement';
import { SHARE_PREFIX } from 'config';
import { capitalize } from 'helpers';
import { withPageTitle } from '../helpers/withPageTitle';

import { TitledRouteObject } from '../routes';

export const wrapRoutes = (routes: TitledRouteObject[]): RouteObject[] =>
  routes.map((route) => {
    if (route.path) {
      const sharePrefix = SHARE_PREFIX ? `${capitalize(SHARE_PREFIX)} ` : '';
      const title = route.title
        ? `${route.title} • MultiversX ${sharePrefix}Explorer`
        : `MultiversX ${sharePrefix}Explorer`;

      if (route.children && route.children.length > 0) {
        wrapRoutes(route.children);
      }

      route.Component = route.Component
        ? withPageTitle(title, route.Component, route?.preventScroll)
        : route.Component;

      delete route['title'];

      route.errorElement = <ErrorElement />;

      return route;
    }

    route.errorElement = <ErrorElement />;

    return route;
  });
