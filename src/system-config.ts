/***********************************************************************************************
 * User Configuration.
 **********************************************************************************************/
/** Map relative paths to URLs. */
const map: any = {
};

/** User packages configuration. */
const packages: any = {
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
  /** @cli-barrel */
];

const cliSystemConfigPackages: any = {};
barrels.forEach((barrelName: string) => {
  var material;
  if (material = /\@angular2\-material\/(.*)/.exec(barrelName)) {
    cliSystemConfigPackages[barrelName] = {
      main: `${material[1]}`,
      defaultExtension: 'js'
    };
  } else {
    cliSystemConfigPackages[barrelName] = { main: 'index' };
  }
  console.log('packages',cliSystemConfigPackages);
});

/** Type declaration for ambient System. */
declare var System: any;

// Apply the CLI SystemJS configuration.
System.config({
  map: {
    '@angular': 'vendor/@angular',
    'rxjs': 'vendor/rxjs',
    'main': 'main.js',
    '@angular2-material': 'vendor/@angular2-material',
    'angularfire2': 'vendor/angularfire2',
    'firebase': 'vendor/firebase/lib/firebase-web.js'
  },
  packages: Object.assign({}, cliSystemConfigPackages, {
    'angularfire2': {
      defaultExtension: 'js',
      main: 'angularfire2'
    }
  })
});

// Apply the user's configuration.
System.config({ map, packages });
