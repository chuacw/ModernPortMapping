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

// let debug = require('debug'); doesn't work
import DebugSetup from 'debug';
const NatAPI = await import('@silentbot1/nat-api'); // this is a module

DebugSetup.enable('nat-pmp,nat-api,nat-upnp');
DebugSetup.log = console.debug;

// For NAT-PMP + NAT-UPNP, use:
const client = new NatAPI.default({ enablePMP: true, enableUPNP: true });

let externalIp: string = await client.externalIp(); 

// Get external IP, the following code works
// client.externalIp().then((ip: string) => {
//     console.log('External IP:', ip)
//     externalIp = ip;
// }).catch((err: any) => {
//     return console.log('Error', err)
// });

console.log("The external IP is: ", externalIp);
// await client.map(1000, 1000); // alternative 1
let udpOptions = {protocol: 'udp', ttl: 3600, description: 'UDP forwarding for nat_forwarding', publicPort: 55000, privatePort: 55000};
let udpmapping = await client.map(udpOptions);
let tcpmapping = udpmapping;
let tcpOptions = {...udpOptions, protocol: 'tcp', description: 'TCP forwarding for nat_forwarding'};
if (udpmapping) {
    tcpmapping = await client.map(tcpOptions);
}
if (udpmapping) {
    console.log(`UDP successfully mapped on: ${udpOptions.publicPort} to ${udpOptions.privatePort}`);
}
if (tcpmapping) {
    console.log(`TCP successfully mapped on: ${udpOptions.publicPort} to ${udpOptions.privatePort}`);
}
console.log("Now's your chance to view the router's configuration")
if (udpmapping) {
    await client.unmap(udpOptions.publicPort);
}
if (tcpmapping) {
    await client.unmap(tcpOptions.publicPort);
}
console.log("View router configuration again please...");
console.log("And we're done!!!");
