import {css,unsafeCSS} from 'lit'
import spinnerCSS from '../../../app-stdlib/css/com/spinner.css.js'

const cssStr = css`
${unsafeCSS(spinnerCSS)}

:host {
  display: block;
}

a {
  text-decoration: none;
}

.links {
  font-size: 13px;
  box-sizing: border-box;
  user-select: none;
}

.links .empty {
  font-size: 16px;
  letter-spacing: 0.7px;
  color: var(--text-color--light);
  padding: 120px 0px;
  background: var(--bg-color--light);
  text-align: center;
}

.links .empty .fas {
  font-size: 120px;
  margin-bottom: 30px;
  color: var(--text-color--light);
}

.link {
  display: flex;
  align-items: center;
  height: 27px;
  padding: 6px 14px;
  color: var(--text-color--lightish);
  border-bottom: 1px solid var(--border-color--light);
}

:host(.top-border) .link:first-child {
  border-top: 1px solid var(--border-color--light);
}

.link:hover {
  text-decoration: none;
  background: var(--bg-color--light);
}

.link > * {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.link img {
  display: block;
  width: 16px;
  height: 16px;
  margin-right: 12px;
  object-fit: cover;
}

.link .title {
  flex: 1;
  font-weight: 400;
  margin-right: 20px;
}

.link .url {
  flex: 1;
  color: #99a;
}

@media (max-width: 700px) {
  .links {
    font-size: 12px;
  }
  .links .favicon {
    width: 12px;
    height: 12px;
  }
  .links .title {
    font-size: 12px;
  }
}
`
export default cssStr