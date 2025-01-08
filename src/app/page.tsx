import Image from "next/image";

// import the function from the server
import { test } from "../test";

export default function Home() {
  return (
    <div>
      <h1>Hello world</h1>
      <br />
      <h2>Test the server</h2>

      <button onClick={() => test}></button>
    </div>
  );
}
