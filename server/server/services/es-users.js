import es from './elasticsearch-client';

const index = 'users';

const handleElasticsearchError = (error) => {
    if (error.status === 404) {
        throw new Error('User Not Found', 404);
    }

    throw new Error(error.msg, error.status || 500);
}

const addUser = (username, password, email, elo, country, profileImageURL, description) => es.index({
        index,
        refresh: 'true',
        body:{
            'username':username,
            'password':password,
            'email':email,
            'elo':elo,
            'country':country,
            'profileImg':profileImageURL,
            'description':description,
            'isAdmin':'false'
        }
    })
    .then(response => response)
    .catch((error) => {
        handleElasticsearchError(error);
    });

const userLogin = (mail, passwd) => es.search({
        index,
        body:{
            "query":{
                "bool": {
                    "must": [
                        {
                            "match": {
                                "email": mail
                            }
                        },
                        {
                            "match": {
                                "password": passwd
                            }
                        }
                    ]
                }
            }
        }
    }).then(response => response).catch((error) => {
        console.log(error);
        handleElasticsearchError(error);
});

const getUser = {
    byUsername: (username) => es.search({
            index:'users',
            type:'user',
            body:{
                query:{
                    match: { 'username' : username },
                }
            }
        })
        .then(res => res)
        .catch(e => {
            handleElasticsearchError(e)
    }),
    byEmail: (mail) => es.search({
        index,
        body: {
            "query": {
                "match": {
                    "email": {
                        "query": mail
                    }
                }
            }
        }
    })
    .then(res => res)
    .catch(e => {
        handleElasticsearchError(e)
        console.log(e);
    })
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