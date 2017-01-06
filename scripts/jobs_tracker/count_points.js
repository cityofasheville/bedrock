function countPoints(accum, currentJob) {
  let points = 1;
  if ('points' in currentJob) points = currentJob.points;
  return points + accum;
}

module.exports = countPoints;
