import {css, unsafeCSS} from 'lit'
import colorsCSS from '../../../app-stdlib/css/colors.css.js'
import buttonsCSS from '../../../app-stdlib/css/buttons2.css.js'
import tooltipCSS from '../../../app-stdlib/css/tooltip.css.js'
import spinnerCSS from '../../../app-stdlib/css/com/spinner.css.js'

const cssStr = css`
${unsafeCSS(colorsCSS)}
${unsafeCSS(buttonsCSS)}
${unsafeCSS(tooltipCSS)}
${unsafeCSS(spinnerCSS)}

:host {
  display: block;
  max-width: 600px;
}

a {
  color: var(--blue);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.section {
  margin-bottom: 30px;
}

.message {
  margin: 1em 0;
  background: #FFEB3B;
  color: #443e0b;
  padding: 10px;
  border-radius: 2px;
  font-size: 15px;
}
`
export default cssStr