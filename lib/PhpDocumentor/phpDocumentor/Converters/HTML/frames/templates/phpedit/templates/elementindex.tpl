{include file="header.tpl" noleftindex=true}
<a name="top"></a>
<h1>Index of All Elements</h1>
<a name="top">&nbsp; </a>
<strong>Indexes by package:</strong><br />
<ul>
{section name=p loop=$packageindex}
<li><a href="elementindex_{$packageindex[p].title}.html">{$packageindex[p].title}</a></li>
{/section}
</ul>
<br />
{include file="basicindex.tpl" indexname="elementindex"}
{include file="footer.tpl"}
