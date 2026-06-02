// Forces dns.lookup to return IPv4 addresses only.
// WSL2 has no outbound IPv6 route; without this, connections to dual-stack
// hosts (e.g. Neon) hang until TCP timeout.
const dns = require('dns');
const orig = dns.lookup.bind(dns);
dns.lookup = function (hostname, options, callback) {
  if (typeof options === 'function') { callback = options; options = {}; }
  if (typeof options === 'number') { options = { family: options }; }
  options = { ...(options || {}) };
  if (!options.family) options.family = 4;
  return orig(hostname, options, callback);
};
