---
layout: page
title: Soon
permalink: /
---

{% assign start = site.data.startdate | date: "%s" | plus: 0 %}
{% assign end = start | plus: 1209600 %}

<h2>Events</h2>
<div class="flex-order listings">
{% assign sorted_events = site.data.events | sort: 'name' %}
{% for event in sorted_events %}
  {% assign show = false %}
  {% for when in event.when %}
    {% assign ts = when | date: "%s" | plus: 0 %}
    {% if ts >= start and ts <= end %}
      {% assign show = true %}
    {% endif %}
  {% endfor %}
  
  {%- if show %}
    {% include event_listing.html event=event %}
  {% endif %}
{% endfor %}
</div>

<h2>Ongoing Events</h2>
<div class="listings">
{% for event in site.data.ongoing %}
  {% include event_listing.html event=event %}
{% endfor %}
</div>

{% include legend.html %}
