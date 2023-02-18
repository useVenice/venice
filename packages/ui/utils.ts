import type {ClassValue} from 'clsx';
import { clsx} from 'clsx'
import {twMerge} from 'tailwind-merge'

/** https://ui.shadcn.com/docs/installation */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
