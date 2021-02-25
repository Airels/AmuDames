import es from './elasticsearch-client';

const index = 'users';

const handleElasticsearchError = (error) => {
    if (error.status === 404) {
        throw new Error('User Not Found', 404);
    }

    throw new Error(error.msg, error.status || 500);
}

const addUser = async (username, password, email, elo, country, profileImageURL, descrption) => { 
    es.index({
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
};


const userLogin = async (email, password) => { // Retourne 401 si non trouvé / erreur d'auth, sinon retourner 200
        es.search({
            index:'users',
            type:'user',
            body:{
                query:{
                    match: { 'email' : email, 'password':password },
                }
            }
        }).then(response => response).catch((error) => {
            handleElasticsearchError(error);
        });
};

const getUser = { // Retour 404 si non trouvé, à faire return de toutes les infos
    byId: async (id) => {
        es.search({
            index:'users',
            type:'user',
            body:{
                query:{
                    match: { 'id' : email },
                }
            }
        })

        return 501;
    },
    byUsername: async (username) => {
        es.search({
            index:'users',
            type:'user',
            body:{
                query:{
                    match: { 'username' : username },
                }
            }
        })// à faire return de toutes les infos
        return 501;
    },
    byEmail: async (email) => {
        es.search({
            index:'users',
            type:'user',
            body:{
                query:{
                    match: { 'email' : email },
                }
            }
        })// à faire return de toutes les infos
        return 501;
    }
};

const updateUser = async (username) => {
    return 501;
};

// Retour 200 si ok
const deleteUser = async (username) => {
    es.deleteByQuery({
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
};

export default {
    addUser,
    userLogin,
    getUser,
    updateUser,
    deleteUser
};