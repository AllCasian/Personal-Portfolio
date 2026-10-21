import Link from 'next/link'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost'
const styles: Record<Variant, string> = {
  primary: 'button-primary',
  secondary: 'button-secondary',
  ghost: 'button-ghost',
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }
type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; variant?: Variant }

export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  return <button className={cn('button', styles[variant], className)} {...props} />
}

export function ButtonLink({ className, variant = 'primary', ...props }: ButtonLinkProps) {
  const { href, ...anchorProps } = props
  return <Link className={cn('button', styles[variant], className)} href={href} {...anchorProps} />
}
