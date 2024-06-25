// Port mapping example 25 Jun 2024 chuacw, Singapore, Singapore.

/*
// See https://github.com/webtorrent/bittorrent-dht
// First, set discover the nearest InternetGatewayDevice
// Using the IGD, open up torrent ports
// Perform nslookup to figure out who the IP address belongs to
// use nslookup -type=a "domain name" on DNS server
// Record timestamp on IP address, send DHT query to IP address 
// every "specified interval", eg, 5 secs.

// See also: https://www.npmjs.com/package/@silentbot1/nat-api
*/

// https://www.npmjs.com/package/@silentbot1/nat-api

const BittorrentProtocol = (await import("bittorrent-protocol")).default; 
const MagnetUri = (await import('magnet-uri'));
function getInfoHash(magnetURI: string): string {
    const parsed = MagnetUri.decode(magnetURI);
    return parsed.infoHash!;
}
  
// let debug = require('debug'); doesn't work
import DebugSetup from 'debug';

// First pattern
// const NatAPI = await import('@silentbot1/nat-api'); // this is a module, working
// const client = new NatAPI.default({ enablePMP: true, enableUPNP: true });

// Second pattern
// import NatAPI from '@silentbot1/nat-api';
// const client = new NatAPI({ enablePMP: true, enableUPNP: true });

// Third pattern
const NatAPI = (await import('@silentbot1/nat-api')).default; // this is a module, working
const client = new NatAPI({ enablePMP: true, enableUPNP: true });

// Fix description in PMP
// import { _pmpMapFix } from './upmpmap_fix.ts';
// client._timeout = 6500000;
// client._pmpMap = _pmpMapFix.bind(client);
// client.enablePMP = true;
// client.enableUPNP = true; // for remapping _pmpMap

DebugSetup.enable('nat-pmp,nat-api,nat-upnp');
DebugSetup.log = console.debug;

// For NAT-PMP + NAT-UPNP, use:
// let externalIp: string = await client.externalIp(); 
// console.log("The external IP is: ", externalIp);

// await client.map(1000, 1000); // alternative 1

// Pattern 1 to port mapping
// let udpOptions = {protocol: 'udp', ttl: 3600, description: 'UDP forwarding for nat_forwarding', publicPort: 55000, privatePort: 55000};
// let udpmapping = await client.map(udpOptions);
// let tcpmapping = udpmapping;
// let tcpOptions = {...udpOptions, protocol: 'tcp', description: 'TCP forwarding for nat_forwarding'};
// if (udpmapping) {
//     tcpmapping = await client.map(tcpOptions);
// }
// if (udpmapping) {
//     console.log(`UDP successfully mapped on: ${udpOptions.publicPort} to ${udpOptions.privatePort}`);
// }
// if (tcpmapping) {
//     console.log(`TCP successfully mapped on: ${udpOptions.publicPort} to ${udpOptions.privatePort}`);
// }

// Pattern 2 to port mapping
let mappingOptions = {ttl: 3600, description: 'Port mapping for nat_forwarding', publicPort: 55000, privatePort: 55000};
let portMapping = await client.map(mappingOptions);
if (portMapping) {
    console.log(`UDP and TCP successfully mapped on: ${mappingOptions.publicPort} to ${mappingOptions.privatePort}`);
}

console.log("Now's your last chance to view the router's configuration")

const magnetURI = 'magnet:?xt=urn:btih:e3811b9539cacff680e418124272177c47477157';
const peer = { host: '127.0.0.1', port: 55165 }; // Replace with actual peer address

const infoHash = getInfoHash(magnetURI);
console.log('infohash is: ', infoHash);

console.log("View router configuration again please...");
console.log("And we're done!!!");

if (portMapping) {
    await client.unmap(mappingOptions.publicPort, mappingOptions.privatePort);
}

process.exit(0);