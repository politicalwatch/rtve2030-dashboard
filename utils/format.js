import {  formatLocale } from "d3";

 const locale = formatLocale({
   decimal: ",",
   thousands: "\u205F",
   grouping: [3],
   currency: ["", "\u202F M€"],
   minus: "\u2212",
   percent: "%",
 });
// https://stackoverflow.com/questions/38466245/d3-formatted-numbers-not-displaying-thousands-separator
function localES_money(num) {
  const numMillion= num / 1000000;
  return locale.format("$,.1f")(numMillion);
}


function localES(num) {
  return locale.format(",.0f")(num);
}



function F(num) {
  return locale.format(",.2f")(num);
}

function N(num) {
  return locale.format(",.0f")(num);
}

function PCT(num){
  return locale.format(",.2%")(num);
}

const format = {
  localES_money,
  localES,
  locale,
  F,
  N,
  PCT
};
export default format;
