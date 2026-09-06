import { Directive, input } from '@angular/core';
import { BrnTabsList } from '@spartan-ng/brain/tabs';
import { classes } from '@spartan-ng/helm/utils';
import { type VariantProps, cva } from 'class-variance-authority';

export const listVariants = cva(
  'rounded-full p-1 group-data-horizontal/tabs:h-10 data-[variant=line]:rounded-none group/tabs-list text-ink-tertiary inline-flex w-fit items-center justify-center group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col',
  {
    variants: {
      variant: {
        // A border + soft shadow (not just `bg-wash`) so the pill still reads as its own
        // control when it sits directly on a `bg-wash` page background instead of a white card.
        default: 'border border-border bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04)]',
        line: 'gap-1 bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);
type ListVariants = VariantProps<typeof listVariants>;

@Directive({
  selector: '[hlmTabsList],hlm-tabs-list',
  hostDirectives: [BrnTabsList],
  host: {
    'data-slot': 'tabs-list',
    '[attr.data-variant]': 'variant()',
  },
})
export class HlmTabsList {
  public readonly variant = input<ListVariants['variant']>('default');

  constructor() {
    classes(() => listVariants({ variant: this.variant() }));
  }
}
