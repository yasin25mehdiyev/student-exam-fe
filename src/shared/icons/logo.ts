import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="shrink-0"
      [class]="class()"
      aria-hidden="true"
    >
      <path
        d="M40 15C40 17.7614 37.7614 20 35 20H25.0896C23.7635 20 22.4918 20.5268 21.5541 21.4645L21.4645 21.5541C20.5268 22.4918 20 23.7635 20 25.0896V35C20 37.7614 17.7614 40 15 40H5C2.23858 40 0 37.7614 0 35V25C0 22.2386 2.23858 20 5 20H13.8762C15.2023 20 16.4741 19.4732 17.4117 18.5355L18.5355 17.4117C19.4732 16.4741 20 15.2023 20 13.8762V5C20 2.23858 22.2386 0 25 0H35C37.7614 0 40 2.23858 40 5V15Z"
        fill="#225DF0"
      />
    </svg>
  `,
})
export class Logo {
  readonly class = input<string>('');
}
