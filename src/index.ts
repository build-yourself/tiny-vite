import net from "node:net";

let nextId = 1;
const server = net.createServer((socket) => {
  const id = nextId++;
  const serverOpenedTime = performance.now();
  console.log(`[${id}] opened from port ${socket.remotePort}`);
  socket.on("data", (chunk) => {
    console.log(`[${id}] data: ${chunk.length} bytes`);
    console.log(`[${id}] chunk: ${chunk.toString().split('\r\n')[0]}`)
    const body = chunk.length;
    socket.write(
      "HTTP/1.1 200 OK\r\n" +
        "Content-Type: text/plain\r\n" +
        `Content-Length: ${body}\r\n` +
        "\r\n" +
        chunk,
    );
  });

  socket.on("end", () => {
    console.log(`[${id}] half closed`);
  });

  socket.on("error", (err: NodeJS.ErrnoException) =>
    console.log(`[${id}] error: ${err.code}`),
  );

  socket.on("close", (hadError) => {
    const ms = performance.now() - serverOpenedTime;
    console.log(
      `[${id}] closed after ${ms} ms  ${hadError ? "because of an error" : ""}`,
    );
  });
});

server.listen(3000, () => console.log("listening on http://localhost:3000"));
