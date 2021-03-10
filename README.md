
![logo](https://i.ibb.co/Px4yQ1y/logo-xxl-amu-dame-outline.png)

# Overview of the project: AmuDames

AMU dames is an online website to play checkers (Dames) in multiplayer.
Featuring a ranking system, be among the best checkers players on AMU dames!

The name come from AMU, stands for Aix-Marseille University, our university at the time of this project, and
dames, as we call checkers in french.
This project was done in 3/4 weeks as the final project of a web app class.

**Team members:** VIZCAINO Yohan, PIERRARD Kévin, YUN Eunsun, IKHLEF Eddy

# Informations
Done using Angular for the front-end, Node.js for the back-end, Use of the ElasticSearch search engine to store and retrieve datas.
Use of npm module to calculate the elo 
Use of ng bootstrap to use some features of bootstrap like modals and collapse

# Front-End Files

<u>Components:</u>

- **app:** the main component, with a navbar to move in different part of the website, connect/disconnect.
- **home:** the home component of the website, featuring a small descriptive text and a news showcase (Admin users can edit the news or upload a news with different type (know with the badge color). 
- **news-edit-modal:** a component to get the modal of a previously selected news to edit it or delete it
- **guide:** a simple component with rules to play the game
- **ranking:** a component used to see the rankings, and visit users' profiles
- **user-profile:** a component to see our or others informations, featuring an edit form to update or delete our profile
- **game-lobby:** the component where users go after click on play, waiting for another player to come to start the game
- **game:** the game component to play checkers on a canvas 

<u>Models:</u>

- game
- news
- user

<u>Services:</u>

- **guards** auth-guard and auth-guard-in-game
- game-manager
- http
- news
- user
- web-socket

## Back-End Files
- **models:** client-socket, game, news, users (use of the front-end models in back-end to be able to use these objects)
- **routes:** game-route (to get, edit games datas), news-route (to get, edit or delete news datas), users-route (to get, edit or delete users datas)
- **services:** elasticsearch-client and its use with es-game, es-news, es-users; handlers (game, news, users); game-manager
