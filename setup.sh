#!/bin/bash

error_exit()
{
	echo "Aborting. $1" 1>&2
	exit 1
}

echo "Checking requiremets..."

which docker > /dev/null
[ $? == 0 ] || error_exit "Docker not installed."

which docker-compose > /dev/null
[ $? == 0 ] || error_exit "Docker Compose not installed."

[ ! -e ".env" ] && error_exit "'.env' file not found."
# -----------------------------------------------------

echo "Detecting system architecture... "

if [[ $(arch) =~ "arm" ]]; then
  echo "BUZZER_BASE_IMG=hypriot/rpi-node" >> .env
else
  echo "BUZZER_BASE_IMG=node:8" >> .env
fi
# ------------------------------------------------------

echo "Generating SSH key pair..."

KEY_TYPE="-t rsa"
KEY_LENGTH="-b 4096"
CMNT="-C 'buzzer@local'"
OUT_FILE="-f .ssh/buzzer_id"
ERR_MSG="Could not generate key pair!"

mkdir -p .ssh
ssh-keygen $KEY_TYPE $KEY_LENGTH $CMNT $OUT_FILE -N '' 1> /dev/null || error_exit $ERR_MSG

[ ! -e ".ssh/buzzer_id.pub" ] && error_exit "Missing public key file!"

echo 'Your public key has been saved in .ssh/buzzer_id.pub'
echo -e "Please copy the content (below) to the '~/.ssh/authorized_keys' file on your remote machine!\n"
cat .ssh/buzzer_id.pub
echo
# ----------------------------------------------------------------------------

exit 0