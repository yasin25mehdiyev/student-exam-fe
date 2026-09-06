import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-flag-az',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg viewBox="0 0 24 16" xmlns="http://www.w3.org/2000/svg" class="size-full" aria-hidden="true">
      <rect width="24" height="16" fill="#00b5e2" />
      <rect width="24" height="10.67" y="5.33" fill="#ef3340" />
      <rect width="24" height="5.33" y="10.67" fill="#00a651" />
      <circle cx="9.3" cy="8" r="4.1" fill="#fff" />
      <circle cx="10.5" cy="8" r="3.35" fill="#ef3340" />
      <path
        fill="#fff"
        d="M14.3 6.5 14.55 7.4 15.36 6.94 14.9 7.75 15.8 8 14.9 8.25 15.36 9.06 14.55 8.6 14.3 9.5 14.05 8.6 13.24 9.06 13.7 8.25 12.8 8 13.7 7.75 13.24 6.94 14.05 7.4Z"
      />
    </svg>
  `,
})
export class FlagAz {}

@Component({
  selector: 'app-flag-gb',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg viewBox="0 0 24 16" xmlns="http://www.w3.org/2000/svg" class="size-full" aria-hidden="true">
      <rect width="24" height="16" fill="#012169" />
      <path stroke="#fff" stroke-width="3.6" d="M0 0 24 16M24 0 0 16" />
      <path stroke="#C8102E" stroke-width="1.3" d="M0 0 24 16M24 0 0 16" />
      <path stroke="#fff" stroke-width="5.2" d="M12 0v16M0 8h24" />
      <path stroke="#C8102E" stroke-width="3" d="M12 0v16M0 8h24" />
    </svg>
  `,
})
export class FlagGb {}

@Component({
  selector: 'app-flag-ru',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg viewBox="0 0 24 16" xmlns="http://www.w3.org/2000/svg" class="size-full" aria-hidden="true">
      <rect width="24" height="16" fill="#fff" />
      <rect width="24" height="10.67" y="5.33" fill="#0039A6" />
      <rect width="24" height="5.33" y="10.67" fill="#D52B1E" />
    </svg>
  `,
})
export class FlagRu {}
