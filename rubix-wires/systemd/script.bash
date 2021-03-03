#!/bin/bash

# Console colors
DEFAULT="\033[0m"
GREEN="\033[32m"
RED="\033[31m"

COMMAND=""
SERVICE_NAME="nubeio-rubix-wires.service"
USER=""
WORKING_DIR=""
GLOBAL_DIR="/data/rubix-wires"
DATA_DIR="data"
CONFIG_DIR="config"
PORT=1313

ABS_CONFIG_DIR=""
ABS_DATA_DIR=""

GLOBAL_DIR_EDITED=false
DATA_DIR_EDITED=false
CONFIG_DIR_EDITED=false
SERVICE_NAME_EDITED=false
PORT_EDITED=false

SERVICE_DIR_SOFT_LINK=/etc/systemd/system/multi-user.target.wants
SERVICE_DIR=/lib/systemd/system
SERVICE_TEMPLATE=nubeio-rubix-wires.template.service

createDirIfNotExist() {
    ABS_DATA_DIR=${GLOBAL_DIR}/${DATA_DIR}
    ABS_CONFIG_DIR=${GLOBAL_DIR}/${CONFIG_DIR}
    mkdir -p ${ABS_DATA_DIR}
    mkdir -p ${ABS_CONFIG_DIR}
    sudo chown -R ${USER}:${USER} ${ABS_DATA_DIR}
    sudo chown -R ${USER}:${USER} ${ABS_CONFIG_DIR}
}

showServiceNameWarningIfNotEdited() {
    if [ ${SERVICE_NAME_EDITED} == false ]; then
        echo -e "${RED}We are using by default service_name=${SERVICE_NAME}!${DEFAULT}"
    fi
}

showWarningIfNotEdited() {
    showServiceNameWarningIfNotEdited
    if [ ${GLOBAL_DIR_EDITED} == false ]; then
        echo -e "${RED}We are using by default global_dir=${GLOBAL_DIR}!${DEFAULT}"
    fi
    if [ ${DATA_DIR_EDITED} == false ]; then
        echo -e "${RED}We are using by default data_dir=${DATA_DIR}!${DEFAULT}"
    fi
    if [ ${CONFIG_DIR_EDITED} == false ]; then
        echo -e "${RED}We are using by default config_dir=${CONFIG_DIR}!${DEFAULT}"
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
    sed -i -e 's,<global_dir>,'"${GLOBAL_DIR}"',g' ${SERVICE_DIR}/${SERVICE_NAME}
    sed -i -e 's,<data_dir>,'"${DATA_DIR}"',g' ${SERVICE_DIR}/${SERVICE_NAME}
    sed -i -e 's,<config_dir>,'"${CONFIG_DIR}"',g' ${SERVICE_DIR}/${SERVICE_NAME}
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
    env_file="${ABS_CONFIG_DIR}/.env"
    if [ ! -f ${env_file} ]; then
        echo -e "${RED}Environmental file ${env_file} doesn't exist so creating an example...${DEFAULT}"
        echo "PORT=${PORT}" >${env_file}
        echo "SECRET_KEY=__SECRET_KEY__" >>${env_file}
    else
        echo -e "${GREEN}Changing Port on Env...${DEFAULT}"
        sed -i -e '/PORT=/c '"PORT=${PORT}"'' ${env_file}
    fi
}

install() {
    if [[ ${USER} != "" && ${WORKING_DIR} != "" ]]; then
        createDirIfNotExist
        showWarningIfNotEdited
        createLinuxService
        changePortOnEnv
        startNewLinuxService
        echo -e "${GREEN}Service is created and started.${DEFAULT}"
    else
        echo -e "${RED}Invalid parameters (-h, --help for help)${DEFAULT}"
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

restart() {
    showServiceNameWarningIfNotEdited
    echo -e "${GREEN}Restarting Linux Service...${DEFAULT}"
    sudo systemctl restart ${SERVICE_NAME}
    echo -e "${GREEN}Service is restarted.${DEFAULT}"
}


help() {
    echo "Service commands:"
    echo -e "   ${GREEN}install [-s=<service_name>] -u=<user> --working-dir=<working_dir> [-g=<global_dir>] [-d=<data_dir>] [-c=<config_dir>] [-p=<port>]${DEFAULT} Install and start the service"
    echo -e "   ${GREEN}disable${DEFAULT}                                                                                                                           Disable the service"
    echo -e "   ${GREEN}enable${DEFAULT}                                                                                                                            Enable the stopped service"
    echo -e "   ${GREEN}delete${DEFAULT}                                                                                                                            Delete the service"
    echo -e "   ${GREEN}restart${DEFAULT}                                                                                                                           Restart the service"
    echo
        echo -e "   ${GREEN}-h, --help${DEFAULT}                                                                                                                    Show this help"
    echo
    echo "Install parameters:"
    echo "    required:"
    echo -e "   ${GREEN}-u, --user=<user>${DEFAULT}                                                                                                                 Which <user> is starting the service"
    echo -e "   ${GREEN}-d, --dir --working-dir=<working_dir>${DEFAULT}                                                                                             Project absolute dir"
    echo "    optional:"
    echo -e "   ${GREEN}-s, --service-name=<service_name>${DEFAULT}                                                                                                 Name of system service to create"
    echo -e "   ${GREEN}-g=<global_dir>${DEFAULT}                                                                                                                   Absolute parent direct for data & config"
    echo -e "   ${GREEN}-d=<data_dir>${DEFAULT}                                                                                                                     Relative data dir"
    echo -e "   ${GREEN}-c=<config_dir>${DEFAULT}                                                                                                                   Relative config dir"
    echo -e "   ${GREEN}-p, --port=<port>${DEFAULT}                                                                                                                 HTTP server port"
}

parseCommand() {
    for i in "$@"; do
        case ${i} in
        -h | --help)
            help
            exit 0
            ;;
        -s=* | --service-name=*)
            SERVICE_NAME="${i#*=}"
            SERVICE_NAME_EDITED=true
            ;;
        -u=* | --user=*)
            USER="${i#*=}"
            ;;
         --working-dir=*)
            WORKING_DIR="${i#*=}"
            ;;
         -g=* | --global-dir=*)
            GLOBAL_DIR="${i#*=}"
            GLOBAL_DIR_EDITED=true
            ;;
        -d=* | --data-dir=*)
            DATA_DIR="${i#*=}"
            DATA_DIR_EDITED=true
            ;;
        -c=* | --config-dir=*)
            CONFIG_DIR="${i#*=}"
            CONFIG_DIR_EDITED=true
            ;;
        -p=* | --port=*)
            PORT="${i#*=}"
            PORT_EDITED=true
            ;;
        install | start | disable | enable | delete | restart)
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
    install)
        install
        ;;
    start)
        install
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
    restart)
        restart
        ;;
    esac
}

parseCommand "$@"
runCommand
exit 0
