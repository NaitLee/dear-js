// deno-lint-ignore-file no-explicit-any
import { IS_BROWSER } from "$fresh/runtime.ts";
import { useState } from "preact/hooks";
import { VALUES_EASY, VALUES_NORMAL, VALUES_HARD, VALUES_INSANE } from "../common/values.ts";
import { BOARD_HEIGHT, BOARD_WIDTH, SELECTION_TIMEOUT } from "../common/constants.ts";

const Values = {
    easy: VALUES_EASY,
    normal: VALUES_NORMAL,
    hard: VALUES_HARD,
    insane: VALUES_INSANE,
};

function choose<T>(array: ArrayLike<T>): T {
    return array[Math.random() * array.length | 0];
}

function compare(array: Array<any>) {
    for (let i = 0; i < array.length - 1; ++i)
        if (array[i] != array[i + 1])
            return i + 1;
    return array.length;
}

function test_steps(values: Record<string, any>, board: string[][]) {
    const last_row = board[board.length - 1];
    for (let i = 0; i < board.length - 1; ++i)
        for (let j = 0; j < board[i].length - 1; ++j)
            if (values[board[i][j]] == values[board[i][j + 1]] || values[board[i][j]] == values[board[i + 1][j]])
                return true;
    for (let j = 0; j < last_row.length - 1; ++j)
        if (last_row[j] == last_row[j + 1])
            return true;
    return false;
}

function get_score(selections: number[]) {
    return selections.length >= 2 ? Math.pow(2, selections.length - 2) : 0;
}

export default function Game() {
    const [score, set_score] = useState(0);
    const [board, set_board] = useState<any[][]>([]);
    const [timeout_id, set_timeout_id] = useState(0);
    const [difficulty, set_difficulty] = useState<keyof typeof Values>('easy');
    let [pressed, set_pressed] = useState(false);
    let [selections, set_selections] = useState<number[]>([]);

    const values = Values[difficulty];

    if (!IS_BROWSER) return <div class="game">
        <noscript>
            <p>Interactivity needs JavaScript.</p>
        </noscript>
    </div>;

    const selected_keys = selections.map(id => board[id / BOARD_WIDTH | 0][id % BOARD_WIDTH]);
    const right_until = compare(selected_keys.map(key => values[key]));
    const right = right_until === selections.length;
    if (board.length === 0 || !test_steps(values, board)) {
        const new_board = [];
        for (let i = 0; i < BOARD_WIDTH; ++i) {
            const row = [];
            for (let j = 0; j < BOARD_HEIGHT; ++j)
                row.push(choose(Object.keys(values)));
            new_board.push(row);
        }
        set_board([...new_board]);
    }

    const form_set_difficulty = (difficulty: keyof typeof Values) => {
        set_difficulty(difficulty);
        set_selections([]);
        set_board([]);
        set_score(0);
    };
    const select = (id: number) => {
        const prev = selections[selections.length - 1];
        if (pressed && selections.indexOf(id) === -1)
            if (prev === undefined || [-board.length, -1, 1, board.length].indexOf(id - prev) !== -1)
                set_selections(selections = [...selections, id]);
    };
    const clear = (event: Event) => {
        event.preventDefault();
        clearTimeout(timeout_id);
        set_pressed(pressed = false);
        if (selections.length < 2 || right_until !== selections.length) return;
        set_score(score + get_score(selections));
        for (const id of selections) {
            board[id / board.length | 0][id % board.length] = choose(Object.keys(values));
        }
        set_board([...board]);
        set_selections(selections = []);
    }
    const mkmousedown = (id: number) => (event: Event) => {
        event.preventDefault();
        set_selections(selections = []);
        set_pressed(pressed = true);
        select(id);
    };
    const mktouchstart = (id: number) => (event: Event) => {
        event.preventDefault();
        if (!pressed)
            set_selections(selections = []);
        set_pressed(pressed = true);
        select(id);
    };
    const mkmouseup = (id: number) => (event: Event) => {
        event.preventDefault();
        clear(event);
    }
    const mktouchend = (id: number) => (event: Event) => {
        event.preventDefault();
        clearTimeout(timeout_id);
        set_timeout_id(setTimeout(() => clear(event), SELECTION_TIMEOUT));
    };
    const mkselect = (id: number) => (event: Event) => {
        event.preventDefault();
        select(id);
    }
    const mktouchselect = (id: number) => (event: Event) => {
        event.preventDefault();
        select(id);
        clearTimeout(timeout_id);
        set_timeout_id(setTimeout(() => clear(event), SELECTION_TIMEOUT));
    };
    const selections_right = [];
    for (let i = 0; i < right_until - 1; ++i)
        selections_right.push(selected_keys[i] + ' == ' + selected_keys[i + 1]);
    let index = 0;
    return <>
        <div class="game">
            <form onSubmit={(event) => event.preventDefault()}>
                <p>
                    <span>Difficulty:</span>
                    <label>
                        <input name="difficulty" type="radio" checked={difficulty === 'easy'} onChange={() => form_set_difficulty('easy')} />
                        <span>Easy</span>
                    </label>
                    <label>
                        <input name="difficulty" type="radio" checked={difficulty === 'normal'} onChange={() => form_set_difficulty('normal')} />
                        <span>Normal</span>
                    </label>
                    <label>
                        <input name="difficulty" type="radio" checked={difficulty === 'hard'} onChange={() => form_set_difficulty('hard')} />
                        <span>Hard</span>
                    </label>
                    <label>
                        <input name="difficulty" type="radio" checked={difficulty === 'insane'} onChange={() => form_set_difficulty('insane')} />
                        <span>Insane</span>
                    </label>
                </p>
            </form>
            <div class="dashboard">
                <span class="score">
                    {<span>Score: {score}</span>}
                    {pressed
                        ? <span> + {right ? get_score(selections) : 0}</span>
                        : <span></span>
                    }
                </span>
                <pre class="selections">
                    <span>{selections_right.join('; ')}{right_until >= 2 ? '; ' : ''}</span>
                    <span class="selections--wrong">{right ? '\xa0' : '// ' + selected_keys[right_until - 1] + ' != ' + selected_keys[right_until] + ' ' + '.'.repeat(selected_keys.length - right_until - 1)}</span>
                </pre>
            </div>
            <div class="game__board">
                {board.map(row => <div>{
                    row.map(cell =>
                        <button class={"board__cell"
                                + (pressed && selections.indexOf(index) !== -1 ? ' board__cell--selected' : '')
                                + (pressed && selections.slice(right_until).indexOf(index) !== -1 ? ' board__cell--selected--wrong' : '')}
                            key={index}
                            data-position={index}
                            onMouseDown={mkmousedown(index)}
                            onDblClick={clear}
                            onMouseUp={mkmouseup(index)}
                            onMouseEnter={mkselect(index)}
                            onTouchStart={mktouchstart(index)}
                            onTouchEnd={mktouchend(index)}
                            onTouchMove={mktouchselect(index++)}
                            onContextMenu={clear}
                        ><code>{cell.replace('(', ' (')}</code></button>)
                }</div>)}
            </div>
        </div>
    </>;
}
