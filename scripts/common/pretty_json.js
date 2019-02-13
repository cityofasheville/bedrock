const prettyJson = (object, order = []) => {
  const seq = order.slice();

  Object.keys(object).forEach(itm => { if (!order.includes(itm)) seq.push(itm); });

  const body = seq.reduce((accum, cur, idx) => {
    if (Object.prototype.hasOwnProperty.call(object, cur)) {
      const piece = JSON.stringify(object[cur], null, 2).replace(/\n/g, '\n  ');
      const comma = (idx === seq.length - 1) ? '' : ',';
      return `${accum}\n  "${cur}": ${piece}${comma}`;
    }
    return accum;
  }, '');
  return `{${body}\n}\n`;
};

module.exports = prettyJson;
