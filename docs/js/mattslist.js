"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var EventManager = /** @class */ (function () {
    function EventManager() {
        var _this = this;
        this.signed_in_pane = document.getElementById('signed-in-pane');
        this.signin_pane = document.getElementById('signin-pane');
        this.signin_email_el = document.getElementById('signin-email');
        this.signin_form_el = document.getElementById('signin-form');
        this.signout_button = document.getElementById('signout-button');
        this.signin_identity_el = document.getElementById('signin-identity');
        this.submit_section = document.getElementById('submit-section');
        this.events = [];
        this.thisweeksdates = [];
        this.nextweeksdates = [];
        this.messages_el = document.getElementById('messages');
        this.newevent_form = document.getElementById('newevent-form');
        this.newevent_name = document.getElementById('newevent-name');
        this.newevent_url = document.getElementById('newevent-url');
        this.newevent_location = document.getElementById('newevent-location');
        this.newevent_price = document.getElementById('newevent-price');
        this.newevent_dates = new CalendarPicker(document.getElementById('newevent-calendar'));
        this.this_week_listing = document.getElementById('this-week');
        this.next_week_listing = document.getElementById('next-week');
        this.all_listing = document.getElementById('all-events');
        this.weekstartdate = new Date();
        while (this.weekstartdate.getDay() !== 1) {
            this.weekstartdate.setDate(this.weekstartdate.getDate() - 1);
        }
        this.nextweekstartdate = new Date(this.weekstartdate.getTime());
        this.nextweekstartdate.setDate(this.weekstartdate.getDate() + 7);
        var d = new Date(this.weekstartdate.getTime());
        for (var i = 0; i < 7; i++) {
            this.thisweeksdates.push(formatLocalDate(d));
            d.setDate(d.getDate() + 1);
        }
        d = new Date(this.nextweekstartdate.getTime());
        for (var i = 0; i < 7; i++) {
            this.nextweeksdates.push(formatLocalDate(d));
            d.setDate(d.getDate() + 1);
        }
        document.body.querySelectorAll('.thisweekdates').forEach(function (el) {
            el.innerHTML = formatDates([_this.weekstartdate].map(formatLocalDate));
        });
        var config = {
            apiKey: "AIzaSyD6x2QgLc1OLBJkC1vGu6q3p_EbO92hbpk",
            authDomain: "mattslist-9eab0.firebaseapp.com",
            databaseURL: "https://mattslist-9eab0.firebaseio.com",
            projectId: "mattslist-9eab0",
            storageBucket: "mattslist-9eab0.appspot.com",
            messagingSenderId: "95752102595"
        };
        firebase.initializeApp(config);
        // Initialize Cloud Firestore through Firebase
        this.db = firebase.firestore();
        // Disable deprecated features
        this.db.settings({
            timestampsInSnapshots: true
        });
    }
    Object.defineProperty(EventManager.prototype, "uid", {
        get: function () {
            return firebase.auth().currentUser.uid;
        },
        enumerable: true,
        configurable: true
    });
    EventManager.prototype.userSignedOut = function () {
        this.hide(this.signed_in_pane);
        this.show(this.signin_pane);
        this.hide(this.submit_section);
    };
    EventManager.prototype.userSignedIn = function () {
        var userProfile = firebase.auth().currentUser;
        this.signin_identity_el.innerText = userProfile.displayName || userProfile.email;
        this.show(this.signed_in_pane);
        this.hide(this.signin_pane);
        this.show(this.submit_section);
    };
    EventManager.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.completeSignIn()];
                    case 1:
                        _a.sent();
                        firebase.auth().onAuthStateChanged(function (user) {
                            if (user) {
                                _this.userSignedIn();
                            }
                            else {
                                _this.userSignedOut();
                            }
                        });
                        this.userSignedOut();
                        // Watch for sign in events.
                        this.signin_form_el.addEventListener('submit', function (ev) {
                            ev.preventDefault();
                            var email = _this.signin_email_el.value;
                            _this.signIn(email);
                            return false;
                        });
                        this.signout_button.addEventListener('click', function (ev) {
                            ev.preventDefault();
                            firebase.auth().signOut().then(function () {
                                // Sign-out successful.
                                _this.displayMessage("Signed out");
                            }).catch(function (error) {
                                // An error happened.
                                _this.displayError(error);
                            });
                            return false;
                        });
                        // Watch for event submission events
                        this.newevent_form.addEventListener('submit', function (ev) {
                            ev.preventDefault();
                            setTimeout(function () {
                                _this.addEventFromForm();
                            }, 0);
                            return false;
                        });
                        // Watch for data
                        this.db.collection("events")
                            .onSnapshot(function (snapshot) {
                            // snapshot.forEach((doc:any) => {
                            //   this.events.push(doc.data() as IStoredEvent);
                            // });
                            snapshot.docChanges().forEach(function (change) {
                                if (change.type === "added") {
                                    _this.events.push(_this.docToStoredEvent(change.doc));
                                }
                                else if (change.type === "modified") {
                                    for (var _i = 0, _a = _this.events; _i < _a.length; _i++) {
                                        var event_1 = _a[_i];
                                        if (event_1.id === change.doc.id) {
                                            Object.assign(event_1, _this.docToStoredEvent(change.doc));
                                            break;
                                        }
                                    }
                                }
                                else if (change.type === "removed") {
                                    for (var _b = 0, _c = _this.events; _b < _c.length; _b++) {
                                        var event_2 = _c[_b];
                                        if (event_2.id === change.doc.id) {
                                            _this.events.splice(_this.events.indexOf(event_2), 1);
                                        }
                                    }
                                }
                                _this.refreshTables();
                            });
                            _this.refreshTables();
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    EventManager.prototype.docToStoredEvent = function (doc) {
        return Object.assign({ id: doc.id }, doc.data());
    };
    EventManager.prototype.displayError = function (err) {
        this.displayMessage(err, "error");
    };
    EventManager.prototype.displayMessage = function (message, cls) {
        var _this = this;
        if (cls === void 0) { cls = "message"; }
        var newEl = document.createElement('div');
        newEl.classList.add(cls);
        newEl.innerText = message;
        this.messages_el.appendChild(newEl);
        setTimeout(function () {
            _this.messages_el.removeChild(newEl);
        }, 15000);
    };
    EventManager.prototype.show = function (el) {
        el.hidden = false;
        if (el.style.display === 'none') {
            delete el.style.display;
        }
    };
    EventManager.prototype.hide = function (el) {
        el.hidden = true;
    };
    EventManager.prototype.signIn = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var actionCodeSettings, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        actionCodeSettings = {
                            url: window.location.href,
                            handleCodeInApp: true,
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)];
                    case 2:
                        _a.sent();
                        window.localStorage.setItem('emailForSignIn', email);
                        this.displayMessage("Email sent!");
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        this.displayError(err_1.message);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    EventManager.prototype.completeSignIn = function () {
        return __awaiter(this, void 0, void 0, function () {
            var email, result, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!firebase.auth().isSignInWithEmailLink(window.location.href)) return [3 /*break*/, 4];
                        email = window.localStorage.getItem('emailForSignIn');
                        if (!email) {
                            email = prompt("Email address, again?");
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, firebase.auth().signInWithEmailLink(email, window.location.href)];
                    case 2:
                        result = _a.sent();
                        window.localStorage.removeItem('emailForSignIn');
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _a.sent();
                        this.displayError(err_2.toString());
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    EventManager.prototype.getEvents = function () {
        return __awaiter(this, void 0, void 0, function () {
            var querySnapshot, ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.collection("events").get()];
                    case 1:
                        querySnapshot = _a.sent();
                        ret = [];
                        querySnapshot.forEach(function (doc) {
                            ret.push(doc.data());
                        });
                        return [2 /*return*/, ret];
                }
            });
        });
    };
    EventManager.prototype.addEvent = function (ev) {
        return __awaiter(this, void 0, void 0, function () {
            var err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.db.collection("events").add(ev)];
                    case 1:
                        _a.sent();
                        this.displayMessage("Event added");
                        return [3 /*break*/, 3];
                    case 2:
                        err_3 = _a.sent();
                        this.displayError(err_3.message);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    EventManager.prototype.addEventFromForm = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tags, price, event, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tags = Array.from(this.newevent_form.querySelectorAll('input[type="checkbox"]'))
                            .map(function (x) {
                            if (x.checked) {
                                var name_1 = (x.getAttribute('name') || '');
                                if (name_1.startsWith('tag-')) {
                                    return name_1.slice('tag-'.length);
                                }
                            }
                            return null;
                        })
                            .filter(function (x) { return x; });
                        price = (this.newevent_price.children[this.newevent_price.selectedIndex].getAttribute('value') || '');
                        event = {
                            name: this.newevent_name.value,
                            url: this.newevent_url.value,
                            author: this.uid,
                            dates: this.newevent_dates.value(),
                            location: this.newevent_location.value,
                            tags: tags,
                            price: price,
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.addEvent(event)];
                    case 2:
                        _a.sent();
                        this.clearAddEventForm();
                        return [3 /*break*/, 4];
                    case 3:
                        err_4 = _a.sent();
                        this.displayError("Error submitting event");
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    EventManager.prototype.clearAddEventForm = function () {
        this.newevent_dates.reset();
        this.newevent_form.reset();
        this.newevent_name.focus();
    };
    EventManager.prototype.refreshTables = function () {
        var _this = this;
        var this_weeks_events = this.events.filter(function (x) {
            for (var _i = 0, _a = (x.dates || []); _i < _a.length; _i++) {
                var date = _a[_i];
                if (_this.thisweeksdates.indexOf(date) !== -1) {
                    return true;
                }
            }
            return false;
        });
        this.createListingTable(this_weeks_events, this.this_week_listing, this.thisweeksdates);
        var next_weeks_events = this.events.filter(function (x) {
            for (var _i = 0, _a = (x.dates || []); _i < _a.length; _i++) {
                var date = _a[_i];
                if (_this.nextweeksdates.indexOf(date) !== -1) {
                    return true;
                }
            }
            return false;
        });
        this.createListingTable(next_weeks_events, this.next_week_listing, this.nextweeksdates);
        this.createListingTable(this.events, this.all_listing, []);
    };
    /**
     *  Display a list of events as a table inside the given element.
     *  dates is the list of dates shown (for the weekly minical)
     */
    EventManager.prototype.createListingTable = function (events, el, dates) {
        el.innerHTML = '';
        var table = document.createElement('table');
        table.classList.add('listing');
        el.appendChild(table);
        function makeCell(cls, contents) {
            var cell = document.createElement('td');
            if (cls) {
                cell.classList.add(cls);
            }
            cell.innerText = contents;
            return cell;
        }
        var _loop_1 = function (event_3) {
            var row = document.createElement('tr');
            // vote row
            // row.appendChild(makeCell('vote', ''));
            row.appendChild(makeCell('dates', formatDates(event_3.dates || [])));
            // mini calendar
            if (dates.length) {
                var minical = makeCell('', '');
                var minical_container_1 = document.createElement('div');
                minical_container_1.classList.add('minical');
                minical.appendChild(minical_container_1);
                dates.forEach(function (dayofweek) {
                    var day = document.createElement('span');
                    day.innerText = daysOfWeek[parseIsoDate(dayofweek).getDay()][0];
                    if ((event_3.dates || []).indexOf(dayofweek) !== -1) {
                        day.classList.add('highlight');
                    }
                    minical_container_1.appendChild(day);
                });
                row.appendChild(minical);
            }
            // price
            var price_string = "?";
            if (event_3.price === "free") {
                price_string = "FREE";
            }
            else if (event_3.price === "vendors") {
                price_string = "Vendors";
            }
            else if (event_3.price) {
                price_string = "$";
            }
            else {
                price_string = "?";
            }
            row.appendChild(makeCell('price', price_string));
            // name/link
            var name_2 = makeCell('name', '');
            var a = document.createElement('a');
            a.innerText = event_3.name;
            a.href = event_3.url;
            name_2.appendChild(a);
            row.appendChild(name_2);
            row.appendChild(makeCell('location', event_3.location || ''));
            row.appendChild(makeCell('tags', (event_3.tags || []).join(', ')));
            table.appendChild(row);
        };
        for (var _i = 0, events_1 = events; _i < events_1.length; _i++) {
            var event_3 = events_1[_i];
            _loop_1(event_3);
        }
    };
    return EventManager;
}());
function parseIsoDate(x) {
    var year = Number(x.slice(0, 4));
    var month = Number(x.slice(5, 7));
    var day = Number(x.slice(8, 10));
    var d = new Date();
    d.setUTCHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);
    d.setDate(day);
    d.setMonth(month - 1);
    d.setFullYear(year);
    return d;
}
function unixTime(x) {
    return x.getTime() / 1000 | 0;
}
function pad(n) {
    if (n < 10) {
        return '0' + n;
    }
    return '' + n;
}
function formatLocalDate(x) {
    return x.getFullYear() +
        '-' + pad(x.getMonth() + 1) +
        '-' + pad(x.getDate());
}
function formatDates(date_strings, asof) {
    var dates = date_strings.map(function (x) { return parseIsoDate(x); });
    if (asof !== undefined) {
        dates = dates.filter(function (x) {
            return unixTime(x) >= unixTime(asof);
        });
    }
    dates.sort(function (a, b) { return unixTime(a) - unixTime(b); });
    if (dates.length === 0) {
        return '';
    }
    else if (dates.length === 1) {
        return dates[0].toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    }
    else {
        // For now, just return a range.
        var first = dates[0];
        var start = first.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
        var last = dates[dates.length - 1];
        if (last.getMonth() === first.getMonth() && last.getFullYear() === first.getFullYear()) {
            return start + '-' + last.toLocaleDateString('en-US', {
                day: 'numeric',
            });
        }
        else {
            return start + '-' + last.toLocaleDateString('en-US', {
                month: 'short', day: 'numeric',
            });
        }
    }
    return 'dates';
}
var MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var is_mouse_drag_selecting = true;
var CalendarPicker = /** @class */ (function () {
    function CalendarPicker(el) {
        this.el = el;
        this.create();
    }
    CalendarPicker.prototype.create = function () {
        this.el.classList.add('cal-picker');
        var todayString = formatLocalDate(new Date());
        var firstOfMonth = new Date();
        firstOfMonth.setDate(1);
        var start_month = firstOfMonth.getMonth();
        var start_day = 1;
        var start_year = firstOfMonth.getFullYear();
        for (var m = 0; m < 12; m++) {
            var target_month = (start_month + m);
            var d = new Date();
            d.setDate(1);
            d.setMonth(target_month % 12);
            if (target_month >= 12) {
                d.setFullYear(d.getFullYear() + 1);
                target_month %= 12;
            }
            var month_el = document.createElement('div');
            month_el.classList.add('month');
            this.el.appendChild(month_el);
            var title = document.createElement('div');
            title.classList.add('title');
            title.innerText = MONTH_NAMES[d.getMonth()] + ' ' + d.getFullYear();
            month_el.appendChild(title);
            var day_table = document.createElement('table');
            while (d.getMonth() === target_month) {
                var row = document.createElement('tr');
                day_table.appendChild(row);
                var _loop_2 = function (weekday) {
                    var cell = document.createElement('td');
                    row.appendChild(cell);
                    if (weekday < d.getDay() || d.getMonth() !== target_month) {
                        cell.classList.add('empty');
                    }
                    else {
                        cell.innerText = '' + d.getDate();
                        var value = formatLocalDate(d);
                        cell.setAttribute('value', value);
                        if (value === todayString) {
                            cell.classList.add('today');
                        }
                        d.setDate(d.getDate() + 1);
                        cell.addEventListener('mousedown', function () {
                            if (cell.classList.contains('selected')) {
                                cell.classList.remove('selected');
                                is_mouse_drag_selecting = false;
                            }
                            else {
                                cell.classList.add('selected');
                                is_mouse_drag_selecting = true;
                            }
                        });
                        cell.addEventListener('mouseenter', function (ev) {
                            if (ev.buttons) {
                                if (is_mouse_drag_selecting) {
                                    cell.classList.add('selected');
                                }
                                else {
                                    cell.classList.remove('selected');
                                }
                            }
                        });
                    }
                };
                for (var weekday = 0; weekday < 7; weekday++) {
                    _loop_2(weekday);
                }
            }
            month_el.appendChild(day_table);
        }
    };
    CalendarPicker.prototype.reset = function () {
        this.el.querySelectorAll('.selected').forEach(function (cell) {
            cell.classList.remove('selected');
        });
    };
    CalendarPicker.prototype.value = function () {
        var ret = [];
        this.el.querySelectorAll('.selected').forEach(function (cell) {
            ret.push(cell.getAttribute('value') || '');
        });
        return ret;
    };
    return CalendarPicker;
}());
var manager = new EventManager();
window.manager = manager;
manager.start().then(function () {
    document.body.classList.remove('loading');
});
