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
    body: {
        'username': username,
        'password': password,
        'email': email,
        'elo': elo,
        'country': country,
        'profileImageURL': profileImageURL,
        'description': description,
        'isAdmin': 'false'
    }
})
    .then(response => response)
    .catch((error) => {
        handleElasticsearchError(error);
    });

const userLogin = (mail, passwd) => es.search({
    index,
    body: {
        "query": {
            "bool": {
                "must": [
                    {
                        "match": {
                            "email": {
                                "query": mail,
                                "operator": "and"
                            }
                        }
                    },
                    {
                        "match": {
                            "password": {
                                "query": passwd,
                                "operator": "and"
                            }
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
        index,
        body: {
            query: {
                match: { 
                    "username": {
                        "query": username
                    } 
                },
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
                        "query": mail,
                        "operator": "and"
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

const updateUser = (email, username, password, profileImageURL, country, description, isAdmin) => es.updateByQuery({
    index,
    refresh: 'true',
    "query": {
        "match": {
          "email": email
        }
      },
      "script" : {
      "source" : "ctx._source.username = params.username; ctx._source.password = params.password; ctx._source.profileImageURL = params.profileImageURL; ctx._source.country = params.country; ctx._source.description = params.description; ctx._source.isAdmin = params.isAdmin",
      "lang" : "painless",
      "params" : {
      "username" : username,
      "username" : password,
      "profileImageURL" : profileImageURL,
      "country" : country,
      "description" : description,
      "isAdmin" : isAdmin
      }
      }
})
.then(response => response)
.catch((error) => {
    console.log("Error " + error);
    handleElasticsearchError(error);
});

const updateUserWithoutPassword = (email, username, profileImageURL, country, description, isAdmin) => es.updateByQuery({
    index,
    refresh: 'true',
    body: {
        "query": {
            "match": {
                "email": {
                    "query": email,
                    "operator": "and"
                }
            }
        },
        "script" : {
            "source" : "ctx._source.username = params.username; ctx._source.profileImageURL = params.profileImageURL; ctx._source.country = params.country; ctx._source.description = params.description; ctx._source.isAdmin = params.isAdmin",
            "lang" : "painless",
            "params" : {
                "username" : username,
                "profileImageURL" : profileImageURL,
                "country" : country,
                "description" : description,
                "isAdmin" : isAdmin
            }
        }
    }
})
.then(response => response)
.catch((error) => {
    console.log("Error " + error);
    handleElasticsearchError(error);
});

const deleteUser = (email) => es.deleteByQuery({
    index,
    type: 'user',
    refresh: 'true',
    body: {
        query: {
            match: { 'email': email },
        }
    }
}).then(response => response).catch((error) => {
    handleElasticsearchError(error);
});

const getRanking = () => es.search({
    index,
    body: {
        "sort": [
            { "elo": "desc" }
        ]
    }
}).then(res => res)
.catch((err) => {
    handleElasticsearchError(err);
})

export default {
    addUser,
    userLogin,
    getUser,
    updateUser,
    updateUserWithoutPassword,
    deleteUser,
    getRanking
};