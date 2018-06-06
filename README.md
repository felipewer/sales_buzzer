# Startup Buzzer

NodeJS app ...

## Requirements

### To access from whitin the local network

- Having a Github organization for your startup/team. (Used for Authentication / Authorization)
- A local machine with a sound card and Docker and Docker Compose installed. (Ex.: Raspberry Pi with HypriotOS image)
- Speakers

### To access from everywhere
- Owning a domain
- An internet acessible VM with Docker and Docker Compose installed and your domain pointing to it

## Setup

1 - Register a new Oauth App in your Github organization. Follow the [official instructions](https://developer.github.com/apps/building-oauth-apps/creating-an-oauth-app/). The **Authorization callback URL** should be your domain url + `/auth/github/callback`. Ex.: `https://buzzer.your.domain/auth/github/callback`

2 - On the local machine, clone repository:

```
git clone https://github.com/felipewer/startup_buzzer.git
```

3 - Copy `.env.sample` to `.env` and fill the environment variables accordingly.

4 - Run the setup script. The SSH public key generated in the end will be necessary in the next step.

```
./setup.sh
```

4 - (Optional) To access from everywhere, setup a HTTPS->SSH tunnel on your internet acessible vm. You can use this project: https://github.com/felipewer/docker-https-ssh-tunnel

5 - Start the app and reverse SSH client:

```
# Use the -d parameter to run in detached mode
docker-compose up
```

To run only the app service uncomment the *ports* mapping of the **buzzer** service in the `docker-compose.yml` file and then start the service:

```
# Use the -d parameter to run in detached mode
docker-compose start buzzer
```
