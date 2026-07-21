/**
 * DASPA — Google Ads monitoring scripts.
 * Paste each into Google Ads → Tools → Bulk actions → Scripts, authorise,
 * and schedule (pacing: daily 8am; search terms: weekly Monday 8am).
 * Set EMAIL below. Both scripts are read-only — they never change bids,
 * budgets or status; they just tell you what needs a human decision.
 */

// ═══════════════ SCRIPT 1 — Daily budget pacing + zero-conversion alarm ═══
var EMAIL = 'james@link.com.au';           // where alerts go
var MONTHLY_BUDGET = 1500;                  // AUD — trial cap, adjust to taste
var CPA_ALARM = 80;                         // alert if trailing-7-day CPA exceeds this

function main() {
  var now = new Date();
  var dayOfMonth = now.getDate();
  var daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  var expectedPct = dayOfMonth / daysInMonth;

  var stats = AdsApp.currentAccount().getStatsFor('THIS_MONTH');
  var spend = stats.getCost();
  var pacePct = spend / MONTHLY_BUDGET;

  var s7 = AdsApp.currentAccount().getStatsFor('LAST_7_DAYS');
  var conv7 = s7.getConversions();
  var cost7 = s7.getCost();
  var cpa7 = conv7 > 0 ? cost7 / conv7 : null;

  var lines = [
    'DASPA Ads — daily pacing (' + now.toDateString() + ')',
    'Month spend: $' + spend.toFixed(2) + ' of $' + MONTHLY_BUDGET +
      ' (' + (pacePct * 100).toFixed(0) + '% spent, ' + (expectedPct * 100).toFixed(0) + '% of month elapsed)',
    'Last 7 days: $' + cost7.toFixed(2) + ' · ' + conv7.toFixed(1) + ' conversions · CPA ' +
      (cpa7 ? '$' + cpa7.toFixed(2) : 'n/a — NO CONVERSIONS'),
  ];

  var alert = false;
  if (pacePct > expectedPct * 1.25) { lines.push('⚠ OVERPACING — on track to blow the monthly cap.'); alert = true; }
  if (cost7 > 100 && conv7 === 0)   { lines.push('⚠ $100+ spent in 7 days with ZERO conversions — check tracking first, then keywords.'); alert = true; }
  if (cpa7 && cpa7 > CPA_ALARM)     { lines.push('⚠ CPA above $' + CPA_ALARM + ' — review search terms and pause bleeders.'); alert = true; }

  Logger.log(lines.join('\n'));
  if (alert) MailApp.sendEmail(EMAIL, 'DASPA Ads alert — needs a look', lines.join('\n'));
}

// ═══════════════ SCRIPT 2 — Weekly search-term digest (paste separately) ═══
// Emails the search terms that spent money last week with zero conversions,
// plus the winners — the raw material for negatives and new exact keywords.
/*
var EMAIL = 'james@link.com.au';
var MIN_COST = 5; // only report terms that spent at least this (AUD)

function main() {
  var report = AdsApp.report(
    "SELECT Query, Cost, Clicks, Conversions, CampaignName " +
    "FROM SEARCH_QUERY_PERFORMANCE_REPORT " +
    "WHERE Cost > " + (MIN_COST * 1000000) + " " +
    "DURING LAST_7_DAYS");
  var rows = report.rows();
  var waste = [], wins = [];
  while (rows.hasNext()) {
    var r = rows.next();
    var line = '"' + r['Query'] + '" — $' + r['Cost'] + ', ' + r['Clicks'] + ' clicks, ' +
               r['Conversions'] + ' conv (' + r['CampaignName'] + ')';
    if (parseFloat(r['Conversions']) === 0) waste.push(line); else wins.push(line);
  }
  var body = 'DASPA — search terms, last 7 days\n\n' +
    '── SPENT WITH ZERO CONVERSIONS (negative candidates) ──\n' +
    (waste.length ? waste.join('\n') : 'none — clean week') +
    '\n\n── CONVERTERS (exact-match candidates) ──\n' +
    (wins.length ? wins.join('\n') : 'none yet');
  MailApp.sendEmail(EMAIL, 'DASPA Ads — weekly search terms', body);
  Logger.log(body);
}
*/
