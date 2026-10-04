// Numora v0.2.0 — SIM gateway abstraction
// Prototype mode: simulates GSM/SMS hardware while keeping a provider-neutral API.
const crypto = require("crypto");
const devices = [
  { id:"sim-1", label:"Test SIM 01", phone:"+63 917 000 0001", carrier:"Prototype SIM", status:"online", signal:82, lastSeen:new Date().toISOString() },
  { id:"sim-2", label:"Test SIM 02", phone:"+63 917 000 0002", carrier:"Prototype SIM", status:"online", signal:67, lastSeen:new Date().toISOString() }
];
const events = [];
function listDevices(){ return devices; }
function getDevice(id){ return devices.find(device=>device.id===id)||null; }
function recordEvent({deviceId,direction,phone,body,status="received"}){
  const device=getDevice(deviceId); if(!device) throw new Error("Unknown SIM gateway device.");
  const event={id:crypto.randomUUID(),deviceId,direction,from:direction==="inbound"?phone:device.phone,to:direction==="inbound"?device.phone:phone,body:String(body).trim(),timestamp:new Date().toISOString(),status};
  events.push(event); device.lastSeen=event.timestamp; return event;
}
function sendSms({deviceId,to,body}){ return recordEvent({deviceId,direction:"outbound",phone:to,body,status:"queued"}); }
function simulateInboundSms({deviceId,from,body}){ return recordEvent({deviceId,direction:"inbound",phone:from,body,status:"received"}); }
function listEvents(){ return [...events].reverse(); }
module.exports={listDevices,getDevice,sendSms,simulateInboundSms,listEvents};
