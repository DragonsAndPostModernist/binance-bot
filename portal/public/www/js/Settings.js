settings = {
    request:{
         method:{
            POST:"POST",
            GET:"GET",
            DELETE:"DELETE",
            PATCH:"PATCH",
            PUT:"PUST"
        }
    },
    paths: {
        client: {
            url: "http://localhost",
            port: 3000
        },
        apiBasePath:{
            dev:"http://localhost:3000/api/v1",
            prod:"http://196.168.0.66:3000/api/v1"
        },
        api:{
            bot:{
                get:"/bot",
                getByName:"/bot/",
                post:"/bot",
                patch:"/bot/",
                delete:"/bot/"
            },
        }
    },
    alerts:{
       toast:{
           success:{
               botCreated:"Success, Bot created",
           },
           error:{
               botCreated:"Oops something wen wrong creating your bot, Try again later"  
           },
           warning:{

           }
           
        }
    }
};