const { Client, RichEmbed, Message, MessageEmbed } = require('discord.js');
module.exports = function() {
    var command_list = [{
        "name": "phelp", //Help
        "description": "Give you help to use the PollPy",
        "options": ""
    },
    {
        "name": "poll", //Poll
        "description": "Start a poll or a prediction",
        "options": [
            {
                "name": "create",
                "description": "Create a poll",
                "type": 1,
                "options": 
                [
                    {
                    "name": "type",
                    "description": "The type of the prediction",
                    "type": 3,
                    "required": true,
                    "choices": [
                        {
                            "name": "Make a Bet",
                            "value": "bet"
                        },
                        {
                            "name": "Reward a Choice",
                            "value": "reward"
                        },
                        {
                            "name": "Poll without engagement",
                            "value": "poll"
                        }
                    ]
                },
                {
                    "name": "question",
                    "description": "What is the question/prediction",
                    "type": 3,
                    "required": true
                },
                {
                    "name": "choice_a",
                    "description": "Choice A",
                    "type": 3,
                    "required": true
                },
                {
                    "name": "choice_b",
                    "description": "Choice B",
                    "type": 3,
                    "required": false
                },
                {
                    "name": "choice_c",
                    "description": "Choice C",
                    "type": 3,
                    "required": false
                },
                {
                    "name": "choice_d",
                    "description": "Choice D",
                    "type": 3,
                    "required": false
                },
                {
                    "name": "choice_e",
                    "description": "Choice E",
                    "type": 3,
                    "required": false
                },
                {
                    "name": "choice_f",
                    "description": "Choice F",
                    "type": 3,
                    "required": false
                }
            ]},
            {
                "name": "select",
                "description": "Participate at a poll or prediction",
                "type": 1,
                "options": [
                    {
                        "name": "id",
                        "description": "Poll ID (bottom of the embed)",
                        "type": 4,
                        "required": true
                    },
                    {
                        "name": "choice",
                        "description": "Number that match to your choice",
                        "type": 3,
                        "required": true,
                        "choices": [
                            {
                                "name": "1",
                                "value": "choicea"
                            },
                            {
                                "name": "2",
                                "value": "choiceb"
                            },
                            {
                                "name": "3",
                                "value": "choicec"
                            },
                            {
                                "name": "4",
                                "value": "choiced"
                            },
                            {
                                "name": "5",
                                "value": "choicee"
                            },
                            {
                                "name": "6",
                                "value": "choicef"
                            }
                        ]
                    },
                    {
                        "name": "bet",
                        "description": "If it\'s a bet you have to tell how many you place on the table",
                        "type": 4,
                        "required": false
                    }
                ]
            },
            {
                "name": "lock",
                "description": "Lock A Poll but keep the stats private until an /pool end",
                "type": 1,
                "options": [
                    {
                        "name": "id",
                        "description": "Poll ID (bottom of the embed)",
                        "type": 4,
                        "required": true
                    }]
            },
            {
                "name": "end",
                "description": "End A Poll and give reward to users",
                "type": 1,
                "options": [
                    {
                        "name": "id",
                        "description": "Poll ID (bottom of the embed)",
                        "type": 4,
                        "required": true
                    },
                    {
                        "name": "choice",
                        "description": "Winner Choice",
                        "type": 3,
                        "required": true,
                        "choices": [
                            {
                                "name": "1",
                                "value": "choicea"
                            },
                            {
                                "name": "2",
                                "value": "choiceb"
                            },
                            {
                                "name": "3",
                                "value": "choicec"
                            },
                            {
                                "name": "4",
                                "value": "choiced"
                            },
                            {
                                "name": "5",
                                "value": "choicee"
                            },
                            {
                                "name": "6",
                                "value": "choicef"
                            }
                        ]
                    },
                    {
                        "name": "reward",
                        "description": "If it\'s a reward prediction indicate the reward for each winners",
                        "type": 4,
                        "required": false
                    }
                ]
            }
        ]
    },
        {
        "name": "pinfo", //Info
        "description": "Give you the lasts informations about PollPy",
        "options": ""
        },
        {
            "name": "plist", //List
            "description": "Give you the list of your server's predictions",
            "options": ""
            },
        {
            "name": "pcurrency", //Pcurrency
            "description": "Admin Command About Currency",
            "options": [
                {
                    "name": "type",
                    "description": "Define Method of the command",
                    "type": 3,
                    "required": true,
                    "choices": [
                        {
                            "name": "Add",
                            "value": "add"
                        },
                        {
                            "name": "Remove",
                            "value": "remove"
                        },
                        {
                            "name": "Set",
                            "value": "set"
                        }
                ]},
                {
                    "name": "user",
                    "description": "User you want to modify",
                    "type": 6,
                    "required": true
                },
                {
                        "name": "amount",
                        "description": "Amount of editing",
                        "type": 4,
                        "required": true
                }]
            },
            {
                "name": "profile",
                "description": "Show profile of one user",
                "type": 1,
                "options": [
                    {
                        "name": "user",
                        "description": "User you want to see",
                        "type": 6,
                        "required": true
                    }]
            },
            {
                "name": "pconfig",
                "description": "Show the config of the server",
                "type": 1,
                "options": [
                    {
                        "name": "type",
                        "description": "Define Method of the command",
                        "type": 3,
                        "required": true,
                        "choices": [
                            {
                                "name": "SetAdmin",
                                "value": "setadmin"
                            },
                            {
                                "name": "SetModerator",
                                "value": "setmoderator"
                            },
                            {
                                "name": "SetUser",
                                "value": "setuser"
                            },
                            {
                                "name": "ViewConfig",
                                "value": "viewconfig"
                            }
                        ]
                    },
                    {
                        "name": "role",
                        "description": "Role that have the permission",
                        "type": 8,
                        "required": false
                    },
                    {
                        "name": "amount",
                        "description": "Amount of editing",
                        "type": 4,
                        "required": false
                }]
            },
            {
                "name": "leaderboard",
                "description": "Show the leaderboard of the server",
                "options": ""
            },
            {
                "name": "defaultcurrency",
                "description": "Edit the config of the currency",
                "type": 1,
                "options": [
                    {
                        "name": "type",
                        "description": "Define Method of the command",
                        "type": 3,
                        "required": true,
                        "choices": [
                            {
                                "name": "Add",
                                "value": "add"
                            },
                            {
                                "name": "Remove",
                                "value": "remove"
                            },
                            {
                                "name": "Set",
                                "value": "set"
                            }
                    ]},
                    {
                        "name": "role",
                        "description": "Role you want to modify",
                        "type": 8,
                        "required": true
                    },
                    {
                        "name": "amount",
                        "description": "Amount of editing",
                        "type": 4,
                        "required": true
                }]
            }]

    return command_list
    }