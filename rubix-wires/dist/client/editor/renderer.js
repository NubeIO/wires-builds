"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../nodes/node");
const container_node_1 = require("../../nodes/container-node");
const container_1 = require("../../nodes/container");
const utils_1 = require("../../nodes/utils");
const renderer_themes_1 = require("./renderer-themes");
const events_1 = require("events");
const Storage_1 = require("../helpers/Storage");
const CopyPasteExtension_1 = require("./extensions/CopyPasteExtension");
const node_exporter_1 = require("../../nodes/node-exporter");
const unknown_1 = require("../../nodes/nodes/unknown/unknown");
class Renderer extends events_1.EventEmitter {
    constructor(editor, canvas, container, theme, skip_render, isMiniMap = false) {
        super();
        this.BOTTOM_PADDING = 112;
        this.NODE_PANEL_WIDTH = 200;
        this.SHOW_PANEL = true;
        this.NODE_PANEL_MARGIN_TOP = 48;
        this.NODE_PANEL_HEADER_HEIGHT = 30;
        this.NODE_PANEL_ITEM_MARGIN = 2;
        this.isMiniMap = false;
        this.openNodeCategories = new Array();
        this.searchText = '';
        this.nodePanelOffset = 0;
        this.showLinks = true;
        this.DEFAULT_OFFSET = 2000;
        this.MAX_OFFSET_HEIGHT = this.DEFAULT_OFFSET;
        this.MAX_OFFSET_WIDTH = this.DEFAULT_OFFSET;
        this.computeConnectionPoint = (a, b, t) => {
            let dist = utils_1.default.distance(a, b);
            let p0 = a;
            let p1 = [a[0] + dist * 0.25, a[1]];
            let p2 = [b[0] - dist * 0.25, b[1]];
            let p3 = b;
            let c1 = (1 - t) * (1 - t) * (1 - t);
            let c2 = 3 * ((1 - t) * (1 - t)) * t;
            let c3 = 3 * (1 - t) * (t * t);
            let c4 = t * t * t;
            let x = c1 * p0[0] + c2 * p1[0] + c3 * p2[0] + c4 * p3[0];
            let y = c1 * p0[1] + c2 * p1[1] + c3 * p2[1] + c4 * p3[1];
            return [x, y];
        };
        this.isMiniMap = isMiniMap;
        container.onAfterExecute = () => {
            this.draw(true);
        };
        this.editor = editor;
        this.max_zoom = 4;
        this.min_zoom = 0.3;
        this.copyPasteExtension = new CopyPasteExtension_1.CopyPasteExtension(this);
        this.theme = theme || new renderer_themes_1.RendererTheme();
        this.nodeCategoriesPanel = this.evaluateNodeCategories();
        this.temp_nodes = [];
        if (container)
            container.attachRenderer(this);
        this.setCanvas(canvas);
        this.clear();
        if (!skip_render)
            this.startRendering();
        this.resize();
        this.draw(true, true);
        window.addEventListener('resize', () => {
            this.resize();
        });
    }
    clear() {
        this.frame = 0;
        this.last_draw_time = 0;
        this.render_time = 0;
        this.fps = 0;
        this.scale = this.getValue('scale', 1);
        this.offset = this.getValue('offset', [0, 0]);
        this.setOffsetValue();
        this.selected_nodes = {};
        this.node_dragged = null;
        this.node_over = null;
        this.node_capturing_input = null;
        this.connecting_node = null;
        this.highquality_render = true;
        this.editor_alpha = 1;
        this.pause_rendering = false;
        this.render_shadows = true;
        this.shadows_width = this.theme.SHADOWS_WIDTH;
        this.clear_background = true;
        this.render_only_selected = true;
        this.live_mode = false;
        this.show_info = false;
        this.allow_dragcanvas = true;
        this.allow_dragnodes = true;
        this.dirty_canvas = true;
        this.dirty_bgcanvas = true;
        this.dirty_area = null;
        this.node_in_container = null;
        this.last_mouse = [0, 0];
        this.last_mouseclick = 0;
        this.title_text_font = this.theme.TITLE_TEXT_FONT;
        this.name_text_font = this.theme.NAME_TEXT_FONT;
        this.inner_text_font = this.theme.INNER_TEXT_FONT;
        this.inner_large_text_font = this.theme.INNER_LARGE_TEXT_FONT;
        this.render_connections_shadows = false;
        this.render_connections_border = true;
        this.render_curved_connections = true;
        this.render_connection_arrows = this.theme.RENDER_CONNECTION_ARROWS;
        this.connections_width = this.theme.CONNECTIONS_WIDTH;
        this.connections_shadow = this.theme.CONNECTIONS_SHADOW;
        if (this.onClear)
            this.onClear();
        if (this.onClear)
            this.onClear();
    }
    static getSelectedNodesIds(renderer, node) {
        const ids = [];
        if (node.id in renderer.selected_nodes) {
            for (let n in renderer.selected_nodes) {
                ids.push(renderer.selected_nodes[n].id);
            }
        }
        else {
            ids.push(node.id);
        }
        return ids;
    }
    setContainer(container, skip_clear = false, joinRoom = true) {
        if (this.container == container)
            return;
        if (!skip_clear)
            this.clear();
        if (!container && this.container) {
            this.container.detachRenderer(this);
            return;
        }
        container.attachRenderer(this);
        this.setDirty(true, true);
        if (joinRoom) {
            this.editor.socket.sendJoinContainerRoom(container.id);
        }
        this.emit('editorChangeContainer', container);
    }
    openContainer(container, joinRoom = true) {
        if (!container)
            throw 'container cannot be null';
        if (this.container == container)
            throw 'container cannot be the same';
        this.clear();
        if (this.container) {
            if (!this._containers_stack)
                this._containers_stack = [];
            this._containers_stack.push(this.container);
        }
        container.attachRenderer(this);
        this.setDirty(true, true);
        if (this.isMiniMap) {
            return;
        }
        if (joinRoom) {
            this.editor.socket.sendJoinContainerRoom(container.id);
        }
        this.emit('editorChangeContainer', container);
        this.reDrawSearchPanel();
    }
    closeContainer(joinRoom = true) {
        if (!this._containers_stack || this._containers_stack.length == 0)
            return;
        let container = this._containers_stack.pop();
        container.attachRenderer(this);
        this.setDirty(true, true);
        if (this.isMiniMap) {
            return;
        }
        if (joinRoom) {
            this.editor.socket.sendJoinContainerRoom(container.id);
        }
        this.emit('editorChangeContainer', container);
        this.reDrawSearchPanel();
    }
    setCanvas(canvas, skip_events = false) {
        if (canvas === this.canvas)
            return;
        if (!canvas && this.canvas) {
            if (!skip_events)
                this.unbindEvents();
        }
        this.canvas = canvas;
        if (!canvas)
            return;
        canvas.className += ' editorcanvas';
        canvas.data = this;
        this.bgcanvas = null;
        if (!this.bgcanvas) {
            this.bgcanvas = document.createElement('canvas');
            this.bgcanvas.width = this.canvas.width;
            this.bgcanvas.height = this.canvas.height;
        }
        if (canvas.getContext == null) {
            throw 'This browser doesnt support Canvas';
        }
        let ctx = (this.ctx = canvas.getContext('2d'));
        if (ctx == null) {
            console.warn('This canvas seems to be WebGL, enabling WebGL renderer');
            this.enableWebGL();
        }
        this._mousemove_callback = this.processMouseMove.bind(this);
        this._mouseup_callback = this.processMouseUp.bind(this);
        if (!skip_events)
            this.bindEvents();
    }
    _doNothing(e) {
        e.preventDefault();
        return false;
    }
    _doReturnTrue(e) {
        e.preventDefault();
        return true;
    }
    bindEvents() {
        let canvas = this.canvas;
        if (this._events_binded) {
            console.warn('Renderer: events already binded');
            return;
        }
        this._mousedown_callback = this.processMouseDown.bind(this);
        this._mousewheel_callback = this.processMouseWheel.bind(this);
        if (this.isMiniMap) {
            canvas.addEventListener('mousedown', this._mousedown_callback, true);
            canvas.addEventListener('mousemove', this._mousemove_callback);
            return;
        }
        canvas.addEventListener('mousedown', this._mousedown_callback, true);
        canvas.addEventListener('mousemove', this._mousemove_callback);
        canvas.addEventListener('mousewheel', this._mousewheel_callback, false);
        canvas.addEventListener('contextmenu', this._doNothing);
        canvas.addEventListener('DOMMouseScroll', this._mousewheel_callback, false);
        {
            canvas.addEventListener('touchstart', this.touchHandler, true);
            canvas.addEventListener('touchmove', this.touchHandler, true);
            canvas.addEventListener('touchend', this.touchHandler, true);
            canvas.addEventListener('touchcancel', this.touchHandler, true);
        }
        this._key_callback = this.processKey.bind(this);
        document.addEventListener('keydown', this._key_callback);
        document.addEventListener('keyup', this._key_callback);
        this._ondrop_callback = this.processDrop.bind(this);
        canvas.addEventListener('dragover', this._doNothing, false);
        canvas.addEventListener('dragend', this._doNothing, false);
        canvas.addEventListener('drop', this._ondrop_callback, false);
        canvas.addEventListener('dragenter', this._doReturnTrue, false);
        this._events_binded = true;
    }
    unbindEvents() {
        if (!this._events_binded) {
            console.warn('NodeEditorCanvas: no events binded');
            return;
        }
        if (this.isMiniMap) {
            this.canvas.removeEventListener('mousedown', this._mousedown_callback);
            this._events_binded = false;
            return;
        }
        this.canvas.removeEventListener('mousemove', this._mousemove_callback);
        this.canvas.removeEventListener('mousedown', this._mousedown_callback);
        this.canvas.removeEventListener('mousewheel', this._mousewheel_callback);
        this.canvas.removeEventListener('DOMMouseScroll', this._mousewheel_callback);
        document.removeEventListener('keydown', this._key_callback);
        document.removeEventListener('keyup', this._key_callback);
        this.canvas.removeEventListener('contextmenu', this._doNothing);
        this.canvas.removeEventListener('drop', this._ondrop_callback);
        this.canvas.removeEventListener('dragenter', this._doReturnTrue);
        this.canvas.removeEventListener('touchstart', this.touchHandler);
        this.canvas.removeEventListener('touchmove', this.touchHandler);
        this.canvas.removeEventListener('touchend', this.touchHandler);
        this.canvas.removeEventListener('touchcancel', this.touchHandler);
        this._mousedown_callback = null;
        this._mousewheel_callback = null;
        this._key_callback = null;
        this._ondrop_callback = null;
        this._events_binded = false;
        this.copyPasteExtension.clear();
    }
    enableWebGL() {
        if (typeof this.GL === undefined)
            throw 'litegl.js must be included to use a WebGL canvas';
        if (typeof this.enableWebGLCanvas === undefined)
            throw 'webglCanvas.js must be included to use this feature';
        this.gl = this.ctx = this.enableWebGLCanvas(this.canvas);
        this.ctx.webgl = true;
        this.bgcanvas = this.canvas;
        this.bgctx = this.gl;
    }
    setDirty(foregraund, background = false) {
        if (foregraund)
            this.dirty_canvas = true;
        if (background)
            this.dirty_bgcanvas = true;
    }
    getCanvasWindow() {
        let doc = this.canvas.ownerDocument;
        return doc.defaultView || doc.parentWindow;
    }
    startRendering() {
        if (this.is_rendering)
            return;
        this.is_rendering = true;
        renderFrame.call(this);
        function renderFrame() {
            if (!this.pause_rendering)
                this.draw();
            let window = this.getCanvasWindow();
            if (this.is_rendering)
                window.requestAnimationFrame(renderFrame.bind(this));
        }
    }
    stopRendering() {
        this.is_rendering = false;
    }
    processMouseDown(e) {
        if (!this.container)
            return;
        this.adjustMouseEvent(e);
        let ref_window = this.getCanvasWindow();
        this.canvas.removeEventListener('mousemove', this._mousemove_callback);
        ref_window.document.addEventListener('mousemove', this._mousemove_callback, true);
        ref_window.document.addEventListener('mouseup', this._mouseup_callback, true);
        if (this.isMiniMap) {
            if (e.which == 1) {
                this.dragging_canvas = true;
            }
            return;
        }
        let n = this.getNodeOnPos(e.canvasX, e.canvasY, this.visible_nodes);
        this.closeAllContextualMenus();
        const isCategoryPanelClicked = e.localX <= this.NODE_PANEL_WIDTH;
        const toggleCategoryPanel = () => {
            const nodeCategory = this.nodeCategoriesPanel.find(nodeCategory => {
                return (nodeCategory.startY - this.nodePanelOffset < e.localY &&
                    nodeCategory.endY - this.nodePanelOffset >= e.localY);
            });
            if (nodeCategory) {
                if (nodeCategory.startY + nodeCategory.height - this.nodePanelOffset <= e.localY) {
                    const nodeClicked = nodeCategory.children.find(node => {
                        return (node.startY - this.nodePanelOffset < e.localY &&
                            node.endY - this.nodePanelOffset >= e.localY);
                    });
                    if (nodeClicked) {
                        let pos = this.convertEventToCanvas(e);
                        pos[0] = Math.round(pos[0]);
                        pos[1] = Math.round(pos[1]);
                        const tempNode = container_1.Container.createNode(nodeClicked.type, this.container, pos);
                        tempNode.selected = true;
                        this.node_dragged = tempNode;
                        this.temp_nodes = [tempNode];
                    }
                }
                else {
                    this.toggleNodeCategoryInPanel(nodeCategory.name);
                }
            }
        };
        if (e.which == 1) {
            if (!e.shiftKey) {
                if (!n || !this.selected_nodes[n.id]) {
                    let todeselect = [];
                    for (let i in this.selected_nodes)
                        if (this.selected_nodes[i] != n)
                            todeselect.push(this.selected_nodes[i]);
                    for (let i in todeselect)
                        this.processNodeDeselected(todeselect[i]);
                }
            }
            let clicking_canvas_bg = false;
            if (n) {
                let skip_action = isCategoryPanelClicked;
                if (!this.connecting_node && !n.flags.collapsed && !this.live_mode) {
                    if (n.outputs)
                        for (let o in n.outputs) {
                            let output = n.outputs[o];
                            let link_pos = this.getConnectionPos(n, false, +o);
                            if (utils_1.default.isInsideRectangle(e.canvasX, e.canvasY, link_pos[0] - 10, link_pos[1] - 5, 20, 10)) {
                                this.connecting_node = n;
                                this.connecting_output = output;
                                this.connecting_pos = this.getConnectionPos(n, false, +o);
                                this.connecting_slot = +o;
                                skip_action = true;
                                break;
                            }
                        }
                    if (n.inputs)
                        for (let i in n.inputs) {
                            let input = n.inputs[i];
                            let link_pos = this.getConnectionPos(n, true, +i);
                            if (utils_1.default.isInsideRectangle(e.canvasX, e.canvasY, link_pos[0] - 10, link_pos[1] - 5, 20, 10)) {
                                if (input.link != null) {
                                    this.editor.socket.sendRemoveLink(input.link.target_node_id, input.link.target_slot, n.id, i);
                                    skip_action = true;
                                }
                            }
                        }
                    if (!skip_action &&
                        utils_1.default.isInsideRectangle(e.canvasX, e.canvasY, n.pos[0] + n.size[0] - 10, n.pos[1] + n.size[1] - 10, 10, 10)) {
                        this.resizing_node = n;
                        this.canvas.style.cursor = 'se-resize';
                        skip_action = true;
                    }
                }
                const widthOfNode = n.flags.collapsed ? this.theme.NODE_COLLAPSED_WIDTH : n.size[0];
                if (!skip_action &&
                    utils_1.default.isInsideRectangle(e.canvasX, e.canvasY, n.pos[0] + widthOfNode - this.theme.NODE_TITLE_HEIGHT, n.pos[1] - this.getNodeHeaderHeight(n), this.theme.NODE_TITLE_HEIGHT, this.theme.NODE_TITLE_HEIGHT)) {
                    n.collapse();
                    skip_action = true;
                }
                if (isCategoryPanelClicked) {
                    toggleCategoryPanel.call(this);
                }
                else if (!skip_action) {
                    let block_drag_node = false;
                    let now = utils_1.default.getTime();
                    if (now - this.last_mouseclick < 300 && this.selected_nodes[n.id]) {
                        if (n['onDblClick'])
                            n['onDblClick'](e);
                        this.processNodeDblClicked(n);
                        block_drag_node = true;
                    }
                    if (n instanceof container_node_1.ContainerNode && (e.ctrlKey || e.metaKey)) {
                        this.editor.openContainer(n.sub_container.id);
                        block_drag_node = true;
                        clicking_canvas_bg = false;
                    }
                    if (n instanceof container_node_1.ContainerNode && (e.keyCode == e.ctrlKey || e.metaKey)) {
                        this.editor.openContainer(n.sub_container.id);
                        block_drag_node = true;
                        clicking_canvas_bg = false;
                    }
                    if (n['onMouseDown'] && n['onMouseDown'](e))
                        block_drag_node = true;
                    else if (this.live_mode) {
                        clicking_canvas_bg = true;
                        block_drag_node = true;
                    }
                    if (!block_drag_node) {
                        if (this.allow_dragnodes)
                            this.node_dragged = n;
                        this.processNodeSelected(n, (e && e.shiftKey) || false);
                    }
                    this.dirty_canvas = true;
                }
            }
            else if (isCategoryPanelClicked) {
                toggleCategoryPanel.call(this);
            }
            else
                clicking_canvas_bg = true;
            if (clicking_canvas_bg && this.allow_dragcanvas) {
                this.dragging_canvas = true;
            }
        }
        else if (e.which == 2) {
        }
        else if (e.which == 3) {
            this.processContextualMenu(n, e);
        }
        this.last_mouse[0] = e.localX;
        this.last_mouse[1] = e.localY;
        this.last_mouseclick = utils_1.default.getTime();
        this.canvas_mouse = [e.canvasX, e.canvasY];
        this.container.setDirtyCanvas(true, true);
        if (!ref_window.document.activeElement ||
            (ref_window.document.activeElement.nodeName.toLowerCase() != 'input' &&
                ref_window.document.activeElement.nodeName.toLowerCase() != 'textarea'))
            e.preventDefault();
        e.stopPropagation();
        return false;
    }
    focusDocument() {
        window.focus();
        if (document.activeElement) {
            document.activeElement.blur();
        }
    }
    miniMapOffsetChanged(e) {
        if (this.offsetChangedCallback) {
            this.offsetChangedCallback([
                -e.canvasX + this.canvasBoundaryRect.width / 2,
                -e.canvasY + this.canvasBoundaryRect.height / 2,
            ]);
        }
    }
    processMouseMove(e) {
        if (!this.container)
            return;
        this.adjustMouseEvent(e);
        let mouse = [e.localX, e.localY];
        let delta = [mouse[0] - this.last_mouse[0], mouse[1] - this.last_mouse[1]];
        this.last_mouse = mouse;
        this.canvas_mouse = [e.canvasX, e.canvasY];
        if (this.isMiniMap) {
            if (this.dragging_canvas) {
                this.miniMapOffsetChanged(e);
            }
            return;
        }
        if (this.dragging_canvas) {
            this.setOffsetDelta(delta[0] / this.scale, delta[1] / this.scale);
            this.dirty_canvas = true;
            this.dirty_bgcanvas = true;
        }
        else {
            if (this.connecting_node)
                this.dirty_canvas = true;
            let n = this.getNodeOnPos(e.canvasX, e.canvasY, this.visible_nodes);
            for (let id in this.container._nodes) {
                let node = this.container._nodes[id];
                if (node.mouseOver && n != node) {
                    node.mouseOver = false;
                    if (this.node_over && this.node_over['onMouseLeave'])
                        this.node_over['onMouseLeave'](e);
                    this.node_over = null;
                    this.dirty_canvas = true;
                }
            }
            this.canvas.style.cursor = 'default';
            if (n) {
                let i = this.isOverNodeInput(n, e.canvasX, e.canvasY, [0, 0]);
                let o = this.isOverNodeOutput(n, e.canvasX, e.canvasY, [0, 0]);
                if ((i != -1 && this.connecting_node) || o != -1)
                    this.canvas.style.cursor = 'crosshair';
                if (!n.mouseOver) {
                    n.mouseOver = true;
                    this.node_over = n;
                    this.dirty_canvas = true;
                    if (n['onMouseEnter'])
                        n['onMouseEnter'](e);
                }
                if (n['onMouseMove'])
                    n['onMouseMove'](e);
                if (this.connecting_node) {
                    let pos = this._highlight_input_pos || [0, 0];
                    let slot = this.isOverNodeInput(n, e.canvasX, e.canvasY, pos);
                    if (slot != -1 && n.inputs[slot]) {
                        this._highlight_input_pos = pos;
                        this._highlight_input = n.inputs[slot];
                    }
                    else {
                        this._highlight_input_pos = null;
                        this._highlight_input = null;
                    }
                }
                if (utils_1.default.isInsideRectangle(e.canvasX, e.canvasY, n.pos[0] + n.size[0] - 10, n.pos[1] + n.size[1] - 10, 10, 10))
                    this.canvas.style.cursor = 'se-resize';
            }
            else {
                this._highlight_input_pos = null;
                this._highlight_input = null;
            }
            if (this.node_capturing_input &&
                this.node_capturing_input != n &&
                this.node_capturing_input['onMouseMove']) {
                this.node_capturing_input['onMouseMove'](e);
            }
            if (this.node_dragged && !this.live_mode) {
                this.computeVisibleNodes();
                let maxWidth = this.MAX_OFFSET_WIDTH;
                let maxHeight = this.MAX_OFFSET_HEIGHT;
                this.nodeToDeselect = null;
                for (let i in this.selected_nodes) {
                    let n = this.selected_nodes[i];
                    n.pos[0] += delta[0] / this.scale;
                    n.pos[1] += delta[1] / this.scale;
                    n.pos[0] = Math.max(-this.DEFAULT_OFFSET, Math.round(n.pos[0]));
                    n.pos[1] = Math.max(-this.DEFAULT_OFFSET + this.NODE_PANEL_HEADER_HEIGHT, Math.round(n.pos[1]));
                    maxWidth = Math.max(n.pos[0] + n.size[0] + 20, maxWidth);
                    maxHeight = Math.max(n.pos[1] + n.size[1] + 20, maxHeight);
                }
                this.temp_nodes.forEach(node => {
                    let pos = this.convertEventToCanvas(e);
                    pos[0] = Math.round(pos[0]);
                    pos[1] = Math.round(pos[1]);
                    node.pos[0] = Math.max(-this.DEFAULT_OFFSET, Math.round(pos[0]));
                    node.pos[1] = Math.max(-this.DEFAULT_OFFSET + this.NODE_PANEL_HEADER_HEIGHT, Math.round(pos[1]));
                    maxWidth = Math.max(node.pos[0] + node.size[0] + 20, maxWidth);
                    maxHeight = Math.max(node.pos[1] + node.size[1] + 20, maxHeight);
                });
                this.MAX_OFFSET_WIDTH = Math.max(this.DEFAULT_OFFSET, maxWidth);
                this.MAX_OFFSET_HEIGHT = Math.max(this.DEFAULT_OFFSET, maxHeight);
                this.setOffsetValue();
                this.dirty_canvas = true;
                this.dirty_bgcanvas = true;
            }
            if (this.resizing_node && !this.live_mode) {
                this.resizing_node.size[0] += delta[0] / this.scale;
                this.resizing_node.size[0] = this.resizing_node.calculateMinWidth(this.resizing_node.size[0]);
                this.canvas.style.cursor = 'se-resize';
                this.dirty_canvas = true;
                this.dirty_bgcanvas = true;
            }
        }
        e.preventDefault();
        return false;
    }
    processMouseUp(e) {
        if (!this.container)
            return;
        this.focusDocument();
        let window = this.getCanvasWindow();
        let document = window.document;
        document.removeEventListener('mousemove', this._mousemove_callback, true);
        this.canvas.addEventListener('mousemove', this._mousemove_callback, true);
        document.removeEventListener('mouseup', this._mouseup_callback, true);
        this.adjustMouseEvent(e);
        if (this.isMiniMap) {
            let mouse = [e.localX, e.localY];
            let delta = [mouse[0] - this.last_mouse[0], mouse[1] - this.last_mouse[1]];
            if (delta[0] == 0 && delta[1] == 0) {
                this.miniMapOffsetChanged(e);
            }
            this.dragging_canvas = false;
            return;
        }
        if (e.which == 1) {
            if (this.connecting_node) {
                this.dirty_canvas = true;
                this.dirty_bgcanvas = true;
                let node = this.getNodeOnPos(e.canvasX, e.canvasY, this.visible_nodes);
                if (node) {
                    let slot = this.isOverNodeInput(node, e.canvasX, e.canvasY);
                    if (slot != -1) {
                        this.editor.socket.sendCreateLink(this.connecting_node.id, this.connecting_slot, node.id, slot);
                    }
                }
                this.connecting_output = null;
                this.connecting_pos = null;
                this.connecting_node = null;
                this.connecting_slot = -1;
                this._highlight_input_pos = null;
                this._highlight_input = null;
            }
            else if (this.resizing_node) {
                this.dirty_canvas = true;
                this.dirty_bgcanvas = true;
                this.editor.socket.sendUpdateNodeSize(this.resizing_node);
                this.resizing_node = null;
            }
            else if (this.node_dragged) {
                this.dirty_canvas = true;
                this.dirty_bgcanvas = true;
                this.node_dragged.pos[0] = Math.round(this.node_dragged.pos[0]);
                this.node_dragged.pos[1] = Math.round(this.node_dragged.pos[1]);
                for (let i in this.selected_nodes) {
                    this.selected_nodes[i].size[0] = Math.round(this.selected_nodes[i].size[0]);
                    this.selected_nodes[i].size[1] = Math.round(this.selected_nodes[i].size[1]);
                    this.editor.socket.sendUpdateNodePosition(this.selected_nodes[i]);
                }
                this.temp_nodes.forEach(node => {
                    let pos = this.convertEventToCanvas(e);
                    pos[0] = Math.round(pos[0]);
                    pos[1] = Math.round(pos[1]);
                    this.editor.socket.sendCreateNode(node.type, pos);
                });
                if (this.nodeToDeselect) {
                    this.processNodeDeselected(this.nodeToDeselect);
                    this.nodeToDeselect = null;
                }
                this.temp_nodes = [];
                this.node_dragged = null;
            }
            else {
                this.dirty_canvas = true;
                this.dragging_canvas = false;
                if (this.node_over && this.node_over['onMouseUp'])
                    this.node_over['onMouseUp'](e);
                if (this.node_capturing_input && this.node_capturing_input['onMouseUp'])
                    this.node_capturing_input['onMouseUp'](e);
            }
        }
        else if (e.which == 2) {
            this.dirty_canvas = true;
            this.dragging_canvas = false;
        }
        else if (e.which == 3) {
            this.dirty_canvas = true;
            this.dragging_canvas = false;
        }
        this.container.setDirtyCanvas(true, true);
        e.stopPropagation();
        e.preventDefault();
        return false;
    }
    processMouseWheel(e) {
        if (!this.container || !this.allow_dragcanvas)
            return;
        let delta = e.wheelDeltaY != null ? e.wheelDeltaY : e.detail * -60;
        this.adjustMouseEvent(e);
        if (e.localX <= this.NODE_PANEL_WIDTH) {
            const panelHeight = this.getNodePanelHeight();
            const difference = panelHeight - this.canvas.height;
            if (difference > 0) {
                this.nodePanelOffset -= delta;
                this.nodePanelOffset = Math.min(Math.max(0, this.nodePanelOffset), difference);
                this.draw(true, false);
            }
            else if (this.nodePanelOffset != 0) {
                this.nodePanelOffset = 0;
                this.draw(true, false);
            }
            return;
        }
        let zoom = this.scale;
        if (delta > 0)
            zoom *= 1.02;
        else if (delta < 0)
            zoom *= 1 / 1.02;
        this.setZoom(zoom, [e.localX, e.localY]);
        this.container.setDirtyCanvas(true, true);
        e.preventDefault();
        return false;
    }
    getNodePanelHeight() {
        const lastCategory = this.nodeCategoriesPanel[this.nodeCategoriesPanel.length - 1];
        return lastCategory.endY;
    }
    isOverNodeInput(node, canvasx, canvasy, slot_pos) {
        if (node.inputs)
            for (let i in node.inputs) {
                let input = node.inputs[i];
                let link_pos = this.getConnectionPos(node, true, +i);
                if (utils_1.default.isInsideRectangle(canvasx, canvasy, link_pos[0] - 10, link_pos[1] - 5, 20, 10)) {
                    if (slot_pos) {
                        slot_pos[0] = link_pos[0];
                        slot_pos[1] = link_pos[1];
                    }
                    return +i;
                }
            }
        return -1;
    }
    isOverNodeOutput(node, canvasx, canvasy, slot_pos) {
        if (node.outputs)
            for (let o in node.outputs) {
                let output = node.outputs[o];
                let link_pos = this.getConnectionPos(node, false, +o);
                if (utils_1.default.isInsideRectangle(canvasx, canvasy, link_pos[0] - 10, link_pos[1] - 5, 20, 10)) {
                    if (slot_pos) {
                        slot_pos[0] = link_pos[0];
                        slot_pos[1] = link_pos[1];
                    }
                    return +o;
                }
            }
        return -1;
    }
    processKey(e) {
        if (!this.container)
            return;
        if (e.target.tagName.toUpperCase() !== 'BODY')
            return;
        let block_default = this.copyPasteExtension.process(e);
        if (e.type == 'keydown') {
            if (e.keyCode == 65 && (e.ctrlKey || e.metaKey)) {
                this.selectAllNodes();
                block_default = true;
            }
            if (e.keyCode == 46 || e.keyCode == 8) {
                this.deleteSelectedNodes();
                block_default = true;
            }
            if (e.keyCode == 27) {
                if (Object.keys(this.selected_nodes).length > 0) {
                    this.deselectAllNodes();
                }
                else {
                    this.editor.hideNodeSettings();
                }
            }
            if (e.keyCode >= 37 && e.keyCode <= 40) {
                this.panCanvas(e.keyCode == 39, e.keyCode == 40, e.keyCode == 37, e.keyCode == 38);
            }
            if (this.selected_nodes)
                for (let i in this.selected_nodes)
                    if (this.selected_nodes[i]['onKeyDown'])
                        this.selected_nodes[i]['onKeyDown'](e);
        }
        else if (e.type == 'keyup') {
            if (this.selected_nodes)
                for (let i in this.selected_nodes)
                    if (this.selected_nodes[i]['onKeyUp'])
                        this.selected_nodes[i]['onKeyUp'](e);
        }
        this.container.setDirtyCanvas(true, true);
        if (block_default) {
            e.preventDefault();
            return false;
        }
    }
    processDrop(e) {
        e.preventDefault();
        this.adjustMouseEvent(e);
        let pos = [e.canvasX, e.canvasY];
        let node = this.getNodeOnPos(pos[0], pos[1]);
        if (!node) {
            if (this.onDropItem)
                this.onDropItem(event);
            return;
        }
        if (node['onDropFile']) {
            let files = e.dataTransfer.files;
            if (files && files.length) {
                for (let i = 0; i < files.length; i++) {
                    let file = e.dataTransfer.files[0];
                    let filename = file.name;
                    let ext = this.getFileExtension(filename);
                    let reader = new FileReader();
                    reader.onload = function (event) {
                    };
                    let type = file.type.split('/')[0];
                    if (type == 'text' || type == '')
                        reader.readAsText(file);
                    else if (type == 'image')
                        reader.readAsDataURL(file);
                    else
                        reader.readAsArrayBuffer(file);
                }
            }
        }
        if (node['onDropItem']) {
            if (node['onDropItem'](event))
                return true;
        }
        if (this.onDropItem)
            return this.onDropItem(event);
        return false;
    }
    processNodeSelected(n, addSelectedNode = false) {
        const setSelected = () => {
            n.selected = true;
            if (n['onSelected'])
                n['onSelected']();
        };
        const inSelection = this.selected_nodes[n.id];
        if (addSelectedNode) {
            if (inSelection) {
                this.nodeToDeselect = n;
            }
            else {
                setSelected();
                this.selected_nodes[n.id] = n;
            }
            this.editor.hideNodeSettings();
        }
        else if (!inSelection) {
            setSelected();
            this.selected_nodes = {};
            this.selected_nodes[n.id] = n;
            this.editor.showSelectedNodeSetting(n);
        }
        this.dirty_canvas = true;
        if (this.onNodeSelected)
            this.onNodeSelected(n);
    }
    processNodeDeselected(n) {
        n.selected = false;
        if (n['onDeselected'])
            n['onDeselected']();
        delete this.selected_nodes[n.id];
        if (this.onNodeDeselected)
            this.onNodeDeselected();
        this.dirty_canvas = true;
    }
    processNodeDblClicked(n) {
        if (this.onShowNodePanel)
            this.onShowNodePanel(n);
        if (this.onNodeDblClicked)
            this.onNodeDblClicked(n);
        this.editor.showNodeSettings(n);
    }
    selectNode(node) {
        this.deselectAllNodes();
        if (!node)
            return;
        if (!node.selected && node['onSelected'])
            node['onSelected']();
        node.selected = true;
        this.selected_nodes[node.id] = node;
        this.setDirty(true);
    }
    selectAllNodes() {
        for (let id in this.container._nodes) {
            let node = this.container._nodes[id];
            if (!node.selected && node['onSelected'])
                node['onSelected']();
            node.selected = true;
            this.selected_nodes[node.id] = node;
        }
        this.setDirty(true);
    }
    deselectAllNodes() {
        for (let i in this.selected_nodes) {
            let n = this.selected_nodes[i];
            if (n['onDeselected'])
                n['onDeselected']();
            n.selected = false;
        }
        this.selected_nodes = {};
        this.setDirty(true);
    }
    deleteSelectedNodes() {
        let ids = [];
        for (let n in this.selected_nodes)
            ids.push(this.selected_nodes[n].id);
        this.editor.socket.sendRemoveNodes(ids);
    }
    adjustMouseEvent(e) {
        let b = this.canvas.getBoundingClientRect();
        e.localX = e.pageX - b.left;
        e.localY = e.pageY - b.top;
        e.canvasX = e.localX / this.scale - this.offset[0];
        e.canvasY = e.localY / this.scale - this.offset[1];
    }
    setZoom(value, zooming_center) {
        if (!zooming_center)
            zooming_center = [this.canvas.width * 0.5, this.canvas.height * 0.5];
        let center = this.convertOffsetToCanvas(zooming_center);
        this.scale = value;
        if (this.scale > this.max_zoom)
            this.scale = this.max_zoom;
        else if (this.scale < this.min_zoom)
            this.scale = this.min_zoom;
        let new_center = this.convertOffsetToCanvas(zooming_center);
        let delta_offset = [new_center[0] - center[0], new_center[1] - center[1]];
        this.setOffsetDelta(delta_offset[0], delta_offset[1]);
        this.storeValue('scale', this.scale);
        this.dirty_canvas = true;
        this.dirty_bgcanvas = true;
    }
    setOffsetDelta(deltaChangeX = 0, deltaChangeY = 0) {
        this.setOffsetValue(this.offset[0] + deltaChangeX, this.offset[1] + deltaChangeY);
    }
    setOffsetValue(x = this.offset[0], y = this.offset[1]) {
        this.offset = this.limitOffset(x, y);
        if (this.translateCallback) {
            this.translateCallback({
                x: -this.offset[0],
                y: -this.offset[1],
                width: this.canvas.width / this.scale,
                height: this.canvas.height / this.scale,
            });
        }
        this.storeValue('offset', this.offset);
    }
    panCanvas(panLeft, panUp, panRight, panBottom, delta = 15) {
        const deltaX = panLeft ? -delta : panRight ? delta : 0;
        const deltaY = panUp ? -delta : panBottom ? delta : 0;
        this.setOffsetDelta(deltaX / this.scale, deltaY / this.scale);
        this.dirty_canvas = true;
        this.dirty_bgcanvas = true;
    }
    convertOffsetToCanvas(pos) {
        return [pos[0] / this.scale - this.offset[0], pos[1] / this.scale - this.offset[1]];
    }
    convertCanvasToOffset(pos) {
        return [(pos[0] + this.offset[0]) * this.scale, (pos[1] + this.offset[1]) * this.scale];
    }
    convertEventToCanvas(e) {
        let rect = this.canvas.getClientRects()[0];
        return this.convertOffsetToCanvas([e.pageX - rect.left, e.pageY - rect.top]);
    }
    computeVisibleNodes() {
        let visible_nodes = [];
        let maxHeight = 0;
        let maxWidth = 0;
        for (let id in this.container._nodes) {
            let node = this.container._nodes[id];
            maxWidth = Math.max(node.pos[0] + node.size[0] + 20, maxWidth);
            maxHeight = Math.max(node.pos[1] + node.size[1] + 20, maxHeight);
            if (this.live_mode && !node['onDrawBackground'] && !node['onDrawForeground'])
                continue;
            let bounding = this.getBounding(node);
            if (!bounding)
                continue;
            if (!utils_1.default.overlapBounding(this.visible_area, bounding))
                continue;
            visible_nodes.push(node);
        }
        this.MAX_OFFSET_HEIGHT = Math.max(this.DEFAULT_OFFSET, maxHeight);
        this.MAX_OFFSET_WIDTH = Math.max(maxWidth, this.DEFAULT_OFFSET);
        this.setOffsetValue();
        return visible_nodes;
    }
    draw(force_foreground, force_background) {
        let now = utils_1.default.getTime();
        this.render_time = (now - this.last__time) * 0.001;
        this.last_draw_time = now;
        if (this.container) {
            let start = [-this.offset[0], -this.offset[1]];
            let end = [
                start[0] + this.canvas.width / this.scale,
                start[1] + this.canvas.height / this.scale,
            ];
            this.visible_area = [start[0], start[1], end[0], end[1]];
        }
        if (this.dirty_bgcanvas || force_background)
            this.drawBackCanvas();
        if (this.dirty_canvas || force_foreground)
            this.drawFrontCanvas();
        this.fps = this.render_time ? 1.0 / this.render_time : 0;
        this.frame += 1;
    }
    drawFrontCanvas() {
        if (!this.ctx)
            this.ctx = this.bgcanvas.getContext('2d');
        let ctx = this.ctx;
        if (!ctx)
            return;
        if (this.ctx.start2D)
            this.ctx.start2D();
        let canvas = this.canvas;
        ctx.restore();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        if (this.dirty_area) {
            ctx.save();
            ctx.beginPath();
            ctx.rect(this.dirty_area[0], this.dirty_area[1], this.dirty_area[2], this.dirty_area[3]);
            ctx.clip();
        }
        if (this.clear_background)
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (this.bgcanvas == this.canvas)
            this.drawBackCanvas();
        else
            ctx.drawImage(this.bgcanvas, 0, 0);
        if (this.onRender)
            this.onRender(canvas, ctx);
        if (this.show_info)
            this.renderInfo(ctx);
        if (this.container) {
            ctx.save();
            ctx.scale(this.scale, this.scale);
            ctx.translate(this.offset[0], this.offset[1]);
            let drawn_nodes = 0;
            let visible_nodes = this.computeVisibleNodes();
            this.visible_nodes = visible_nodes;
            const draw = node => {
                ctx.save();
                ctx.translate(node.pos[0], node.pos[1]);
                this.drawNode(node, ctx);
                drawn_nodes += 1;
                ctx.restore();
            };
            const hoveredNodes = [];
            for (let i in visible_nodes) {
                let node = visible_nodes[i];
                if (!this.selected_nodes[node.id]) {
                    if (node.mouseOver) {
                        hoveredNodes.push(node);
                    }
                    else {
                        draw(node);
                    }
                }
            }
            for (let i in this.selected_nodes) {
                let node = this.selected_nodes[i];
                draw(node);
            }
            hoveredNodes.forEach(node => draw(node));
            if (this.container.config.links_ontop)
                if (!this.live_mode)
                    this.drawConnections(ctx);
            if (this.connecting_pos != null) {
                ctx.lineWidth = this.connections_width;
                let link_color = this.theme.NEW_LINK_COLOR;
                if (this.connecting_output != null) {
                    link_color = this.theme.LINK_TYPE_COLORS[Renderer.mapToColor(this.connecting_output.type)];
                }
                this.renderLink(ctx, this.connecting_pos, [this.canvas_mouse[0], this.canvas_mouse[1]], link_color);
                ctx.fillStyle = link_color;
                ctx.beginPath();
                ctx.arc(this.connecting_pos[0], this.connecting_pos[1], 4, 0, Math.PI * 2);
                ctx.fill();
                if (this._highlight_input_pos) {
                    ctx.fillStyle = this.theme.LINK_TYPE_COLORS[Renderer.mapToColor(this._highlight_input.type)];
                    ctx.beginPath();
                    ctx.arc(this._highlight_input_pos[0], this._highlight_input_pos[1], 6, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            ctx.restore();
            ctx.beginPath();
            ctx.arc(0, 0, 0, 0, Math.PI * 2);
            ctx.fill();
            if (this.SHOW_PANEL && !this.isMiniMap) {
                this.renderNodePanel(ctx, canvas);
            }
            ctx.restore();
            ctx.scale(this.scale, this.scale);
            ctx.translate(this.offset[0], this.offset[1]);
            this.temp_nodes.forEach(node => {
                ctx.save();
                ctx.translate(node.pos[0], node.pos[1]);
                this.drawNode(node, ctx);
                drawn_nodes += 1;
                ctx.restore();
            });
            ctx.restore();
        }
        if (this.dirty_area) {
            ctx.restore();
        }
        if (this.canvasBoundaryRect && this.isMiniMap) {
            ctx.beginPath();
            ctx.fillStyle = this.theme.LINK_TYPE_COLORS[1];
            ctx.globalAlpha = 0.2;
            ctx.rect(this.canvasBoundaryRect.x, this.canvasBoundaryRect.y, this.canvasBoundaryRect.width, this.canvasBoundaryRect.height);
            ctx.fill();
            ctx.restore();
        }
        if (this.ctx.finish2D)
            this.ctx.finish2D();
        this.dirty_canvas = false;
    }
    renderNodePanel(ctx, canvas) {
        ctx.save();
        ctx.fillStyle = this.theme.CONTAINER_NODE_BGCOLOR;
        ctx.rect(0, 0, this.NODE_PANEL_WIDTH, canvas.height);
        ctx.fill();
        this.nodeCategoriesPanel.forEach(value => {
            ctx.save();
            ctx.translate(this.NODE_PANEL_ITEM_MARGIN, value.startY + this.NODE_PANEL_ITEM_MARGIN - this.nodePanelOffset);
            this.drawNodeCategory(value, ctx);
            ctx.restore();
            if (value.isOpen) {
                value.children.forEach(child => {
                    ctx.save();
                    ctx.translate(this.NODE_PANEL_ITEM_MARGIN * 4, child.startY + this.NODE_PANEL_ITEM_MARGIN - this.nodePanelOffset);
                    this.drawNodeWidget(child, ctx);
                    ctx.restore();
                });
            }
        });
        ctx.restore();
    }
    renderInfo(ctx, x = 0, y = 0) {
        ctx.save();
        ctx.translate(x, y);
        ctx.font = '10px Arial';
        ctx.fillStyle = '#888';
        if (this.container) {
            ctx.fillText('T: ' + this.container.globaltime.toFixed(2) + 's', 5, 13 * 1);
            ctx.fillText('I: ' + this.container.iteration, 5, 13 * 2);
            ctx.fillText('F: ' + this.frame, 5, 13 * 3);
            ctx.fillText('FPS:' + this.fps.toFixed(2), 5, 13 * 4);
        }
        else
            ctx.fillText('No container selected', 5, 13 * 1);
        ctx.restore();
    }
    drawBackCanvas() {
        let canvas = this.bgcanvas;
        if (!this.bgctx)
            this.bgctx = this.bgcanvas.getContext('2d');
        let ctx = this.bgctx;
        if (ctx.start)
            ctx.start();
        if (this.clear_background)
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        if (this.container) {
            ctx.save();
            ctx.scale(this.scale, this.scale);
            ctx.translate(this.offset[0], this.offset[1]);
            if (this.theme.BG_IMAGE && this.scale > 0.5) {
                ctx.globalAlpha = (1.0 - 0.5 / this.scale) * this.editor_alpha;
                ctx.imageSmoothingEnabled = ctx.imageSmoothingEnabled = false;
                if (!this._bg_img || this._bg_img.name != this.theme.BG_IMAGE) {
                    this._bg_img = new Image();
                    this._bg_img.name = this.theme.BG_IMAGE;
                    this._bg_img.src = this.theme.BG_IMAGE;
                    let that = this;
                    this._bg_img.onload = function () {
                        that.draw(true, true);
                    };
                }
                let pattern = null;
                if (this._pattern == null && this._bg_img.width > 0) {
                    pattern = ctx.createPattern(this._bg_img, 'repeat');
                    this._pattern_img = this._bg_img;
                    this._pattern = pattern;
                }
                else
                    pattern = this._pattern;
                if (pattern) {
                    ctx.fillStyle = pattern;
                    ctx.fillRect(this.visible_area[0], this.visible_area[1], this.visible_area[2] - this.visible_area[0], this.visible_area[3] - this.visible_area[1]);
                    ctx.fillStyle = 'transparent';
                }
                ctx.globalAlpha = 1.0;
                ctx.imageSmoothingEnabled = ctx.imageSmoothingEnabled = true;
            }
            if (this.onBackgroundRender)
                this.onBackgroundRender(canvas, ctx);
            if (this.render_connections_shadows) {
                ctx.shadowColor = '#000';
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowBlur = 6;
            }
            else
                ctx.shadowColor = 'rgba(0,0,0,0)';
            if (!this.live_mode)
                this.drawConnections(ctx);
            ctx.shadowColor = 'rgba(0,0,0,0)';
            ctx.restore();
        }
        if (ctx.finish)
            ctx.finish();
        this.dirty_bgcanvas = false;
        this.dirty_canvas = true;
    }
    drawNodeCategory(value, ctx) {
        ctx.fillStyle = this.theme.NODE_DEFAULT_BGCOLOR;
        ctx.beginPath();
        const margin = this.NODE_PANEL_ITEM_MARGIN;
        const width = this.NODE_PANEL_WIDTH - margin * 2;
        ctx.roundRect(0, 0, width, value.height - margin * 2, 4);
        ctx.fill();
        ctx.font = this.inner_large_text_font;
        let title = value.name;
        if (title && this.NODE_PANEL_WIDTH > 54) {
            const truncatedTitle = Renderer.truncateToSize(ctx, title, width - 32);
            ctx.fillStyle = this.theme.NODE_TITLE_COLOR;
            ctx.fillText(truncatedTitle, 16, 18);
        }
    }
    drawNodeWidget(value, ctx) {
        const marginVertical = this.NODE_PANEL_ITEM_MARGIN * 2;
        const marginHorizontal = this.NODE_PANEL_ITEM_MARGIN * 2;
        const size = [this.NODE_PANEL_WIDTH - marginHorizontal * 3, value.height - marginVertical * 2];
        const margin = 8;
        if (this.render_shadows) {
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowOffsetX = this.shadows_width;
            ctx.shadowOffsetY = this.shadows_width;
            ctx.shadowBlur = 3;
        }
        else
            ctx.shadowColor = 'transparent';
        ctx.beginPath();
        ctx.roundRect(0, 0, size[0], size[1], 4);
        ctx.fill();
        ctx.fillStyle = value.color || this.theme.NODE_DEFAULT_COLOR;
        ctx.beginPath();
        ctx.roundRect(0, 0, size[0], size[1], 4);
        ctx.fill();
        ctx.shadowColor = 'transparent';
        ctx.fillStyle = this.theme.NODE_DEFAULT_BOXCOLOR;
        ctx.beginPath();
        const shape = this.theme.NODE_DEFAULT_SHAPE;
        const titleHeight = value.height;
        if (shape == 'round' || shape == 'circle')
            ctx.arc(size[0] - margin - titleHeight * 0.2, margin + 2, (this.theme.NODE_TITLE_HEIGHT - 2) * 0.5, 0, Math.PI * 2);
        else
            ctx.rect(size[0] - titleHeight * 0.5, -titleHeight + 3, titleHeight - 6, titleHeight - 6);
        ctx.fill();
        const textMaxLength = size[0] - titleHeight * (value.icon ? (name ? 3 : 2) : 1) + (value.icon ? 0 : -10);
        const drawIcon = () => {
            const size = (titleHeight - margin) / 2;
            const dstX = margin / 2;
            ctx.drawImage(value.iconImage, dstX, dstX, size, size);
        };
        if (value.icon) {
            if (!value.iconImage) {
                value.iconImage = this.loadImage(value.icon, drawIcon);
            }
            else {
                drawIcon();
            }
        }
        ctx.font = this.inner_large_text_font;
        let title = value.name;
        if (title && this.NODE_PANEL_WIDTH > 54) {
            const truncatedTitle = Renderer.truncateToSize(ctx, title, size[0] - 32);
            ctx.fillStyle = this.theme.NODE_TITLE_COLOR;
            ctx.fillText(truncatedTitle, 18, 14);
        }
    }
    drawNode(node, ctx) {
        let glow = false;
        let color = node.color || this.theme.NODE_DEFAULT_COLOR;
        if (node instanceof container_node_1.ContainerNode)
            color = this.theme.CONTAINER_NODE_COLOR;
        else if (node.type == 'main/input' || node.type == 'main/output')
            color = this.theme.IO_NODE_COLOR;
        let render_title = true;
        if (node.flags.skip_title_render)
            render_title = false;
        if (node.mouseOver)
            render_title = true;
        if (node.selected) {
            ctx.shadowColor = this.theme.SELECTION_COLOR;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowBlur = this.theme.SELECTION_WIDTH;
        }
        else if (node.mouseOver) {
            ctx.shadowColor = this.theme.SELECTION_COLOR;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowBlur = 1;
        }
        else if (this.render_shadows) {
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowOffsetX = this.shadows_width;
            ctx.shadowOffsetY = this.shadows_width;
            ctx.shadowBlur = 3;
        }
        else
            ctx.shadowColor = 'transparent';
        if (this.live_mode) {
            if (!node.flags.collapsed) {
                ctx.shadowColor = 'transparent';
                if (node['onDrawForeground'])
                    node['onDrawForeground'](ctx);
            }
            return;
        }
        let editor_alpha = this.editor_alpha;
        ctx.globalAlpha = editor_alpha;
        let shape = node.shape || this.theme.NODE_DEFAULT_SHAPE;
        node.size[1] = node.computeHeight();
        let size = [node.size[0], node.size[1]];
        if (node.flags.collapsed) {
            size[0] = this.theme.NODE_COLLAPSED_WIDTH;
            size[1] = 0;
        }
        if (node.flags.clip_area) {
            ctx.save();
            if (shape == 'box') {
                ctx.beginPath();
                ctx.rect(0, 0, size[0], size[1]);
            }
            else if (shape == 'round') {
                ctx.roundRect(0, 0, size[0], size[1], 10);
            }
            else if (shape == 'circle') {
                ctx.roundRect(0, 0, size[0], size[1], 10);
            }
            ctx.clip();
        }
        this.drawNodeShape(node, ctx, size, color, node.bgcolor, !render_title, node.selected);
        ctx.shadowColor = 'transparent';
        ctx.textAlign = 'left';
        ctx.font = this.inner_text_font;
        let render_text = this.scale > 0.6;
        if (!node.flags.collapsed) {
            if (node.inputs)
                for (let i in node.inputs) {
                    let slot = node.inputs[i];
                    ctx.globalAlpha = editor_alpha;
                    ctx.fillStyle =
                        slot.link != null
                            ? this.theme.NODE_SLOT_COLOR
                            : this.theme.DATATYPE_COLOR[Renderer.mapToColor(slot.type)];
                    let pos = this.getConnectionPos(node, true, +i);
                    pos[0] -= node.pos[0];
                    pos[1] -= node.pos[1];
                    ctx.beginPath();
                    if (1 || slot.round)
                        ctx.arc(pos[0], pos[1], 4, 0, Math.PI * 2);
                    ctx.fill();
                    if (render_text) {
                        const name = slot.name;
                        let nameWidth = 0;
                        if (name != null) {
                            ctx.textAlign = 'left';
                            ctx.fillStyle = slot.isOptional
                                ? this.theme.NODE_OPTIONAL_IO_COLOR
                                : this.theme.NODE_DEFAULT_IO_COLOR;
                            const truncated = Renderer.truncateToSize(ctx, name, size[0] / 2);
                            nameWidth = ctx.measureText(truncated).width;
                            ctx.fillText(truncated, 8, pos[1] + 5);
                        }
                        const label = slot.label;
                        if (this.editor.showNodesIOValues && label !== undefined) {
                            ctx.textAlign = 'right';
                            ctx.fillStyle = this.theme.NODE_DEFAULT_IO_COLOR;
                            const truncated = Renderer.truncateToSize(ctx, label || 'null', size[0] - nameWidth - 40);
                            ctx.fillText(truncated, node.size[0] - 8, pos[1] + 5);
                        }
                    }
                }
            if (this.connecting_node)
                ctx.globalAlpha = 0.4 * editor_alpha;
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'black';
            if (node.outputs) {
                for (let o in node.outputs) {
                    let slot = node.outputs[o];
                    let pos = this.getConnectionPos(node, false, +o);
                    pos[0] -= node.pos[0];
                    pos[1] -= node.pos[1];
                    ctx.fillStyle =
                        slot.links && slot.links.length
                            ? this.theme.NODE_SLOT_COLOR
                            : this.theme.DATATYPE_COLOR[Renderer.mapToColor(slot.type)];
                    ctx.beginPath();
                    if (!this.connecting_pos)
                        ctx.arc(pos[0], pos[1], 4, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                    if (render_text) {
                        const name = slot.name;
                        let nameWidth = 0;
                        if (name != null) {
                            ctx.textAlign = 'left';
                            ctx.fillStyle = this.theme.NODE_DEFAULT_IO_COLOR;
                            const truncated = Renderer.truncateToSize(ctx, name, size[0] / 2);
                            nameWidth = ctx.measureText(truncated).width;
                            ctx.fillText(truncated, 8, pos[1] + 5);
                        }
                        const label = slot.label;
                        if (this.editor.showNodesIOValues && label !== undefined) {
                            ctx.textAlign = 'right';
                            ctx.fillStyle = this.theme.NODE_DEFAULT_IO_COLOR;
                            const truncated = Renderer.truncateToSize(ctx, label || 'null', size[0] - nameWidth - 40);
                            ctx.fillText(truncated, node.size[0] - 8, pos[1] + 5);
                        }
                    }
                }
            }
            ctx.textAlign = 'left';
            ctx.globalAlpha = 1;
            if (node['onDrawForeground'])
                node['onDrawForeground'](ctx);
        }
        if (node.flags.clip_area)
            ctx.restore();
        ctx.globalAlpha = 1.0;
    }
    static truncateToSize(ctx, text, maxWidth) {
        let width = ctx.measureText(text).width;
        const ellipsis = '…';
        const ellipsisWidth = ctx.measureText(ellipsis).width;
        if (width <= maxWidth || width <= ellipsisWidth) {
            return text;
        }
        let result = text.toString();
        while (width >= maxWidth - ellipsisWidth && result.length > 0) {
            result = result.substring(0, result.length - 1);
            width = ctx.measureText(result).width;
        }
        return result + ellipsis;
    }
    drawNodeShape(node, ctx, size, fgColor, bgColor, noTitle, selected) {
        ctx.strokeStyle = fgColor || this.theme.NODE_DEFAULT_COLOR;
        ctx.fillStyle = bgColor || this.theme.NODE_DEFAULT_BGCOLOR;
        if (node instanceof container_node_1.ContainerNode) {
            ctx.strokeStyle = fgColor || this.theme.CONTAINER_NODE_COLOR;
            ctx.fillStyle = bgColor || this.theme.CONTAINER_NODE_BGCOLOR;
        }
        else if (node instanceof unknown_1.UnknownNode) {
            ctx.strokeStyle = this.theme.UNKNOWN_NODE_COLOR;
            ctx.fillStyle = this.theme.UNKNOWN_NODE_BGCOLOR;
        }
        else if (node.type == 'main/input' || node.type == 'main/output') {
            ctx.strokeStyle = fgColor || this.theme.IO_NODE_COLOR;
            ctx.fillStyle = bgColor || this.theme.IO_NODE_BGCOLOR;
        }
        let titleHeight = this.theme.NODE_TITLE_HEIGHT;
        let nameHeight = this.theme.NODE_NAME_HEIGHT;
        let name = node.getName();
        let shape = node.shape || this.theme.NODE_DEFAULT_SHAPE;
        const startVertical = noTitle ? 0 : name ? -titleHeight - nameHeight : -titleHeight;
        const headerHeight = this.getNodeHeaderHeight(node);
        const nodeHeight = headerHeight + size[1];
        const hasIcon = node.showIcon && node.iconImageUrl;
        const margin = 8;
        const start = hasIcon ? titleHeight : margin;
        const textMaxLength = size[0] - titleHeight * (hasIcon ? 2 : 1) + (hasIcon ? -margin : -margin * 2);
        if (shape == 'box') {
            ctx.beginPath();
            ctx.rect(0, startVertical, size[0] + 1, nodeHeight);
            ctx.fill();
        }
        else if (shape == 'round') {
            ctx.roundRect(0, startVertical, size[0], nodeHeight, 4);
            ctx.fill();
        }
        else if (shape == 'circle') {
            ctx.roundRect(0, startVertical, size[0], nodeHeight, 8);
            ctx.fill();
        }
        ctx.shadowColor = 'transparent';
        if (node.bgImage && node.bgImage.width)
            ctx.drawImage(node.bgImage, (size[0] - node.bgImage.width) * 0.5, (size[1] - node.bgImage.height) * 0.5);
        if (node.bgImageUrl && !node.bgImage)
            node.bgImage = this.loadImage(node.bgImageUrl);
        if (node['onDrawBackground'])
            node['onDrawBackground'](ctx);
        if (!noTitle) {
            ctx.fillStyle = node.headerColor || this.theme.NODE_DEFAULT_COLOR;
            let old_alpha = ctx.globalAlpha;
            if (shape == 'box') {
                ctx.beginPath();
                ctx.rect(0, -headerHeight, size[0] + 1, headerHeight);
                ctx.fill();
            }
            else if (shape == 'round') {
                ctx.roundRect(0, -headerHeight, size[0], headerHeight, 4, node.flags.collapsed ? 4 : 0);
                ctx.fill();
            }
            else if (shape == 'circle') {
                ctx.roundRect(0, -headerHeight, size[0], headerHeight, 8, node.flags.collapsed ? 8 : 0);
                ctx.fill();
            }
            if (!node.flags.collapsed) {
                ctx.beginPath();
                ctx.fillStyle = utils_1.default.pSBC(-0.1, bgColor || this.theme.NODE_DEFAULT_BGCOLOR);
                ctx.rect(0, 1, size[0], 2);
                ctx.fill();
                ctx.beginPath();
                ctx.fillStyle = utils_1.default.pSBC(-0.5, bgColor || this.theme.NODE_DEFAULT_BGCOLOR);
                ctx.rect(0, 0, size[0], 1);
                ctx.fill();
            }
            if (name) {
                ctx.beginPath();
                ctx.fillStyle = this.theme.NODE_TITLE_COLOR;
                if (node.type == 'main/container') {
                    ctx.fillStyle = bgColor || this.theme.CONTAINER_NODE_BGCOLOR;
                }
                else if (node.type == 'main/input' || node.type == 'main/output') {
                    ctx.fillStyle = bgColor || this.theme.IO_NODE_BGCOLOR;
                }
                ctx.rect(start, -nameHeight, size[0] - start - margin, 1);
                ctx.fill();
            }
            const signalVertical = name ? nameHeight : 0;
            ctx.fillStyle = node.boxcolor || this.theme.NODE_DEFAULT_BOXCOLOR || fgColor;
            ctx.beginPath();
            if (shape == 'round' || shape == 'circle')
                ctx.arc(size[0] - margin - titleHeight * 0.2, titleHeight * -0.5 - signalVertical, (titleHeight - 6) * 0.5, 0, Math.PI * 2);
            else
                ctx.rect(size[0] - titleHeight * 0.5, -titleHeight + 3 - signalVertical, titleHeight - 6, titleHeight - 6);
            ctx.fill();
            ctx.globalAlpha = old_alpha;
            const state = node.nodeState || node_1.NodeState.NORMAL;
            const stateColor = this.theme.STATE_COLORS[state];
            if (name && this.scale > 0.5) {
                ctx.font = this.title_text_font;
                const truncatedTitle = Renderer.truncateToSize(ctx, name, textMaxLength);
                ctx.fillStyle = stateColor || this.theme.NODE_TITLE_COLOR;
                ctx.fillText(truncatedTitle, start, 13 - titleHeight - nameHeight);
                ctx.font = this.name_text_font;
                let title = node.getTitle();
                if (title && this.scale > 0.5) {
                    const truncatedTitle = Renderer.truncateToSize(ctx, title, textMaxLength + titleHeight);
                    ctx.fillStyle = stateColor || this.theme.NODE_TITLE_COLOR;
                    ctx.fillText(truncatedTitle, start, 13 - titleHeight);
                }
            }
            else {
                ctx.font = this.title_text_font;
                let title = node.getTitle();
                if (title && this.scale > 0.5) {
                    const truncatedTitle = Renderer.truncateToSize(ctx, title, textMaxLength + titleHeight);
                    ctx.fillStyle = stateColor || this.theme.NODE_TITLE_COLOR;
                    ctx.fillText(truncatedTitle, start, -margin / 2);
                }
            }
            function drawIcon() {
                const size = titleHeight - margin;
                const dstX = margin / 2;
                const dstY = margin / 2 - (titleHeight + headerHeight) / 2;
                ctx.drawImage(node.iconImage, dstX, dstY, size, size);
            }
            if (hasIcon) {
                if (!node.iconImage) {
                    node.iconImage = this.loadImage(node.iconImageUrl, drawIcon);
                }
                else {
                    drawIcon();
                }
            }
        }
    }
    getNodeHeaderHeight(node) {
        let renderTitle = true;
        if (node.flags.skip_title_render)
            renderTitle = false;
        if (node.mouseOver)
            renderTitle = true;
        let titleHeight = this.theme.NODE_TITLE_HEIGHT;
        return renderTitle ? this.getNodeNameHeight(node) + titleHeight : 0;
    }
    getNodeNameHeight(node) {
        let nameHeight = this.theme.NODE_NAME_HEIGHT;
        let name = node.getName();
        return name ? nameHeight : 0;
    }
    drawNodeCollapsed(node, ctx, fgcolor, bgcolor) {
        ctx.strokeStyle = fgcolor || this.theme.NODE_DEFAULT_COLOR;
        ctx.fillStyle = bgcolor || this.theme.NODE_DEFAULT_BGCOLOR;
        let collapsed_radius = this.theme.NODE_COLLAPSED_RADIUS;
        let shape = node.shape || this.theme.NODE_DEFAULT_SHAPE;
        if (shape == 'circle') {
            ctx.beginPath();
            ctx.roundRect(node.size[0] * 0.5 - collapsed_radius, node.size[1] * 0.5 - collapsed_radius, 2 * collapsed_radius, 2 * collapsed_radius, 5);
            ctx.fill();
            ctx.shadowColor = 'rgba(0,0,0,0)';
            ctx.stroke();
            ctx.fillStyle = node.boxcolor || this.theme.NODE_DEFAULT_BOXCOLOR || fgcolor;
            ctx.beginPath();
            ctx.roundRect(node.size[0] * 0.5 - collapsed_radius * 0.5, node.size[1] * 0.5 - collapsed_radius * 0.5, collapsed_radius, collapsed_radius, 2);
            ctx.fill();
        }
        else if (shape == 'round') {
            ctx.beginPath();
            ctx.roundRect(node.size[0] * 0.5 - collapsed_radius, node.size[1] * 0.5 - collapsed_radius, 2 * collapsed_radius, 2 * collapsed_radius, 5);
            ctx.fill();
            ctx.shadowColor = 'rgba(0,0,0,0)';
            ctx.stroke();
            ctx.fillStyle = node.boxcolor || this.theme.NODE_DEFAULT_BOXCOLOR || fgcolor;
            ctx.beginPath();
            ctx.roundRect(node.size[0] * 0.5 - collapsed_radius * 0.5, node.size[1] * 0.5 - collapsed_radius * 0.5, collapsed_radius, collapsed_radius, 2);
            ctx.fill();
        }
        else {
            ctx.beginPath();
            ctx.rect(0, 0, node.size[0], collapsed_radius * 2);
            ctx.fill();
            ctx.shadowColor = 'rgba(0,0,0,0)';
            ctx.stroke();
            ctx.fillStyle = node.boxcolor || this.theme.NODE_DEFAULT_BOXCOLOR || fgcolor;
            ctx.beginPath();
            ctx.rect(collapsed_radius * 0.5, collapsed_radius * 0.5, collapsed_radius, collapsed_radius);
            ctx.fill();
        }
    }
    drawConnections(ctx) {
        ctx.lineWidth = this.connections_width;
        ctx.globalAlpha = this.editor_alpha;
        for (let id in this.container._nodes) {
            let node = this.container._nodes[id];
            if (node.outputs) {
                for (let i in node.outputs) {
                    let outputs = node.outputs[i];
                    if (!outputs || !outputs.links)
                        continue;
                    for (let j in outputs.links) {
                        const link = outputs.links[j];
                        if (!link)
                            continue;
                        let start_node = this.container.getNodeById(link.target_node_id);
                        if (!start_node)
                            continue;
                        if (!this.shouldShowLink(node, start_node)) {
                            continue;
                        }
                        let start_node_slotpos = null;
                        if (link.target_slot == -1)
                            start_node_slotpos = [start_node.pos[0] + 10, start_node.pos[1] + 10];
                        else
                            start_node_slotpos = this.getConnectionPos(start_node, true, link.target_slot);
                        let color = this.theme.LINK_TYPE_COLORS[Renderer.mapToColor(node.outputs[i].type)];
                        this.renderLink(ctx, this.getConnectionPos(node, false, +i), start_node_slotpos, color, node.id === start_node.id, node);
                    }
                }
            }
        }
        ctx.globalAlpha = 1;
    }
    shouldShowLink(node, inputNode) {
        if (this.showLinks)
            return true;
        else if (this.selected_nodes[node.id] || this.selected_nodes[inputNode.id]) {
            return true;
        }
        return false;
    }
    renderLink(ctx, a, b, color, isSelf = false, node) {
        if (!this.highquality_render) {
            ctx.beginPath();
            ctx.moveTo(a[0], a[1]);
            ctx.lineTo(b[0], b[1]);
            ctx.stroke();
            return;
        }
        let dist = utils_1.default.distance(a, b);
        if (this.render_connections_border && this.scale > 0.6)
            ctx.lineWidth = this.connections_width + this.connections_shadow;
        ctx.beginPath();
        if (this.render_curved_connections) {
            if (isSelf) {
                if (node.flags.collapsed) {
                    ctx.moveTo(a[0], a[1]);
                    ctx.quadraticCurveTo(a[0] + 20, a[1] + 10, a[0], a[1] + 20);
                    ctx.lineTo(b[0], b[1] + 20);
                    ctx.quadraticCurveTo(b[0] - 20, b[1] + 10, b[0], b[1]);
                }
                else {
                    ctx.moveTo(a[0], a[1]);
                    const nodeHeight = node.pos[1] + node.size[1];
                    const rightMax = a[0] + 20;
                    const bottomMax = nodeHeight + 24;
                    const leftMin = b[0] - 20;
                    ctx.quadraticCurveTo(rightMax, a[1], rightMax, a[1] + 20);
                    ctx.lineTo(rightMax, bottomMax - 20);
                    ctx.quadraticCurveTo(rightMax, bottomMax, a[0], bottomMax);
                    ctx.lineTo(b[0], bottomMax);
                    ctx.quadraticCurveTo(leftMin, bottomMax, leftMin, bottomMax - 20);
                    ctx.lineTo(leftMin, b[1] + 20);
                    ctx.quadraticCurveTo(leftMin, b[1], b[0], b[1]);
                }
            }
            else {
                ctx.moveTo(a[0], a[1]);
                ctx.bezierCurveTo(a[0] + dist * 0.25, a[1], b[0] - dist * 0.25, b[1], b[0], b[1]);
            }
        }
        else {
            if (isSelf) {
                ctx.moveTo(a[0], a[1]);
                const nodeHeight = node.flags.collapsed ? a[1] : node.pos[1] + node.size[1];
                const rightMax = a[0] + 20;
                const bottomMax = nodeHeight + 20;
                const leftMin = b[0] - 20;
                ctx.lineTo(rightMax, a[1]);
                ctx.lineTo(rightMax, bottomMax);
                ctx.lineTo(leftMin, bottomMax);
                ctx.lineTo(leftMin, b[1]);
                ctx.lineTo(b[0], b[1]);
            }
            else {
                ctx.moveTo(a[0], a[1]);
                ctx.lineTo((a[0] + (b[0] - 10)) * 0.5, a[1]);
                ctx.lineTo((a[0] + (b[0] - 10)) * 0.5, b[1]);
                ctx.lineTo(b[0], b[1]);
            }
        }
        if (this.render_connections_border && this.scale > 0.6) {
            ctx.strokeStyle = 'rgba(0,0,0,0.5)';
            ctx.stroke();
        }
        ctx.lineWidth = this.connections_width;
        ctx.fillStyle = ctx.strokeStyle = color;
        ctx.stroke();
        if (this.render_connection_arrows && this.scale > 0.6) {
            let pos = this.computeConnectionPoint(a, b, 0.5);
            let pos2 = this.computeConnectionPoint(a, b, 0.51);
            let angle = 0;
            if (this.render_curved_connections)
                angle = -Math.atan2(pos2[0] - pos[0], pos2[1] - pos[1]);
            else
                angle = b[1] > a[1] ? 0 : Math.PI;
            ctx.save();
            ctx.translate(pos[0], pos[1]);
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.moveTo(-5, -5);
            ctx.lineTo(0, +5);
            ctx.lineTo(+5, -5);
            ctx.fill();
            ctx.restore();
        }
    }
    resize(width, height) {
        if (this.isMiniMap)
            return;
        if (!width && !height) {
            let parent = this.canvas.parentNode;
            width = parent.clientWidth;
            height = window.innerHeight - this.BOTTOM_PADDING;
        }
        if (this.canvas.width == width && this.canvas.height == height)
            return;
        this.canvas.width = width;
        this.canvas.height = height;
        this.bgcanvas.width = this.canvas.width;
        this.bgcanvas.height = this.canvas.height;
        this.setOffsetValue();
        this.setDirty(true, true);
    }
    switchLiveMode(transition) {
        if (!transition) {
            this.live_mode = !this.live_mode;
            this.dirty_canvas = true;
            this.dirty_bgcanvas = true;
            return;
        }
        let self = this;
        let delta = this.live_mode ? 1.1 : 0.9;
        if (this.live_mode) {
            this.live_mode = false;
            this.editor_alpha = 0.1;
        }
        let t = setInterval(function () {
            self.editor_alpha *= delta;
            self.dirty_canvas = true;
            self.dirty_bgcanvas = true;
            if (delta < 1 && self.editor_alpha < 0.01) {
                clearInterval(t);
                if (delta < 1)
                    self.live_mode = true;
            }
            if (delta > 1 && self.editor_alpha > 0.99) {
                clearInterval(t);
                self.editor_alpha = 1;
            }
        }, 1);
    }
    onNodeSelectionChange(node) {
        return;
    }
    touchHandler(event) {
        let touches = event.changedTouches, first = touches[0], type = '';
        switch (event.type) {
            case 'touchstart':
                type = 'mousedown';
                break;
            case 'touchmove':
                type = 'mousemove';
                break;
            case 'touchend':
                type = 'mouseup';
                break;
            default:
                return;
        }
        let window = this.getCanvasWindow();
        let document = window.document;
        let simulatedEvent = document.createEvent('MouseEvent');
        simulatedEvent.initMouseEvent(type, true, true, window, 1, first.screenX, first.screenY, first.clientX, first.clientY, false, false, false, false, 0, null);
        first.target.dispatchEvent(simulatedEvent);
        event.preventDefault();
    }
    onImport(node, e, prev_menu, canvas, first_event) {
        this.editor.popUpImport(this.convertEventToCanvas(first_event));
    }
    getCanvasMenuOptions() {
        let options = [];
        if (this.getMenuOptions)
            options = this.getMenuOptions();
        else {
            options.push({ content: 'Add', is_menu: true, callback: this.onMenuAdd.bind(this) });
            options.push(null);
            this.addCommonMenuOptions(options);
            options.push({
                content: 'Import',
                callback: this.onImport.bind(this),
            });
            if (this._containers_stack && this._containers_stack.length > 0)
                options.push({
                    content: 'Close Container',
                    callback: () => {
                        this.closeContainer(true);
                    },
                });
        }
        if (this.getExtraMenuOptions) {
            let extra = this.getExtraMenuOptions(this, this.editor);
            if (extra) {
                extra.push(null);
                options.push(...extra);
            }
        }
        return options;
    }
    addCommonMenuOptions(options, node = null) {
        options.push({
            content: 'Toggle Map',
            callback: () => {
                this.editor.toggleMiniMap();
            },
        });
        options.push(null);
        options.push({ content: 'Select All', callback: this.selectAllNodes.bind(this) });
        let nodes = this.selected_nodes;
        const nodeIds = Object.keys(this.selected_nodes) || [];
        if (!nodeIds.length && node) {
            nodes = { [node.id]: node };
        }
        else if (nodeIds.length && node && nodeIds.indexOf(`${node.id}`) === -1) {
            nodes = { [node.id]: node };
        }
        options.push({
            content: 'Copy',
            callback: () => this.copyPasteExtension.onCopyNodes(nodes),
        });
        options.push({ content: 'Paste', callback: () => this.copyPasteExtension.onPasteNodes() });
        options.push(null);
    }
    getNodeMenuOptions(node) {
        let options = [];
        options.push({
            content: 'Settings',
            callback: () => {
                this.editor.showNodeSettings(node);
            },
        });
        options.push(null);
        if (node.description) {
            options.push({
                content: 'Help',
                callback: () => {
                    this.editor.showNodeHelp(node);
                },
            });
            options.push(null);
        }
        if (node.contextMenu && Object.keys(node.contextMenu).length > 0) {
            for (let option in node.contextMenu) {
                options.push({
                    content: node.contextMenu[option].title,
                    callback: () => {
                        node.contextMenu[option].onClick.call(node);
                    },
                });
            }
            options.push(null);
        }
        if (node['getMenuOptions'])
            options = node['getMenuOptions'](this);
        if (node['getExtraMenuOptions']) {
            let extra = node['getExtraMenuOptions'](this, this.editor);
            if (extra) {
                options.push(...extra);
            }
        }
        this.addCommonMenuOptions(options, node);
        if (node.clonable || Object.keys(this.selected_nodes).length) {
            options.push({ content: 'Export', callback: this.onMenuNodeExport.bind(this) });
            options.push({ content: 'Clone', callback: this.onMenuNodeClone.bind(this) });
        }
        options.push({ content: 'Collapse', callback: this.onMenuNodeCollapse.bind(this) });
        options.push({
            content: 'Move to Container',
            callback: this.onMenuNodeMoveToContainer.bind(this),
        });
        options.push({ content: 'Remove', callback: this.onMenuNodeRemove.bind(this) });
        if (node['onGetInputs']) {
            let inputs = node['onGetInputs']();
            if (inputs && inputs.length)
                options[0].disabled = false;
        }
        if (node['onGetOutputs']) {
            let outputs = node['onGetOutputs']();
            if (outputs && outputs.length)
                options[1].disabled = false;
        }
        return options;
    }
    processContextualMenu(node, event) {
        let that = this;
        let win = this.getCanvasWindow();
        let menu_info = null;
        let options = { event: event, callback: inner_option_clicked.bind(this) };
        let slot = null;
        if (node)
            slot = this.getSlotInPosition(node, event.canvasX, event.canvasY);
        if (slot) {
        }
        else
            menu_info = node ? this.getNodeMenuOptions(node) : this.getCanvasMenuOptions();
        if (!menu_info)
            return;
        let menu = this.createContextualMenu(menu_info, options, win);
        function inner_option_clicked(v, e) {
            if (!v)
                return;
            if (v == slot) {
                if (v.input)
                    node.removeInput(slot.slot);
                else if (v.output)
                    node.removeOutput(slot.slot);
                return;
            }
            if (v.callback)
                return v.callback(node, e, menu, that, event);
        }
    }
    getFileExtension(url) {
        let question = url.indexOf('?');
        if (question != -1)
            url = url.substr(0, question);
        let point = url.lastIndexOf('.');
        if (point == -1)
            return '';
        return url.substr(point + 1).toLowerCase();
    }
    getParentContainersNodesType() {
        function addTypes(parentContainerNode, parentContainersNodesTypes) {
            if (parentContainerNode) {
                parentContainersNodesTypes.push(parentContainerNode.type);
                addTypes(parentContainerNode.container.container_node, parentContainersNodesTypes);
            }
            return parentContainersNodesTypes;
        }
        if (this.editor.renderer) {
            const parentContainerNode = this.editor.renderer.container.container_node;
            return addTypes(parentContainerNode, []);
        }
        else {
            return [];
        }
    }
    filterRequiredNodesOnCategory(category) {
        const nodeTypes = container_1.Container.getNodeTypesInCategory(category);
        const returnNodeTypes = [];
        const parentContainersNodesTypes = this.getParentContainersNodesType();
        for (let i in nodeTypes) {
            if (!nodeTypes[i].show_in_menu)
                continue;
            if (parentContainersNodesTypes.length) {
                const isNotRequiredChild = nodeTypes[i].parentContainerNodeType &&
                    !parentContainersNodesTypes.includes(nodeTypes[i].parentContainerNodeType);
                if (nodeTypes[i].recursive) {
                    if (isNotRequiredChild) {
                        continue;
                    }
                }
                else {
                    const isSameNodeExistOnParent = parentContainersNodesTypes.includes(nodeTypes[i].type);
                    if (isNotRequiredChild || isSameNodeExistOnParent) {
                        continue;
                    }
                }
            }
            else if (!parentContainersNodesTypes.length && nodeTypes[i].parentContainerNodeType) {
                continue;
            }
            returnNodeTypes.push(nodeTypes[i]);
        }
        return returnNodeTypes;
    }
    onMenuAdd(node, e, prev_menu, canvas, first_event) {
        let window = canvas.getCanvasWindow();
        let values = container_1.Container.getNodeTypesCategories();
        let entries = {};
        for (let i in values)
            if (values[i])
                entries[i] = { value: values[i], content: values[i], is_menu: true };
        let menu = canvas.createContextualMenu(entries, { event: e, callback: inner_clicked.bind(this), from: prev_menu }, window);
        function inner_clicked(v, e) {
            let category = v.value;
            const nodeTypes = this.filterRequiredNodesOnCategory(category);
            if (nodeTypes.length) {
                const values = [];
                nodeTypes.forEach(nodeType => {
                    values.push({
                        content: nodeType.node_name,
                        value: nodeType.type,
                    });
                });
                canvas.createContextualMenu(values, { event: e, callback: inner_create.bind(this), from: menu }, window);
                return false;
            }
        }
        function inner_create(v, e) {
            let type = v.value;
            let pos = canvas.convertEventToCanvas(first_event);
            pos[0] = Math.round(pos[0]);
            pos[1] = Math.round(pos[1]);
            this.editor.socket.sendCreateNode(type, pos);
        }
        return false;
    }
    onMenuNodeCollapse(node) {
        node.flags.collapsed = !node.flags.collapsed;
        node.setDirtyCanvas(true, true);
    }
    onMenuNodeRemove(node, e, prev_menu, renderer, first_event) {
        const ids = Renderer.getSelectedNodesIds(renderer, node);
        this.editor.socket.sendRemoveNodes(ids);
    }
    onMenuNodeMoveToContainer(node, e, prev_menu, renderer, first_event) {
        const ids = Renderer.getSelectedNodesIds(renderer, node);
        this.editor.socket.sendMoveToNewContainer(ids);
    }
    onMenuNodeExport(node, e, prev_menu, renderer, first_event) {
        node_exporter_1.default.exportNodes(this.selected_nodes, this.editor).then(({ hasNonCloneable }) => {
            this.editor.displayMessage(`Clipboard Copy Successful.${hasNonCloneable ? ' Ignoring non cloneable' : ''}`);
        }, e => {
            this.editor.displayMessage(e);
        });
    }
    onMenuNodeClone(node, e, prev_menu, renderer, first_event) {
        const ids = Renderer.getSelectedNodesIds(renderer, node);
        this.editor.socket.sendCloneNode(ids, this.convertEventToCanvas(first_event));
    }
    createContextualMenu(values, options, ref_window) {
        options = options || {};
        this.options = options;
        ref_window = ref_window || window;
        if (!options.from)
            this.closeAllContextualMenus();
        else {
            let menus = document.querySelectorAll('.contextualmenu');
            for (let key in menus) {
                if (menus[key].previousSibling == options.from)
                    menus[key].closeMenu();
            }
        }
        let root = ref_window.document.createElement('div');
        root.className = 'contextualmenu menubar-panel';
        this.root = root;
        let style = root.style;
        style.minWidth = '100px';
        style.minHeight = '20px';
        style.position = 'fixed';
        style.top = '100px';
        style.zIndex = '1000';
        style.color = this.theme.MENU_TEXT_COLOR;
        style.padding = '2px';
        style.borderBottom = '1px solid ' + this.theme.MENU_TEXT_COLOR;
        style.backgroundColor = this.theme.MENU_BG_COLOR;
        if (options.title) {
            let element = document.createElement('div');
            element.className = 'contextualmenu-title';
            element.innerHTML = options.title;
            root.appendChild(element);
        }
        root.addEventListener('contextmenu', function (e) {
            e.preventDefault();
            return false;
        });
        for (let i in values) {
            let item = values[i];
            let element = ref_window.document.createElement('div');
            element.className = 'menu-entry';
            if (item == null) {
                element.className = 'menu-entry separator';
                root.appendChild(element);
                continue;
            }
            if (item.is_menu)
                element.className += ' submenu';
            if (item.disabled)
                element.className += ' disabled';
            element.style.cursor = 'pointer';
            element.dataset['value'] = typeof item == 'string' ? item : item.value;
            element.data = item;
            if (typeof item == 'string')
                element.innerHTML = values.constructor == Array ? values[i] : i;
            else
                element.innerHTML = item.content ? item.content : i;
            element.addEventListener('click', on_click);
            root.appendChild(element);
        }
        root.addEventListener('mouseover', function (e) {
            this.mouse_inside = true;
        });
        root.addEventListener('mouseout', function (e) {
            let aux = e.relatedTarget;
            if (aux == this)
                return;
            this.mouse_inside = false;
        });
        ref_window.document.body.appendChild(root);
        let root_rect = root.getClientRects()[0];
        if (options.from) {
            options.from.block_close = true;
        }
        let left = options.left || 0;
        let top = options.top || 0;
        if (options.event) {
            left = options.event.pageX - 10;
            top = options.event.pageY - 10;
            if (options.left)
                left = options.left;
            let rect = ref_window.document.body.getClientRects()[0];
            if (options.from) {
                let parent_rect = options.from.getClientRects()[0];
                left = parent_rect.left + parent_rect.width;
            }
            if (left > rect.width - root_rect.width - 10)
                left = rect.width - root_rect.width - 10;
            if (top > rect.height - root_rect.height - 10)
                top = rect.height - root_rect.height - 10;
        }
        root.style.left = left + 'px';
        root.style.top = top + 'px';
        let that = this;
        function on_click(e) {
            let value = this.dataset['value'];
            let close = true;
            if (options.callback) {
                let ret = options.callback.call(root, this.data, e);
                if (ret !== undefined)
                    close = ret;
            }
            if (close) {
                that.closeAllContextualMenus();
            }
        }
        root.closeMenu = function () {
            if (options.from) {
                options.from.block_close = false;
                if (!options.from.mouse_inside)
                    options.from.closeMenu();
            }
            if (this.parentNode)
                ref_window.document.body.removeChild(this);
        };
        return root;
    }
    closeAllContextualMenus() {
        let elements = document.querySelectorAll('.contextualmenu');
        if (!elements.length)
            return;
        let result = [];
        for (let i = 0; i < elements.length; i++)
            result.push(elements[i]);
        for (let i in result)
            if (result[i].parentNode)
                result[i].parentNode.removeChild(result[i]);
    }
    getConnectionPos(node, is_input, slot_number) {
        if (node.flags.collapsed) {
            if (is_input)
                return [node.pos[0], node.pos[1] - this.theme.NODE_TITLE_HEIGHT * 0.5];
            else
                return [
                    node.pos[0] + this.theme.NODE_COLLAPSED_WIDTH,
                    node.pos[1] - this.theme.NODE_TITLE_HEIGHT * 0.5,
                ];
        }
        if (is_input && slot_number == -1) {
            return [node.pos[0] + 10, node.pos[1] + 10];
        }
        if (is_input && node.inputs[slot_number] && node.inputs[slot_number].pos)
            return [
                node.pos[0] + node.inputs[slot_number].pos[0],
                node.pos[1] + node.inputs[slot_number].pos[1],
            ];
        else if (!is_input && node.outputs[slot_number] && node.outputs[slot_number].pos)
            return [
                node.pos[0] + node.outputs[slot_number].pos[0],
                node.pos[1] + node.outputs[slot_number].pos[1],
            ];
        if (!is_input)
            return [
                node.pos[0] + node.size[0] + 1,
                node.pos[1] + 10 + slot_number * this.theme.NODE_SLOT_HEIGHT,
            ];
        const offsetForInputs = is_input ? (node.outputs ? Object.keys(node.outputs).length : 0) : 0;
        return [
            node.pos[0],
            node.pos[1] + 10 + (slot_number + offsetForInputs) * this.theme.NODE_SLOT_HEIGHT,
        ];
    }
    loadImage(url, onReadyCallback = () => { }) {
        let img = new Image();
        img.src = this.theme.NODE_IMAGES_PATH + url;
        img.ready = false;
        img.onload = function () {
            this.ready = true;
            onReadyCallback();
        };
        return img;
    }
    getBounding(node) {
        if (!node.size || !node.pos)
            return;
        return [
            node.pos[0] - 4,
            node.pos[1] - this.getNodeHeaderHeight(node),
            node.pos[0] + node.size[0] + 4,
            node.pos[1] + node.size[1] + this.getNodeHeaderHeight(node),
        ];
    }
    isPointInsideNode(node, x, y, margin) {
        margin = margin || 0;
        let margin_top = 20;
        if (node.flags.collapsed) {
            if (utils_1.default.isInsideRectangle(x, y, node.pos[0] - margin, node.pos[1] - this.getNodeHeaderHeight(node) - margin, this.theme.NODE_COLLAPSED_WIDTH + 2 * margin, this.getNodeHeaderHeight(node) + 2 * margin))
                return true;
        }
        else if (node.pos[0] - 4 - margin < x &&
            node.pos[0] + node.size[0] + 4 + margin > x &&
            node.pos[1] - this.getNodeNameHeight(node) - margin_top - margin < y &&
            node.pos[1] + node.size[1] + margin > y)
            return true;
        return false;
    }
    getSlotInPosition(node, x, y) {
        if (node.inputs)
            for (let i in node.inputs) {
                let input = node.inputs[i];
                let link_pos = this.getConnectionPos(node, true, +i);
                if (utils_1.default.isInsideRectangle(x, y, link_pos[0] - 10, link_pos[1] - 5, 20, 10))
                    return { input: input, slot: +i, link_pos: link_pos, locked: input.locked };
            }
        if (node.outputs)
            for (let o in node.outputs) {
                let output = node.outputs[o];
                let link_pos = this.getConnectionPos(node, false, +o);
                if (utils_1.default.isInsideRectangle(x, y, link_pos[0] - 10, link_pos[1] - 5, 20, 10))
                    return { output: output, slot: +o, link_pos: link_pos, locked: output.locked };
            }
        return null;
    }
    getNodeOnPos(x, y, nodes_list) {
        if (nodes_list) {
            for (let i = nodes_list.length - 1; i >= 0; i--) {
                let n = nodes_list[i];
                if (this.isPointInsideNode(n, x, y, 2))
                    return n;
            }
        }
        else {
            for (let id in this.container._nodes) {
                let node = this.container._nodes[id];
                if (this.isPointInsideNode(node, x, y, 2))
                    return node;
            }
        }
        return null;
    }
    localToScreen(node, x, y, canvas) {
        return [
            (x + node.pos[0]) * canvas.scale + canvas.offset[0],
            (y + node.pos[1]) * canvas.scale + canvas.offset[1],
        ];
    }
    showNodeActivity(node) {
        node.boxcolor = this.theme.NODE_ACTIVE_BOXCOLOR;
        node.setDirtyCanvas(true, true);
        setTimeout(function () {
            node.boxcolor = this.theme.NODE_DEFAULT_BOXCOLOR;
            node.setDirtyCanvas(true, true);
        }, 50);
    }
    toggleNodeCategoryInPanel(type) {
        const index = this.openNodeCategories.indexOf(type);
        if (index > -1) {
            this.openNodeCategories.splice(index, 1);
        }
        else {
            this.openNodeCategories.push(type);
        }
        this.nodeCategoriesPanel = this.evaluateNodeCategories();
        if (this.getNodePanelHeight() <= this.canvas.height) {
            this.nodePanelOffset = 0;
        }
    }
    evaluateNodeCategories() {
        let startOffset = this.NODE_PANEL_MARGIN_TOP;
        let endOffset = this.NODE_PANEL_MARGIN_TOP;
        return (container_1.Container.getNodeTypesCategories()
            .filter(category => category)
            .map(category => {
            startOffset = endOffset;
            let shouldAdd = true;
            const categoryHeight = this.NODE_PANEL_HEADER_HEIGHT;
            endOffset += categoryHeight;
            const isOpen = this.openNodeCategories.indexOf(category) !== -1 || !!this.searchText;
            const nodeTypesInCategory = this.filterRequiredNodesOnCategory(category)
                .filter(child => {
                return (child.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
                    category.toLowerCase().includes(this.searchText.toLowerCase()));
            })
                .map(child => {
                const startY = endOffset;
                const itemHeight = this.theme.NODE_TITLE_HEIGHT + this.NODE_PANEL_ITEM_MARGIN * 6;
                if (isOpen) {
                    endOffset += itemHeight;
                }
                const output = {
                    endY: endOffset,
                    height: itemHeight,
                    icon: child.icon,
                    color: child.color,
                    name: child.node_name,
                    startY,
                    type: child.type,
                    category: child.category,
                };
                return output;
            });
            if (!!this.searchText && nodeTypesInCategory.length === 0) {
                endOffset = startOffset;
                shouldAdd = false;
            }
            const output = {
                children: nodeTypesInCategory,
                name: category,
                isOpen,
                height: this.NODE_PANEL_HEADER_HEIGHT,
                startY: startOffset,
                endY: endOffset,
                shouldAdd,
            };
            return output;
        })
            .filter(node => node.shouldAdd));
    }
    reDrawSearchPanel() {
        this.nodeCategoriesPanel = this.evaluateNodeCategories();
        this.draw(true, false);
    }
    onSearch(searchText) {
        this.searchText = searchText || '';
        this.reDrawSearchPanel();
    }
    toggleNodePanel(width, showingNodePanel) {
        this.NODE_PANEL_WIDTH = width;
        this.SHOW_PANEL = showingNodePanel;
        this.draw(true, false);
    }
    toggleNodeLinks(showLinks) {
        this.showLinks = showLinks;
        this.draw(true, true);
    }
    static mapToColor(type) {
        switch (type) {
            case node_1.Type.STRING:
                return 0;
            case node_1.Type.NUMBER:
                return 1;
            case node_1.Type.BOOLEAN:
                return 2;
        }
        return 0;
    }
    storeValue(key, data) {
        if (!this.isMiniMap) {
            Storage_1.default.set(key, data);
        }
    }
    getValue(key, defaultValue) {
        if (this.isMiniMap) {
            return defaultValue;
        }
        return Storage_1.default.get(key, defaultValue);
    }
    updateWidth(width) {
        if (this.canvas.width == width)
            return;
        this.canvas.width = width;
        this.bgcanvas.width = this.canvas.width;
        this.setOffsetValue();
        this.draw(true, true);
    }
    changeSelectedNodes(selectedNodes = []) {
        Object.keys(this.selected_nodes).forEach(key => {
            this.processNodeDeselected(this.selected_nodes[key]);
        });
        selectedNodes.forEach(node => {
            this.processNodeSelected(node, true);
        });
    }
    limitOffset(x, y) {
        const resolvedX = Math.min(Math.max(Math.min(x, this.MAX_OFFSET_WIDTH), this.canvas.width / this.scale - this.MAX_OFFSET_WIDTH), this.DEFAULT_OFFSET);
        const resolvedY = Math.min(Math.max(Math.min(y, this.MAX_OFFSET_HEIGHT), this.canvas.height / this.scale - this.MAX_OFFSET_HEIGHT), this.DEFAULT_OFFSET);
        return [resolvedX, resolvedY];
    }
    onTranslateCallback(callback) {
        this.translateCallback = callback;
    }
    onOffsetChangedCallback(callback) {
        this.offsetChangedCallback = callback;
    }
    setBoundaryRectangle(canvasBoundaryRect) {
        this.canvasBoundaryRect = canvasBoundaryRect;
        this.dirty_canvas = true;
    }
    setOffset(pageOffset) {
        this.setOffsetValue(pageOffset[0], pageOffset[1]);
        this.dirty_canvas = true;
        this.dirty_bgcanvas = true;
    }
}
exports.Renderer = Renderer;
CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius = 5, radius_low) {
    if (radius_low === undefined)
        radius_low = radius;
    this.beginPath();
    this.moveTo(x + radius, y);
    this.lineTo(x + width - radius, y);
    this.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.lineTo(x + width, y + height - radius_low);
    this.quadraticCurveTo(x + width, y + height, x + width - radius_low, y + height);
    this.lineTo(x + radius_low, y + height);
    this.quadraticCurveTo(x, y + height, x, y + height - radius_low);
    this.lineTo(x, y + radius);
    this.quadraticCurveTo(x, y, x + radius, y);
};
if (!window['requestAnimationFrame']) {
    window.requestAnimationFrame =
        window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
}
//# sourceMappingURL=renderer.js.map