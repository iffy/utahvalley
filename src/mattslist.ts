declare var firebase:any;

type Price = 'free' | 'vendors' | 'yes' | '';

function debounce(func:Function, milli=100):Function {
  let timer:number;
  return (...args:any) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func(...args);
    }, milli);
  }
}

interface IEvent {
  name: string;
  url: string;
  author: string;
  dates?: string[];
  location?: string;
  tags?: string[];
  price?: Price;
  ticketonsaledate?: string;
}
interface IStoredEvent extends IEvent {
  id: string;
}

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

class EventManager {
  private db:any;

  private signed_in_pane = document.getElementById('signed-in-pane') as HTMLDivElement;
  private signin_pane = document.getElementById('signin-pane') as HTMLDivElement;

  private signin_email_el = document.getElementById('signin-email') as HTMLInputElement;
  private signin_form_el = document.getElementById('signin-form') as HTMLFormElement;
  private signout_button = document.getElementById('signout-button') as HTMLButtonElement;
  private signin_identity_el = document.getElementById('signin-identity') as HTMLDivElement;

  private submit_section = document.getElementById('submit-section') as HTMLDivElement;

  private events:IStoredEvent[] = [];
  private weekstartdate:Date;
  private nextweekstartdate:Date;
  private thisweeksdates:string[] = [];
  private nextweeksdates:string[] = [];

  refreshTables:Function;

  constructor() {
    this.refreshTables = debounce(() => {
      this._refreshTables()
    });

    this.weekstartdate = new Date();
    while (this.weekstartdate.getDay() !== 1) {
      this.weekstartdate.setDate(this.weekstartdate.getDate()-1);
    }
    this.nextweekstartdate = new Date(this.weekstartdate.getTime());
    this.nextweekstartdate.setDate(this.weekstartdate.getDate() + 7);

    let d = new Date(this.weekstartdate.getTime());
    for (let i = 0; i < 7; i++) {
      this.thisweeksdates.push(formatLocalDate(d));
      d.setDate(d.getDate()+1);
    }

    d = new Date(this.nextweekstartdate.getTime());
    for (let i = 0; i < 7; i++) {
      this.nextweeksdates.push(formatLocalDate(d));
      d.setDate(d.getDate()+1);
    }

    document.body.querySelectorAll('.thisweekdates').forEach(el => {
      el.innerHTML = formatDates(
      [this.weekstartdate].map(formatLocalDate));
    })
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

  get uid() {
    return firebase.auth().currentUser.uid;
  }

  userSignedOut() {
    this.hide(this.signed_in_pane);
    this.show(this.signin_pane);
    this.hide(this.submit_section);
  }

  userSignedIn() {
    const userProfile = firebase.auth().currentUser;
    this.signin_identity_el.innerText = userProfile.displayName || userProfile.email;
    this.show(this.signed_in_pane);
    this.hide(this.signin_pane);
    this.show(this.submit_section);
  }

  async start() {
    await this.completeSignIn();

    firebase.auth().onAuthStateChanged((user:any) => {
      if (user) {
        this.userSignedIn();     
      } else {
        this.userSignedOut();
      }
    });

    this.userSignedOut();
    

    // Watch for sign in events.
    this.signin_form_el.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const email:string = this.signin_email_el.value;
      this.signIn(email);
      return false;
    });
    this.signout_button.addEventListener('click', ev => {
      ev.preventDefault();
      firebase.auth().signOut().then(() => {
        // Sign-out successful.
        this.displayMessage("Signed out");
      }).catch((error:any) => {
        // An error happened.
        this.displayError(error);
      });
      return false;
    });

    // Watch for event submission events
    this.newevent_form.addEventListener('submit', ev => {
      ev.preventDefault();
      setTimeout(() => {
        this.addEventFromForm();
      }, 0);
      return false;
    });

    // Watch for data
    this.db.collection("events")
    .onSnapshot((snapshot:any) => {
        // snapshot.forEach((doc:any) => {
        //   this.events.push(doc.data() as IStoredEvent);
        // });
        snapshot.docChanges().forEach((change:any) => {
          if (change.type === "added") {
            this.events.push(this.docToStoredEvent(change.doc));
          } else if (change.type === "modified") {
            for (let event of this.events) {
              if (event.id === change.doc.id) {
                Object.assign(event, this.docToStoredEvent(change.doc));
                break;
              }
            }
          } else if (change.type === "removed") {
            for (let event of this.events) {
              if (event.id === change.doc.id) {
                this.events.splice(this.events.indexOf(event), 1);
              }
            }
          }
          this.refreshTables();
        });
        this.refreshTables();
    });
  }

  docToStoredEvent(doc:any):IStoredEvent {
    return Object.assign({id:doc.id}, doc.data());
  }

  private messages_el = document.getElementById('messages') as HTMLDivElement;

  displayError(err:string) {
    this.displayMessage(err, "error");
  }
  displayMessage(message:string, cls:string = "message") {
    const newEl = document.createElement('div');
    newEl.classList.add(cls);
    newEl.innerText = message;
    this.messages_el.appendChild(newEl);
    setTimeout(() => {
      this.messages_el.removeChild(newEl);
    }, 15000)
  }

  show(el:HTMLElement) {
    el.hidden = false;
    if (el.style.display === 'none') {
      delete el.style.display;
    }
  }
  hide(el:HTMLElement) {
    el.hidden = true;
  }

  async signIn(email:string) {
    let actionCodeSettings = {
      url: window.location.href,
      handleCodeInApp: true,
      // dynamicLinkDomain: 'example.page.link'
    };
    try {
      await firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      this.displayMessage("Email sent!");
    } catch(err) {
      this.displayError(err.message);
    }
  }

  async completeSignIn() {
    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
      var email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = prompt("Email address, again?");
      }
      try {
        const result = await firebase.auth().signInWithEmailLink(email, window.location.href);
        window.localStorage.removeItem('emailForSignIn');
      } catch(err) {
        this.displayError(err.toString());
      }
    }
  }

  async getEvents():Promise<IEvent[]> {
    const querySnapshot = await this.db.collection("events").get()
    let ret:IEvent[] = [];
    querySnapshot.forEach((doc:any) => {
      ret.push(doc.data());
    });
    return ret;
  }


  private newevent_form = document.getElementById('newevent-form') as HTMLFormElement;
  private newevent_name = document.getElementById('newevent-name') as HTMLInputElement;
  private newevent_url = document.getElementById('newevent-url') as HTMLInputElement;
  private newevent_location = document.getElementById('newevent-location') as HTMLInputElement;
  private newevent_price = document.getElementById('newevent-price') as HTMLSelectElement;
  private newevent_dates = new CalendarPicker(document.getElementById('newevent-calendar') as HTMLElement);

  async addEvent(ev:IEvent) {
    try {
      await this.db.collection("events").add(ev)
      this.displayMessage("Event added");
      
    } catch (err) {
      this.displayError(err.message);
    }
  }

  async addEventFromForm() {
    let tags = Array.from(this.newevent_form.querySelectorAll('input[type="checkbox"]'))
      .map((x:any) => {
        if (x.checked) {
          let name = (x.getAttribute('name') || '');
          if (name.startsWith('tag-')) {
            return name.slice('tag-'.length);
          }
        }
        return null;
      })
      .filter(x => x);

    let price = (this.newevent_price.children[this.newevent_price.selectedIndex].getAttribute('value') || '') as Price;

    let event:IEvent = {
      name: this.newevent_name.value,
      url: this.newevent_url.value,
      author: this.uid,
      dates: this.newevent_dates.value(),
      location: this.newevent_location.value,
      tags,
      price,
    }
    try {
      await this.addEvent(event);  
      this.clearAddEventForm();
    } catch(err) {
      this.displayError("Error submitting event");
    }
  }
  clearAddEventForm() {
    this.newevent_dates.reset();
    this.newevent_form.reset();
    this.newevent_name.focus();
  }

  private this_week_listing = document.getElementById('this-week') as HTMLDivElement;
  private next_week_listing = document.getElementById('next-week') as HTMLDivElement;
  private all_listing = document.getElementById('all-events') as HTMLDivElement;
  private _refreshTables() {
    let this_weeks_events = this.events.filter(x => {
      for (const date of (x.dates || [])) {
        if (this.thisweeksdates.indexOf(date) !== -1) {
          return true;
        }
      }
      return false;
    })
    this.createListingTable(this_weeks_events, this.this_week_listing, this.thisweeksdates);

    let next_weeks_events = this.events.filter(x => {
      for (const date of (x.dates || [])) {
        if (this.nextweeksdates.indexOf(date) !== -1) {
          return true;
        }
      }
      return false;
    })
    this.createListingTable(next_weeks_events, this.next_week_listing, this.nextweeksdates);

    this.createListingTable(this.events, this.all_listing, []);
  }

  /**
   *  Display a list of events as a table inside the given element.
   *  dates is the list of dates shown (for the weekly minical)
   */
  createListingTable(events:IStoredEvent[], el:HTMLElement, dates:string[]) {
    el.innerHTML = '';

    events.sort((a,b) => {
      let a_date = parseIsoDate((a.dates || ["2040-01-01"])[0]);
      let b_date = parseIsoDate((b.dates || ["2040-01-01"])[0]);
      return unixTime(a_date) - unixTime(b_date);
    });

    let table = document.createElement('table');
    table.classList.add('listing');
    el.appendChild(table);
    function makeCell(cls:string, contents:string) {
      let cell = document.createElement('td');
      if (cls) {
        cell.classList.add(cls);
      }
      cell.innerText = contents;
      return cell;
    }
    for (const event of events) {
      let row = document.createElement('tr');
      
      // vote row
      // row.appendChild(makeCell('vote', ''));

      row.appendChild(makeCell('dates', formatDates(event.dates || [])));

      // mini calendar
      if (dates.length) {
        let minical = makeCell('', '');
        let minical_container = document.createElement('div');
        minical_container.classList.add('minical');
        minical.appendChild(minical_container);
        dates.forEach(dayofweek => {
          let day = document.createElement('span');
          day.innerText = daysOfWeek[parseIsoDate(dayofweek).getDay()][0];
          if ((event.dates || []).indexOf(dayofweek) !== -1) {
            day.classList.add('highlight');
          }
          minical_container.appendChild(day);
        })
        row.appendChild(minical);  
      }
      
      // price
      let price_string = "?";
      if (event.price === "free") {
        price_string = "FREE";
      } else if (event.price === "vendors") {
        price_string = "Vendors";
      } else if (event.price) {
        price_string = "$";
      } else {
        price_string = "?";
      }
      row.appendChild(makeCell('price', price_string));

      // name/link
      let name = makeCell('name', '');
      let a = document.createElement('a');
      a.innerText = event.name;
      a.href = event.url;
      name.appendChild(a);
      row.appendChild(name);


      row.appendChild(makeCell('location', event.location || ''));
      row.appendChild(makeCell('tags', (event.tags || []).join(', ')));
      table.appendChild(row);
    }
  }
}

function parseIsoDate(x:string):Date {
  let year = Number(x.slice(0, 4));
  let month = Number(x.slice(5, 7));
  let day = Number(x.slice(8, 10));
  let d = new Date();
  d.setUTCHours(0);
  d.setMinutes(0);
  d.setSeconds(0);
  d.setMilliseconds(0);
  d.setDate(day);
  d.setMonth(month - 1);
  d.setFullYear(year);
  return d;
}

function unixTime(x:Date):number {
  return x.getTime()/1000|0;
}

function pad(n:number):string {
  if (n < 10) {
    return '0' + n;
  }
  return '' + n;
}

function formatLocalDate(x:Date):string {
  return x.getFullYear() +
    '-' + pad(x.getMonth() + 1) +
    '-' + pad(x.getDate())
}

function formatDates(date_strings:string[], asof?:Date):string {
  let dates = date_strings.map(x => parseIsoDate(x));
  if (asof !== undefined) {
    dates = dates.filter(x => {
      return unixTime(x) >= unixTime(asof);
    });
  }
  dates.sort((a,b) => unixTime(a) - unixTime(b));
  
  if (dates.length === 0) {
    return '';
  } else if (dates.length === 1) {
    return dates[0].toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  } else {
    // For now, just return a range.
    let first = dates[0];
    let start = first.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
    let last = dates[dates.length-1];
    if (last.getMonth() === first.getMonth() && last.getFullYear() === first.getFullYear()) {
      return start + '-' + last.toLocaleDateString('en-US', {
        day: 'numeric',
      })
    } else {
      return start + '-' + last.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric',
      })
    }
  }
  
  return 'dates';
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

let is_mouse_drag_selecting = true;

class CalendarPicker {
  constructor(private el:HTMLElement) {
    this.create();
  }
  create() {
    this.el.classList.add('cal-picker');
    let todayString = formatLocalDate(new Date());
    let firstOfMonth = new Date();
    firstOfMonth.setDate(1);
    let start_month = firstOfMonth.getMonth();
    let start_day = 1;
    let start_year = firstOfMonth.getFullYear();
    for (let m = 0; m < 12; m++) {
      let target_month = (start_month + m);
      let d = new Date();
      d.setDate(1);
      d.setMonth(target_month % 12);
      if (target_month >= 12) {
        d.setFullYear(d.getFullYear() + 1);
        target_month %= 12;
      }

      let month_el = document.createElement('div');
      month_el.classList.add('month');
      this.el.appendChild(month_el);

      let title = document.createElement('div');
      title.classList.add('title');
      title.innerText = MONTH_NAMES[d.getMonth()] + ' ' + d.getFullYear();
      month_el.appendChild(title);

      let day_table = document.createElement('table');
      while (d.getMonth() === target_month) {
        let row = document.createElement('tr');
        day_table.appendChild(row);
        for (let weekday = 0; weekday < 7; weekday++) {
          let cell = document.createElement('td');
          row.appendChild(cell);
          if (weekday < d.getDay() || d.getMonth() !== target_month) {
            cell.classList.add('empty');
          } else {
            cell.innerText = '' + d.getDate();
            let value = formatLocalDate(d);
            cell.setAttribute('value', value);
            if (value === todayString) {
              cell.classList.add('today');
            }
            d.setDate(d.getDate()+1);
            cell.addEventListener('mousedown', () => {
              if (cell.classList.contains('selected')) {
                cell.classList.remove('selected');
                is_mouse_drag_selecting = false;
              } else {
                cell.classList.add('selected');
                is_mouse_drag_selecting = true;
              }
            })
            cell.addEventListener('mouseenter', (ev) => {
              if (ev.buttons) {
                if (is_mouse_drag_selecting) {
                  cell.classList.add('selected');
                } else {
                  cell.classList.remove('selected');
                }
              }
            });
          }
        }
      }
      month_el.appendChild(day_table);
    }
  }
  reset() {
    this.el.querySelectorAll('.selected').forEach(cell => {
      cell.classList.remove('selected');
    })
  }
  value():string[] {
    let ret:string[] = [];
    this.el.querySelectorAll('.selected').forEach(cell => {
      ret.push(cell.getAttribute('value') || '');
    })
    return ret;
  }
}

const manager = new EventManager();
(window as any).manager = manager;
manager.start().then(() => {
  document.body.classList.remove('loading');  
})
