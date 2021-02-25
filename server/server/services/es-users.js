import es from './elasticsearch-client';

const index = 'users';

const handleElasticsearchError = (error) => {
    if (error.status === 404) {
        throw new Error('User Not Found', 404);
    }

    throw new Error(error.msg, error.status || 500);
}

const addUser = (username, password, email, elo, country, profileImageURL, descrption) => es.index({
        index:'users',
        type: 'user',
        body:{
            'username':username,
            'password':password,
            'email':email,
            'elo':elo,
            'country':country,
            'profileImg':profileImageURL,
            'description':descrption,
            'isAdmin':'false'
        }
    }).then(response => response).catch((error) => {
        handleElasticsearchError(error);
});

const userLogin = (email, passwd) => es.search({
        index:'users',
        type:'user',
        body:{
            query:{
                match: { 
                    email: {
                        query: email
                    },
                    password: {
                        query: passwd
                    }
                 }
            }
        }
    }).then(response => response).catch((error) => {
        console.log(error);
        handleElasticsearchError(error);
});

const getUser = {
    byId: (id) => es.search({
        index:'users',
        type:'user',
        body:{
            query:{
                match: { 'id' : email },
            }
        }
    }),
    byUsername: (username) => es.search({
            index:'users',
            type:'user',
            body:{
                query:{
                    match: { 'username' : username },
                }
            }
        }).then(res => res)
        .catch(e => {
            handleElasticsearchError(e)
            console.log(e);
    }),
    byEmail: (email) => es.search({
        index:'users',
        type:'user',
        body:{
            query:{
                match: { 'email' : email },
            }
        }
    })// à faire return de toutes les infos
};

const updateUser = (username) => 501;

const deleteUser = (username) => es.deleteByQuery({
        index:'users',
        type:'user',
        body:{
            query:{
                match: { 'username' : username },
            }
        }
    }).then(response => response).catch((error) => {
        handleElasticsearchError(error);
});

export default {
    addUser,
    userLogin,
    getUser,
    updateUser,
    deleteUser
};