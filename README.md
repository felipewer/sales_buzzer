# Startup Buzzer

NodeJS app to play sounds and utter speech on given events.

**THINK**: Playing this [siren](https://www.myinstants.com/media/sounds/imperial-alert.mp3) when you have problems in production or this [laugh](https://www.myinstants.com/media/sounds/ha-ha-risada-do-nelson.mp3) when someone's commit breaks CI and he/she now ows everybody in the a team a beer! 

The project is composed of a REST API which can be integrated to other systems via webhooks and a Preact PWA client for admin and playing around.

![screenshot](/screenshot.png)

## Requirements

### To access from whitin the local network

- Having a Github organization for your startup/team. (Used for Authentication / Authorization)
- A local machine with a sound card and Docker and Docker Compose installed. (Ex.: Raspberry Pi with HypriotOS image)
- Speakers

### To access from everywhere
- Owning a domain
- An internet acessible VM with Docker and Docker Compose installed and your domain pointing to it

## Setup

1 - Register a new Oauth App in your Github organization. Follow the [official instructions](https://developer.github.com/apps/building-oauth-apps/creating-an-oauth-app/). The **Authorization callback URL** should be your domain url + `/auth/github/callback`. Ex.: `http://<local_machine_ip>:8080/auth/github/callback` or `https://buzzer.your.domain/auth/github/callback`

2 - On the local machine, clone the repository:

```
git clone https://github.com/felipewer/startup_buzzer.git
```

3 - Copy `.env.sample` to `.env` and fill the environment variables accordingly.

4 - Run the setup script. The SSH public key generated in the end will be necessary in the next step.

```
./setup.sh
```

4 - (Optional) To access the buzzer from everywhere, setup a HTTPS->SSH tunnel on your internet acessible vm. You can use this project: https://github.com/felipewer/docker-https-ssh-tunnel

5 - Start the service

#### Option A: Run buzzer + reverse SSH client for outside access:

```
docker-compose up -d
```

#### Option B: Run the buzzer service alone for local access:

To run only the app service uncomment the *ports* mapping of the **buzzer** service in the `docker-compose.yml` file and then start the service:

```
docker-compose build
docker-compose run -d --service-ports buzzer
```

## Usage

1 - Access the admin client at `https://buzzer.your.domain` to get an API token, add new sounds and utter speach.

*Ps.: Speech must cointain only words and digits. Allowed sound types are **wav** and **mp3***.

2 - Test your webhook (change domain, sound and token accordingly):
```
# Play sound
curl 'https://buzzer.<your.domain>/api/sounds/<sound.ext>' \
  -H 'Authorization: Bearer <API Token>'

# Utter speech
curl 'https://buzzer.<your.domain>/api/speech' \
  -H 'Authorization: Bearer <API Token>' \
  -H 'Content-Type: application/json' \
  -d '{ "speech": "Hello World" }'
```

3 - Be creative!