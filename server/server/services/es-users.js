import es from './elasticsearch-client';

const index = 'users';

const handleElasticsearchError = (error) => {
    if (error.status === 404) {
        throw new Error('User Not Found', 404);
    }

    throw new Error(error.msg, error.status || 500);
}

const addUser = async (username, password, email, elo, country, profileImageURL, descrption) => { // Retourne 201 si ok
    return 501;
};

const userLogin = async (email, password) => { // Retourne 401 si non trouvé / erreur d'auth, sinon retourner 200
    return 501;
};

const getUser = { // Retour 404 si non trouvé, sinon TOUTES les infos
    byId: async (id) => {
        return 501;
    },
    byUsername: async (username) => {
        return 501;
    },
    byEmail: async (email) => {
        return 501;
    }
};

const updateUser = async (username) => {
    return 501;
};

// Retour 200 si ok
const deleteUser = async (username) => {
    return 501;
};

export default {
    addUser,
    userLogin,
    getUser,
    updateUser,
    deleteUser
};