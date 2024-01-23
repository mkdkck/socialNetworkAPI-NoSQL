const connection = require("../config/connection");
const { Thought, User, Reaction } = require("../models");

connection.on("error", (err) => err);

connection.once("open", async () => {
    console.log("connected");
    // Delete the collections if they exist
    let userCheck = await connection.db
        .listCollections({ name: "users" })
        .toArray();
    if (userCheck.length) {
        await connection.dropCollection("users");
    }

    let thoughtsCheck = await connection.db
        .listCollections({ name: "thoughts" })
        .toArray();
    if (thoughtsCheck.length) {
        await connection.dropCollection("thoughts");
    }

    let reactionsCheck = await connection.db
        .listCollections({ name: "reactions" })
        .toArray();
    if (reactionsCheck.length) {
        await connection.dropCollection("reactions");
    }


    try {
        // set base data
        const users = [{
            username: "ColinL",
            email: "colin@gmail.com",
            thoughts: []
        },
        {
            username: "PeterB",
            email: "peter@hotmial.com",
            thoughts: []
        },
        {
            username: "LucyK",
            email: "lucy@icloud.com",
            thoughts: []
        },
        {
            username: "MollyY",
            email: "molly@office.com",
            thoughts: []
        }];

        const thoughts = [{
            thoughtText: "I want to see a movie",
            username: "",
            reactions: []
        },
        {
            thoughtText: "I can fly",
            username: "",
            reactions: []
        },
        {
            thoughtText: "I can swim",
            username: "",
            reactions: []
        },
        {
            thoughtText: "I want to go on a road trip",
            username: "",
            reactions: []
        }]

        const reactions = [{
            reactionBody: "Great Thinking",
            username: ""
        },
        {
            reactionBody: "No way!",
            username: ""
        },
        {
            reactionBody: "I want to join too",
            username: ""
        },
        {
            reactionBody: "Nice try",
            username: ""
        },
        ]

        // create random user for reactions
        for (let i = 0; i < reactions.length; i++) {
            const userIndex = Math.floor(Math.random() * users.length);
            reactions[i].username = users[userIndex].username
        };
        //seed reaction table
        const insertedReactions = await Reaction.insertMany(reactions);

        // create random user for thoughts
        for (let i = 0; i < thoughts.length; i++) {
            const userIndex = Math.floor(Math.random() * users.length);
            thoughts[i].username = users[userIndex].username
        };

        //assign reactions to related thoughts
        thoughts.forEach(thought => {
            insertedReactions.forEach(reaction => {
                if (thought.username === reaction.username) {
                    thought.reactions.push(reaction._id);
                }
            });
        });
        //seed thoughts table
        const insertedThoughts = await Thought.insertMany(thoughts);

        //assign thoughts to related users
        users.forEach(user => {
            insertedThoughts.forEach(thought => {
                if (user.username === thought.username) {
                    user.thoughts.push(thought._id);
                }
            });
        });
        //seed users table
        await User.insertMany(users)

        console.log('user data created sucessfully')
    } catch (err) {
        console.log(err)
    }
    process.exit();
})