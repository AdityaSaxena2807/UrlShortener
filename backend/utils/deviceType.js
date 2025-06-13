const useragent = require("useragent");

module.exports = function getDeviceType(userAgentStr) {
  const agent = useragent.parse(userAgentStr);
  if (agent.device.family === "Other") return "desktop";
  if (/mobile/i.test(userAgentStr)) return "mobile";
  if (/tablet/i.test(userAgentStr)) return "tablet";
  return "desktop";
};
