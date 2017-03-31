import * as readJson from 'read-package-json';
import * as readPackageTree from 'read-package-tree'
import { resolve as pathResolve } from 'path';

import { Package, DependencyField } from '../typings/package';
import { PackageTree } from '../typings/package/package-tree';
import { isUndefined } from 'util';
import { isNull } from 'util';
import { contains } from './util';

export type Dependencies = {
  dependencies: DependencyField,
  devDependencies: DependencyField,
  peerDependencies: DependencyField,
  optionalDependencies: DependencyField
};
export const dependencyTypes: Array<keyof Dependencies> = [
  'dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'
];

/**
 * Loads the package dependencies in the package.json of a specified package directory
 * @param packageDir {string} The package directory
 * @return {Promise<Package>} The package dependencies
 */
export async function packageDependencies(packageDir: string): Promise<Dependencies> {
  const packageConfig = await packageConfiguration(packageDir);
  return dependencyTypes.reduce((acc, type) => Object.assign(acc, { [type]: packageConfig[type] || {} }), {}) as Dependencies;
}

/**
 * Fetch a map of the requested packages and their corresponding installed versions in the package
 * @param packageDir {string} the path of the root level package
 * @param requestedDependencies {string[]} the list of requested packages to filter the package tree
 * @return {Promise<{[dep: string]: string}>} the version map
 */
export async function installedDependencyVersions(packageDir: string,
                                                  requestedDependencies: string[]): Promise<{[dep: string]: string}> {
  const installedPackages = await installedDependencies(packageDir, requestedDependencies);

  return installedPackages.reduce((acc, pkg: Package) => Object.assign(acc, {[pkg.name]: pkg.version}), {});
}

/**
 * Loads the package information of all requested first level dependencies
 * @param packageDir {string} the package path
 * @param requestedDependencies {string[]} requested dependencies
 * @return {Promise<Package[]>} The package information of the first level requested dependencies
 */
 function installedDependencies(packageDir: string, requestedDependencies: string[]): Promise<Package[]> {
  return new Promise((resolve, reject) => {
    readPackageTree(packageDir, (parentNode: PackageTree | undefined, kidName: string) => {
      // Filter function, to ignore deep level and unrequested dependencies
      return (
        isUndefined(parentNode) || // the root package has the parent 'undefined' and needs to be included
        isNull(parentNode.parent) && contains(requestedDependencies, kidName) // first condition: only include first level deps.; second: only include required dependencies
      )
    }, (err, data: PackageTree) => {
      if (err) return reject(err);

      // resolve with the children of the root package
      resolve(data.children.map(childPackageTree => childPackageTree.package));
    });
  });
}

/**
 * Loads the package configuration in the package.json of a specified package directory
 * @param sourceDir {string} The package directory
 * @return {Promise<Package>} The package configuration
 */
function packageConfiguration(sourceDir: string): Promise<Package> {
  return new Promise((resolve, reject) => {
    readJson(pathResolve(sourceDir, 'package.json'), (err: any, data: Package) => {
      if (err) return reject(err);

      resolve(data);
    });
  });
}