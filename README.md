# atvise-scm

## Installation

With [atvise-scm-cli](https://github.com/LukasHechenberger/atvise-scm-cli) installed, run `atvise-scm init`.

## Usage

Please refer to the documentation of [atvise-scm-cli](https://github.com/LukasHechenberger/atvise-scm-cli#running-tasks) on how to run tasks

## Configuration

### Atviseproject.js

This **file is required** to exist in all atvise-scm project directories. It contains a ES2015 JavaScript module.

#### Exported Keys

The most important keys are:

 - **host** :String=localhost - The atvise server to connect to
 - **port** :Object - The atvise server ports
   - **opc** :Number=4840 - The atvise server OPC-UA port
   - **http** :Number=80 - The atvise server HTTP port
   
To get a full overview over the keys available take a look at the [default Atviseproject.js](https://github.com/LukasHechenberger/atvise-scm/blob/master/src/lib/config/Atviseproject.js) file inside this repository.

#### Sample

A *Atviseproject.js* file might look like this:

```javascript
// Atviseproject.js

export const host = '127.0.0.1'; // An atvise server's IP address
export const port = {
  opc: 4840, // The OPC-UA port the atvise server uses
  http: 80, // The HTTP port the avise server uses
};
```
