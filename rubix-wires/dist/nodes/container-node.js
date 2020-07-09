"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("./node");
const constants_1 = require("./constants");
const container_1 = require("./container");
class ContainerNode extends node_1.Node {
    constructor(container) {
        super(container);
        this.description = 'Contains other nodes';
        this.title = 'Folder';
        this.settings['name'] = {
            description: 'Folder name',
            value: 'Folder',
            type: node_1.SettingType.STRING,
        };
    }
    shouldRejectNodeType(type) {
        return constants_1.IOT_TYPES.includes(type);
    }
    onCreated() {
        this.setupSubContainer();
        this.initializeNameValue();
    }
    onAdded() {
        this.applyTitle();
    }
    onAfterSettingsChange(oldSettings, oldName) {
        this.applyTitle();
    }
    onRemoved() {
        for (let id in this.sub_container._nodes) {
            let node = this.sub_container._nodes[id];
            node.container.remove(node);
        }
        delete container_1.Container.containers[this.sub_container.id];
    }
    configure(data, from_db = false, configure_sub_cont = true) {
        super.configure(data);
        try {
            this.sub_container = container_1.Container.containers[data.sub_container.id];
            if (!this.sub_container)
                this.sub_container = new container_1.Container(this.side, data.sub_container.id);
            this.sub_container.container_node = this;
            this.sub_container.parent_container_id = this.container.id;
            this.sub_container.parent_id = this.id;
            if (configure_sub_cont)
                this.sub_container.configure(data.sub_container, true);
        }
        catch (err) {
            this.debugErr(`ERROR: configure() container node: ${err}`);
        }
    }
    serialize() {
        try {
            let data = super.serialize();
            data.sub_container = this.sub_container.serialize();
            return data;
        }
        catch (err) {
            this.debugErr(`ERROR: serialize() container node: ${err}`);
        }
    }
    getExtraMenuOptions(renderer, editor) {
        let that = this;
        return [
            {
                content: 'Open',
                callback: function () {
                    editor.openContainer(that.sub_container.id);
                },
            },
            null,
        ];
    }
    onExecute() {
        if (this.isUpdated)
            this.isRecentlyActive = true;
        this.sub_container.runStep();
    }
    applyTitle() {
        this.title = this.settings['name'].value;
        this.sub_container.name = this.title;
        this.size = this.computeSize();
    }
    getInitialTitle() {
        return `${this.title} ${this.sub_container.id}`;
    }
    setupSubContainer() {
        if (this.sub_container) {
            this.sub_container = container_1.Container.containers[this.sub_container.id];
        }
        else {
            this.sub_container = new container_1.Container(this.side);
        }
        this.sub_container.container_node = this;
        this.sub_container.parent_container_id = this.container.id;
        this.sub_container.parent_id = this.id;
        if (this.container.db)
            this.container.db.updateLastContainerId(this.sub_container.id);
    }
    initializeNameValue() {
        this.settings['name'].value = this.getInitialTitle();
    }
}
exports.ContainerNode = ContainerNode;
//# sourceMappingURL=container-node.js.map