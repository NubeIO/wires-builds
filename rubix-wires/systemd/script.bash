#!/bin/bash

# Console colors
DEFAULT="\033[0m"
GREEN="\033[32m"
RED="\033[31m"

DB_LOCATION="/data"
SERVICE=nubeio-rubix-wires.service
SERVICE_DIR_SOFT_LINK=/etc/systemd/system/multi-user.target.wants
SERVICE_DIR=/lib/systemd/system

COMMAND=""
USER=""
USER_GROUP=""
WORKING_DIR=""

createDirIfNotExist() {
    # Create directory and change ownership if not exist
    [[ -d ${DB_LOCATION} ]] || {
        echo -e "${GREEN}Creating a location ${DB_LOCATION} and set ownership ${USER}:`echo ${USER_GROUP} || echo ${USER}`${DEFAULT}"
        sudo mkdir ${DB_LOCATION}
    }
    sudo chown -R ${USER}:`echo ${USER_GROUP} || echo ${USER}` ${DB_LOCATION}
}

start() {
    if [[ ${USER} != "" && ${WORKING_DIR} != "" ]]
    then
        createDirIfNotExist
        echo -e "${GREEN}Creating Linux Service${DEFAULT}"
        sudo cp nubeio-rubix-wires.template.service ${SERVICE_DIR}/${SERVICE}
        sed -i -e 's/<user>/'"${USER}"'/' ${SERVICE_DIR}/${SERVICE}
        sed -i -e 's,<working_dir>,'"${WORKING_DIR}"',' ${SERVICE_DIR}/${SERVICE}

        echo -e "${GREEN}Soft Un-linking Linux Service${DEFAULT}"
        sudo unlink ${SERVICE_DIR_SOFT_LINK}/${SERVICE}

        echo -e "${GREEN}Soft Linking Linux Service${DEFAULT}"
        sudo ln -s ${SERVICE_DIR}/${SERVICE} ${SERVICE_DIR_SOFT_LINK}/${SERVICE}

        echo -e "${GREEN}Enabling Linux Service${DEFAULT}"
        sudo systemctl daemon-reload
        sudo systemctl enable ${SERVICE}

        echo -e "${GREEN}Starting Linux Service${DEFAULT}"
        sudo systemctl restart ${SERVICE}

        echo -e "${GREEN}Service is created and started, please reboot to confirm...${DEFAULT}"
    else
        echo -e ${RED}"-u=<user> -dir=<working_dir> these parameters should be on you input (-h, --help for help)${DEFAULT}"
    fi
}

disable() {
    echo -e "${GREEN}Stopping Linux Service${DEFAULT}"
    sudo systemctl stop ${SERVICE}
    echo -e "${GREEN}Disabling Linux Service${DEFAULT}"
    sudo systemctl disable ${SERVICE}
    echo -e "${GREEN}Service is disabled...${DEFAULT}"
}

enable() {
    echo -e "${GREEN}Enabling Linux Service${DEFAULT}"
    sudo systemctl enable ${SERVICE}
    echo -e "${GREEN}Starting Linux Service${DEFAULT}"
    sudo systemctl start ${SERVICE}
    echo -e "${GREEN}Service is enabled...${DEFAULT}"
}

delete() {
    echo -e "${GREEN}Stopping Linux Service${DEFAULT}"
    sudo systemctl stop ${SERVICE}
    echo -e "${GREEN}Un-linking Linux Service${DEFAULT}"
    sudo unlink ${SERVICE_DIR_SOFT_LINK}/${SERVICE}
    echo -e "${GREEN}Removing Linux Service${DEFAULT}"
    sudo rm -r ${SERVICE_DIR}/${SERVICE}
    echo -e "${GREEN}Service is deleted...${DEFAULT}"
}

help() {
    echo "Service commands:"
    echo -e "   ${GREEN}start -u=<user> -dir=<working_dir>${DEFAULT}        Start the service (-u=pi -dir=/home/pi/wires-build/rubix-wires)"
    echo -e "   ${GREEN}disable${DEFAULT}                                   Disable the service"
    echo -e "   ${GREEN}enable${DEFAULT}                                    Enable the stopped service"
    echo -e "   ${GREEN}delete -u=<user>${DEFAULT}                          Delete the service"
    echo
    echo "Service parameters:"
    echo -e "   ${GREEN}-h --help${DEFAULT}                                 Show this help"
    echo -e "   ${GREEN}-u --user=<user>${DEFAULT}                          Which <user> is starting the service"
    echo -e "   ${GREEN}-ug --user-group=<user_group>${DEFAULT}             Data is associated with which <user_group>, DEFAULT <user>"
    echo -e "   ${GREEN}-dir --working-dir=<working_dir>:${DEFAULT}         From where wires is starting"
}

parseCommand() {
    for i in "$@"
    do
    case ${i} in
    -h|--help)
        help
        exit 0
        ;;
    -u=*|--user=*)
        USER="${i#*=}"
        ;;
    -ug=*|--user-group=*)
        USER_GROUP="${i#*=}"
        ;;
    -dir=*|--working-dir=*)
        WORKING_DIR="${i#*=}"
        ;;
    start|disable|enable|delete)
        COMMAND=${i}
        ;;
    *)
        echo -e "${RED}Unknown option (-h, --help for help)${DEFAULT}"
        exit 1
        ;;
    esac
    done
}

runCommand() {
    case ${COMMAND} in
    start)
        start
        ;;
    disable)
        disable
        ;;
    enable)
        enable
        ;;
    delete)
        delete
        ;;
    esac
}

parseCommand "$@"
runCommand
exit 0
