'use strict';

const fs = require('fs');
const path = require('path');

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'dummy',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
      AST: JSON.parse(fs.readFileSync(path.join(__dirname, 'ember-keyword-complete.ast.json'), {encoding: 'utf8'})),

      // Here you can pass flags/options to your application instance
      // when it is created
      EMOJIS: [{"val": "smile"}, {"val": "smiley"}, {"val": "grinning"}, {"val": "blush"}, {"val": "relaxed"}, {"val": "wink"}, {"val": "heart_eyes"}, {"val": "kissing_heart"}, {"val": "kissing_closed_eyes"}, {"val": "kissing"}, {"val": "kissing_smiling_eyes"}, {"val": "stuck_out_tongue_winking_eye"}, {"val": "stuck_out_tongue_closed_eyes"}, {"val": "stuck_out_tongue"}, {"val": "flushed"}, {"val": "grin"}, {"val": "pensive"}, {"val": "relieved"}, {"val": "unamused"}, {"val": "disappointed"}, {"val": "persevere"}, {"val": "cry"}, {"val": "joy"}, {"val": "sob"}, {"val": "sleepy"}],

      // JSON.stringify((new Array(20)).join(',').split(',').map(() => {return {nick: faker.internet.userName(), firstname: faker.name.firstName(), lastname: faker.name.lastName()}}))
      USERS: [{"nick": "Merlin40", "firstname": "Dorcas", "lastname": "Champlin"}, {
        "nick": "Adele_Treutel75",
        "firstname": "Nicklaus",
        "lastname": "Marks"
      }, {"nick": "Nicholaus_Strosin11", "firstname": "Shawna", "lastname": "Greenfelder"}, {
        "nick": "Jaida62",
        "firstname": "Eliane",
        "lastname": "Lockman"
      }, {"nick": "Emiliano.Glover", "firstname": "Zechariah", "lastname": "O'Kon"}, {
        "nick": "Candace_Huel",
        "firstname": "Delta",
        "lastname": "Kulas"
      }, {"nick": "Jalon1", "firstname": "Timmothy", "lastname": "Daugherty"}, {
        "nick": "Gina_Hermiston",
        "firstname": "Rosendo",
        "lastname": "Bartell"
      }, {"nick": "Mozell86", "firstname": "Denis", "lastname": "Spencer"}, {
        "nick": "Tod_Moen91",
        "firstname": "Lucio",
        "lastname": "Brekke"
      }, {"nick": "Lane.Lowe", "firstname": "Talia", "lastname": "Sipes"}, {
        "nick": "Ida49",
        "firstname": "Madie",
        "lastname": "Cronin"
      }, {"nick": "Wilber8", "firstname": "Okey", "lastname": "Stark"}, {
        "nick": "Eryn.Kilback29",
        "firstname": "Merle",
        "lastname": "Leannon"
      }, {"nick": "Consuelo71", "firstname": "Jeramy", "lastname": "Cummerata"}, {
        "nick": "Whitney37",
        "firstname": "Mckenna",
        "lastname": "Gorczany"
      }, {"nick": "Karson.Heller1", "firstname": "Marianne", "lastname": "Sauer"}, {
        "nick": "Reilly_Crona",
        "firstname": "Esmeralda",
        "lastname": "Russel"
      }, {"nick": "Marina77", "firstname": "Kaci", "lastname": "Pollich"}, {
        "nick": "Clemens.Konopelski",
        "firstname": "Aditya",
        "lastname": "Cole"
      }, {"nick": "Peggie98", "firstname": "Damaris", "lastname": "Littel"}, {
        "nick": "Benedict_Smith80",
        "firstname": "Carli",
        "lastname": "Wilderman"
      }, {"nick": "Luther.Pacocha", "firstname": "Domingo", "lastname": "Mann"}, {
        "nick": "Joanie12",
        "firstname": "Keenan",
        "lastname": "Swaniawski"
      }, {"nick": "Lottie86", "firstname": "Estell", "lastname": "Conn"}, {
        "nick": "Antonetta.Little",
        "firstname": "Nikki",
        "lastname": "Schulist"
      }, {"nick": "Marlin27", "firstname": "Kaley", "lastname": "Cruickshank"}, {
        "nick": "Demond_Keebler",
        "firstname": "Wilbert",
        "lastname": "Haley"
      }, {"nick": "Terence96", "firstname": "Dedrick", "lastname": "Donnelly"}, {
        "nick": "Jon21",
        "firstname": "Bill",
        "lastname": "Runte"
      }],

      /*
       // https://en.wikipedia.org/wiki/List_of_Internet_Relay_Chat_commands
       var a = [];$('#mw-content-text h3 .mw-headline').each((i, e) => {
       var name = e.innerHTML;
       a.push({name: name, syntax: e.parentElement.nextElementSibling.nextElementSibling.querySelector('code').innerText, desc: e.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.innerText})
       });
       console.log(JSON.stringify(a))
       */
      COMMANDS: [{
        "name": "ADMIN",
        "syntax": "ADMIN [<target>]",
        "desc": "Instructs the server to return information about the administrators of the server specified by <target>, where <target> is either a server or a user. If <target> is omitted, the server should return information about the administrators of the current server.[1]"
      }, {
        "name": "AWAY",
        "syntax": "AWAY [<message>]",
        "desc": "Provides the server with a message to automatically send in reply to a PRIVMSG directed at the user, but not to a channel they are on.[2] If <message> is omitted, the away status is removed."
      }, {
        "name": "CNOTICE",
        "syntax": "CNOTICE <nickname> <channel> :<message>",
        "desc": "Sends a channel NOTICE message to <nickname> on <channel> that bypasses flood protection limits. The target nickname must be in the same channel as the client issuing the command, and the client must be a channel operator."
      }, {
        "name": "CPRIVMSG",
        "syntax": "CPRIVMSG <nickname> <channel> :<message>",
        "desc": "Sends a private message to <nickname> on <channel> that bypasses flood protection limits. The target nickname must be in the same channel as the client issuing the command, and the client must be a channel operator."
      }, {
        "name": "CONNECT",
        "syntax": "CONNECT <target server> [<port> [<remote server>]]",
        "desc": "Instructs the server <remote server> (or the current server, if <remote server> is omitted) to connect to <target server> on port <port>.[3][4] This command should only be available to IRC Operators."
      }, {
        "name": "DIE",
        "syntax": "DIE",
        "desc": "This command may only be issued by IRC server operators."
      }, {
        "name": "ENCAP",
        "syntax": ":<source> ENCAP <destination> <subcommand> <parameters>",
        "desc": "This command is for use by servers to encapsulate commands so that they will propagate across hub servers not yet updated to support them, and indicates the subcommand and its parameters should be passed unaltered to the destination, where it will be unencapsulated and parsed. This facilitates implementation of new features without a need to restart all servers before they are usable across the network.[6]"
      }, {
        "name": "ERROR",
        "syntax": "ERROR <error message>",
        "desc": "This command is for use by servers to report errors to other servers. It is also used before terminating client connections.[7]"
      }, {"name": "HELP", "syntax": "HELP", "desc": "Requests the server help file."}, {
        "name": "INFO",
        "syntax": "INFO [<target>]",
        "desc": "Returns information about the <target> server, or the current server if <target> is omitted.[8] Information returned includes the server's version, when it was compiled, the patch level, when it was started, and any other information which may be considered to be relevant."
      }, {
        "name": "INVITE",
        "syntax": "INVITE <nickname> <channel>",
        "desc": "Invites <nickname> to the channel <channel>.[9] <channel> does not have to exist, but if it does, only members of the channel are allowed to invite other clients. If the channel mode i is set, only channel operators may invite other clients."
      }, {
        "name": "ISON",
        "syntax": "ISON <nicknames>",
        "desc": "Queries the server to see if the clients in the space-separated list <nicknames> are currently on the network.[10] The server returns only the nicknames that are on the network in a space-separated list. If none of the clients are on the network the server returns an empty list."
      }, {
        "name": "JOIN",
        "syntax": "JOIN <channels> [<keys>]",
        "desc": "Makes the client join the channels in the comma-separated list <channels>, specifying the passwords, if needed, in the comma-separated list <keys>.[11] If the channel(s) do not exist then they will be created."
      }, {
        "name": "KICK",
        "syntax": "KICK <channel> <client> [<message>]",
        "desc": "Forcibly removes <client> from <channel>.[12] This command may only be issued by channel operators."
      }, {
        "name": "KILL",
        "syntax": "KILL <client> <comment>",
        "desc": "Forcibly removes <client> from the network.[13] This command may only be issued by IRC operators."
      }, {
        "name": "KNOCK",
        "syntax": "KNOCK <channel> [<message>]",
        "desc": "Sends a NOTICE to an invitation-only <channel> with an optional <message>, requesting an invite."
      }, {
        "name": "LINKS",
        "syntax": "LINKS [<remote server> [<server mask>]]",
        "desc": "Lists all server links matching <server mask>, if given, on <remote server>, or the current server if omitted.[14]"
      }, {
        "name": "LIST",
        "syntax": "LIST [<channels> [<server>]]",
        "desc": "Lists all channels on the server.[15] If the comma-separated list <channels> is given, it will return the channel topics. If <server> is given, the command will be forwarded to <server> for evaluation."
      }, {
        "name": "LUSERS",
        "syntax": "LUSERS [<mask> [<server>]]",
        "desc": "Returns statistics about the size of the network.[16] If called with no arguments, the statistics will reflect the entire network. If <mask> is given, it will return only statistics reflecting the masked subset of the network. If <target> is given, the command will be forwarded to <server> for evaluation."
      }, {
        "name": "MODE",
        "syntax": "MODE <nickname> <flags> (user)",
        "desc": "The MODE command is dual-purpose. It can be used to set both user and channel modes.[17]"
      }, {
        "name": "MOTD",
        "syntax": "MOTD [<server>]",
        "desc": "Returns the message of the day on <server> or the current server if it is omitted.[18]"
      }, {
        "name": "NAMES",
        "syntax": "NAMES [<channels>]",
        "desc": "Returns a list of who is on the comma-separated list of <channels>, by channel name.[19] If <channels> is omitted, all users are shown, grouped by channel name with all users who are not on a channel being shown as part of channel \"*\". If <server> is specified, the command is sent to <server> for evaluation.[20]"
      }, {
        "name": "NAMESX",
        "syntax": "PROTOCTL NAMESX",
        "desc": "Instructs the server to send names in an RPL_NAMES reply prefixed with all their respective channel statuses instead of just the highest one (similar to IRCv3's multi-prefix)."
      }, {
        "name": "NICK",
        "syntax": "NICK <nickname> [<hopcount>]",
        "desc": "Allows a client to change their IRC nickname. Hopcount is for use between servers to specify how far away a nickname is from its home server.[23][24]"
      }, {
        "name": "NOTICE",
        "syntax": "NOTICE <msgtarget> <message>",
        "desc": "This command works similarly to PRIVMSG, except automatic replies must never be sent in reply to NOTICE messages.[25]"
      }, {
        "name": "OPER",
        "syntax": "OPER <username> <password>",
        "desc": "Authenticates a user as an IRC operator on that server/network.[26]"
      }, {
        "name": "PART",
        "syntax": "PART <channels> [<message>]",
        "desc": "Causes a user to leave the channels in the comma-separated list <channels>.[27]"
      }, {
        "name": "PASS",
        "syntax": "PASS <password>",
        "desc": "Sets a connection password.[28] This command must be sent before the NICK/USER registration combination."
      }, {
        "name": "PING",
        "syntax": "PING <server1> [<server2>]",
        "desc": "Tests the presence of a connection.[29] A PING message results in a PONG reply. If <server2> is specified, the message gets passed on to it."
      }, {
        "name": "PONG",
        "syntax": "PONG <server1> [<server2>]",
        "desc": "This command is a reply to the PING command and works in much the same way.[30]"
      }, {
        "name": "PRIVMSG",
        "syntax": "PRIVMSG <msgtarget> <message>",
        "desc": "Sends <message> to <msgtarget>, which is usually a user or channel.[31]"
      }, {
        "name": "QUIT",
        "syntax": "QUIT [<message>]",
        "desc": "Disconnects the user from the server.[32]"
      }, {
        "name": "REHASH",
        "syntax": "REHASH",
        "desc": "Causes the server to re-read and re-process its configuration file(s).[33] This command can only be sent by IRC Operators."
      }, {
        "name": "RESTART",
        "syntax": "RESTART",
        "desc": "Restarts a server.[34] It may only be sent by IRC Operators."
      }, {"name": "RULES", "syntax": "RULES", "desc": "Requests the server rules."}, {
        "name": "SERVER",
        "syntax": "SERVER <servername> <hopcount> <info>",
        "desc": "The server message is used to tell a server that the other end of a new connection is a server.[35] This message is also used to pass server data over the whole network. <hopcount> details how many hops (server connections) away <servername> is. <info> contains addition human-readable information about the server."
      }, {
        "name": "SERVICE",
        "syntax": "SERVICE <nickname> <reserved> <distribution> <type> <reserved> <info>",
        "desc": "Registers a new service on the network.[36]"
      }, {
        "name": "SERVLIST",
        "syntax": "SERVLIST [<mask> [<type>]]",
        "desc": "Lists the services currently on the network.[37]"
      }, {
        "name": "SQUERY",
        "syntax": "SQUERY <servicename> <text>",
        "desc": "Identical to PRIVMSG except the recipient must be a service.[38]"
      }, {
        "name": "SQUIT",
        "syntax": "SQUIT <server> <comment>",
        "desc": "Causes <server> to quit the network.[39]"
      }, {
        "name": "SETNAME",
        "syntax": "SETNAME <new real name>",
        "desc": "Allows a client to change the \"real name\" specified when registering a connection."
      }, {
        "name": "SILENCE",
        "syntax": "SILENCE [+/-<hostmask>]",
        "desc": "Adds or removes a host mask to a server-side ignore list that prevents matching users from sending the client messages. More than one mask may be specified in a space-separated list, each item prefixed with a \"+\" or \"-\" to designate whether it is being added or removed. Sending the command with no parameters returns the entries in the client's ignore list."
      }, {
        "name": "STATS",
        "syntax": "STATS <query> [<server>]",
        "desc": "Returns statistics about the current server, or <server> if it's specified.[40]"
      }, {
        "name": "SUMMON",
        "syntax": "SUMMON <user> [<server>]",
        "desc": "Gives users who are on the same host as <server> a message asking them to join IRC.[41][42]"
      }, {
        "name": "TIME",
        "syntax": "TIME [<server>]",
        "desc": "Returns the local time on the current server, or <server> if specified.[43]"
      }, {
        "name": "TOPIC",
        "syntax": "TOPIC <channel> [<topic>]",
        "desc": "Allows the client to query or set the channel topic on <channel>.[44] If <topic> is given, it sets the channel topic to <topic>. If channel mode +t is set, only a channel operator may set the topic."
      }, {
        "name": "TRACE",
        "syntax": "TRACE [<target>]",
        "desc": "Trace a path across the IRC network to a specific server or client, in a similar method to traceroute.[45]"
      }, {
        "name": "UHNAMES",
        "syntax": "PROTOCTL UHNAMES",
        "desc": "Instructs the server to send names in an RPL_NAMES reply in the long format:"
      }, {
        "name": "USER",
        "syntax": "USER <username> <hostname> <servername> <realname>",
        "desc": "This command is used at the beginning of a connection to specify the username, hostname, real name and initial user modes of the connecting client.[46][47] <realname> may contain spaces, and thus must be prefixed with a colon."
      }, {
        "name": "USERHOST",
        "syntax": "USERHOST <nickname> [<nickname> <nickname> ...]",
        "desc": "Returns a list of information about the nicknames specified.[48]"
      }, {
        "name": "USERIP",
        "syntax": "USERIP <nickname>",
        "desc": "Requests the direct IP address of the user with the specified nickname."
      }, {
        "name": "USERS",
        "syntax": "USERS [<server>]",
        "desc": "Returns a list of users and information about those users in a format similar to the UNIX commands who, rusers and finger.[49]"
      }, {
        "name": "VERSION",
        "syntax": "VERSION [<server>]",
        "desc": "Returns the version of <server>, or the current server if omitted.[50]"
      }, {
        "name": "WALLOPS",
        "syntax": "WALLOPS <message>",
        "desc": "Sends <message> to all operators connected to the server (RFC 1459), or all users with user mode 'w' set (RFC 2812).[51][52]"
      }, {
        "name": "WATCH",
        "syntax": "WATCH [+/-<nicknames>]",
        "desc": "Adds or removes a user to a client's server-side friends list. More than one nickname may be specified in a space-separated list, each item prefixed with a \"+\" or \"-\" to designate whether it is being added or removed. Sending the command with no parameters returns the entries in the client's friends list."
      }, {
        "name": "WHO",
        "syntax": "WHO [<name> [\"o\"]]",
        "desc": "Returns a list of users who match <name>.[53] If the flag \"o\" is given, the server will only return information about IRC Operators."
      }, {
        "name": "WHOIS",
        "syntax": "WHOIS [<server>] <nicknames>",
        "desc": "Returns information about the comma-separated list of nicknames masks <nicknames>.[54] If <server> is given, the command is forwarded to it for processing."
      }, {
        "name": "WHOWAS",
        "syntax": "WHOWAS <nickname> [<count> [<server>]]",
        "desc": "Used to return information about a nickname that is no longer in use (due to client disconnection, or nickname changes).[55] If given, the server will return information from the last <count> times the nickname has been used. If <server> is given, the command is forwarded to it for processing. In RFC 2812, <nickname> can be a comma-separated list of nicknames.[56]"
      }]
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  return ENV;
};
