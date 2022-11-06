import {css} from 'lit'
import resetcss from './reset.css.js'
import colorscss from './colors.css.js'
import typographycss from './typography.css.js'
import buttonscss from './buttons.css.js'
import inputscss from './inputs.css.js'
const cssStr = css`
${resetcss}
${colorscss}
${typographycss}
${buttonscss}
${inputscss}

body {
  background: var(--bg-color--default);
  color: var(--text-color--default);
}
`
export default cssStr
