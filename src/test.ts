"use server";

const app_uri = "http://127.0.0.1:8000/test";

export function test() {
  fetch(app_uri)
    .then((response) => response.json())
    .then((data) => console.log(data));
}
