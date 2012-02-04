{if $sdesc != ''}{$sdesc|default:''}<br />{/if}
{if $desc != ''}{$desc|default:''}{/if}
{if count($tags) > 0}
<div class="tags">
<ul>
{section name=tag loop=$tags}
<li><b>{$tags[tag].keyword|capitalize}:</b> {if $tags[tag].keyword == 'static'}This method can be called statically{else}{$tags[tag].data}{/if}</li>
{/section}
</ul>
</div>
{/if}