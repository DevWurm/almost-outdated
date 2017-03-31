export type Package = {
  name: string,
  version: string,
  description?: string,
  keywords?: string[],
  homepage: string,
  bugs?: BugsField,
  license?: string,
  author?: PersonField,
  contributors?: PersonField[],
  files?: string[],
  main?: string,
  bin?: BinField,
  man?: ManField,
  directories?: DirectoriesField,
  repository?: RepositoryField,
  scripts?: ScriptsField,
  config?: object,
  dependencies?: DependencyField,
  devDependencies?: DependencyField,
  peerDependencies?: DependencyField,
  bundledDependencies?: string[],
  bundleDependencies?: string[], // a synonym of bundledDependencies
  optionalDependencies?: DependencyField,
  engines?: EnginesField,
  os?: string[],
  cpu?: string[],
  preferGlobal?: boolean,
  private?: boolean,
  publishConfig?: object
};

export type PersonField = {
  name: string,
  email?: string,
  url?: string
} | string;

export type BugsField = {
  url?: string,
  email?: string
};

export type BinField = {
  [name: string]: string
} | string;

export type ManField = string | string[];

export type DirectoriesField = {
  lib?: string,
  bin?: string,
  man?: string,
  doc?: string,
  example?: string,
  test?: string,
};

export type RepositoryField = {
  type: string,
  url: string
} | string;

export type ScriptsField = {
  [name: string]: string
};

export type DependencyField = {
  [name: string]: string
};

export type EnginesField = {
  node?: string,
  npm?: string
};