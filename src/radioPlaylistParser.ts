import { JSDOM } from "jsdom";
import { BoardLineItem } from "./lists";

export function parseRadioPlaylist( listScript: string ): BoardLineItem[] {
    const top100Table = new RegExp('<table(.|\n)*?</table>');
    let currentPosition = 100;

    const { document } = new JSDOM(listScript.match(top100Table)[0])
    .window;
    const top100List = [
        ...document.querySelectorAll('tr td:nth-child(2)'),
    ];
    return top100List.map((tableRow) => {
        const songRow = tableRow.textContent
            .split('\\n                ')[2]
            .replace('        ', '');
        return {
            placement: currentPosition--,
            artist: songRow.split(' — ')[0],
            song: songRow.split(' — ')[1],
        };
    });
}
