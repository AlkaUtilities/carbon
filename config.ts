export default {
    // General stuff
    cli: {
        status_ok: "🟩 OK",
        status_bad: "🟥 BAD",
    },

    log: {
        enabled: false,
        filePath: "./logs/",
    },

    // Bot releated stuff
    ownerId: "529424782438170679",
    developersId: ["529424782438170679"],

    devGuildId: "998487239803813898",

    icons: {
        loading: "<a:loading:1013023173635211365>",
        sync: "<:sync:1042093144369537074>",

        true: "<:true:1010479956909891614>",
        false: "<:false:1010479954372349993>",

        bot: {
            developer: "<a:developer:1010538744803233822>",
        },

        server: {
            owner: "<:server_owner:1010487201810874470>",
            verified: "<:server_verified:1010152556405739611>",
            partnered: "<:server_partnered:1010152578010579006>",
        },

        alka: {
            bot: "<:alka_bot:1010540470109225061>",
            owner: "<:alka_owner:1010540473988943912>",
        },

        blacklist: {
            found: "<:blacklist_found:1042095758402396230>",
            notfound: "<:blacklist_notfound:1042095690068807761>",
        },
    },

    alka: {
        owners: ["529424782438170679", "664025740890734593"],

        bots: [
            "1016267923985281024",
            "798420219005239326",
            "888023934207934505",
        ],
    },

    userLeveling: {
        min: 15,
        max: 25,
        required: 100, // levelupGoal: level * required
    },
};
