// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseApiUrl: '',
  // geoServerRoot: 'http://ec2-3-25-96-54.ap-southeast-2.compute.amazonaws.com:8080/geoserver',
  // geoServerRoot: 'http://13.238.73.166:8080/geoserver', // AWS one
  // geoServerRoot: 'http://34.87.216.86:8080/geoserver',  // New GCP one
  geoServerRoot: 'https://smithyserver.xyz/geoserver', // GCP https load balancer, secured
  nidemLayer: 'NIDEM',
};
