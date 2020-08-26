"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EdgeHelp {
}
exports.default = EdgeHelp;
EdgeHelp.NetworkDesc = `## Description\n ` +
    ` The is node is used for reading and writing values to the edge-io-28. This node uses an internal rest-api to talk to the edge-io-28. No details need to be set\n ` +
    `   \n ` +
    `### Enable\n ` +
    `   \n ` +
    ` The point enable will disable any new value being sent to the node **output**  \n ` +
    `   \n ` +
    `### Polling Interval\n ` +
    `   \n ` +
    ` This will change the poll rate of the edge-io-28 inputs. A normal setting is 1 second\n ` +
    ` The faster the polling rate is the higher the memory usage is\n ` +
    `   \n ` +
    `### Polling Interval Time Setting\n ` +
    `   \n ` +
    `Used in conjugation with the **Polling Interval**. Make the selection for the time units for **Seconds**, **Minutes**, **Hours** \n ` +
    `   \n `;
EdgeHelp.inputsDesc = `## Description\n ` +
    ` The is node is used in conjunction with the edge-io-28. This node uses an internal rest-api to talk to the edge-io-28\n ` +
    `   \n ` +
    `## Digital Input\n ` +
    `   \n ` +
    `A total of 14 DIs can be used on the edge-io-28. There are 7 DIs and 7 UIs\n ` +
    `   \n ` +
    `### DIs (From the UIs)  \n ` +
    `   \n ` +
    ` The UIs can be setup and used to read a status change from a *Digital Input* (7 off dry input)\n ` +
    `   \n ` +
    `### DIs (From the UIs)  \n ` +
    `   \n ` +
    ` The UIs can be setup and used to read a status change from a *Digital Input* (7 off dry input)\n ` +
    `   \n ` +
    `## Universal Input\n ` +
    `   \n ` +
    ` The Universal Input or Analogue Input (7 off) can be used in a number of combinations for reading different sensor types\n ` +
    `   \n ` +
    `### UI as 0/10dc  \n ` +
    `   \n ` +
    ` When configured as a UI 0/10dc the node output value will return a value that is set in the **Low scale** & **High scale**\n ` +
    `   \n ` +
    `### UI as 0/20ma and or 4/20ma \n ` +
    `   \n ` +
    ` When configured as a UI 0/20ma and or 4/20ma the node output value will return a value that is set in the **Low scale** & **High scale**\n ` +
    `   \n ` +
    `### UI as 10K thermistor \n ` +
    `   \n ` +
    ` When configured as a UI 10K thermistor type 2 the node output value will return a value based on the resistance and corresponding temperature\n ` +
    `   \n ` +
    `## Point Configuration\n ` +
    `### Point Enable\n ` +
    `   \n ` +
    ` The point enable will disable any new value being sent to the node **output**  \n ` +
    `   \n ` +
    `### Point Debug\n ` +
    `   \n ` +
    ` The point debug will allow the node **output** to always send the value even if there is node change\n ` +
    ` This is just a guide to see if the polling is working\n ` +
    `   \n ` +
    `### Point Selection\n ` +
    `   \n ` +
    ` 1. Select the **Point Type** for example UO  \n ` +
    ` 2. Select the **Point Number** for example UO-1   \n ` +
    ` **Note:** You cant set a type **Digital** and point number **UI1** the correct types must be matched with the correct point numbers  \n ` +
    `   \n ` +
    `### Point Units\n ` +
    `   \n ` +
    ` The units can be set as required see steps below.  \n ` +
    ` 1. Select the **Units Category**.  \n ` +
    ` 2. Lock (**lock icon**) the node setting's and hit the **save** button to return the units types.  \n ` +
    ` 3. Select the units type.  \n ` +
    ` 4. Save and close the node as required  \n ` +
    `   \n ` +
    `### Point Low Scale\n ` +
    `   \n ` +
    ` This is used in when the UI type is set as a 0-10dc or 4-20ma. The **High Scale**  must be set as well \n ` +
    ` For example if the point type is 0-10dc and the *Low Scale* is set to 0 and *High Scale* is set to 100 \   \n ` +
    ` the node output value when at 0vdc will return 0 and at 10vdc the node output value will return 100 \   \n ` +
    `   \n ` +
    `### Point High Scale\n ` +
    `   \n ` +
    ` This is used in when the UI type is set as a 0-10dc or 4-20ma (See **Low Scale** setting for more info).  \n ` +
    `   \n ` +
    `### Point Decimal Places\n ` +
    `   \n ` +
    ` The units can be set as required see steps below.  \n ` +
    `   \n ` +
    `### Point Offset\n ` +
    `   \n ` +
    ` Enter a float value to offset. This will apply an math add function to the original value  \n ` +
    ` Example original value is 20 and offset is -1 the **node output** value result will be 19 \n ` +
    `   \n ` +
    `### Point Decimal Places\n ` +
    `   \n ` +
    ` Enter a int value to Decimal. This will apply an math round function to the original value \n ` +
    ` Example original value is 99.9999 and the device places is set to 0  the **node output** value result will be 99 \n ` +
    `   \n ` +
    `### Math Function\n ` +
    `   \n ` +
    ` The units can be set as required see steps below.  \n ` +
    ` 1. **na** Will apply not math.  \n ` +
    ` 2. **add** Will add a **value** node output.  \n ` +
    ` 3. **subtract** Will subtract a **value** node output.  \n ` +
    ` 4. **multiply** Will multiply a **value** node output.  \n ` +
    ` 5. **divide** Will divide a **value** node output. \n ` +
    ` 6. **invert** Will invert the node output. Example in original value = 0 the node output value will = 1.   \n ` +
    `   \n ` +
    `###  History Settings Database Type\n ` +
    `   \n ` +
    ` The are two options for the database type. The data can either be pushed to influxDB or PostgreSQL.  \n ` +
    ` 1. Select required database type (if type is *Nube DB PostgreSQL* *no more steps are required*).  \n ` +
    ` 2. Enter DB details like IP, port, username and password(if type is *InfluxDB*)\n ` +
    `   \n ` +
    `#### History Settings History Type\n ` +
    `   \n ` +
    ` 1. **Change Of Value (COV)**.  \n ` +
    ` 2. **Periodic**.  \n ` +
    ` 3. **Trigger Only**.  \n ` +
    `   \n ` +
    `####  History Settings Local Storage Limit\n ` +
    `   \n ` +
    ` 1. **Change Of Value (COV)**.  \n ` +
    ` 2. **Periodic**.  \n ` +
    ` 3. **Trigger Only**.  \n ` +
    `   \n ` +
    `####  History Settings Round minutes\n ` +
    `   \n ` +
    ` 1. **Change Of Value (COV)**.  \n ` +
    ` 2. **Periodic**.  \n ` +
    ` 3. **Trigger Only**.  \n ` +
    `   \n ` +
    `### Alarm Settings\n ` +
    `   \n ` +
    ` to be added  \n ` +
    `   \n ` +
    `### Tag Settings\n ` +
    `   \n ` +
    ` to be added  \n `;
EdgeHelp.outputsDesc = `## Description\n ` +
    ` The is node is used in conjunction with the edge-io-28. This node uses an internal rest-api to talk to the edge-io-28\n ` +
    `   \n ` +
    `## Digital Output\n ` +
    `   \n ` +
    ` The DOs can be used to drive a 0-12vdc relay (5 off) or an onboard Normally Open Relay (2 off)\n ` +
    `### DOs  \n ` +
    `   \n ` +
    ` The input of the node can will drive the output on/true  with any value > 1 or a true value \n ` +
    ` Any value < 0 or a false will drive the output off/false \n ` +
    `### Relay Output  \n ` +
    `   \n ` +
    ` The input of the node can will drive the output on/true  with any value > 1 or a true value \n ` +
    ` Any value < 0 or a false will drive the output off/false \n ` +
    `## Universal Output\n ` +
    `   \n ` +
    ` The Universal Output or Analogue Output (7 off) has a voltage range of 0 to 12vdc\n ` +
    ` The UOs can be used as an AO floating point 0/10dc or a binary on/off 0-12dc \n ` +
    `### UOs as 0/10dc  \n ` +
    `   \n ` +
    ` When configured as a UOs a the node input value is a float value between 0/100 to drive a voltage of 0/10dc \n ` +
    `### UOs as On/Off  \n ` +
    `   \n ` +
    ` The input of the node can will drive the output on/true  with any value > 1 or a true value \n ` +
    ` Any value < 0 or a false will drive the output off/false \n ` +
    `## Point Configuration\n ` +
    `### Point Enable\n ` +
    `   \n ` +
    ` The point enable will disable any new value being sent to the node **output**  \n ` +
    `### Point Selection\n ` +
    `   \n ` +
    ` 1. Select the **Point Type** for example UO  \n ` +
    ` 2. Select the **Point Number** for example UO-1   \n ` +
    `### Point Settings\n ` +
    `   \n ` +
    ` The DOs can be used to drive a 0-12vdc relay (5 off) or an onboard Normally Open Relay (2 off)\n ` +
    `### Point Units\n ` +
    `   \n ` +
    ` The units can be set as required see steps below.  \n ` +
    ` 1. Select the **Units Category**.  \n ` +
    ` 2. Lock (**lock icon**) the node setting's and hit the **save** button to return the units types.  \n ` +
    ` 3. Select the units type.  \n ` +
    ` 4. Save and close the node as required  \n ` +
    `###  History Settings Database Type\n ` +
    `   \n ` +
    ` The are two options for the database type. The data can either be pushed to influxDB or PostgreSQL.  \n ` +
    ` 1. Select required database type (if type is *Nube DB PostgreSQL* *no more steps are required*).  \n ` +
    ` 2. Enter DB details like IP, port, username and password(if type is *InfluxDB*)\n ` +
    `#### History Settings History Type\n ` +
    `   \n ` +
    ` 1. **Change Of Value (COV)**.  \n ` +
    ` 2. **Periodic**.  \n ` +
    ` 3. **Trigger Only**.  \n ` +
    `####  History Settings Local Storage Limit\n ` +
    `   \n ` +
    ` 1. **Change Of Value (COV)**.  \n ` +
    ` 2. **Periodic**.  \n ` +
    ` 3. **Trigger Only**.  \n ` +
    `####  History Settings Round minutes\n ` +
    `   \n ` +
    ` 1. **Change Of Value (COV)**.  \n ` +
    ` 2. **Periodic**.  \n ` +
    ` 3. **Trigger Only**.  \n ` +
    `### Alarm Settings\n ` +
    `   \n ` +
    ` to be added  \n ` +
    `### Tag Settings\n ` +
    `   \n ` +
    ` to be added  \n `;
//# sourceMappingURL=edge-28.js.map