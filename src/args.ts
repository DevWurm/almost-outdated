import * as yargs from 'yargs';

export const args: () => Arguments = function getArgs() {
  const argv = yargs
    .option('no-dependencies',
      {
        alias: 'no-dep',
        describe: 'Don\'t show dependencies',
        type: 'boolean'
      }
    )
    .option('no-devDependencies',
      {
        alias: 'no-dev',
        describe: 'Don\'t show devDependencies',
        type: 'boolean'
      }
    )
    .option('no-peerDependencies',
      {
        alias: 'no-peer',
        describe: 'Don\'t show peerDependencies',
        type: 'boolean'
      }
    )
    .option('no-optionalDependencies',
      {
        alias: 'no-optional',
        describe: 'Don\'t show optionalDependencies',
        type: 'boolean'
      }
    )
    .completion()
    .recommendCommands()
    .help()
    .argv;

  argv.packages = argv._;

  return argv;
};

export type Arguments = {
  'no-dependencies'?: boolean,
  'no-devDependencies'?: boolean,
  'no-peerDependencies'?: boolean,
  'no-optionalDependencies'?: boolean
  noDependencies?: boolean,
  noDevDependencies?: boolean,
  noPeerDependencies?: boolean,
  noOptionalDependencies?: boolean
  packages: string[]
}