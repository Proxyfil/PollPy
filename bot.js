//Var Declaration
const { Client, RichEmbed, Message, MessageEmbed, APIMessage, MessageAttachment } = require('discord.js');
const { createClient } = require('@supabase/supabase-js');
const bot = new Client({disableEveryone: "False"});
const poll = require('./cmds/poll.js');
const help = require('./cmds/help.js');
const info = require('./cmds/info.js');
const currency_script = require('./cmds/currency.js');
const server_config = require('./cmds/server_config.js');
const token = require('./sec-ident/token.json').token;
const cmdinit = require('./cmds/init-cmd.js');
const pollerror = require('./cmds/error.js');
const db_token = require('./sec-ident/db-token.js');
const supabase = createClient(db_token()[0], db_token()[1])


//Starting Loop
bot.on('ready', () =>{
    console.log("["+new Date().toLocaleString()+"] [BOOT] Is this... life ?");
    //bot.user.setActivity("Deploying Release, I will be back soon")});
    bot.user.setActivity("/phelp | Release V1.0 NOW ON LIVE ! gg")});

    const cmdlist = cmdinit();

    //Command Declaration
    cmdlist.forEach(command => {
        bot.api.applications("856792010613719040").commands.post({
            data: {
                name: command.name,
                description: command.description,
                options: command.options
            }
        }).catch(error => {console.log(error)});

        console.log("["+new Date().toLocaleString()+"] [INIT] Command initiated : "+command.name+" as been initiated")
    });
    //Command Application

    const reply = async (interaction, response) => {
        let data = {
            content: response,
        }

        if (typeof response === 'object') {
            data = await createAPIMessage(interaction, response)
        }

        bot.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 4,
                data,
            },
        })
    }

    //Message Conversion

    const createAPIMessage = async (interaction, content) => {
        const {data, files} = await APIMessage.create(
            bot.channels.resolve(interaction.channel_id),
            content
        )
        .resolveData()
        .resolveFiles()

        return { ...data, files}
    }

    //Gain Giveaway

    const give_gain = async(currency, user_id) => {
        let { data: receive, errorreceive } = await supabase
        .from('users')
        .update({currency: currency})
        .eq('user_id', user_id)
    }

    //Command treatment

    bot.ws.on('INTERACTION_CREATE', async interaction => {
            const command = interaction.data.name.toLowerCase();
            const args = interaction.data.options;

            try{
                server = await bot.guilds.fetch(interaction.guild_id)
            }
            catch{
                const embed = pollerror("405 : Unable to get your guild info. Please contact a PollPy Admin",interaction.member.user.username,interaction.member.user.id,interaction.member.user.avatar);
                reply(interaction, embed);
                console.log("["+new Date().toLocaleString()+"] [ERROR] [SERVER INFO ERROR] Command failed by ("+interaction.member.user.id+") "+interaction.member.user.username+"#"+interaction.member.user.discriminator+" : "+interaction.data.name+" "+args[0].name+" in server "+server.name+" ("+interaction.guild_id+")") 
            }

            console.log("["+new Date().toLocaleString()+"] [REQUEST] Request by ("+interaction.member.user.id+") "+interaction.member.user.username+"#"+interaction.member.user.discriminator+" : "+interaction.data.name+" in server "+server.name+" ("+interaction.guild_id+")")

            //if(interaction.member.user.id != "249940011997200394" && interaction.member.user.id != "275207704509808640"){
            //    const embedm = pollerror("503 : Bot is in maintenance",interaction.member.user.username,interaction.member.user.id,interaction.member.user.avatar);
            //    reply(interaction, embedm);
            //    console.log("["+new Date().toLocaleString()+"] [ERROR] [MAINTENANCE] Command failed by ("+interaction.member.user.id+") "+interaction.member.user.username+"#"+interaction.member.user.discriminator+" : "+interaction.data.name+" in server "+server.name+" ("+interaction.guild_id+")")
            //    return 0
            //}

            let { data: config, error } = await supabase
                .from('config')
                .select("*")
                .eq("server_id", interaction.guild_id)

                
            if(config[0] == null){
                const { data, error2 } = await supabase
                .from('config')
                .insert([
                    { server_id: interaction.guild_id, role_config: [{'admin': '', 'moderator': '', 'user': '','admin_name': '', 'moderator_name': '', 'user_name': ''}]}
                ])
                config.push({ server_id: interaction.guild_id, roleconfig: [{'admin': '', 'moderator': '', 'user': '','admin_name': '', 'moderator_name': '', 'user_name': ''}]})
            }

            // ------------------------------------ DEBUG ---------------------------------
            //console.log(interaction);
            //console.log(args);
            // ----------------------------------------------------------------------------

            //Poll Command

            if(server.ownerID === interaction.member.user.id || interaction.member.roles.includes(config[0].role_config[0].admin) || interaction.member.roles.includes(config[0].role_config[0].moderator)){

                if (command === 'poll'){

                    const params = interaction.data.options[0].options;

                    if(args[0].name === 'create'){

                        let { data: config, error } = await supabase
                        .from('config')
                        .select("*")
                        .eq("server_id", interaction.guild_id)

                        let { data: raw_polls, error2 } = await supabase // Get Prediction
                        .from('predictions')
                        .select("*")

                        polls = []
                        
                        raw_polls.forEach(element => {
                            if(element.prediction_identification[0].guild === interaction.guild_id){
                                polls.push(element)
                            }
                        });
                        
                        if(polls.length < 3 && config[0].boost == "none"){
                    
                            const ident = [{'author':interaction.member.user.username, 'guild':interaction.guild_id}]

                            const { data, error } = await supabase
                                .from('predictions')
                                .insert([
                                    { prediction_config: params, prediction_identification: ident },
                                ])


                            const embed = poll.poll(interaction,params);
                            var id = String(data[0].id)

                            embed.setFooter("Vote with /poll select "+id+" | Poll N°"+id)

                            reply(interaction,embed,params);
                        }
                        else if(polls.length < 7 && config[0].boost === "tier1"){

                            const ident = [{'author':interaction.member.user.username, 'guild':interaction.guild_id}]

                            const { data, error } = await supabase
                                .from('predictions')
                                .insert([
                                    { prediction_config: params, prediction_identification: ident },
                                ])


                            const embed = poll.poll(interaction,params);
                            var id = String(data[0].id)

                            embed.setFooter("Vote with /poll select "+id+" | Poll N°"+id)

                            reply(interaction,embed,params);

                        }
                        else if(config[0].boost === "tier2"){

                            const ident = [{'author':interaction.member.user.username, 'guild':interaction.guild_id}]

                            const { data, error } = await supabase
                                .from('predictions')
                                .insert([
                                    { prediction_config: params, prediction_identification: ident },
                                ])


                            const embed = poll.poll(interaction,params);
                            var id = String(data[0].id)

                            embed.setFooter("Vote with /poll select "+id+" | Poll N°"+id)

                            reply(interaction,embed,params);

                        }
                        else{
                            const embed = pollerror("402 : Too much predictions. Please take Submarine Boost on Patreon or end one prediction (Default : 3 max, Tier 1 : 7 Max, Tier 2 : Infinite)",interaction.member.user.username,interaction.member.user.id,interaction.member.user.avatar);
                            reply(interaction, embed);
                            console.log("["+new Date().toLocaleString()+"] [ERROR] [Too much Predictions] Command failed by ("+interaction.member.user.id+") "+interaction.member.user.username+"#"+interaction.member.user.discriminator+" : "+interaction.data.name+" "+args[0].name+" in server "+server.name+" ("+interaction.guild_id+")")
                        }
                    }

                else if(args[0].name === 'lock'){ // Lock Prediction
                    let { data: polls, error } = await supabase
                        .from('predictions')
                        .select("*")
                        .eq('id', params[0].value)

                    if(polls[0] != null){
                        if(polls[0].prediction_identification[0].guild != interaction.guild_id){
                            const embed = pollerror("403 : Prediction not accessible for the user. You can't lock prediction from others servers. Prediction ID "+params[0].value,interaction.member.user.username,interaction.member.user.id,interaction.member.user.avatar);
                            reply(interaction, embed);
                            console.log("["+new Date().toLocaleString()+"] [ERROR] [Prediction Not Accessible] Command failed by ("+interaction.member.user.id+") "+interaction.member.user.username+"#"+interaction.member.user.discriminator+" : "+interaction.data.name+" "+args[0].name+" in server "+server.name+" ("+interaction.guild_id+")")
                        }
                        else{
                            const { data, error } = await supabase
                                    .from('predictions')
                                    .update({status: "lock"})
                                    .eq('id', params[0].value)

                            const embed = poll.lock(interaction,params);
                            reply(interaction, embed);
                        }
                    }
                }
                else if(args[0].name === 'end'){ // End Prediction

                    var winner_pot = 0
                    var choice_winner_pot = 0
            
                    let { data: polls, error } = await supabase // Get Prediction
                    .from('predictions')
                    .select("*")
                    .eq('id', params[0].value)

                    if(polls[0] != null && polls[0].prediction_identification[0].guild == interaction.guild_id){
                        if(polls[0].prediction_config[0].value === "bet"){
                
                            let winner_list = []
                            let winner_id_list = []

                            polls[0].prediction_users.forEach(element => {
                                winner_pot = winner_pot + element.bet
                                if(element.choice === params[1].value){
                                    winner_list.push(element)
                                    winner_id_list.push(element.user_id)
                                    choice_winner_pot = choice_winner_pot + element.bet
                                }
                            });
                    
                            let currency = []

                            let { data: leaderboard, errorleaderboard } = await supabase // Get users List
                                .from('config')
                                .select('leaderboard')
                                .eq('server_id', interaction.guild_id)
                    
                            let { data: users, erroruser } = await supabase // Users List
                            .from('users')
                            .select("*")
                            .in('user_id', winner_id_list)
                    
                            users.forEach(user => {
                                currency = []
                                winner_list.forEach(winner => {
                                    if(winner.user_id === user.user_id){
                                        user.currency.forEach(guild => {
                                            if(guild.server_id === interaction.guild_id){ // If Right Amount
                                                guild.amount = Math.round(guild.amount + (winner.bet/choice_winner_pot)*winner_pot,0)

                                                leaderboard[0].leaderboard[0][user.user_id] = guild.amount
                                            }
                                            currency.push(guild)
                                        });
                                    }
                                });
                                give_gain(currency, user.user_id); // Distribute Gains
                            });
                            const embed = poll.end(interaction,winner_pot,params,"bet",winner_id_list.length,polls[0].prediction_users.length);
                            reply(interaction, embed)

                            let { data: delete_polls, delete_error } = await supabase // Delete Prediction
                            .from('predictions')
                            .delete()
                            .eq('id', params[0].value)

                            const { dataleaderboard, editerrorleaderboard } = await supabase // Update Users
                            .from('config')
                            .update({'leaderboard': leaderboard[0].leaderboard })
                            .eq('id', config[0].id)

                        }
                        else if(polls[0].prediction_config[0].value === "reward"){ // Prediction Type Reward
                            if(params[2] == null){
                                const embed = pollerror("417 : You have to insert a reward. Prediction ID "+params[0].value,interaction.member.user.username,interaction.member.user.id,interaction.member.user.avatar);
                                reply(interaction, embed);
                                console.log("["+new Date().toLocaleString()+"] [ERROR] [Reward Not Defined] Command failed by ("+interaction.member.user.id+") "+interaction.member.user.username+"#"+interaction.member.user.discriminator+" : "+interaction.data.name+" "+args[0].name+" in server "+server.name+" ("+interaction.guild_id+")")
                            }
                            else if(params[2].value < 0){
                                const embed = pollerror("417 : You have to insert a reward equal or greater than 0 . Prediction ID "+params[0].value,interaction.member.user.username,interaction.member.user.id,interaction.member.user.avatar);
                                reply(interaction, embed);
                                console.log("["+new Date().toLocaleString()+"] [ERROR] [Reward Under 0] Command failed by ("+interaction.member.user.id+") "+interaction.member.user.username+"#"+interaction.member.user.discriminator+" : "+interaction.data.name+" "+args[0].name+" in server "+server.name+" ("+interaction.guild_id+")")
                            }
                            else{
                                let winner_list = []
                                let winner_id_list = []

                                choice_winner_pot = params[2].value

                                polls[0].prediction_users.forEach(element => {
                                    if(element.choice === params[1].value){
                                        winner_list.push(element)
                                        winner_id_list.push(element.user_id)
                                    }
                                });
                        
                                let currency = []
                                
                                let { data: leaderboard, errorleaderboard } = await supabase // Get users List
                                .from('config')
                                .select("leaderboard")
                                .eq('server_id', interaction.guild_id)
                        
                                let { data: users, erroruser } = await supabase // Get users List
                                .from('users')
                                .select("*")
                                .in('user_id', winner_id_list)
                        
                                users.forEach(user => {
                                    currency = []
                                    winner_list.forEach(winner => {
                                        if(winner.user_id === user.user_id){
                                            user.currency.forEach(guild => {
                                                if(guild.server_id === interaction.guild_id){ // If Right Amount
                                                    guild.amount = guild.amount + choice_winner_pot
        
                                                    leaderboard[0].leaderboard[0][user.user_id] = guild.amount
                                                    console.log("Guild Amount : "+guild.amount)
                                                }
                                                currency.push(guild)
                                            
                                                console.log("currency : " +currency) // +++++
                                            });
                                        }
                                    });
                                    give_gain(currency, user.user_id); // Distribute Gains
                                });

                                const embed = poll.end(interaction,choice_winner_pot,params,"reward",winner_id_list.length,polls[0].prediction_users.length);
                                reply(interaction, embed)

                                let { data: delete_polls, delete_error } = await supabase // Delete Prediction
                                .from('predictions')
                                .delete()
                                .eq('id', params[0].value)

                                const { dataleaderboard, editerrorleaderboard } = await supabase // Update Users
                                .from('config')
                                .update({'leaderboard': leaderboard[0].leaderboard })
                                .eq('id', config[0].id)
                            }
                        }
                        else if(polls[0].prediction_config[0].value === "poll"){

                            a = []
                            b = []
                            c = []
                            d = []
                            e = []
                            f = []

                            let { data: polls, error } = await supabase // Get Prediction
                            .from('predictions')
                            .select("*")
                            .eq('id', params[0].value)

                            polls[0].prediction_users.forEach(user => { // Calculate Votes
                                if(user.choice === "choicea"){
                                    a.push(user)
                                }
                                else if(user.choice === "choiceb"){
                                    b.push(user)
                                }
                                else if(user.choice === "choicec"){
                                    c.push(user)
                                }
                                else if(user.choice === "choiced"){
                                    d.push(user)
                                }
                                else if(user.choice === "choicee"){
                                    e.push(user)
                                }
                                else if(user.choice === "choicef"){
                                    f.push(user)
                                }
                                
                            });

                        winner_pot = [a,b,c,d,e,f]

                        const embed = poll.end(interaction,winner_pot,params,"poll",0);
                        reply(interaction, embed)

                        let { data: delete_polls, delete_error } = await supabase // Delete Prediction
                        .from('predictions')
                        .delete()
                        .eq('id', params[0].value)
                        }
                    }
                    else{
                        const embed = pollerror("404 : Prediction not found. Prediction ID "+params[0].value,interaction.member.user.username,interaction.member.user.id,interaction.member.user.avatar); // Error : Prediction Not Found
                        reply(interaction, embed)
                        console.log("["+new Date().toLocaleString()+"] [ERROR] [Prediction Not Found] Command failed by ("+interaction.member.user.id+") "+interaction.member.user.username+"#"+interaction.member.user.discriminator+" : "+interaction.data.name+" "+args[0].name+" in server "+server.name+" ("+interaction.guild_id+")")
                    }
                }
            }
            else if(command === 'plist'){
                let { data: polls, error } = await supabase // Get Prediction
                .from('predictions')
                .select("*")

                const embed = poll.list(interaction,polls);
                reply(interaction,embed);
                console.log("["+new Date().toLocaleString()+"] [LOG] Command executed by ("+interaction.member.user.id+") "+interaction.member.user.username+"#"+interaction.member.user.discriminator+" : "+interaction.data.name+" in server "+server.name+" ("+interaction.guild_id+")")
            }
            }

            if(server.ownerID === interaction.member.user.id || interaction.member.roles.includes(config[0].role_config[0].admin) || interaction.member.roles.includes(config[0].role_config[0].moderator) || interaction.member.roles.includes(config[0].role_config[0].user)){
                if(command === "poll"){
                    const params = interaction.data.options[0].options;
                    if(args[0].name === 'select'){
                            let { data: polls, error } = await supabase
                            .from('predictions')
                            .select("*")
                            .eq('id', params[0].value)

                            //console.log(poll)

                            if(polls[0] != null){ // Prediction Research
                                if(polls[0].prediction_identification[0].guild === interaction.guild_id){ // Prediction Matching
                                    if(polls[0].prediction_config[0].value === 'bet'){ // Prediction with bet

                                        var checkup = 0
                                        var currency = []
                                        var slot = 0

                                        let { data: users, error } = await supabase
                                        .from('users')
                                        .select('*')
                                        .eq('user_id', interaction.member.user.id)
                                        
                                        let { data: leaderboard, errorleaderboard } = await supabase // Get users List
                                        .from('config')
                                        .select("leaderboard")
                                        .eq('server_id', interaction.guild_id)

                                        // ------------------------------------ DEBUG ---------------------------------
                                        //console.log(polls);
                                        //console.log(users);
                                        // ----------------------------------------------------------------------------
                                        if(params[2] == null){
                                            const embed = pollerror("411 : You have to add a bet. Prediction ID "+params[0].value,interaction.member.user.username,interaction.member.user.id,interaction.member.user.avatar); // Error : Not Enough Currency
                                            reply(interaction, embed)
                                            checkup = 1000
                                            console.log("["+new Date().toLocaleString()+"] [ERROR] [No Bet Defined] Command failed by ("+interaction.member.user.id+") "+interaction.member.user.username+"#"+interaction.member.user.discriminator+" : "+interaction.data.name+" "+args[0].name+" in server "+server.name+" ("+interaction.guild_id+")")
                                        }
                                        else if(params[2].value < 0){
                                            const embed = pollerror("417 : Need to set a bet equal or greater than 0. Prediction ID "+params[0].value,interaction.member.user.username,interaction.member.user.id,interaction.member.user.avatar); // Error : Prediction Not Found
                                            reply(interaction, embed)
                                            console.log("["+new Date().toLocaleString()+"] [ERROR] [Bet Under 0] Command failed by ("+interaction.member.user.id+") "+interaction.member.user.username+"#"+interaction.member.user.discriminator+" : "+interaction.data.name+" "+args[0].name+" in server "+server.name+" ("+interaction.guild_id+")")
                                        }
                                        else if(users[0] != undefined){ // Checking if user as already currency
                                            users[0].currency.forEach(element => {
                                                if(element.server_id === interaction.guild_id){ // If Right ID
                                                    if(element.amount < params[2].value){   // If Not Enough Currency
                                                        checkup = checkup + 1
                                                    }
                                                    slot = 1
                                                }
                                                currency.push(element)
                                            });
                                            
                                            if(slot === 0){
                                                add_currency = 0
                                                let { data: config, error2 } = await supabase
                                                .from('config')
                                                .select("currency_config")
                                                .eq("server_id", interaction.guild_id)

                                                const user_roles = interaction.member.roles.map(r => r.id)
                                                user_roles.forEach(role => {
                                                    if(config[0][role] != null){
                                                        add_currency =+ config[0][role]
                                                    }
                                                });

                                                currency.push({'server_id': interaction.guild_id, 'amount': add_currency})
                                                leaderboard[0].leaderboard[0][interaction.member.user.id] = add_currency
                                                if(params[2].value > add_currency){
                                                    checkup = checkup + 1
                                                }
                                            } 
                                        }

                                        else if(users[0] === undefined){ // Creating user in DB
                                            add_currency = 0
                                            let { data: config, error2 } = await supabase
                                            .from('config')
                                            .select("currency_config")
                                            .eq("server_id", interaction.guild_id)
                            
                                            server = await bot.guilds.fetch(interaction.guild_id)
                                            const user_roles = await server.members.fetch(args[0].value).then(user => { 
                                                const user_roles = user.roles.cache.map(r => r.id)
                                                return user_roles
                                            })
                                            user_roles.forEach(role => {
                                                if(config[0].currency_config != [{}]){
                                                    if (config[0].currency_config[0][role] != null){
                                                        add_currency += config[0].currency_config[0][role]
                                                    }
                                                }
                                            });

                                            if(params[2].value > add_currency){
                                                checkup = checkup + 1
                                            }
                                            const { data, error } = await supabase
                                            .from('users')
                                            .insert([
                                                { user_id: interaction.member.user.id, currency: [{'server_id': interaction.guild_id, 'amount': add_currency}]},
                                            ])

                                            users.push([{ user_id: interaction.member.user.id, currency: [{'server_id': interaction.guild_id, 'amount': add_currency}]}])
                                            leaderboard[0].leaderboard[0][interaction.member.user.id] = add_currency
                                            
                                        }


                                        if(polls[0] != null){
                                            polls[0].prediction_users.forEach(row => {    //Checking if user already bet
                                                if(row.user_id === interaction.member.user.id){
                                                    checkup = checkup + 2
                                                }
                                            });
                                        }
                                        else{
                                            checkup =+2
                                        }


                                        if(checkup === 3){ // Already Bet and Bet Above Currency Of User
                                            const embed = pollerror("417 : Bet amount is above user currency and you have already bet. Prediction ID "+params[0].value,interaction.member.user.username,interaction.member.user.id,interaction.member.user.avatar); // Error : Not Enough Currency
                                            reply(interaction, embed)
                                            console.log("["+new Date().toLocaleString()+"] [ERROR] [Already Bet And Above Capacity] Command failed by ("+interaction.member.user.id+") "+interaction.member.user.username+"#"+interaction.member.user.discriminator+" : "+interaction.data.name+" "+args[0].name+" in server "+server.name+" ("+interaction.guild_id+")")
                                        }
                                        else if(checkup === 2){ // Already Bet
                                            const embed = pollerror("417 : You have already bet. Prediction ID "+params[0].value,interaction.member.user.username,interaction.member.user.id,interaction.member.user.avatar); // Error : Not Enough Currency
                                            reply(interaction, embed)
                                            console.log("["+new Date().toLocaleString()+"] [ERROR] [Already Bet] Command failed by ("+interaction.member.user.id+") "+interaction.member.user.username+"#"+interaction.member.user.discriminator+" : "+interaction.data.name+" "+args[0].name+" in server "+server.name+" ("+interaction.guild_id+")")
                                        }
                                        else if(checkup === 1){ // Bet Above Currency Of User
                                            const embed = pollerror("417 : Bet amount is above user currency. Prediction ID "+params[0].value,interaction.member.user.username,interaction.member.user.id,interaction.member.user.avatar); // Error : Not Enough Currency
                                            reply(interaction, embed)
                                            console.log("["+new Date().toLocaleString()+"] [ERROR] [Bet Above Capacity] Command failed by ("+interaction.member.user.id+") "+interaction.member.user.username+"#"+interaction.member.user.discriminator+" : "+interaction.data.name+" "+args[0].name+" in server "+server.name+" ("+interaction.guild_id+")")
                                        }
                                        else if(polls[0].status === "lock"){
                                            const embed = pollerror("423 : The Prediction As Been Locked. Prediction ID "+params[0].value,interaction.member.user.username,interaction.member.user.id,interaction.member.user.avatar); // Error : Not Enough Currency
                                            reply(interaction, embed)
                                            console.log("["+new Date().toLocaleString()+"] [ERROR] [Prediction Locked] Command failed by ("+interaction.member.user.id+") "+interaction.member.user.username+"#"+interaction.member.user.discriminator+" : "+interaction.data.name+" "+args[0].name+" in server "+server.name+" ("+interaction.guild_id+")")
                                        }
                                        else if(checkup === 0){ // No Error
                                            currency.forEach(element => {
                                                if(element.server_id === interaction.guild_id){ // If Right Amount
                                                    element.amount = element.amount - params[2].value

                                                    leaderboard[0].leaderboard[0][interaction.member.user.id] = element.amount

                                                    new_amount = element.amount
                                                }
                                            });

                                            const { datacurrency, errorcurrency } = await supabase // Update Users
                                            .from('users')
                                            .update({'currency': currency })
                                            .eq('user_id', interaction.member.user.id)

                                            const { dataleaderboard, errorleaderboard } = await supabase // Update Users
                                            .from('config')
                                            .update({'leaderboard': leaderboard[0].leaderboard })
                                            .eq('id', config[0].id)

                                            var user_list = polls[0].prediction_users
                                            user_list.push({"user_id": interaction.member.user.id, "choice": params[1].value, "bet": params[2].value});

                                            if(polls[0].prediction_users != null){
                                            
                                                const { dataprediction, errorprediction } = await supabase // Update Predictions
                                                .from('predictions')
                                                .update({prediction_users: user_list})
                                                .eq('id', params[0].value)
                                            }
                                            else{
                                            
                                                const { dataprediction, errorprediction } = await supabase // Update Predictions
                                                .from('predictions')
                                                .update({prediction_users: {"user_id": interaction.member.user.id, "choice": params[1].value, "bet": params[2].value}})
                                                .eq('id', params[0].value)
                                            }

                                            const embed = poll.confirm(interaction,params[1].value,new_amount); // Confirm Vote
                                            reply(interaction, embed);
                                        }
                                    }




                                    else if(polls[0].prediction_config[0].value === 'reward' || polls[0].prediction_config[0].value === 'poll'){ // Prediction with reward or poll
                                        checkup = 0

                                        if(polls[0] != null){
                                            polls[0].prediction_users.forEach(row => {    //Checking if user already bet
                                                if(row.user_id === interaction.member.user.id){
                                                    checkup =+ 2
                                                }
                                            });
                                        }
                                        else{
                                            checkup =+2
                                        }

                                        if(checkup === 2){ // Already Bet
                                            const embed = pollerror("417 : You have already bet. Prediction ID "+params[0].value,interaction.member.user.username,interaction.member.user.id,interaction.member.user.avatar); // Error : Not Enough Currency
                                            reply(interaction, embed)
                                            console.log("["+new Date().toLocaleString()+"] [ERROR] [Already Bet] Command failed by ("+interaction.member.user.id+") "+interaction.member.user.username+"#"+interaction.member.user.discriminator+" : "+interaction.data.name+" "+args[0].name+" in server "+server.name+" ("+interaction.guild_id+")")
                                        }
                                        else if(polls[0].status === "lock"){
                                            const embed = pollerror("423 : The Prediction As Been Locked. Prediction ID "+params[0].value,interaction.member.user.username,interaction.member.user.id,interaction.member.user.avatar); // Error : Not Enough Currency
                                            reply(interaction, embed)
                                            console.log("["+new Date().toLocaleString()+"] [ERROR] [Prediction Locked] Command failed by ("+interaction.member.user.id+") "+interaction.member.user.username+"#"+interaction.member.user.discriminator+" : "+interaction.data.name+" "+args[0].name+" in server "+server.name+" ("+interaction.guild_id+")")
                                        }
                                        else if(checkup === 0){

                                            var user_list = polls[0].prediction_users
                                            user_list.push({"user_id": interaction.member.user.id, "choice": params[1].value});

                                            if(polls[0].prediction_users != null){
                                                const { data, error } = await supabase
                                                .from('predictions')
                                                .update({prediction_users: user_list})
                                                .eq('id', params[0].value)
                                            }
                                            else{
                                                const { data, error } = await supabase
                                                .from('predictions')
                                                .update({prediction_users: [{"user_id": interaction.member.user.id, "choice": params[1].value}]})
                                                .eq('id', params[0].value)
                                            }

                                            const embed = poll.confirm(interaction,params[1].value); // Confirm Vote
                                            reply(interaction, embed);
                                        }
                                    }

                                    else{ // Prediction Error : Access Unauthorized to the Prediction
                                        const embed = pollerror("403 : Prediction not accessible for the user. Prediction ID "+params[0].value,interaction.member.user.username,interaction.member.user.id,interaction.member.user.avatar);
                                        reply(interaction, embed);
                                        console.log("["+new Date().toLocaleString()+"] [ERROR] [Prediction Not Accessible] Command failed by ("+interaction.member.user.id+") "+interaction.member.user.username+"#"+interaction.member.user.discriminator+" : "+interaction.data.name+" "+args[0].name+" in server "+server.name+" ("+interaction.guild_id+")")
                                    }
                                }
                                else{ //Prediction Error : Bad ID input
                                    const embed = pollerror("404 : Prediction Not Found for ID "+params[0].value,interaction.member.user.username,interaction.member.user.id,interaction.member.user.avatar);
                                    reply(interaction, embed);
                                    console.log("["+new Date().toLocaleString()+"] [ERROR] [Prediction Not Found] Command failed by ("+interaction.member.user.id+") "+interaction.member.user.username+"#"+interaction.member.user.discriminator+" : "+interaction.data.name+" "+args[0].name+" in server "+server.name+" ("+interaction.guild_id+")")
                                }
                            }
                            else{
                                const embed = pollerror("404 : Prediction Not Found for ID "+params[0].value,interaction.member.user.username,interaction.member.user.id,interaction.member.user.avatar); // Prediction Not Found
                                reply(interaction, embed);
                                console.log("["+new Date().toLocaleString()+"] [ERROR] [Prediction Not Found] Command failed by ("+interaction.member.user.id+") "+interaction.member.user.username+"#"+interaction.member.user.discriminator+" : "+interaction.data.name+" "+args[0].name+" in server "+server.name+" ("+interaction.guild_id+")")
                            }
                            console.log("["+new Date().toLocaleString()+"] [LOG] Command executed by ("+interaction.member.user.id+") "+interaction.member.user.username+"#"+interaction.member.user.discriminator+" : "+interaction.data.name+" "+args[0].name+" in server "+server.name+" ("+interaction.guild_id+")")
                        }
                    }
                
                //Help Command

                else if (command === 'phelp'){ 
                    const embed = help(interaction.member.user.username,interaction.member.user.id,interaction.member.user.avatar);
                    reply(interaction, embed);
                
                    console.log("["+new Date().toLocaleString()+"] [LOG] Command executed by ("+interaction.member.user.id+") "+interaction.member.user.username+"#"+interaction.member.user.discriminator+" : "+interaction.data.name+" in server "+server.name+" ("+interaction.guild_id+")")
                }

                //Info Command

                else if (command === 'pinfo'){
                    const embed = info(interaction.member.user.username,interaction.member.user.id,interaction.member.user.avatar);
                    reply(interaction,embed);

                    console.log("["+new Date().toLocaleString()+"] [LOG] Command executed by ("+interaction.member.user.id+") "+interaction.member.user.username+"#"+interaction.member.user.discriminator+" : "+interaction.data.name+" in server "+server.name+" ("+interaction.guild_id+")")
                }

                //Profile Command

                else if (command === 'profile'){
                    add_currency = 0
                    let { data: users, error1 } = await supabase
                    .from('users')
                    .select("*")
                    .eq("user_id", args[0].value)

                    let { data: config, error2 } = await supabase
                    .from('config')
                    .select("*")
                    .eq("server_id", interaction.guild_id)

                    if(users[0] == null){
                        add_currency = 0

                        server = await bot.guilds.fetch(interaction.guild_id)
                        const user_roles = await server.members.fetch(args[0].value).then(user => { 
                            const user_roles = user.roles.cache.map(r => r.id)
                            return user_roles
                        })
                        user_roles.forEach(role => {
                            if(config[0].currency_config != [{}]){
                                if (config[0].currency_config[0][role] != null){
                                    add_currency += config[0].currency_config[0][role]
                                }
                            }
                        });

                        const { data, error } = await supabase
                        .from('users')
                        .insert([
                        { user_id: args[0].value, currency: [{'server_id': interaction.guild_id, 'amount': add_currency}]},
                        ])

                        users.push({ user_id: args.value, currency: [{'server_id': interaction.guild_id, 'amount': add_currency}], 'boost': 'none'})
                    }

                    currency = []

                        users[0].currency.forEach(guild => {
                            if(guild.server_id === interaction.guild_id){
                                currency.push(guild)
                            }                
                        });
                    var boost = users[0].boost
                    if(interaction.member.roles.includes(config[0].role_config[0].admin)){
                        s_role = "admin"
                    }
                    else if(interaction.member.roles.includes(config[0].role_config[0].moderator)){
                        s_role = "moderator"
                    }
                    else if(interaction.member.roles.includes(config[0].role_config[0].user)){
                        s_role = "user"
                    }
                    else{
                        s_role = "4c931151fd94ebc6aa6034427624b2ea"
                    }
                    let user = bot.users.fetch(args[0].value).then(user => {

                        resp = bot.guilds.cache.get(interaction.guild_id).channels.cache.get(interaction.channel_id)

                        if(boost == "tier1" || boost == "tier2"){

                            const embed = new MessageEmbed()
                            .setTitle(':page_facing_up: '+user.username+'\'s Profile')
                            .setColor(0xda5d5d)
                            .setTimestamp()
                            .setAuthor(interaction.member.user.username, "https://cdn.discordapp.com/avatars/"+interaction.member.user.id+"/"+interaction.member.user.avatar+".webp?size=128")
                            
                            reply(interaction,embed);

                            const img = currency_script.profile(interaction,args,user,currency,boost,s_role,resp)
                        }
                        else{
                            currency_script.profile(interaction,args,user,currency,boost,s_role,resp).then(embed =>{
                                reply(interaction,embed);
                            })
                        }

                        console.log("["+new Date().toLocaleString()+"] [LOG] Command executed by ("+interaction.member.user.id+") "+interaction.member.user.username+"#"+interaction.member.user.discriminator+" : "+interaction.data.name+" in server "+server.name+" ("+interaction.guild_id+")")

                    });
                }

                else if (command === "leaderboard"){
                    let { data: leaderboard, error1 } = await supabase
                        .from('config')
                        .select("leaderboard")
                        .eq("server_id", interaction.guild_id)

                        const raw_list = Object.entries(leaderboard[0].leaderboard[0])
                        raw_list.sort(function(a,b){
                            return b[1] - a[1]
                        })

                        let list = []
                        
                        field = ""
                        if(raw_list[0] != null){
                            i = 0
                        }
                        else{
                            i = 15
                            field = "No users have been register yet"
                        }
                        while (i != 15){
                            if(raw_list[i] != null){
                                amount = raw_list[i][1]
                                list = await bot.users.fetch(raw_list[i][0]).then(user =>{
                                    list[user.username] = amount
                                    return list
                                })
                            }
                            i = i + 1
                        }

                    const embed = currency_script.leaderboard(interaction, args, list, bot.guilds.cache.get(interaction.guild_id))
                    reply(interaction, embed)
                    console.log("["+new Date().toLocaleString()+"] [LOG] Command executed by ("+interaction.member.user.id+") "+interaction.member.user.username+"#"+interaction.member.user.discriminator+" : "+interaction.data.name+" in server "+server.name+" ("+interaction.guild_id+")")
                }
            }

            if(server.ownerID === interaction.member.user.id || interaction.member.roles.includes(config[0].role_config[0].admin)){

                //Pcurrency Command

                if (command === 'pcurrency'){
                    let { data: leaderboard, errorleaderboard } = await supabase // Get users List
                        .from('config')
                        .select("leaderboard")
                        .eq('server_id', interaction.guild_id)

                    if(args[0].value === "set"){

                        currency = []

                        let { data: users, error1 } = await supabase
                        .from('users')
                        .select("*")
                        .eq("user_id", args[1].value)
                        
                        if(users[0] == null){
                            const { data, error } = await supabase
                            .from('users')
                            .insert([
                            { user_id: args[1].value, currency: [{'server_id': interaction.guild_id, 'amount': args[2].value}]},
                            ])

                            let users = [{ user_id: args[1].value, currency: [{'server_id': interaction.guild_id, 'amount': args[2].value}]}]

                            leaderboard[0].leaderboard[0][users[0].user_id] = args[2].value

                        }
                        else{
                            checkup = 0
                            users[0].currency.forEach(guild => {
                                if(guild.server_id === interaction.guild_id){ // If Right Amount
                                    guild.amount = args[2].value

                                    leaderboard[0].leaderboard[0][args[1].value] = args[2].value
                                    checkup = 1
                                }
                                currency.push(guild)
                            });
                            if(checkup===0){
                                currency.push({"server_id":interaction.guild_id,"amount":args[2].value})

                                leaderboard[0].leaderboard[0][users[0].user_id] = args[2].value
                            }

                            const { data, error2 } = await supabase
                            .from('users')
                            .update({ currency: currency })
                            .eq('user_id', args[1].value)
                        }
                        let user = bot.users.fetch(args[1].value).then(user => {
                            console.log("called")
                            const embed = currency_script.modify(interaction, args, user.username)
                            reply(interaction,embed)
                        });
                        const { dataleaderboard, errorleaderboard } = await supabase // Update Users
                        .from('config')
                        .update({'leaderboard': leaderboard[0].leaderboard })
                        .eq('id', interaction.guild_id)
                    }
                    else if(args[0].value === "add"){

                        currency = []
                        add_currency = 0

                        let { data: users, error1 } = await supabase
                        .from('users')
                        .select("*")
                        .eq("user_id", args[1].value)

                        let { data: config, error2 } = await supabase
                        .from('config')
                        .select("currency_config")
                        .eq("server_id", interaction.guild_id)

                        let { data: leaderboard, errorleaderboard } = await supabase // Get users List
                        .from('config')
                        .select("leaderboard")
                        .eq('server_id', interaction.guild_id)

                        server = await bot.guilds.fetch(interaction.guild_id)
                        const user_roles = await server.members.fetch(args[1].value).then(user => { 
                            const user_roles = user.roles.cache.map(r => r.id)
                            return user_roles
                        })
                        user_roles.forEach(role => {
                            if(config[0].currency_config != [{}]){
                                if (config[0].currency_config[0][role] != null){
                                    add_currency += config[0].currency_config[0][role]
                                }
                            }
                        });
                        if(users[0] == null){
                            const { data, error } = await supabase
                            .from('users')
                            .insert([
                            { user_id: args[1].value, currency: [{'server_id': interaction.guild_id, 'amount': 0+args[2].value+add_currency}]},
                            ])

                            let users = [{ user_id: args[1].value, currency: [{'server_id': interaction.guild_id, 'amount': 0+args[2].value+add_currency}]}]

                            leaderboard[0].leaderboard[0][users[0].user_id] = args[2].value+add_currency
                        }
                        else{
                            checkup = 0
                            users[0].currency.forEach(guild => {
                                if(guild.server_id === interaction.guild_id){ // If Right Amount
                                    guild.amount = guild.amount + args[2].value
                                    leaderboard[0].leaderboard[0][users[0].user_id] = guild.amount
                                    checkup = 1
                                }
                                currency.push(guild)
                            });
                            if(checkup===0){
                                currency.push({"server_id":interaction.guild_id,"amount":add_currency+args[2].value})

                                leaderboard[0].leaderboard[0][users[0].user_id] = add_currency+args[2].value
                            }

                            const { data, error2 } = await supabase
                            .from('users')
                            .update({ currency: currency })
                            .eq('user_id', args[1].value)
                        }
                        let user = bot.users.fetch(args[1].value).then(user => {
                            const embed = currency_script.modify(interaction, args, user.username)
                            reply(interaction,embed)
                        });

                        const { dataleaderboard2, errorleaderboard2 } = await supabase // Update Users
                        .from('config')
                        .update({'leaderboard': leaderboard[0].leaderboard })
                        .eq('id', config[0].id)
                    }
                    else if(args[0].value === "remove"){

                        currency = []
                        add_currency = 0

                        let { data: users, error1 } = await supabase
                        .from('users')
                        .select("*")
                        .eq("user_id", args[1].value)

                        let { data: config, error2 } = await supabase
                        .from('config')
                        .select("currency_config")
                        .eq("server_id", interaction.guild_id)

                        let { data: leaderboard, errorleaderboard } = await supabase // Get users List
                        .from('config')
                        .select("leaderboard")
                        .eq('server_id', interaction.guild_id)

                        server = await bot.guilds.fetch(interaction.guild_id)
                        const user_roles = await server.members.fetch(args[1].value).then(user => { 
                            const user_roles = user.roles.cache.map(r => r.id)
                            return user_roles
                        })
                        user_roles.forEach(role => {
                            if(config[0].currency_config != [{}]){
                                if (config[0].currency_config[0][role] != null){
                                    add_currency += config[0].currency_config[0][role]
                                }
                            }
                        });

                        if(users[0] == null){
                            const { data, error } = await supabase
                            .from('users')
                            .insert([
                            { user_id: args[1].value, currency: [{'server_id': interaction.guild_id, 'amount': 0-args[2].value + add_currency}]},
                            ])

                            let users = [{ user_id: args[1].value, currency: [{'server_id': interaction.guild_id, 'amount': 0-args[2].value + add_currency}]}]

                            leaderboard[0].leaderboard[0][users[0].user_id] = 0-args[2].value + add_currency
                        }
                        else{
                            checkup = 0
                            users[0].currency.forEach(guild => {
                                if(guild.server_id === interaction.guild_id){ // If Right Amount
                                    guild.amount = guild.amount - args[2].value

                                    leaderboard[0].leaderboard[0][users[0].user_id] = guild.amount-args[2].value


                                    checkup = 1
                                }
                                currency.push(guild)
                            });
                            if(checkup===0){
                                currency.push({"server_id":interaction.guild_id,"amount":add_currency-args[2].value})

                                leaderboard[0].leaderboard[0][users[0].user_id] = add_currency-args[2].value
                            }

                            const { data, error2 } = await supabase
                            .from('users')
                            .update({ currency: currency })
                            .eq('user_id', args[1].value)
                        }
                        let user = bot.users.fetch(args[1].value).then(user => {
                            const embed = currency_script.modify(interaction, args, user.username)
                            reply(interaction,embed)
                        });
                        const { dataleaderboard2, errorleaderboard2 } = await supabase // Update Users
                        .from('config')
                        .update({'leaderboard': leaderboard[0].leaderboard })
                        .eq('id', config[0].id)
                    }

                    console.log("["+new Date().toLocaleString()+"] [LOG] Command executed by ("+interaction.member.user.id+") "+interaction.member.user.username+"#"+interaction.member.user.discriminator+" : "+interaction.data.name+" "+args[0].value+" in server "+server.name+" ("+interaction.guild_id+")")
                }

                //Pconfig Command

                else if (command === 'pconfig'){
                    let { data: config, error } = await supabase
                        .from('config')
                        .select("*")
                        .eq("server_id", interaction.guild_id)

                    if(config[0] == null){
                        const { data, error2 } = await supabase
                        .from('config')
                        .insert([
                            { server_id: interaction.guild_id, role_config: [{'admin': '', 'moderator': '', 'user': '','admin_name': '', 'moderator_name': '', 'user_name': ''}], leaderboard: [{}], currency_config: [{}]}
                        ])

                        config.push({ server_id: interaction.guild_id, role_config: [{'admin': '', 'moderator': '', 'user': '','admin_name': '', 'moderator_name': '', 'user_name': ''}], leaderboard: [{}], currency_config: [{}]})
                    }
                    if(args[1] != null || args[0].value == "viewconfig"){
                        if(args[0].value === "setadmin"){
                            if(args[1].value != null){
                                config[0].role_config[0].admin = args[1].value
                                config[0].role_config[0].admin_name = server.roles.cache.get(args[1].value).name
                            }
                        }
                        else if(args[0].value === "setmoderator"){
                            if(args[1].value != null){
                                config[0].role_config[0].moderator = args[1].value
                                config[0].role_config[0].moderator_name = server.roles.cache.get(args[1].value).name
                            }
                        }
                        else if(args[0].value === "setuser"){
                            if(args[1].value != null){
                                config[0].role_config[0].user = args[1].value
                                config[0].role_config[0].user_name = server.roles.cache.get(args[1].value).name
                            }
                        }

                        const { data, error2 } = await supabase
                        .from('config')
                        .update({ role_config: config[0].role_config })
                        .eq('server_id', interaction.guild_id)

                        const embed = server_config.config(interaction,args,config[0],server,[]);
                        reply(interaction, embed);
                    }

                    console.log("["+new Date().toLocaleString()+"] [LOG] Command executed by ("+interaction.member.user.id+") "+interaction.member.user.username+"#"+interaction.member.user.discriminator+" : "+interaction.data.name+" "+args[0].value+" in server "+server.name+" ("+interaction.guild_id+")")
                }

                //DefaultCurrency

                else if (command === 'defaultcurrency'){
                    let { data: config, error } = await supabase
                        .from('config')
                        .select("*")
                        .eq("server_id", interaction.guild_id)

                    if(config[0] == null){
                        const { data, error2 } = await supabase
                        .from('config')
                        .insert([
                            { server_id: interaction.guild_id, role_config: [{'admin': '', 'moderator': '', 'user': '','admin_name': '', 'moderator_name': '', 'user_name': ''}], leaderboard: [{}], currency_config: [{}]}
                        ])

                        config.push({ server_id: interaction.guild_id, role_config: [{'admin': '', 'moderator': '', 'user': '','admin_name': '', 'moderator_name': '', 'user_name': ''}], leaderboard: [{}], currency_config: [{}]})
                    }
                    if(args[1] != null || args[2] != null || args[0].value == "viewconfig"){
                        if(args[0].value === "set"){
                            if(args[2].value != null){
                                config[0].currency_config[0][args[1].value] = args[2].value
                            }
                        }
                        else if(args[0].value === "add"){
                            if(args[2].value != null){
                                config[0].currency_config[0][args[1].value] =+ args[2].value
                            }
                        }
                        else if(args[0].value === "remove"){
                            if(args[2].value != null){
                                config[0].currency_config[0][args[1].value] =- args[2].value
                            }
                        }

                        const { data, error2 } = await supabase
                        .from('config')
                        .update({ currency_config: config[0].currency_config })
                        .eq('server_id', interaction.guild_id)

                        const list = Object.entries(config[0].currency_config[0])
                        curr_config = [{}]
                        curr_config_list = await bot.guilds.fetch(interaction.guild_id).then(server => {
                            list.forEach(element => {
                                curr_config_list_temp = server.roles.fetch(element[0]).then(role => {
                                    curr_config[0][role.name] = element[1]
                                    return curr_config
                                })
                            });
                            return curr_config_list_temp
                        })

                        const embed = server_config.config(interaction,args,config[0],server,curr_config_list);
                        reply(interaction, embed);
                    }
                    else{
                        const embed = pollerror("417 : Need to select a Role or Define an amount.",interaction.member.user.username,interaction.member.user.id,interaction.member.user.avatar); // Error : Prediction Not Found
                        reply(interaction, embed)
                        console.log("["+new Date().toLocaleString()+"] [ERROR] [No Role Defined] Command failed by ("+interaction.member.user.id+") "+interaction.member.user.username+"#"+interaction.member.user.discriminator+" : "+interaction.data.name+" "+args[0].value+" in server "+server.name+" ("+interaction.guild_id+")")
                    }

                    console.log("["+new Date().toLocaleString()+"] [LOG] Command executed by ("+interaction.member.user.id+") "+interaction.member.user.username+"#"+interaction.member.user.discriminator+" : "+interaction.data.name+" "+args[0].value+" in server "+server.name+" ("+interaction.guild_id+")")
                }
            }
            if(config[0].role_config[0].admin === "" && config[0].role_config[0].moderator === "" && config[0].role_config[0].user === "" && server.ownerID != interaction.member.user.id){
                const embed = pollerror("418 : PollPy config not defined. Please contact your server owner to make /pconfig.",interaction.member.user.username,interaction.member.user.id,interaction.member.user.avatar); // Error : Prediction Not Found
                reply(interaction, embed)
                console.log("["+new Date().toLocaleString()+"] [ERROR] [No Config] Command failed by ("+interaction.member.user.id+") "+interaction.member.user.username+"#"+interaction.member.user.discriminator+" : "+interaction.data.name+" in server "+server.name+" ("+interaction.guild_id+")")
            }
            else if(server.ownerID != interaction.member.user.id && interaction.member.roles.includes(config[0].role_config[0].admin) === false && interaction.member.roles.includes(config[0].role_config[0].moderator) === false && interaction.member.roles.includes(config[0].role_config[0].user) === false){
                const embed = pollerror("418 : You don\'t have the permission to use commands. Please contact your server owner.",interaction.member.user.username,interaction.member.user.id,interaction.member.user.avatar); // Error : Prediction Not Found
                reply(interaction, embed)
                console.log("["+new Date().toLocaleString()+"] [ERROR] [No Rights] Command failed by ("+interaction.member.user.id+") "+interaction.member.user.username+"#"+interaction.member.user.discriminator+" : "+interaction.data.name+" in server "+server.name+" ("+interaction.guild_id+")")
            }
        }
);
process.on('unhandledRejection', async error => {
	proxyfil = await bot.users.fetch("249940011997200394")
    proxyfil.send("[ERROR] "+error)
    console.log(error)
});
bot.login(token);