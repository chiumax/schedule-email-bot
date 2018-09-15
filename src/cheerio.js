"use strict";
const fs = require("fs");
const path = require("path");
const Discord = require("discord.js");
const tokenFile = require(path.join(__dirname, "/../config/token.json")); // process.env.token;
const bot = new Discord.Client({ disableEveryone: true });
const cheerio = require("cheerio");
const rp = require("request-promise");
const nodemailer = require("nodemailer");
const schedule = require("node-schedule");
const moment = require("moment");

// Quotes that are printed along with the schedule
const quotes = [
  "Rise n' shine!",
  "Wakey, wakey, eggs and bakey!",
  "Good morning! And if I don't see you, good afternoon, good evening, and good night!",
  "Good morning, Sunshine!",
  "Mornin' mi amigos! and amigas",
  "Top o' the mornin’ to ya!",
  "You know my favorite time of day is? When I get to say 'GOOOOOD MORNING' to you!",
  "Get your butt out of bed!",
  "I always have a reason to wake up, and that’s simply to say “good morning” to you!",
  "Dreaming of you is great, but waking up to you is perfect. Saying good morning to you is my dream come true!",
  "Mornin', good-lookin'!",
  "Welcome to yesterday's tomorrow!",
  "Today is a good day to die! - Klingon proverb"
];

// IMPORTING BOTCONFIG - EMAILS, EMAIL SENDER
let botconfigRaw = fs.readFileSync(path.join(__dirname, "/../config/botconfig.json"));
let botconfig = JSON.parse(botconfigRaw);

// NODE SCHEDULE STUFF
var rule = new schedule.RecurrenceRule();
// EVERY WEEKDAY AT 6:30
rule.hour = 23;
// MONDAY THROUGH FRIDAY. WHOLE RANGE IS 0-6
rule.dayOfWeek = new schedule.Range(1, 5);
rule.minute = [7, 8];

// NODEMAILER STUFF
var transporter = nodemailer.createTransport({
  service: "gmail",
  // SETUP LOGIN STUFF - email and password to email account
  // CONFIGURE LESS SECURE APPS FOR GMAIl
  auth: {
    user: botconfig.auth.email,
    pass: botconfig.auth.pass
  }
});

const week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
let day = "";
let tempDay = 0;
const today = moment()
  //.date(11)
  .format("M/D/YYYY");
let row = "";
let msg = "";
let discordMsg = "";
let specialCase = [];

// ADD EMAILS TO THI LIST
const emailsTo = botconfig.email;

let mailOptions = {
  from: botconfig.auth.email, // sender address
  // BCC BECAUSE OTHER PEOPLE SHOULDN'T BE ABLE TO SEE THE WHOLE SENDER LIST
  bcc: emailsTo, // list of receivers
  subject: "Subject of your email", // Subject line
  html: ""
};

const options = {
  uri: botconfig.url,
  transform: function(body) {
    return cheerio.load(body);
  }
};

const rowNext = (rownum, degree) => {
  if (rownum.charAt(rownum.length - 2) === "R") {
    row = rownum.slice(0, rownum.length - 1) + (parseInt(rownum.slice(-1)) + degree);
  } else if (rownum.charAt(rownum.length - 3) === "R") {
    row = rownum.slice(0, rownum.length - 2) + (parseInt(rownum.slice(-2)) + degree);
  }
};
// In the schedule, there would be undesired text
// check is basically telling the code to use regex and remove said text
// check would then set be false and both the desired and undesired schedules would be printed
// In case if there was anything that was actually important.
let check = true;
const classNames = ["Bio", "CS", "ESS", "POE"];

bot.on("ready", async () => {
  console.log(`
      __              __      
_____/ /_  ___  ___  / /______
/ ___/ __ \/ _ \/ _ \/ __/ ___/
(__  ) / / /  __/  __/ /_(__  ) 
/____/_/ /_/\___/\___/\__/____/  
                          
`);
  console.log(`${bot.user.username} is online!`);
  bot.user.setActivity("with Gerard ;)");
  //schedule.scheduleJob(rule, function() {
  // Just in case if something goes wrong, these variables are reset
  row = "";
  msg = "";
  discordMsg = "";
  day = "";
  tempDay = 0;
  specialCase = [];
  rp(options).then($ => {
    $("td").each(function(i, elem) {
      if (today === $(this).text()) {
        row = $(this)
          .parent()
          .children()
          .first()
          .attr("id");
        rowNext(row, 2);
        day =
          week.indexOf(
            $(this)
              .prev()
              .text()
          ) + 1;
        // Initialize some text. Found out that the class names didn't have special css class names
        // Since there wern't too many, I manually added it to the message.
        discordMsg =
          $(this)
            .prev()
            .text() +
          " " +
          $(this).text() +
          "\n      BIO C.S ESS POE\n";
        msg =
          '<tr style="height:20px;">' +
          $(this)
            .prev()
            .html() +
          " " +
          $(this).html() +
          "</tr>" +
          '<tr style="height:20px;"> <td class="s1"></td><td class="s1">Bio </td><td class="s1">CS </td><td class="s1">ESS </td><td class="s5">POE </td> </tr>';
      }
      if (
        row ===
        $(this)
          .parent()
          .children()
          .first()
          .attr("id")
      ) {
        if (!!Number($(this).text())) {
          tempDay += 1;
          if (day == tempDay) {
            if ($(this).attr("class") === "s1") {
              msg +=
                '<tr style="height:20px;">' + $.html(this) + $(this).nextUntil(".s1") + "</tr>";
            } else {
              msg +=
                '<tr style="height:20px;">' + $.html(this) + $(this).nextUntil(".s0") + "</tr>";
            }
            // kinda pissed that I had to resort to such vile ways of parsing data
            // I couldn't just get the text into a list from nextUntil
            // Thank god the schedule table isn't too big so this was feasible.
            let plainText = [
              $(this).text(),
              $(this)
                .next()
                .text(),
              $(this)
                .next()
                .next()
                .text(),
              $(this)
                .next()
                .next()
                .next()
                .text(),
              $(this)
                .next()
                .next()
                .next()
                .next()
                .text()
            ];
            plainText.forEach((element, index) => {
              if (index != 0) {
                if (/[^xy]/gi.test(element)) {
                  specialCase.push(
                    `During period ${$(this).text()} and under ${
                      classNames[index - 1]
                    }, the text ${element} is on the schedule. \n`
                  );
                }
                if (check === true) {
                  element = element.replace(/[^xy]/gi, "");
                }
              }
              if (!!element) {
                discordMsg += "   " + element;
              } else {
                discordMsg += "   -";
              }
            });
            discordMsg += "\n";
            rowNext(row, 1);
            tempDay = 0;
          }
        } else if (!!$(this).attr("colspan")) {
          tempDay += 1;
          if (day == tempDay) {
            discordMsg += $(this).text();
            msg += '<tr style="height:20px;">' + $.html(this) + "</tr>";
          }
        }
      }
    });

    mailOptions.html =
      '<div class="ritz grid-container" dir="ltr"><table class="waffle no-grid" cellspacing="0" cellpadding="0">' +
      msg +
      "</table></dir>";
    // DYNAMIC SUBJECT HEADER FOR EMAIL. CHANGES EVERYDAY
    mailOptions.subject =
      "Poolesville Blocking Schedule for " + moment().format("dddd, MMMM Do, YYYY");
    // THIS IS WHAT ACTUALLY SENDS THE MAIL.
    transporter.sendMail(mailOptions, function(err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log(msg);
        console.log(info);
        console.log(discordMsg);
        discordMsg =
          "**" +
          quotes[Math.floor(Math.random() * quotes.length)] +
          "** \n" +
          "```" +
          discordMsg +
          specialCase.join("") +
          "```";
        bot.channels.get(botconfig.channel).send(discordMsg);
      }
    });
  });
});
//});

bot.login(tokenFile.token);
