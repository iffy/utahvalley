---
layout: page
title: Soon
order: 1
permalink: /
---

{%- assign events = "" | split: "" -%}
{%- for subdir in site.data.events -%}
  {%- assign events = events | concat: subdir[1] -%}
{%- endfor -%}

{%- assign start = site.data.startdate | date: "%s" | plus: 0 -%}
{%- assign end1 = start | plus: 604800 -%}
{%- assign end2 = end1 | plus: 604800 -%}

<!--
start: {{ start | date: "%s" }}
end1:  {{ end1 | date: "%s" }}
end2:  {{ end2 | date: "%s" }}
-->

{%- include filtering.html -%}

<h2><a name="this-week"></a>This week</h2>
<div class="flex-order listings" id="this-week-listings">
{%- assign sorted_events = events | sort: 'name' -%}
{%- for event in sorted_events -%}
  {%- assign show = false -%}
  {%- for when in event.when -%}
    {%- assign ts = when | date: "%s" | plus: 0 -%}
    {%- if ts >= start and ts < end1 -%}
      {%- assign show = true -%}
    {%- endif -%}
  {%- endfor -%}
  
  {%- if show -%}
    {%- include event_listing.html event=event start=start showcal=true -%}
  {%- endif -%}
{%- endfor -%}
</div>

<h2><a name="next-week"></a>Next week</h2>
<div class="flex-order listings">
{%- assign sorted_events = events | sort: 'name' -%}
{%- for event in sorted_events -%}
  {%- assign show = false -%}
  {%- for when in event.when -%}
    {%- assign ts = when | date: "%s" | plus: 0 -%}
    {%- if ts >= end1 and ts < end2 -%}
      {%- assign show = true -%}
    {%- endif -%}
  {%- endfor -%}
  
  {%- if show -%}
    {%- include event_listing.html event=event start=end1 showcal=true -%}
  {%- endif -%}
{%- endfor -%}
</div>

<script>
const thisweek_end = {{ end1 }};
const nextweek_end = {{ end2 }};
function startOfToday() {
  let now = new Date();
  let offset = now.getTimezoneOffset();
  now.setHours(0,0,0,0);
  const ts = Math.floor(now.getTime()/1000) - (offset * 60) - 1;
  return ts;
}
function fadePastEvents() {
  const now = startOfToday();
  Array.from(document.querySelectorAll('[data-dates]')).forEach(elem => {
    let whens = elem.getAttribute('data-dates')
    .trim()
    .split(' ')
    .map(s => Number(s))
    .filter(when => {
      if (when > nextweek_end) {
        // date is not in view
        return false;
      }
      if (when < now) {
        // event has passed
        return false;
      } else {
        // still time in the future
        return true;
      }
    })
    if (!whens.length) {
      elem.classList.add('finished');
    }
  })
}
fadePastEvents();
</script>

<h2>More</h2>

- <a href="{{ site.baseurl }}/all/">Future events</a>
- <a href="{{ site.baseurl }}/ongoing/">Ongoing events</a>
- <a href="{{ site.baseurl }}/sources/">Sources</a>

{% include legend.html %}
