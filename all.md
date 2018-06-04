---
layout: page
title: All
order: 2
permalink: /all/
---

{%- assign events = "" | split: "" -%}
{%- for subdir in site.data.events -%}
  {%- assign events = events | concat: subdir[1] -%}
{%- endfor -%}

{%- assign start = site.data.startdate | date: "%s" | plus: 0 -%}

{%- include filtering.html -%}

<h2>All Future Events</h2>
<div class="flex-order">
{% assign sorted_events = events | sort: 'name' %}
{% for event in sorted_events %}
{% assign show = false %}
{% for when in event.when %}
  {% assign ts = when | date: "%s" | plus: 0 %}
  {% if ts >= start %}
    {% assign show = true %}
  {% endif %}
{% endfor %}

{%- if show %}
  {% include event_listing.html event=event start=start showcal=false %}
{% endif %}
{% endfor %}
</div>

{% include legend.html %}

