#!/bin/bash

# Console colors
DEFAULT="\033[0m"
GREEN="\033[32m"
RED="\033[31m"

COMMAND=""
SERVICE_NAME="nubeio-rubix-wires.service"
USER=""
WORKING_DIR=""
DATA_DIR="/data/rubix-wires"
PORT=1313

DATA_DIR_EDITED=false
SERVICE_NAME_EDITED=false
PORT_EDITED=false

SERVICE_DIR_SOFT_LINK=/etc/systemd/system/multi-user.target.wants
SERVICE_DIR=/lib/systemd/system
SERVICE_TEMPLATE=nubeio-rubix-wires.template.service

createDirIfNotExist() {
    mkdir -p ${DATA_DIR}
    sudo chown -R ${USER}:${USER} ${DATA_DIR}
}

showServiceNameWarningIfNotEdited() {
    if [ ${SERVICE_NAME_EDITED} == false ]; then
        echo -e "${RED}We are using by default service_name=${SERVICE_NAME}!${DEFAULT}"
    fi
}

showWarningIfNotEdited() {
    showServiceNameWarningIfNotEdited
    if [ ${DATA_DIR_EDITED} == false ]; then
        echo -e "${RED}We are using by default data_dir=${DATA_DIR}!${DEFAULT}"
    fi
    if [ ${PORT_EDITED} == false ]; then
        echo -e "${RED}We are using by default port=${PORT}!${DEFAULT}"
    fi
}

createLinuxService() {
    echo -e "${GREEN}Creating Linux Service...${DEFAULT}"
    sudo cp ${SERVICE_TEMPLATE} ${SERVICE_DIR}/${SERVICE_NAME}
    sed -i -e 's/<user>/'"${USER}"'/' ${SERVICE_DIR}/${SERVICE_NAME}
    sed -i -e 's,<working_dir>,'"${WORKING_DIR}"',' ${SERVICE_DIR}/${SERVICE_NAME}
    sed -i -e 's,<data_dir>,'"${DATA_DIR}"',g' ${SERVICE_DIR}/${SERVICE_NAME}
}

startNewLinuxService() {
    echo -e "${GREEN}Starting New Linux Service...${DEFAULT}"
    echo -e "${GREEN}Soft Un-linking Linux Service...${DEFAULT}"
    sudo unlink ${SERVICE_DIR_SOFT_LINK}/${SERVICE_NAME}

    echo -e "${GREEN}Soft Linking Linux Service...${DEFAULT}"
    sudo ln -s ${SERVICE_DIR}/${SERVICE} ${SERVICE_DIR_SOFT_LINK}/${SERVICE_NAME}

    echo -e "${GREEN}Hitting daemon-reload...${DEFAULT}"
    sudo systemctl daemon-reload

    echo -e "${GREEN}Enabling Linux Service...${DEFAULT}"
    sudo systemctl enable ${SERVICE_NAME}

    echo -e "${GREEN}Starting Linux Service...${DEFAULT}"
    sudo systemctl restart ${SERVICE_NAME}
}

changePortOnEnv() {
    env_file="${DATA_DIR}/.env"
    if [ ! -f ${env_file} ]; then
        echo -e "${RED}Environmental file ${env_file} doesn't exist so creating an example...${DEFAULT}"
        echo "PORT=${PORT}" >${env_file}
        echo "SECRET_KEY=__SECRET_KEY__" >>${env_file}
    else
        echo -e "${GREEN}Changing Port on Env...${DEFAULT}"
        sed -i -e '/PORT=/c '"PORT=${PORT}"'' ${env_file}
    fi
}

start() {
    if [[ ${USER} != "" && ${WORKING_DIR} != "" ]]; then
        createDirIfNotExist
        showWarningIfNotEdited
        createLinuxService
        changePortOnEnv
        startNewLinuxService
        echo -e "${GREEN}Service is created and started.${DEFAULT}"
    else
        echo -e ${RED}"-u=<user> -dir=<working_dir> these parameters should be on you input (-h, --help for help)${DEFAULT}"
    fi
}

disable() {
    showServiceNameWarningIfNotEdited
    echo -e "${GREEN}Stopping Linux Service...${DEFAULT}"
    sudo systemctl stop ${SERVICE_NAME}
    echo -e "${GREEN}Disabling Linux Service...${DEFAULT}"
    sudo systemctl disable ${SERVICE_NAME}
    echo -e "${GREEN}Service is disabled.${DEFAULT}"
}

enable() {
    showServiceNameWarningIfNotEdited
    echo -e "${GREEN}Enabling Linux Service...${DEFAULT}"
    sudo systemctl enable ${SERVICE_NAME}
    echo -e "${GREEN}Starting Linux Service...${DEFAULT}"
    sudo systemctl start ${SERVICE_NAME}
    echo -e "${GREEN}Service is enabled.${DEFAULT}"
}

delete() {
    showServiceNameWarningIfNotEdited
    echo -e "${GREEN}Stopping Linux Service...${DEFAULT}"
    sudo systemctl stop ${SERVICE_NAME}
    echo -e "${GREEN}Un-linking Linux Service...${DEFAULT}"
    sudo unlink ${SERVICE_DIR_SOFT_LINK}/${SERVICE_NAME}
    echo -e "${GREEN}Removing Linux Service...${DEFAULT}"
    sudo rm -r ${SERVICE_DIR}/${SERVICE_NAME}
    echo -e "${GREEN}Hitting daemon-reload...${DEFAULT}"
    sudo systemctl daemon-reload
    echo -e "${GREEN}Service is deleted.${DEFAULT}"
}

help() {
    echo "Service commands:"
    echo -e "   ${GREEN}start -service_name=<service_name> -u=<user> -dir=<working_dir> -data_dir=<data_dir> -p=<port>${DEFAULT}    Start the service"
    echo -e "   ${GREEN}disable${DEFAULT}                                                                                           Disable the service"
    echo -e "   ${GREEN}enable${DEFAULT}                                                                                            Enable the stopped service"
    echo -e "   ${GREEN}delete -u=<user>${DEFAULT}                                                                                  Delete the service"
    echo
    echo "Service parameters:"
    echo -e "   ${GREEN}-h --help${DEFAULT}                                                                                         Show this help"
    echo -e "   ${GREEN}-u --user=<user>${DEFAULT}                                                                                  Which <user> is starting the service"
    echo -e "   ${GREEN}-ug --user-group=<user_group>${DEFAULT}                                                                     Data is associated with which <user_group>, DEFAULT <user>"
    echo -e "   ${GREEN}-dir --working-dir=<working_dir>:${DEFAULT}                                                                 From where wires is starting"
}

parseCommand() {
    for i in "$@"; do
        case ${i} in
        -h | --help)
            help
            exit 0
            ;;
        -service_name=*)
            SERVICE_NAME="${i#*=}"
            SERVICE_NAME_EDITED=true
            ;;
        -u=* | --user=*)
            USER="${i#*=}"
            ;;
        -dir=* | --working-dir=*)
            WORKING_DIR="${i#*=}"
            ;;
        -data_dir=*)
            DATA_DIR="${i#*=}"
            DATA_DIR_EDITED=true
            ;;
        -p=* | --port=*)
            PORT="${i#*=}"
            PORT_EDITED=true
            ;;
        start | disable | enable | delete)
            COMMAND=${i}
            ;;
        *)
            echo -e "${RED}Unknown options ${i}  (-h, --help for help)${DEFAULT}"
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
