import es from '@elastic/elasticsearch';

const index = 'users';

const handleElasticsearchError = (error) => {
    if (error.status === 404) {
        throw new Error('User Not Found', 404);
    }

    throw new Error(error.msg, error.status || 500);
}

const addUser = (username, email, password, elo, country, profileImageURL, descrption) => { // Retourne 201 si ok
    return 501;
};

const userLogin = (username, password) => { // Retourne 401 si non trouvé / erreur d'auth, sinon retourner user, elo, profileURL, pays, isAdmin
    return 501;
};

const getUser = { // Retour 404 si non trouvé, sinon TOUTES les infos
    byId: (id) => {
        return 501;
    },
    byUsername: (username) => {
        return 501;
    },
    byEmail: (email) => {
        return 501;
    }
};

const updateUser = (username) => {
    return 501;
};

// Retour 200 si ok
const deleteUser = (username) => {
    return 501;
};

export default {
    addUser,
    userLogin,
    getUser,
    updateUser,
    deleteUser
};