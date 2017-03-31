import { Package } from './package';

export type PackageTree = {
  package: Package,
  children: PackageTree[],
  parent: PackageTree | null,
  path: string,
  realpath: string,
  isLink?: boolean,
  target?: string,
  error?: any
}
