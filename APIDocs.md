<a name="SpecMDSpec"></a>

## SpecMDSpec
**Kind**: global class  

* [SpecMDSpec](#SpecMDSpec)
    * [new SpecMDSpec(specPath, pluginInfo, metadata, getPluginFn, specmd)](#new_SpecMDSpec_new)
    * [.parse](#SpecMDSpec+parse)
    * [.output](#SpecMDSpec+output) ⇒ <code>Promise</code>

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

### specMDSpec.parse
Parses the specmd specification that this SpecMDSpec represents

**Kind**: instance property of [<code>SpecMDSpec</code>](#SpecMDSpec)  
<a name="SpecMDSpec+output"></a>

### specMDSpec.output ⇒ <code>Promise</code>
Processes the spec-md specification that this SpecMDSpec represents.

**Kind**: instance property of [<code>SpecMDSpec</code>](#SpecMDSpec)  
**Returns**: <code>Promise</code> - - Promise for the resulting output. Output is assumed to be a string, but this class is agnostic of that.  
