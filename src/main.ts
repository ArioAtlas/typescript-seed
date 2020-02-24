import { sayHello } from "./greet";

function showHello(divName: string, name: string) {
  const elm = document.getElementById(divName);
  elm.innerText = sayHello(name);
}

showHello("greeting", "TypeScript");
