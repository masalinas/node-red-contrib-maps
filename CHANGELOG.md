### 0.1.0: First Release

**Enhancements**

 - Draw Openlayers from node.

**Fixes**

### 0.2.0: Second Release with some fixes

**Fixes**

 - Refactor the code to manage socket.io server better. Now each node is responsible to create
the socket.io server if not exist in the node-RED instance. The node save the socket.io server instance in the node-RED global context **io** variable. This new way to manage the socket-io server permit resolve two problems:
* The initial configuration of each template node will be load the first time.
* The node will be able to work with other nodes that use socket.io server too, Of course the global context **io** variable will be reserver by me.

 **Enhancements**