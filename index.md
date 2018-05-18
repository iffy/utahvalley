---
layout: page
title: Soon
order: 1
permalink: /
---

{% assign start = site.data.startdate | date: "%s" | plus: 0 %}
{% assign end1 = start | plus: 604800 %}
{% assign end2 = end1 | plus: 604800 %}

<h2>This week</h2>
<div class="flex-order listings">
{% assign sorted_events = site.data.events | sort: 'name' %}
{% for event in sorted_events %}
  {% assign show = false %}
  {% for when in event.when %}
    {% assign ts = when | date: "%s" | plus: 0 %}
    {% if ts >= start and ts < end1 %}
      {% assign show = true %}
    {% endif %}
  {% endfor %}
  
  {%- if show %}
    {% include event_listing.html event=event %}
  {% endif %}
{% endfor %}
</div>

<h2>Next week</h2>
<div class="flex-order listings">
{% assign sorted_events = site.data.events | sort: 'name' %}
{% for event in sorted_events %}
  {% assign show = false %}
  {% for when in event.when %}
    {% assign ts = when | date: "%s" | plus: 0 %}
    {% if ts >= end1 and ts <= end2 %}
      {% assign show = true %}
    {% endif %}
  {% endfor %}
  
  {%- if show %}
    {% include event_listing.html event=event %}
  {% endif %}
{% endfor %}
</div>

<h2>More</h2>

- <a href="{{ site.baseurl }}/all/">Future events</a>
- <a href="{{ site.baseurl }}/ongoing/">Ongoing events</a>

{% include legend.html %}
