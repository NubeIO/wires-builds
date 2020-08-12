"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AjaxRequest_1 = require("../../../client/helpers/AjaxRequest");
const log = require('logplease').create('client', { color: 3 });
class ChartLogPage {
    constructor() {
        this.reconnecting = false;
        this.container_id = window.container_id;
        this.node_id = window.node_id;
        this.max_records = window.max_records;
        this.createControles();
        this.createSocket();
    }
    createSocket() {
        let socket = io('/dashboard');
        this.socket = socket;
        let that = this;
        socket.on('connect', function () {
            log.debug('Connected to socket');
            log.debug('Join to dashboard room [' + that.container_id + ']');
            socket.emit('room', that.container_id);
            if (that.reconnecting) {
                noty({ text: 'Connection is restored.', type: 'alert' });
                that.reconnecting = false;
            }
        });
        socket.on('disconnect', function () {
            noty({ text: 'Connection is lost!', type: 'error' });
            that.reconnecting = true;
        });
        socket.on('nodeMessageToDashboardSide', function (n) {
            if (n.cid != that.container_id || n.id != that.node_id)
                return;
            let data = n.message;
            if (data.clear)
                $('#history-table').html('');
            if (data.value)
                that.addRecord(data.value);
        });
        socket.on('nodeSettings', function (n) {
            if (n.cid != that.container_id || n.id != that.node_id)
                return;
            if (n.settings['maxRecords']) {
                that.max_records = n.settings['maxRecords'].value;
                that.removeOldRecords();
            }
        });
    }
    addRecord(record) {
        let date = moment(record.y).format('DD.MM.YYYY - H:mm:ss.SSS');
        $('#history-table').append('<tr><td>' + date + '</td><td>' + record.y + '</td></tr>');
        this.removeOldRecords();
    }
    removeOldRecords() {
        let rows = $('#history-table tr');
        let unwanted = rows.length - this.max_records;
        if (unwanted > 0) {
            for (let i = 0; i < unwanted; i++) {
                rows[i].remove();
            }
        }
    }
    createControles() {
        let that = this;
        $('#clear-button').click(function () {
            AjaxRequest_1.default.ajax({
                url: '/api/editor/c/' + that.container_id + '/n/' + that.node_id + '/clear',
                type: 'POST',
            });
        });
    }
}
exports.ChartLogPage = ChartLogPage;
exports.page = new ChartLogPage();
//# sourceMappingURL=chart-log-page.js.map