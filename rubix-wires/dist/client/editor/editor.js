"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../nodes/container");
const renderer_1 = require("./renderer");
const editor_client_socket_1 = require("./editor-client-socket");
const renderer_themes_1 = require("./renderer-themes");
require("../../nodes/nodes/index");
const events_1 = require("events");
const log = require('logplease').create('editor', { color: 6 });
class Editor extends events_1.EventEmitter {
    constructor(themeId = 0) {
        super();
        this.themeId = 0;
        this.isRunning = false;
        this.showNodesIOValues = true;
        this.showLinks = true;
        this.showingNodePanel = true;
        this.settingVisibility = false;
        log.warn('!!! NEW EDITOR CREATED');
        window.editor = this;
        this.themeId = themeId;
        this.root = document.getElementById('canvas');
        this.root.className = 'node-editor';
        this.root.innerHTML =
            "<div class='content'><div class='editor-area'><canvas class='canvas' width='50' height='50'></canvas></div></div>";
        this.canvas = this.root.querySelector('.canvas');
        this.rootContainer = new container_1.Container(container_1.Side.editor);
        this.renderer = new renderer_1.Renderer(this, this.canvas, this.rootContainer, renderer_themes_1.themes[this.themeId]);
        this.renderer.onTranslateCallback(rect => {
            this.canvasBoundaryRect = rect;
            if (this.miniMapRenderer) {
                this.setMiniMapPositionAndSize();
                this.miniMapRenderer.setBoundaryRectangle(rect);
            }
        });
        this.renderer.on('editorChangeContainer', cont => {
            this.updateContainersNavigation();
            this.updateBrowserUrl();
            this.emit('editorChangeContainer', cont);
            if (this.miniMapRenderer) {
                this.miniMapRenderer.openContainer(cont);
            }
        });
        if (minimap_opened) {
            this.clearMiniWindow();
        }
        this.updateContainersNavigation();
    }
    setMiniMapPositionAndSize() {
        if (!this.miniMapRenderer)
            return;
        this.miniMapRenderer.offset = [this.miniMapRenderer.DEFAULT_OFFSET, this.miniMapRenderer.DEFAULT_OFFSET];
        if (this.renderer.container.id != 0 && this.renderer.container.id !== this.miniMapRenderer.container.id) {
            this.miniMapRenderer.openContainer(this.renderer.container);
        }
        const totalHeight = this.miniMapRenderer.MAX_OFFSET_HEIGHT + this.miniMapRenderer.DEFAULT_OFFSET;
        const totalWidth = this.miniMapRenderer.MAX_OFFSET_WIDTH + this.miniMapRenderer.DEFAULT_OFFSET;
        this.miniMapRenderer.scale = this.miniMapRenderer.canvas.height / totalHeight;
        const width = this.miniMapRenderer.canvas.width;
        this.miniMapRenderer.canvas.height = (width * totalHeight) / totalWidth;
    }
    connect() {
        this.socket = new editor_client_socket_1.EditorClientSocket(this);
        this.rootContainer.client_socket = this.socket.socket;
        this.configureNodes();
    }
    disconnect() {
        window.editor = null;
        this.socket.socket.close();
        this.renderer.unbindEvents();
        if (this.miniMapRenderer) {
            this.miniMapRenderer.unbindEvents();
            this.miniMapRenderer = null;
        }
        this.renderer = null;
        container_1.Container.clear();
    }
    openContainer(id) {
        if (this.renderer.container.id == id)
            return;
        const cont = container_1.Container.containers[id];
        if (!cont)
            return log.error('Cant open. Container id [' + id + '] not found');
        this.renderer.openContainer(cont, false);
        this.socket.sendJoinContainerRoom(this.renderer.container.id);
    }
    focusNode(id, parentId) {
        if (this.renderer.container.id != parentId)
            return;
        this.renderer.focusNode(id);
    }
    closeContainer() {
        if (this.renderer.container.id != 0) {
            this.renderer.closeContainer(false);
            if (this.miniMapRenderer) {
                this.miniMapRenderer.closeContainer(false);
            }
            this.socket.sendJoinContainerRoom(this.renderer.container.id);
        }
    }
    showNodeSettingsIfLocked(node) {
        window.vueEditor.$refs.nodeSettings.showIfLocked(node);
    }
    showNodeSettings(node) {
        window.vueEditor.$refs.nodeSettings.show(node);
    }
    showSelectedNodeSetting(node) {
        if (this.settingVisibility)
            window.vueEditor.$refs.nodeSettings.show(node);
    }
    hideNodeSettings() {
        if (this.settingVisibility)
            window.vueEditor.$refs.nodeSettings.close();
    }
    showNodeHelp(node) {
        window.vueEditor.$refs.nodeHelp.show(node.title, node.description);
    }
    onSearch(searchText) {
        this.renderer.onSearch(searchText);
    }
    run() {
        this.socket.sendRunContainer();
    }
    stop() {
        this.socket.sendStopContainer();
    }
    step() {
        this.socket.sendStepContainer();
    }
    onContainerRun() {
        this.isRunning = true;
        this.emit('run');
    }
    onContainerRunStep() {
        this.emit('step');
    }
    onContainerStop() {
        this.isRunning = false;
        this.emit('stop');
    }
    onSettingToggle(visibility) {
        this.settingVisibility = visibility;
    }
    displayNodesIOValues() {
        this.showNodesIOValues = true;
    }
    hideNodesIOValues() {
        this.showNodesIOValues = false;
    }
    toggleNodeLinks(showLinks) {
        this.showLinks = showLinks;
        this.renderer.toggleNodeLinks(showLinks);
    }
    showNodePanel(width, show) {
        this.showingNodePanel = show;
        this.renderer.toggleNodePanel(width, show);
    }
    conditionalEditorChangeContainer(node) {
        this.emit('editorChangeContainer', this.renderer.container);
    }
    editorChangeContainer() {
        this.emit('editorChangeContainer', this.renderer.container);
    }
    displayMessage(message) {
        this.emit('display-message', message);
    }
    displayError(message) {
        this.emit('display-error', message);
    }
    onImport(cid, selectedNodes, message) {
        this.renderer.changeSelectedNodes(selectedNodes);
        this.emit('importChangeContainer', cid);
    }
    onMoveToContainer(selectedNodes, message) {
        this.displayMessage(message);
        this.renderer.changeSelectedNodes(selectedNodes);
        this.editorChangeContainer();
    }
    onCloned(selectedNodes, message) {
        this.displayMessage(message);
        this.renderer.changeSelectedNodes(selectedNodes);
        this.editorChangeContainer();
    }
    popUpImport(pos) {
        this.emit('pop-up-import', pos);
    }
    onEditorResize() {
        if (this.canvas && this.root) {
            this.renderer.updateWidth(this.root.clientWidth);
        }
    }
    clearMiniWindow() {
        minimap_opened = false;
        if (this.miniMapRenderer) {
            this.miniMapRenderer.setContainer(null, false, false);
            this.miniMapRenderer = null;
        }
        const contentArea = this.root.querySelector('.content');
        const miniWindow = contentArea.querySelector('.mini-window');
        if (miniWindow) {
            contentArea.removeChild(miniWindow);
        }
    }
    toggleMiniMap() {
        if (minimap_opened) {
            this.clearMiniWindow();
        }
        else {
            this.addMiniWindow();
        }
    }
    addMiniWindow(w = 200, h = 200) {
        minimap_opened = true;
        const miniWindow = document.createElement('div');
        miniWindow.className = 'mini-window';
        miniWindow.innerHTML = "<canvas class='mini-map' width='" + w + "' height='" + h + "'></canvas>";
        const canvas = miniWindow.querySelector('.mini-map');
        this.miniMapRenderer = new renderer_1.Renderer(this, canvas, this.rootContainer, renderer_themes_1.themes[this.themeId], false, true);
        this.miniMapRenderer.onOffsetChangedCallback(pageOffset => {
            if (this.renderer)
                this.renderer.setOffset(pageOffset);
        });
        if (this.canvasBoundaryRect) {
            this.miniMapRenderer.setBoundaryRectangle(this.canvasBoundaryRect);
        }
        this.setMiniMapPositionAndSize();
        miniWindow.style.position = 'absolute';
        miniWindow.style.top = '4px';
        miniWindow.style.right = '4px';
        const close_button = document.createElement('div');
        close_button.className = 'corner-button';
        close_button.innerHTML = 'X';
        close_button.style.marginRight = '4px';
        close_button.addEventListener('click', () => this.clearMiniWindow());
        miniWindow.appendChild(close_button);
        this.root.querySelector('.content').appendChild(miniWindow);
    }
    updateContainersNavigation() {
    }
    updateBrowserUrl() {
    }
    configureNodes() {
        this.socket.getContainerState();
        this.socket.configureNodes(() => {
            if (this.renderer && this.renderer.container) {
                this.emit('editorChangeContainer', this.renderer.container);
            }
        });
    }
}
exports.Editor = Editor;
let minimap_opened = false;
//# sourceMappingURL=editor.js.map