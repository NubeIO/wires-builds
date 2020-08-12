"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AjaxRequest_1 = require("../../../client/helpers/AjaxRequest");
const log = require('logplease').create('client', { color: 3 });
class ChartIndexPage {
    constructor() {
        this.DELAY = 100;
        this.reconnecting = false;
        this.container_id = window.container_id;
        this.node_id = window.node_id;
        this.range_start = window.range_start;
        this.range_end = window.range_end;
        this.autoscroll = window.autoscroll;
        this.style = window.style;
        this.max_records = window.max_records;
        this.createChart();
        this.createControles();
        this.getDataFromServer();
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
                that.dataset.clear();
            if (data.value)
                that.addChartData(data.value);
            if (data.style) {
                console.log(data.style);
                $('#chartstyle').dropdown('set selected', data.style);
            }
        });
        socket.on('nodeSettings', function (n) {
            if (n.cid != that.container_id || n.id != that.node_id)
                return;
            if (n.settings['maxRecords'])
                that.max_records = n.settings['maxRecords'].value;
        });
    }
    createChart() {
        this.groups = new vis.DataSet();
        this.groups.add({ id: 0 });
        this.chart_body = document.getElementById('visualization');
        this.dataset = new vis.DataSet();
        this.options = {
            start: this.range_start,
            end: this.range_end,
        };
        this.graph2d = new vis.Graph2d(this.chart_body, this.dataset, this.groups, this.options);
        this.renderStep();
    }
    renderStep() {
        let now = vis.moment();
        let range = this.graph2d.getWindow();
        let interval = range.end - range.start;
        switch (this.autoscroll) {
            case 'continuous':
                this.graph2d.setWindow(now - interval, now, { animation: false });
                requestAnimationFrame(this.renderStep.bind(this));
                break;
            case 'discrete':
                this.graph2d.setWindow(now - interval, now, { animation: false });
                setTimeout(this.renderStep.bind(this), this.DELAY);
                break;
            case 'none':
                setTimeout(this.renderStep.bind(this), this.DELAY);
                break;
            default:
                if (now > range.end) {
                    this.graph2d.setWindow(now - 0.1 * interval, now + 0.9 * interval);
                }
                setTimeout(this.renderStep.bind(this), this.DELAY);
                break;
        }
    }
    getDataFromServer() {
        let that = this;
        AjaxRequest_1.default.ajax({
            url: '/api/editor/c/' + this.container_id + '/n/' + this.node_id + '/log',
            type: 'GET',
            success: function (data) {
                $('#infoPanel').hide();
                $('#chartPanel').fadeIn(300);
                if (data) {
                    that.dataset.add(data);
                    that.graph2d.setOptions(that.options);
                }
                else
                    that.showAll();
                $('#chartstyle').dropdown('set selected', that.style);
                $('#autoscroll').dropdown('set selected', that.autoscroll);
            },
            error: function () {
                $('#infoPanel').html("<p class='text-danger'>Failed to get data from server!</p>");
            },
        });
        this.updateChartStyle();
    }
    addChartData(data) {
        this.dataset.add(data);
        let unwanted = this.dataset.length - this.max_records;
        if (unwanted > 0) {
            let items = this.dataset.get();
            for (let i = 0; i < unwanted; i++) {
                this.dataset.remove(items[i]);
            }
        }
    }
    updateChartStyle() {
        switch (this.style) {
            case 'bars':
                this.options = {
                    height: '370px',
                    style: 'bar',
                    drawPoints: false,
                    barChart: { width: 50, align: 'right', sideBySide: false },
                };
                break;
            case 'splines':
                this.options = {
                    height: '370px',
                    style: 'line',
                    drawPoints: { style: 'circle', size: 6 },
                    shaded: { enabled: false },
                    interpolation: { enabled: true },
                };
                break;
            case 'shadedsplines':
                this.options = {
                    style: 'line',
                    height: '370px',
                    drawPoints: { style: 'circle', size: 6 },
                    shaded: { enabled: true, orientation: 'bottom' },
                    interpolation: { enabled: true },
                };
                break;
            case 'lines':
                this.options = {
                    height: '370px',
                    style: 'line',
                    drawPoints: { style: 'square', size: 6 },
                    shaded: { enabled: false },
                    interpolation: { enabled: false },
                };
                break;
            case 'shadedlines':
                this.options = {
                    height: '370px',
                    style: 'line',
                    drawPoints: { style: 'square', size: 6 },
                    shaded: { enabled: true, orientation: 'bottom' },
                    interpolation: { enabled: false },
                };
                break;
            case 'dots':
                this.options = {
                    height: '370px',
                    style: 'points',
                    drawPoints: { style: 'circle', size: 10 },
                };
                break;
            default:
                break;
        }
        this.graph2d.setOptions(this.options);
    }
    redrawChart(options) {
        let window = this.graph2d.getWindow();
        options.start = window.start;
        options.end = window.end;
        this.graph2d.destroy();
        this.graph2d = new vis.Graph2d(this.chart_body, this.dataset, this.groups, options);
    }
    showNow() {
        clearTimeout(this.zoomTimer);
        $('#autoscroll').dropdown('set selected', 'none');
        let window = {
            start: vis.moment().add(-30, 'seconds'),
            end: vis.moment(),
        };
        this.graph2d.setWindow(window);
        this.zoomTimer = setTimeout(function (parameters) {
            $('#autoscroll').dropdown('set selected', 'continuous');
        }, 1000);
    }
    showAll() {
        clearTimeout(this.zoomTimer);
        $('#autoscroll').dropdown('set selected', 'none');
        let start, end;
        if (this.dataset.length == 0) {
            start = vis.moment().add(-1, 'seconds');
            end = vis.moment().add(60, 'seconds');
        }
        else {
            let min = this.dataset.min('x');
            let max = this.dataset.max('x');
            start = vis.moment(min.x).add(-1, 'seconds');
            end = vis.moment(max.x).add(60 * 2, 'seconds');
        }
        let window = {
            start: start,
            end: end,
        };
        this.graph2d.setWindow(window);
    }
    createControles() {
        let that = this;
        $('#chartstyle').change(function () {
            that.style = this.value;
            that.updateChartStyle();
            AjaxRequest_1.default.ajax({
                url: '/api/editor/c/' + that.container_id + '/n/' + that.node_id + '/style',
                type: 'POST',
                data: { style: that.style },
            });
        });
        $('#clear-button').click(function () {
            AjaxRequest_1.default.ajax({
                url: '/api/editor/c/' + that.container_id + '/n/' + that.node_id + '/clear',
                type: 'POST',
            });
        });
        $('#share-button').click(function () {
            let url = $(location).attr('host') + $(location).attr('pathname');
            let start = that.graph2d.getWindow().start;
            let end = that.graph2d.getWindow().end;
            url += '?autoscroll=' + $('#autoscroll').val();
            url += '&style=' + $('#chartstyle').val();
            url += '&start=' + start.getTime();
            url += '&end=' + end.getTime();
            $('#shareModal').modal('setting', 'transition', 'vertical flip').modal('show');
            $('#url').val(url);
        });
        $('#autoscroll').change(function () {
            that.autoscroll = this.value;
        });
        $('#show-all-button').click(function () {
            that.showAll();
        });
        $('#show-now-button').click(function () {
            that.showNow();
        });
    }
}
exports.ChartIndexPage = ChartIndexPage;
exports.page = new ChartIndexPage();
//# sourceMappingURL=chart-index-page.js.map