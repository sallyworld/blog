
// Navigator variables
var userAgent = navigator.userAgent.toLowerCase();
var appName   = navigator.appName.toLowerCase();

// Detect browser
var IE      = !!(appName == 'netscape' && userAgent.search('trident') != -1 || userAgent.indexOf('msie') != -1 || userAgent.indexOf('edge') != -1);
var CHROME  = !!(userAgent.indexOf('chrome') != -1 && userAgent.indexOf('edge') == -1);
var FIREFOX = !!(userAgent.indexOf('firefox') != -1);
var SAFARI  = !!(userAgent.indexOf('chrome') == -1 && userAgent.indexOf('safari') != -1);

// Detect device
var WINDOWS = !!(navigator.platform && 'win16|win32|win64'.indexOf(navigator.platform.toLowerCase()) != -1);
var MAC     = !!(navigator.platform && 'mac|macintel'.indexOf(navigator.platform.toLowerCase()) != -1);
var MOBILE  = !!(navigator.platform && 'win16|win32|win64|mac|macintel'.indexOf(navigator.platform.toLowerCase()) == -1);

(function() {

    var init = function() {
        var pass = true;
        var data;

        var regExp = [];

        regExp.case1 = /(\<[a-zA-Z]+[^>]+[\>])([^<]*)(\<\/[a-zA-Z]+\>)/g; // Select a pair of tags.
        regExp.case2 = /[!@#$%^*()\-_+\\\|\[\]{};:\'",.<>\/].*/g; // Select special characters.

        data = decodeURIComponent(location.search);

        if (new RegExp(regExp.case1).test(data)) {
            pass = false;
            data = data.replace(regExp.case1, '');
        }

        if (new RegExp(regExp.case2).test(data)) {
            pass = false;
            data = data.replace(regExp.case2, '');
        }

        if (!pass) location.search = data;
    };

    init();

    var common = function() {
        if (!Object.assign) {
            Object.defineProperty(Object, 'assign', {
                value: function(target) {
                    if (target == null) {
                        throw new TypeError('Can\'t convert undefined or null to object.');
                    }

                    target = Object(target);

                    for (var i = 1; i < arguments.length; i++) {
                        if (arguments[i]) {
                            for (var j in arguments[i]) {
                                if (Object.prototype.hasOwnProperty.call(arguments[i], j)) {
                                    target[j] = arguments[i][j];
                                }
                            }
                        }
                    }

                    return target;
                },
                writable: true,
                configurable: true
            });
        }

        if (!Array.prototype.find) {
            Object.defineProperty(Array.prototype, 'find', {
                value: function(predicate) {
                    if (this == null) throw new TypeError('"this" is null or undefined.');
                    if (typeof predicate !== 'function') throw new TypeError('predicate must be a function');

                    var i = 0;

                    while (i < Object(this).length >>> 0) {
                        var value = Object(this)[i];

                        if (predicate.call(arguments[1], value, i, Object(this))) {
                            return value;
                        }

                        i++;
                    }

                    return undefined;
                }
            });
        }

        if (!('remove' in Element.prototype)) {
            Element.prototype.remove = function() {
                if (this.parentNode) {
                    this.parentNode.removeChild(this);
                }
            }
        }

        // Capitalize the first letter of a string
        String.prototype.capitalize = function() {
            return this.charAt(0).toUpperCase() + this.slice(1);
        };

        $.ajaxSetup({
            dataType: 'json',
            cache: false,
            timeout: 100000
        });

        String.prototype.includes = String.prototype.includes || function(value) {
            return this.indexOf(value) != -1 ? true : false;
        };

        String.prototype.startsWith = String.prototype.startsWith || function(value, position) {
            position = position || 0;
            return this.substr(position, value.length) === value;
        };

        // Less than equal IE 10
        if (!window.location.origin) {
            window.location.origin = window.location.protocol + "//" +
                                     window.location.hostname + (window.location.port ? ':' + window.location.port: '');
        }
    };

    common.prototype = {

        global: {},
        dialog: {},
        params: {},
        client: {},
        config: {},

        addZero: function(i) {
            if (i < 10) i = '0' + Number(i);
            return i;
        },

        /**
        * Converts Handlebars syntax to HTML.
        *
        * @param {id} - element
        * @param {data} - object
        */
        compileHTML: function(id, data) {
            if (typeof window['Handlebars'] == 'object') {
                var script = document.getElementById(id).innerHTML;
                var html   = Handlebars.compile(script);

                return html(data);
            } else {
                throw new Error('Library could not be found. Additional library load is required. [ Handlebars ]');
            }
        },

        getUrlParam: function(name) {
            var value = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
            return value == null ? null : (value[1] || 0);
        },

        gridToExcel: function(table, data) {
            if (typeof window.jsGrid == 'object') {
                try {
                    if (typeof data == 'undefined') data = table.data('JSGrid').data;
                    if (data.length == 0) throw new Error('Data to convert to Excel could not be found.');

                    var fields = table.data('JSGrid').fields;

                    var html = '<table style="font-size: 1em; border-collapse: collapse">';

                    html += '<tr>';

                    var temp = [];

                    for (var i in fields) {
                        if (fields[i].title) temp.push(fields[i]);
                    }

                    fields = temp;

                    for (var i in fields) {
                        html += '<th style="height: 16.5pt; border: thin solid black">' + fields[i].title + '</th>';
                    }

                    html += '</tr>';

                    for (var i in data) {
                        html += '<tr>';

                        for (var k in fields) {
                            var keys = Object.keys(data[i]);

                            var isExecuting = true;

                            for (var m in keys) {
                                if (fields[k].name == keys[m]) {
                                    html += '<td style="height: 16.5pt; text-align: center; border: thin solid black; mso-number-format: \'\\@\' ">' +
                                            (typeof data[i][keys[m]] == 'undefined' ? '' : data[i][keys[m]]) + '</td>';

                                    isExecuting = false;
                                }
                            }

                            if (isExecuting) {
                                html += '<td style="height: 16.5pt; text-align: center; border: thin solid black; mso-number-format: \'\\@\' "></td>';
                            }
                        }

                        html += '</tr>';
                    }

                    html += '</table>';

                    // BOM(Byte Order Mark, 바이트 순서 표식) 적용: '\uFEFF'

                    var date     = new Date(Date.now() - (new Date().getTimezoneOffset() * 1000 * 60)).toISOString();
                    var filename = date.replace(/-/g, '').replace('T', '').replace(/:/g, '').substring(0, 14);

                    if (IE) {
                        if (typeof Blob != 'undefined') {
                            var blob = new Blob(['\uFEFF' + html], { type: 'text/html' });
                            navigator.msSaveOrOpenBlob(blob, filename + '.xls');
                        }
                    } else {
                        var link = document.createElement('a');

                        document.body.appendChild(link);
                        link.setAttribute('type', 'hidden');

                        link.download = filename;
                        link.href     = 'data:application/vnd.ms-excel,' + '\uFEFF' + encodeURIComponent(html);
                        link.click();
                        link.remove();
                    }
                } catch (error) {
                    throw new Error(error.message);
                }
            } else {
                throw new Error('Library could not be found. Additional library load is required. [ jsGrid ]');
            }
        },

        /**
         * Load the JS script file.
         *
         * @param {object} script
         * @param {array}  script
         * @param {string} script
         */
        import: function(script) {
            var load = function(elem, i) {
                var deferred_ = $.Deferred();

                try {
                    var url;

                    if (typeof elem == 'object') {
                        var defaults = [];

                        defaults.path    = '';
                        defaults.name    = null;
                        defaults.version = null;
                        defaults.minify  = false;

                        var item = $.extend(true, defaults, elem);

                        if (item.name && item.version) {
                            url = item.path + '/js/lib/' +
                                  item.name + '/' +
                                  item.version + '/' +
                                  item.name +
                                  (item.minify ? '.min' : '') + '.js';
                        } else throw new Error('Library name or version could not be found.' + (i ? ' [ ' + (Number(i) + 1) + ' ]' : ''));
                    } else url = elem;

                    $.ajax({
                        type: 'GET',
                        url: url,
                        dataType: 'script',
                        async: false,
                        complete: function(data) {
                            n++;
                            if (!i || (n == script.length)) deferred_.resolve(data);
                        },
                        error: function(event) {
                            throw new Error('Library load is failed. [ ' + item.name + (item.minify ? '.min' : '') + '.js ]');
                        }
                    });
                } catch (error) {
                    deferred_.reject(error);
                }

                return deferred_.promise();
            };

            var deferred = $.Deferred();

            try {
                var n = 0;

                if (typeof script == 'object') {
                    if ($.isEmptyObject(script)) deferred.resolve();
                    else {
                        if ($.isArray(script)) {
                            for (var i in script) {
                                load(script[i], i).then(function() { deferred.resolve(); });
                            }
                        } else load(script).then(function() { deferred.resolve(); });
                    }
                } else load(script).then(function() { deferred.resolve(); });
            } catch (error) {
                deferred.reject(error);
            }

            return deferred.promise();
        },

        isDateFormat: function(value) {
            return (
                /^\d{4}\-\d{2}\-\d{2}$/.test(value) &&
                Date.parse(value)
            );
        },

        /**
         * Set the begin date and the end date when selecting a date with both calendars loaded.
         *
         * @param {object} begin
         * @param {object} end
         *
         * @description
         * This function applies when using the 'Datepicker' widget.
         */
        setDateLimit: function(begin, end) {
            begin.on('change', function() {
                end.datepicker('option', { minDate: $(this).datepicker('getDate') });
            });

            end.on('change', function() {
                begin.datepicker('option', { maxDate: $(this).datepicker('getDate') });
            });
        },

        /**
         * Reset the default value when using the JS library.
         *
         * @param {string} library
         */
        setDefaults: function(library) {
            if (typeof library == 'string') {
                switch (library.toLowerCase()) {
                    case 'handlebars':
                        if (typeof window['Handlebars'] == 'object' ) {
                            Handlebars.registerHelper('is', function(a, b, options) {
                                return a == b ? options.fn(this) : options.inverse(this);
                            });

                            Handlebars.registerHelper('not', function(a, b, options) {
                                return a == b ? options.inverse(this) : options.fn(this);
                            });
                        }
                        break;

                    case 'dialog':
                        $.extend($.ui.dialog.prototype.options, {
                            modal: true,
                            autoOpen: true,
                            dialogClass: 'ui-dialog-light',
                            closeText: '닫기',
                            show: {
                                effect: 'drop',
                                direction: 'up',
                                duration: 'slow'
                            },
                            hide: {
                                effect: 'drop',
                                direction: 'up',
                                duration: 'slow'
                            },
                            close: function() {
                                if ($('[role="loader"]').length > 0) {
                                    if (typeof window.Loader == 'object') Loader.stop();
                                }

                                $(this).dialog('destroy').empty();
                            },
                            buttons: [
                                {
                                    text: '확인',
                                    class: 'ui-dialog-button',
                                    icon: 'ui-icon-check',
                                    click: function() {
                                        $(this).dialog('close');
                                    }
                                }
                            ]
                        });
                        break;

                    case 'datepicker':
                        if (typeof $.datepicker == 'object') {
                            $.datepicker.regional.ko = {
                                buttonImageOnly: true,
                                changeMonth: true,
                                changeYear: true,
                                closeText: '닫기',
                                currentText: '오늘',
                                dateFormat: 'yy-mm-dd',
                                dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
                                dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
                                monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
                                monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
                                nextText: '다음 달',
                                prevText: '이전 달',
                                showButtonPanel: false,
                                showMonthAfterYear: true,
                                yearRange: 'c-5:c',
                                yearSuffix: '년',

                                onSelect: function(dateText, inst) {
                                    $(this).trigger('change');

                                    if (IE) { // datepicker in dialog closing issue
                                        if ($(this).parents('[role="dialog"]').length > 0) {
                                            inst.dpDiv.empty();
                                            return false;
                                        }
                                    }
                                },

                                onChangeMonthYear: function(year, month, inst) {
                                    var date = new Date();

                                    if (inst.selectedYear == date.getFullYear() &&
                                        inst.selectedMonth == date.getMonth() &&
                                        inst.selectedDay == date.getDate()) {
                                        $('#' + inst.id).datepicker('setDate', date).trigger('change');
                                        return;
                                    }

                                    if (inst.currentYear != 0 && inst.currentYear != inst.selectedYear) {
                                        var yearRange = inst.settings.yearRange.split(':');

                                        var min = Number(yearRange[0].replace('c', ''));
                                        var max = Number(yearRange[1].replace('c', ''));

                                        if (year > inst.currentYear + max) {
                                            $('#' + inst.id).datepicker(
                                                'setDate',
                                                inst.currentYear + '-' +
                                                (
                                                    inst.selectedMonth - 1 < 0
                                                    ? 12
                                                    : (inst.selectedMonth + 1 < 10 ? '0' : '') + (inst.selectedMonth + 1)
                                                ) + '-01'
                                            );
                                        }
                                    }
                                }
                            };

                            $.datepicker.setDefaults($.datepicker.regional.ko);
                        }
                        break;

                    case 'jsgrid':
                        if (typeof window.jsGrid == 'object') {
                            jsGrid.setDefaults({
                                noDataContent: '조회된 목록이 없습니다.',

                                confirmDeleting: false,
                                deleteConfirm: '선택한 항목을 삭제합니다.',

                                pageButtonCount: 10,
                                pagerFormat: '{first} {prev} {pages} {next} {last}',
                                pagePrevText: '<',
                                pageNextText: '>',
                                pageFirstText: '<<',
                                pageLastText: '>>',

                                loadMessage: '목록을 불러오는 중',

                                onError: function(args) {
                                    console.error(args);
                                }
                            });
                        }
                        break;
                }
            }
        }

    };

    window.common = new common();

})();
