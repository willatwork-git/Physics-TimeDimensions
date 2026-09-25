/* Assertions for 55-challenge: reads the probe's JSON, prints what's wrong (nothing when all is well). Run by node. */
const r = JSON.parse(process.argv[2]), b = [];
if (r.errors.length) b.push("errors: " + r.errors[0]);
if (/[?&](c|g)=/.test(r.search)) b.push("link parameters left in the address bar: " + r.search);
if (!r.before || !r.before.includes(r.opt0)) b.push(`before guessing, expected "A friend guessed “${r.opt0}”", saw ${JSON.stringify(r.before)}`);
if (!r.after || !/Your friend guessed/.test(r.after)) b.push(`after the reveal, the friend's guess is missing (saw ${JSON.stringify(r.after)})`);
if (!r.share) b.push("no Challenge a friend button after the reveal");
if (!/\?c=clocks&g=1#clocks$/.test(r.link || "")) b.push("built link is " + r.link);
if (r.ownQuestionLink !== null) b.push("a tour stop with its own question was offered a share link: " + r.ownQuestionLink);
process.stdout.write(b.join(" · "));
