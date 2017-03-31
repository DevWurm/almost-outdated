import * as RegistryClient from 'npm-registry-client';
import * as packageVersions from 'npm-package-versions';
import { contains } from './util';

export type Registry = 'yarn' | 'npm'
const registries = {
  yarn: 'https://registry.yarnpkg.com/',
  npm: 'https://registry.npmjs.org/'
};

export type DistTags = {
  latest?: string,
  next?: string
  [tag: string]: string
}

export function registryTags(packageName: string, registry: Registry | string): Promise<DistTags> {
  const client = new RegistryClient({
    // fake logger to disable logging
    log: {
      verbose: () => null,
      http: () => null,
      info: () => null
    }
  });
  const registryUrl = resolveRegistry(registry);

  return new Promise((resolve, reject) => {
    client.distTags.fetch(registryUrl, { package: packageName, auth: {} }, (err, distTags: DistTags) => {
      if (err) return reject(err);

      resolve(distTags);
    });
  });
}

export function registryVersions(packageName: string, registry: Registry | string): Promise<string[]> {
  packageVersions.uri = resolveRegistry(registry);

  // extract scope and name from scoped packages
  const parsedName = /(@(\w+)\/)?(\w+)/.exec(packageName);
  const scope: string | null = parsedName[1] ? parsedName[2] : null;
  const name: string = parsedName[3];

  // set the scope for scoped packages
  packageVersions.config = scope ? { scope } : {};

  return new Promise((resolve, reject) => {
    packageVersions(name, (err, versions) => {
      if (err) return reject(err);

      resolve(versions);
    });
  });
}

/**
 * Resolve the registry URI of a predefined registry by an identifier or pass through an existing URI
 * @param registry {Registry | string} Registry identifier or URI
 * @return {Registry|string} Registry URI
 */
function resolveRegistry(registry: Registry | string) {
  return contains(Object.getOwnPropertyNames(registries), registry) ? registries[registry] : registry;
}