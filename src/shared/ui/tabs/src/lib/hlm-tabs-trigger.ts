import { Directive, input } from '@angular/core';
import { BrnTabsTrigger } from '@spartan-ng/brain/tabs';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
  selector: '[hlmTabsTrigger]',
  hostDirectives: [
    { directive: BrnTabsTrigger, inputs: ['brnTabsTrigger: hlmTabsTrigger', 'disabled'] },
  ],
  host: {
    'data-slot': 'tabs-trigger',
  },
})
export class HlmTabsTrigger {
  public readonly triggerFor = input.required<string>({ alias: 'hlmTabsTrigger' });
  constructor() {
    classes(() => [
      `cursor-pointer gap-1.5 rounded-full border border-transparent px-4 py-1.5 text-sm font-medium [&_ng-icon:not([class*='text-'])]:text-[length:--spacing(4)] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring text-ink-tertiary hover:text-brand-500 relative inline-flex h-[calc(100%-2px)] flex-1 items-center justify-center whitespace-nowrap transition-all group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_ng-icon]:pointer-events-none [&_ng-icon]:shrink-0`,
      'group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-active:bg-transparent',
      'data-active:bg-brand-100/40 data-active:text-brand-500 data-active:shadow-[0px_1px_3px_0px_rgba(6,42,126,0.13)]',
      'after:bg-brand-500 after:absolute after:opacity-0 after:transition-opacity group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:bottom-[-5px] group-data-[orientation=horizontal]/tabs:after:h-0.5 group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-right-1 group-data-[orientation=vertical]/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-active:after:opacity-100',
    ]);
  }
}
