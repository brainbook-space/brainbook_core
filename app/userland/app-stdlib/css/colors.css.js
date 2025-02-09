import {css} from 'lit'

const cssStr = css`
body {
  --blue: #2864dc; /* this is a leftover that ought to get replaced */
  --border-color--default: #bbc;
  --border-color--light: #ccd;
  --border-color--dark: #99a;
  --border-color--semi-light: #dde;
  --border-color--very-light: #eef;
  --border-color--private-light: #b7c7b0;
  --border-color--unread: #9497f5;
  --text-color--default: #333;
  --text-color--lightish: #555;
  --text-color--light: #667;
  --text-color--pretty-light: #889;
  --text-color--very-light: #bbc;
  --text-color--link: #4040e7;
  --text-color--result-link: blue;
  --text-color--markdown-link: #4040e7;
  --text-color--private-default: #518680;
  --text-color--private-link: #02796d;
  --bg-color--default: #fff;
  --bg-color--secondary: #fafafd;
  --bg-color--light: #fafafd;
  --bg-color--semi-light: #f0f0f6;
  --bg-color--private-light: #f5faf7;
  --bg-color--private-semi-light: #edf6f1;
  --bg-color--light-highlight: #f7faff;
  --bg-color--selected: var(--text-color--link);
  --bg-color--unread: #f2f3ff;
}

@media (prefers-color-scheme: dark) {
  body {
    --border-color--default: #666;
    --border-color--light: #555;
    --border-color--dark: #888;
    --border-color--semi-light: #444;
    --border-color--very-light: #333;
    --border-color--private-light: #3a5a4c;
    --border-color--unread: #9497f5;
    --text-color--default: #ccc;
    --text-color--lightish: #bbb;
    --text-color--light: #aaa;
    --text-color--pretty-light: #999;
    --text-color--very-light: #555;
    --text-color--link: #5d80ff;
    --text-color--result-link: #587bfb;
    --text-color--markdown-link: #5d80ff;
    --text-color--private-default: #69a59e;
    --text-color--private-link: #04a294;
    --bg-color--default: #222;
    --bg-color--secondary: #1b1b1b;
    --bg-color--light: #333;
    --bg-color--semi-light: #444;
    --bg-color--private-light: #202f2f;
    --bg-color--private-semi-light: #354a48;
    --bg-color--light-highlight: #3e3e3a;
    --bg-color--selected: var(--text-color--link);
    --bg-color--unread: #333658;
  }
}
`
export default cssStr
