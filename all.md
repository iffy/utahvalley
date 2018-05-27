---
layout: page
title: All
order: 2
permalink: /all/
---

{% assign start = site.data.startdate | date: "%s" | plus: 0 %}

<h2>All Future Events</h2>
<div class="flex-order">
{% assign sorted_events = site.data.events | sort: 'name' %}
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

