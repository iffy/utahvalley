---
layout: page
title: All
permalink: /all/
---

{% assign start = site.data.startdate | date: "%s" | plus: 0 %}
{% assign end = start | plus: 1209600 %}

<p>
Here's some fun things happening in Utah Valley on or after {{ start | date: "%b %-d, %Y" }}.  <a href="https://docs.google.com/forms/d/e/1FAIpQLSeNumgYsAbknX4dhEWg9jLnD_2MGjO8EIEYab1fGCmVhoMjhQ/viewform?usp=sf_link">Submit an event.</a>
Accuracy is attempted, but these listings may be outdated&mdash;always click through for more details.
</p>


<h2>Events</h2>
<ol>
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
  {% include event_listing.html event=event %}
{% endif %}
{% endfor %}
</ol>

{% include legend.html %}

