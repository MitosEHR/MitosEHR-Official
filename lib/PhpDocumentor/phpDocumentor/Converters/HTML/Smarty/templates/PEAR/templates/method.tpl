{section name=methods loop=$methods}
{if $show == 'summary'}
method {$methods[methods].function_call}, {$methods[methods].sdesc}<br />
{else}
	<a name="{$methods[methods].method_dest}"></a>
	<h3>{$methods[methods].function_name}{if $methods[methods].ifunction_call.constructor} (Constructor){elseif $methods[methods].ifunction_call.destructor} (Destructor){/if}<span class="smalllinenumber">&nbsp;&nbsp;&nbsp;[line {if $methods[methods].slink}{$methods[methods].slink}{else}{$methods[methods].line_number}{/if}]</span></h3>
	<div class="function">
    <table width="90%" border="0" cellspacing="0" cellpadding="1"><tr><td class="code_border">
    <table width="100%" border="0" cellspacing="0" cellpadding="2"><tr><td class="code">
		<code>{$methods[methods].function_return} {if $methods[methods].ifunction_call.returnsref}&amp;{/if}{$methods[methods].function_name}(
{if count($methods[methods].ifunction_call.params)}
{section name=params loop=$methods[methods].ifunction_call.params}
{if $smarty.section.params.iteration != 1}, {/if}
{if $methods[methods].ifunction_call.params[params].default != ''}[{/if}{$methods[methods].ifunction_call.params[params].type}
{$methods[methods].ifunction_call.params[params].name}{if $methods[methods].ifunction_call.params[params].default != ''} = {$methods[methods].ifunction_call.params[params].default}]{/if}
{/section}
{/if})</code>
    </td></tr></table>
    </td></tr></table><br />
	
		{include file="docblock.tpl" sdesc=$methods[methods].sdesc desc=$methods[methods].desc tags=$methods[methods].tags}<br />

{if $methods[methods].descmethod}
	<p>Overridden in child classes as:<br />
	{section name=dm loop=$methods[methods].descmethod}
	<dl>
	<dt>{$methods[methods].descmethod[dm].link}</dt>
		<dd>{$methods[methods].descmethod[dm].sdesc}</dd>
	</dl>
	{/section}</p>
{/if}
{if $methods[methods].method_overrides}Overrides {$methods[methods].method_overrides.link} ({$methods[methods].method_overrides.sdesc|default:"parent method not documented"}){/if}

    {if count($methods[methods].params) > 0}
    <h4>Parameters:</h4>
    <div class="tags">
    <table border="0" cellspacing="0" cellpadding="0">
    {section name=params loop=$methods[methods].params}
      <tr>
        <td>{$methods[methods].params[params].datatype}&nbsp;&nbsp;</td>
        <td><tt>{$methods[methods].params[params].var}</tt>&nbsp;&nbsp;</td>
        <td>&mdash;&nbsp;</td>
        <td>{$methods[methods].params[params].data}</td>
      </tr>
    {/section}
    </table>
    </div><br />
    {/if}
    <div class="top">[ <a href="#top">Top</a> ]</div>
  </div>
  <hr />  
{/if}
{/section}
