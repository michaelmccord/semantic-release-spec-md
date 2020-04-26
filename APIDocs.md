## Modules

<dl>
<dt><a href="#module_get-logger">get-logger</a></dt>
<dd></dd>
<dt><a href="#module_get-package">get-package</a></dt>
<dd></dd>
<dt><a href="#module_index">index</a></dt>
<dd></dd>
<dt><a href="#module_Plugin">Plugin</a></dt>
<dd></dd>
</dl>

## Classes

<dl>
<dt><a href="#SpecMDSpec">SpecMDSpec</a></dt>
<dd><p>Represents a spec-md specification</p>
</dd>
</dl>

## External

<dl>
<dt><a href="#external_Signale">Signale</a></dt>
<dd><p>Signale logger</p>
</dd>
<dt><a href="#external_requireg">requireg</a></dt>
<dd><p>requireg function</p>
</dd>
</dl>

<a name="module_get-logger"></a>

## get-logger
<a name="exp_module_get-logger--module.exports"></a>

### module.exports(context, scope) ⇒ [<code>Signale</code>](#external_Signale) ⏏
Returns a [Signale](#external_Signale) logger

**Kind**: Exported function  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Object</code> | Provides the [Signale](#external_Signale) logger with the stdout and stderr streams |
| context.stdout | <code>Stream</code> | The stdout stream |
| context.stderr | <code>Stream</code> | The stderr stream |
| scope | <code>String</code> | Provides a scope string to the [Signale](#external_Signale) logger |

<a name="module_get-package"></a>

## get-package

* [get-package](#module_get-package)
    * [module.exports([requireFn], [requiregFn])](#exp_module_get-package--module.exports) ⇒ <code>GetPackageReturnedFn</code> ⏏
        * [~GetPackageReturnedFn](#module_get-package--module.exports..GetPackageReturnedFn) : <code>function</code>

<a name="exp_module_get-package--module.exports"></a>

### module.exports([requireFn], [requiregFn]) ⇒ <code>GetPackageReturnedFn</code> ⏏
Uses [requireFn](requireFn) or [requiregFn](requiregFn) to get a [package](packageName) from either the local dependency cache or from a global install

**Kind**: Exported function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [requireFn] | <code>function</code> | <code>require</code> | The function to use to retrieve from the local dependency cache (node_modules) |
| [requiregFn] | <code>function</code> | <code>requireg</code> | The function to use to retrieve from a global installation (defaults to [requireg](#external_requireg)) |

<a name="module_get-package--module.exports..GetPackageReturnedFn"></a>

#### module.exports~GetPackageReturnedFn : <code>function</code>
Gets [packageName](packageName) from local dependency cache or from a global install

**Kind**: inner typedef of [<code>module.exports</code>](#exp_module_get-package--module.exports)  

| Param | Type |
| --- | --- |
| packageName | <code>string</code> | 

<a name="module_index"></a>

## index
<a name="module_Plugin"></a>

## Plugin

* [Plugin](#module_Plugin)
    * [~Plugin](#module_Plugin..Plugin)
        * [new Plugin(getPackage, getLogger, path, fs)](#new_module_Plugin..Plugin_new)
        * [.verifyConditions(pluginConfig, context)](#module_Plugin..Plugin+verifyConditions)
    * [~getPackageFn](#module_Plugin..getPackageFn) ⇒ <code>any</code>
    * [~getLoggerFn](#module_Plugin..getLoggerFn) ⇒ [<code>Signale</code>](#external_Signale)
    * [~resolveFn](#module_Plugin..resolveFn) ⇒ <code>string</code>
    * [~existsSyncFn](#module_Plugin..existsSyncFn) ⇒ <code>boolean</code>

<a name="module_Plugin..Plugin"></a>

### Plugin~Plugin
Represents the semantic-release-spec-md plugin

**Kind**: inner class of [<code>Plugin</code>](#module_Plugin)  

* [~Plugin](#module_Plugin..Plugin)
    * [new Plugin(getPackage, getLogger, path, fs)](#new_module_Plugin..Plugin_new)
    * [.verifyConditions(pluginConfig, context)](#module_Plugin..Plugin+verifyConditions)

<a name="new_module_Plugin..Plugin_new"></a>

#### new Plugin(getPackage, getLogger, path, fs)

| Param | Type |
| --- | --- |
| getPackage | <code>getPackageFn</code> | 
| getLogger | <code>getLoggerFn</code> | 
| path | <code>Object</code> | 
| path.resolve | <code>resolveFn</code> | 
| fs | <code>Object</code> | 
| fs.existsSync | <code>existsSyncFn</code> | 

<a name="module_Plugin..Plugin+verifyConditions"></a>

#### plugin.verifyConditions(pluginConfig, context)
Fulfills the [verifyConditions](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/plugins.md) release step of semantic-release plugins

**Kind**: instance method of [<code>Plugin</code>](#module_Plugin..Plugin)  

| Param | Type |
| --- | --- |
| pluginConfig | <code>Object</code> | 
| pluginConfig.specPath | <code>string</code> | 
| pluginConfig.specMDPlugin | <code>Object</code> | 
| pluginConfig.specMDPlugin.package | <code>string</code> | 
| pluginConfig.specMDPlugin.args | <code>Array.&lt;string&gt;</code> | 
| pluginConfig.outputPath | <code>string</code> | 
| context | <code>Object</code> | 

<a name="module_Plugin..getPackageFn"></a>

### Plugin~getPackageFn ⇒ <code>any</code>
**Kind**: inner typedef of [<code>Plugin</code>](#module_Plugin)  

| Param | Type |
| --- | --- |
| packageName | <code>string</code> | 

<a name="module_Plugin..getLoggerFn"></a>

### Plugin~getLoggerFn ⇒ [<code>Signale</code>](#external_Signale)
**Kind**: inner typedef of [<code>Plugin</code>](#module_Plugin)  

| Param | Type |
| --- | --- |
| context | <code>Object</code> | 
| context.stdout | <code>Stream</code> | 
| context.stderr | <code>Stream</code> | 

<a name="module_Plugin..resolveFn"></a>

### Plugin~resolveFn ⇒ <code>string</code>
**Kind**: inner typedef of [<code>Plugin</code>](#module_Plugin)  

| Param | Type |
| --- | --- |
| pathSegments | <code>Array.&lt;string&gt;</code> | 

<a name="module_Plugin..existsSyncFn"></a>

### Plugin~existsSyncFn ⇒ <code>boolean</code>
**Kind**: inner typedef of [<code>Plugin</code>](#module_Plugin)  

| Param | Type |
| --- | --- |
| path | <code>PathLike</code> | 

<a name="SpecMDSpec"></a>

## SpecMDSpec
Represents a spec-md specification

**Kind**: global class  

* [SpecMDSpec](#SpecMDSpec)
    * [new SpecMDSpec(specPath, pluginInfo, metadata, getPluginFn, specmd)](#new_SpecMDSpec_new)
    * [.parse()](#SpecMDSpec+parse)
    * [.getOutput()](#SpecMDSpec+getOutput) ⇒ <code>Promise</code>

<a name="new_SpecMDSpec_new"></a>

### new SpecMDSpec(specPath, pluginInfo, metadata, getPluginFn, specmd)

| Param | Type | Description |
| --- | --- | --- |
| specPath | <code>string</code> | The file path to the specification that this SpecMDSpec represents |
| pluginInfo | <code>Object</code> | A pluginInfo object describing any plugins (if any) that should be used to process the spec. Supply undefined or null to process without a plugin. |
| metadata | <code>Object</code> | A plain javascript object holding spec-md metadata information |
| getPluginFn | <code>function</code> | A function used to retrieve plugin packages |
| specmd | <code>Object</code> | A reference to the specmd package (eg retrieved via require) |

<a name="SpecMDSpec+parse"></a>

### specMDSpec.parse()
Parses the specmd specification that this SpecMDSpec represents

**Kind**: instance method of [<code>SpecMDSpec</code>](#SpecMDSpec)  
<a name="SpecMDSpec+getOutput"></a>

### specMDSpec.getOutput() ⇒ <code>Promise</code>
Processes the spec-md specification that this SpecMDSpec represents.

**Kind**: instance method of [<code>SpecMDSpec</code>](#SpecMDSpec)  
**Returns**: <code>Promise</code> - Promise for the resulting output. Output is assumed to be a string, but this class is agnostic of that.  
<a name="external_Signale"></a>

## Signale
Signale logger

**Kind**: global external  
**See**: [https://github.com/klaussinani/signale](https://github.com/klaussinani/signale)  
<a name="external_requireg"></a>

## requireg
requireg function

**Kind**: global external  
**See**: [https://github.com/h2non/requireg](https://github.com/h2non/requireg)  
