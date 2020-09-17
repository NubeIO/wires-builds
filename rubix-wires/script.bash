#!/bin/bash

# Console colors
DEFAULT="\033[0m"
GREEN="\033[32m"
RED="\033[31m"

DB_LOCATION="/data"

COMMAND=""
USER=""
USER_GROUP=""
HOME_PATH=""
LOG=true
SERVICE_NAME="nubeio-rubix-wires"

createDirIfNotExist() {
    # Create directory and change ownership if not exist
    [[ -d ${DB_LOCATION} ]] || {
        echo -e "${GREEN}Creating a location ${DB_LOCATION} and set ownership ${USER}:`echo ${USER_GROUP} || echo ${USER}`${DEFAULT}"
        sudo mkdir ${DB_LOCATION}
    }
    sudo chown -R ${USER}:`echo ${USER_GROUP} || echo ${USER}` ${DB_LOCATION}
}

createLogger() {
    if ${LOG}
    then
        echo -e "${GREEN}Setting log rotate size of 50M${DEFAULT}"
        npm run pm2 set pm2-logrotate:max_size 50M
        echo -e "${GREEN}Setting max date logs is of 5 days${DEFAULT}"
        npm run pm2 set pm2-logrotate:retain 5
        echo -e "${GREEN}Setting log rotate compression (gzip compression) as true${DEFAULT}"
        npm run pm2 set pm2-logrotate:compress true
    else
        echo -e "${GREEN}Uninstalling pm2-logrotate${DEFAULT}"
        npm run uninstall:pm2-logrotate
    fi
}

start() {
    if [[ ${USER} != "" && ${HOME_PATH} != "" ]]
    then
        createDirIfNotExist
        echo -e "${GREEN}Starting production run with PM2${DEFAULT}"
        if ${LOG}
        then
            npm run pm2:start
        else
            npm run pm2:start -- -o /dev/null -e /dev/null
        fi
        echo -e "${GREEN}Saving PM2 configuration${DEFAULT}"
        npm run pm2:save
        echo -e "${GREEN}Creating Linux Service${DEFAULT}"
        sudo npm run pm2:startup -- -u ${USER} --hp ${HOME_PATH} --service-name ${SERVICE_NAME}
        echo -e "${GREEN}Enabling Linux Service${DEFAULT}"
        sudo systemctl enable ${SERVICE_NAME}.service
        createLogger
        echo -e "${GREEN}Service is installed, please reboot your system...${DEFAULT}"
    else
        echo -e ${RED}"-u=<user> -hp=<home_path> these parameters should be on you input (-h, --help for help)${DEFAULT}"
    fi
}

disable() {
    echo -e "${GREEN}Stopping Linux Service${DEFAULT}"
    sudo systemctl stop ${SERVICE_NAME}.service
    echo -e "${GREEN}Disabling Linux Service${DEFAULT}"
    sudo systemctl disable ${SERVICE_NAME}.service
    echo -e "${GREEN}Service is disabled...${DEFAULT}"
}

enable() {
    echo -e "${GREEN}Enabling Linux Service${DEFAULT}"
    sudo systemctl enable ${SERVICE_NAME}.service
    echo -e "${GREEN}Starting Linux Service${DEFAULT}"
    sudo systemctl start ${SERVICE_NAME}.service
    echo -e "${GREEN}Service is enabled...${DEFAULT}"
}

delete() {
    if [[ ${USER} != "" ]]
    then
        echo -e "${GREEN}Deleting PM2 running app, if exist${DEFAULT}"
        npm run pm2:delete
        echo -e "${GREEN}Removing Linux Service${DEFAULT}"
        sudo npm run pm2:unstartup -- -u ${USER} --service-name ${SERVICE_NAME}
        echo -e "${GREEN}Service is deleted...${DEFAULT}"
    else
        echo -e "${RED}-u=<user> this parameters should be on you input (-h, --help for help)${DEFAULT}"
    fi
}

help() {
    echo "Service commands:"
    echo -e "   ${GREEN}start -u=<user> -hp=<home_path>${DEFAULT}           Start the service (optional parameters: -l, -ug, -ilr)"
    echo -e "   ${GREEN}disable${DEFAULT}                                   Stop the service"
    echo -e "   ${GREEN}enable${DEFAULT}                                    Restart the stopped service"
    echo -e "   ${GREEN}delete -u=<user>${DEFAULT}                          Delete the service"
    echo
    echo "Service parameters:"
    echo -e "   ${GREEN}-h --help${DEFAULT}                                 Show this help"
    echo -e "   ${GREEN}-u --user=<user>${DEFAULT}                          Which <user> is starting the service"
    echo -e "   ${GREEN}-ug --user-group=<user_group>${DEFAULT}             Data is associated with which <user_group>, DEFAULT <user>"
    echo -e "   ${GREEN}-hp --home-path=<home_path>:${DEFAULT}              Which <home_path> for storing PM2 files"
    echo -e "   ${GREEN}-l --log=<boolean>:${DEFAULT}                       by default true, for logging"
    echo -e "   ${GREEN}-ilr --install-log-rotate=<boolean>:${DEFAULT}      by default false, if you want to start \
and your logs need to be rotated, you need this command (it installs 'pm2-logrotate' and start a process)"
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
    -hp=*|--home-path=*)
        HOME_PATH="${i#*=}"
        ;;
    -l=*|--log=*)
        LOG="${i#*=}"
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
