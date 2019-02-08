const Discord = require("discord.js");
const snekfetch = require("snekfetch");
const auth = require('./auth.json');

const prefix = "!";
const api = [
  {ip: "51.68.213.93", port: "23081"}, // CTF#1
  {ip: "138.201.55.232", port: "25660"}, // CTF#2
  {ip: "162.221.187.210", port: "25020"}, // Final Bout
  {ip: "162.221.187.210", port: "25000"}, // HTF
  {ip: "51.68.213.93", port: "23080"}, // Run Mode
  {ip: "51.68.213.93", port: "23082"}, //Climb
  {ip: "51.68.213.93", port: "23083"} // AlphaZRPG
];

const getApiURL = (ip, port) => `https://api.soldat.pl/v0/server/{ip}/{port}`

const client = new Discord.Client(); 

client.login(auth.token);

client.on("ready", ()=>{
  console.log(`Bot is ready! ${client.user.username}`);
});

client.on("message", async message => {
  let timeInterval;

  if(message.channel.type === "dm") return;

  const messageArray = message.content.split(" ");
  const command = messageArray[0];
  const args = messageArray.slice(1);

  if(!command.startsWith(prefix)) return;

  if(command === `${prefix}statusMID`){
		update();
		clearInterval(timeInterval);
		timeInterval = setInterval(update,60000);
  }
});

async function status(){
  const statuses = await Promise.all(api.map(({ip, port}) => {
    return snekfetch.get(getApiURL(ip, port));
  }))
  
	const embed = new Discord.RichEmbed()
	  .setAuthor(client.user.username,client.user.avatarURL)
	  .setColor(Math.floor(Math.random() * 16777214) + 1)

  statuses.forEach(({body: {NumPlayers, MaxPlayers, CurrentMap}}, i) => {
    embed.addField(`:flag_gb:**Midgard [CTF] #1****Address**: <soldat://{api[i].ip}:api[i].port> \n **Players:**  \`{NumPlayers}/{MaxPlayers}\`<:crouch:533700465670619197> **Map:**  \`${CurrentMap}\`:map:`)
  })

  embed.setTimestamp(new Date());
  
	client.channels.get(`537011480973934592`).send(embed);
}

async function update(){
	let fetched = await client.channels.get(`537011480973934592`).fetchMessages({limit: 10});
	client.channels.get(`537011480973934592`).bulkDelete(fetched);
	status();
}
