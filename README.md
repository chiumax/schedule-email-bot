# Schedule Email Bot :envelope:
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Pretty shabby email/discord bot written in JS. I built this to save the inconvenience for looking at google drive for schedules.

Special thanks to [Aidan](https://github.com/aidangoettsch).

## Background :flags:

The school I go to groups classes into flexible 'blocks' of time. These 'blocks' of time are prone to change everyday and they are published on a google sheets. Instead of actually visiting the sheets page everyday, why not just send it/email it to you?

Even if not meant to be reused, I'll admit that the code here is not 100% reusable since a lot of things were special cases when I was scraping the schedules.

## Notable Resources/Dependencies :books:

-   Node.JS (v10.10.0) [https://nodejs.org/en/]
-   discord.js (v11.3.2) [https://discord.js.org/#/]
-   cheerio (v1.0.0-rc.2) [https://cheerio.js.org/]
-   moment (v2.22.2) [https://momentjs.com/]
-   nodemailer (v.4.6.8) [https://nodemailer.com/about/]
-   request-promise (v4.2.2) [https://github.com/request/request-promise]

### Testing

-   sinon (v.6.2.0) [https://sinonjs.org/]



## TO-DO :white_check_mark:
- [x] Add a different good morning message everyday
- [x] Parse extra data in the schedule so formatting looks nice
- [x] Add some screenshots
- [x] Credit dependencies
- [ ] Add more comments

## SETUP :wrench:

1. Clone Repository
2. `yarn install` or `npm install` whatever you like.
3.

## Screenshots :camera:
![discord](https://github.com/dumblole/schedule-email-bot/blob/master/image/Discord_2018-09-14_22-18-15.png)

![discord](https://github.com/dumblole/schedule-email-bot/blob/master/image/Discord_2018-09-14_22-19-26.png)

![gmail](https://github.com/dumblole/schedule-email-bot/blob/master/image/chrome_2018-09-14_22-21-55.png)

*Formatting still leaves a lot to be desired*

![original](https://github.com/dumblole/schedule-email-bot/blob/master/image/chrome_2018-09-14_22-22-11.png)

*Example of what my bot parses*
## Code Style :art:

-   I use the [Prettier](https://prettier.io/) code formatter for js (default settings from the vs-code extension except for line width set to 100).

    [<img src ="https://prettier.io/icon.png" alt="prettier logo" width="100" height="100">](https://prettier.io/)
