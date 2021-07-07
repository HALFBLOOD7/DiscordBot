require("dotenv").config();

const { Client } = require("discord.js");
const request = require("request");
const cheerio = require("cheerio");

const client = new Client();

const PREFIX = "$";
const CMD_LIST = ["help", "hii", "memlist", "fact", "covid", "meme"];

client.on("ready", () => {
  console.log(`bot ::[${client.user.tag}] is ready`);
});

client.on("message", async (message) => {
  if (message.author.bot || !message.content.startsWith(PREFIX)) return;
  const [CMD_NAME, ...args] = message.content
    .trim()
    .substring(PREFIX.length)
    .split(" ");
  console.log(CMD_NAME, args);
  if (CMD_LIST.indexOf(CMD_NAME) === -1)
    return message.channel.send(
      "no such command exist use $help to get all available command"
    );

  switch (CMD_NAME) {
    case CMD_LIST[0]: {
      //help
      message.channel.send("The command list \n" + CMD_LIST);
      break;
    }
    case CMD_LIST[1]: {
      //simple hii
      message.channel.send(`hii  ${message.author.username}`);
      break;
    }
    case CMD_LIST[2]: {
      //get member list
      console.log("member list");
      break;
    }
    case CMD_LIST[3]: {
      request("http://randomfactgenerator.net", (error, response, html) => {
        if (!error && response.statusCode == 200) {
          const $ = cheerio.load(html);
          if ($) {
            const element = $("#z").html();
            const fact = element.substring(0, element.indexOf("<br>"));
            message.channel.send(fact);
          }
        } else return "something went wrong";
      });
      break;
    }
    case CMD_LIST[4]: {
      //covid result
      let covidData;
      if (args.length === 1) {
        covidData = await require("./fetch_from_api").covidData(args[0]);
      } else {
        covidData = await require("./fetch_from_api").covidData("india");
      }
      let msg;
      if (covidData == "country not found") {
        msg = "country not found";
      } else {
        msg =
          "country:" +
          covidData.country +
          "\n" +
          "confirmed:" +
          covidData.confirmed +
          "\n" +
          "recovered:" +
          covidData.recovered +
          "\n" +
          "deaths:" +
          covidData.deaths +
          "\n" +
          "updated at:" +
          covidData.lastUpdate.substring(0, covidData.lastUpdate.indexOf("T"));
      }
      message.channel.send(msg);
      break;
    }
    case CMD_LIST[5]: {
      //random meme
      let meme = await require("./fetch_from_api").memeLink();
      message.channel.send(meme);
    }
  }
});
client.login(process.env.Bot_Token);
