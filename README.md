# TFTP

# Usage

```js
import server from "../dist/index.mjs";

const PORT = 69;

server.listen(PORT, "127.0.0.1", () => {
  console.log("Server listening on port " + PORT);
});
```

### Ressouces

-[rfc1350](https://datatracker.ietf.org/doc/html/rfc1350)
