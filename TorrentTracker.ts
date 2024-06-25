// See https://github.com/webtorrent/bittorrent-dht
// First, set discover the nearest InternetGatewayDevice
// Using the IGD, open up torrent ports
// Perform nslookup to figure out who the IP address belongs to
// use nslookup -type=a "domain name" on DNS server
// Record timestamp on IP address, send DHT query to IP address 
// every "specified interval", eg, 5 secs.

// See also: https://www.npmjs.com/package/@silentbot1/nat-api
