// Numora v0.2.0 — Communications + SIM gateway prototype
require("dotenv").config();
const crypto=require("crypto");
const express=require("express");
const path=require("path");
const {sendTextMessage}=require("./services/whatsapp");
const simGateway=require("./services/sim-gateway");
const app=express(); const PORT=process.env.PORT||3000;
app.use(express.json()); app.use(express.static(path.join(__dirname,"public")));
const messages=[{id:"demo-1",channel:"whatsapp",direction:"inbound",contact:"Juan Santos",phone:"+63 917 123 4567",body:"Welcome to the Numora prototype.",timestamp:new Date().toISOString(),status:"delivered"}];
app.get("/api/health",(_req,res)=>res.json({ok:true,service:"Numora",whatsappConfigured:Boolean(process.env.WHATSAPP_ACCESS_TOKEN&&process.env.WHATSAPP_PHONE_NUMBER_ID),simGateway:{mode:"prototype",devices:simGateway.listDevices().length}}));
app.get("/api/messages",(_req,res)=>res.json(messages));
app.post("/api/messages",async(req,res)=>{
 const {phone,body,channel="whatsapp",deviceId="sim-1"}=req.body||{};
 const normalizedPhone=String(phone||"").replace(/[\\s()-]/g,"");
 if(!phone||!body?.trim()) return res.status(400).json({error:"phone and body are required"});
 if(!/^09\\d{9}$/.test(normalizedPhone)&&!/^639\\d{9}$/.test(normalizedPhone)&&!/^\\+639\\d{9}$/.test(normalizedPhone)){
  return res.status(400).json({error:"Enter a valid Philippine mobile number, e.g. 09171234567 or +639171234567"});
 }
 const message={id:crypto.randomUUID(),channel,direction:"outbound",contact:phone,phone:normalizedPhone.startsWith("+")?normalizedPhone:"+"+normalizedPhone,timestamp:new Date().toISOString(),status:"queued"};
 try{
  if(channel==="whatsapp"&&process.env.WHATSAPP_ACCESS_TOKEN&&process.env.WHATSAPP_PHONE_NUMBER_ID){const result=await sendTextMessage({to:phone,body:body.trim()});message.status="sent";message.providerId=result?.messages?.[0]?.id||null;}
  else if(channel==="sms"){const event=simGateway.sendSms({deviceId,to:phone,body:body.trim()});message.status=event.status;message.deviceId=deviceId;}
  messages.push(message); res.status(201).json(message);
 }catch(error){console.error("Message send failed:",error);res.status(502).json({error:"Message could not be sent.",details:error.message});}
});
app.get("/api/sim-gateway/devices",(_req,res)=>res.json(simGateway.listDevices()));
app.get("/api/sim-gateway/events",(_req,res)=>res.json(simGateway.listEvents()));
app.post("/api/sim-gateway/inbound",(req,res)=>{
 const {deviceId,from,body}=req.body||{};
 if(!deviceId||!from||!body?.trim()) return res.status(400).json({error:"deviceId, from and body are required"});
 try{const event=simGateway.simulateInboundSms({deviceId,from,body:body.trim()});const message={id:event.id,channel:"sms",direction:"inbound",contact:from,phone:from,body:event.body,timestamp:event.timestamp,status:event.status,deviceId};messages.push(message);res.status(201).json(message);}
 catch(error){res.status(400).json({error:error.message});}
});
app.use((_req,res)=>res.sendFile(path.join(__dirname,"public","index.html")));
app.listen(PORT,()=>console.log(`Numora v0.2.0 running at http://localhost:${PORT}`));
