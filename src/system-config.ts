/***********************************************************************************************
 * User Configuration.
 **********************************************************************************************/
/** Map relative paths to URLs. */
const map: any = {
  '@angular2-material': 'vendor/@angular2-material',
  'angularfire2': 'vendor/angularfire2',
  'firebase': 'vendor/firebase/lib/firebase-web.js',
  'hammerjs': 'vendor/hammerjs/hammer.min.js',
  '@ngrx': 'vendor/@ngrx'
};

/** User packages configuration. */
const packages: any = {
  '@ngrx/db': {
    format: 'cjs',
    main: 'index.js',
    defaultExtension: 'js'
  },
  '@ngrx/store': {
    format: 'cjs',
    main: 'index.js',
    defaultExtension: 'js'
  },
  'config': {
    main: 'config',
    defaultExtension: 'js'
  },
  'angularfire2': {
    defaultExtension: 'js',
    main: 'angularfire2'
  },
  '@angular2-material/core': {
    defaultExtension: 'js',
    main: 'core'
  },
  '@angular2-material/icon': {
    defaultExtension: 'js',
    main: 'icon'
  },
  '@angular2-material/card': {
    defaultExtension: 'js',
    main: 'card'
  },
  '@angular2-material/toolbar': {
    defaultExtension: 'js',
    main: 'toolbar'
  },
  '@angular2-material/button': {
    defaultExtension: 'js',
    main: 'button'
  },
  '@angular2-material/list': {
    defaultExtension: 'js',
    main: 'list'
  },
  '@angular2-material/progress-circle': {
    defaultExtension: 'js',
    main: 'progress-circle'
  },
  '@angular2-material/sidenav': {
    defaultExtension: 'js',
    main: 'sidenav'
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////
/***********************************************************************************************
 * Everything underneath this line is managed by the CLI.
 **********************************************************************************************/
const barrels: string[] = [
  // Angular specific barrels.
  '@angular/core',
  '@angular/common',
  '@angular/compiler',
  '@angular/http',
  '@angular/router',
  '@angular/platform-browser',
  '@angular/platform-browser-dynamic',
  '@angular/router-deprecated',
  '@angular/app-shell',
  '@angular2-material/toolbar',
  '@angular2-material/card',
  '@angular2-material/core',
  '@angular2-material/sidenav',
  '@angular2-material/button',
  '@angular2-material/progress-circle',
  'angularfire2',

  // Thirdparty barrels.
  'rxjs',

  // App specific barrels.
  'app',
  'app/shared',
  'app/+login',
  'app/+issues',
  'app/+issues/+list',
  'app/+issues/+filter',
  'app/+issues/+triage',
  'app/+issues/+list/toolbar',
  'app/+issues/+list/issue-row',
  'app/+issues/+list/repo-selector-row',
  'app/+repo-selector',
  'app/+repo-selector/repo-selector-row',
  /** @cli-barrel */
];

const cliSystemConfigPackages: any = {};
barrels.forEach((barrelName: string) => {
  cliSystemConfigPackages[barrelName] = { main: 'index' };
});

/** Type declaration for ambient System. */
declare var System: any;

// Apply the CLI SystemJS configuration.
System.config({
  map: {
    '@angular': 'vendor/@angular',
    'rxjs': 'vendor/rxjs',
    'main': 'main.js'
  },
  packages: cliSystemConfigPackages
});

// Apply the user's configuration.
System.config({ map, packages });
