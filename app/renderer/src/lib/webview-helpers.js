import {load} from 'cheerio';
import {parseDocument} from 'htmlparser2';

/**
 * JS code that is executed in the webview to set the needed attributes on the DOM so the source can be used for the
 * native inspector window.
 *
 * NOTE:
 * object destructuring the arguments resulted in this error with iOS (not with Android)
 *
 * `Duplicate parameter 'e' not allowed in function with destructuring parameters.`
 *
 * That's why the object destructuring is done in the method itself
 */
export function setHtmlElementAttributes(obj) {
  const {isAndroid, webviewTopOffset, webviewLeftOffset} = obj;
  const htmlElements = document.body.getElementsByTagName('*');
  // iOS uses CSS sizes for elements and screenshots, Android sizes times DRP
  // for other platforms, use default DRP of 1
  const dpr = isAndroid ? window.devicePixelRatio : 1;

  Array.from(htmlElements).forEach((el) => {
    const rect = el.getBoundingClientRect();

    el.setAttribute('data-appium-inspector-width', Math.round(rect.width * dpr));
    el.setAttribute('data-appium-inspector-height', Math.round(rect.height * dpr));
    el.setAttribute(
      'data-appium-inspector-x',
      Math.round(webviewLeftOffset + (rect.left - window.scrollX) * dpr),
    );
    el.setAttribute(
      'data-appium-inspector-y',
      Math.round(webviewTopOffset + (rect.top - window.scrollY) * dpr),
    );
  });
}

/**
 * Parse the source if it's HTML:
 * - head and scripts need to be removed to clean the HTML tree
 * - all custom attributes need to be transformed to normal width/height/x/y
 */
export function parseSource(source) {
  const isHTML = source.includes('<html');
  const isLikelyFakeDriverSource = source.includes('<app ') || source.includes('<mock');

  if (!isHTML || isLikelyFakeDriverSource) {
    return source;
  }

  const dom = parseDocument(source);
  const $ = load(dom);

  $('head, script').remove();

  $('*').each(function () {
    const $el = $(this);

    ['width', 'height', 'x', 'y'].forEach((attr) => {
      const inspectorAttr = `data-appium-inspector-${attr}`;
      const value = $el.attr(inspectorAttr);

      if (value !== undefined) {
        $el.attr(attr, value);
        $el.removeAttr(inspectorAttr);
      }
    });
  });

  return $.xml();
}
