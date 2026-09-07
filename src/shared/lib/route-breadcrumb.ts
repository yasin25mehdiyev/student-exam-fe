import { ActivatedRoute } from '@angular/router';

export interface BreadcrumbEntry {
  readonly labelKey: string;
  readonly url: string;
}

/** Walks the activated route tree collecting each segment's `data.breadcrumb` key, deduped
 *  for empty-path index routes that inherit their parent's `data` (Angular's emptyOnly
 *  param/data inheritance) and would otherwise re-assert the same breadcrumb. */
export function collectBreadcrumbTrail(route: ActivatedRoute): BreadcrumbEntry[] {
  const crumbs: BreadcrumbEntry[] = [];
  let node: ActivatedRoute | null = route.root;
  let url = '';

  while (node) {
    const child: ActivatedRoute | null = node.firstChild;
    if (child?.snapshot) {
      const segments = child.snapshot.url.map((segment) => segment.path);
      if (segments.length > 0) {
        url += `/${segments.join('/')}`;
      }
      const breadcrumbKey = child.snapshot.data['breadcrumb'] as string | undefined;
      if (breadcrumbKey) {
        crumbs.push({ labelKey: breadcrumbKey, url: url || '/' });
      }
    }
    node = child;
  }

  return crumbs.filter((crumb, index) => crumb.url !== crumbs[index - 1]?.url);
}
