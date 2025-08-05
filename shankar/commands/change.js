module.exports.config = {
 name: "change",
 version: "1.1.1",
 hasPermssion: 2,
 credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
 description: "Pastebin aur RunMocky ke beech code badlein",
 commandCategory: "Admin",
 usages: "/test",
 cooldowns: 3,
 usePrefix: false
};
const axios = require('axios');
const fs = require('fs');
module.exports.run = async function ({ api, event, args }) {
 if (event.type === 'message_reply' && event.messageReply.body !== '') {
 const attachment = event.messageReply.body;
 if (attachment.includes('pastebin.com')) {
 const pastebinLink = attachment;
 
axios.get(pastebinLink).then(response => {
 const sourceCode = response.data

axios.post("https://api.mocky.io/api/mock", {
 "status": 200,
 "content": sourceCode,
 "content_type": "application/json",
 "charset": "UTF-8",
 "secret": "DongDev",
 "expiration": "never"
}).then(function(response) {
 return api.sendMessage(`${response.data.link}`, event.threadID, event.messageID);
 }).catch(e => {
 console.log(e)
 return api.sendMessage('Pastebin se RunMocky par code upload karne mein error!', event.threadID)
 }) 
 });
 } else if(attachment.includes('run.mocky.io')) {
 const runmockyLink = attachment;
 axios.get(runmockyLink).then(async response => {
 const sourceCode = response.data
 const { PasteClient } = require('pastebin-api');
 const client = new PasteClient("GT50TmDosqBBicH60IXyiTANFaXGBxCZ");
 async function pastepin(name) {
 const url = await client.createPaste({
 code: sourceCode,
 expireDate: 'N',
 format: "javascript",
 name: name,
 publicity: 1
 });
 var id = url.split('/')[3]
 return 'https://pastebin.com/raw/' + id
 }
 var name = await generateId()
 var link = await pastepin(name)
 return api.sendMessage(`${link}`, event.threadID, event.messageID);
 }).catch(e =>{
 console.log(e)
 return api.sendMessage('RunMocky se Pastebin par code upload karne mein error!', event.threadID)
 })
 }
 }
}
function generateId() {
 const min = 100000;
 const max = 999999;
 const randomSixDigitId = Math.floor(Math.random() * (max - min + 1)) + min;
 return randomSixDigitId;
 }
