---
layout: page
title: Ongoing
order: 3
permalink: /ongoing/
---

<h2>Ongoing</h2>
<table class="listings">
{% for event in site.data.ongoing %}
  {% include event_listing.html event=event %}
{% endfor %}
</table>

{% include legend.html %}

