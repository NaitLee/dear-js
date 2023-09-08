import { Head } from "$fresh/runtime.ts";
import { REPO_URL } from "../common/constants.ts";
import Game from "../islands/Game.tsx";

export default function Home() {
  return <>
    <Head>
      <title>Dear JavaScript!</title>
    </Head>
    <h1>Dear JavaScript!</h1>
    <p>Drag or tap on continuous <a href="https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Equality" target="_blank">“truthy”</a> or “falsy” JavaScript values to score.</p>
    <Game />
    <footer>
      <p>Inspired by <i><a href="https://www.thomas-yang.me/projects/oh-my-dear-js/" target="_blank">Oh My Dear JavaScript</a></i></p>
      <p><a href={REPO_URL}>Source Code Repository</a></p>
      <p>
        <a href="https://fresh.deno.dev" class="fresh-logo">
          <img
            width="197"
            height="37"
            src="https://fresh.deno.dev/fresh-badge.svg"
            alt="Made with Fresh"
          />
        </a>
      </p>
    </footer>
  </>;
}
