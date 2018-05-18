---
layout: page
title: Ongoing
order: 3
permalink: /ongoing/
---

<h2>Ongoing</h2>
<div class="listings">
{% for event in site.data.ongoing %}
  {% include event_listing.html event=event %}
{% endfor %}
</div>

{% include legend.html %}

