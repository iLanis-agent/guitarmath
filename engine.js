/* GuitarMath engine - honest guitar string tension math. Pure functions, no DOM. */
var GuitarEngine = (function () {
  var RHO = 0.286;          /* music-wire density, lb per cubic inch */
  var WOUND_FACTOR = 0.80;  /* wound strings carry only the core's share of a solid wire's mass */
  var G = 386.4;            /* gravity constant in the unit-weight tension formula */
  var STANDARD_GAUGES = [0.008, 0.009, 0.010, 0.011, 0.012, 0.013, 0.014, 0.016, 0.017, 0.018, 0.020, 0.022, 0.024, 0.026, 0.028, 0.030, 0.032, 0.034, 0.036, 0.038, 0.040, 0.042, 0.044, 0.046, 0.048, 0.050, 0.052, 0.054, 0.056];

  /* standard tuning reference frequencies */
  var NOTES = { E2: 82.41, A2: 110.00, D3: 146.83, G3: 196.00, B3: 246.94, E4: 329.63 };

  function r1(x) { return Math.round(x * 10) / 100 * 10; } /* keep one decimal, honest precision */
  function round1(x) { return Math.round(x * 10) / 10; }

  function semitoneFreq(baseHz, semitones) {
    return baseHz * Math.pow(2, semitones / 12);
  }

  function unitWeight(gaugeIn, wound) {
    var uw = Math.PI / 4 * RHO * gaugeIn * gaugeIn;
    return wound ? uw * WOUND_FACTOR : uw;
  }

  /* tension in pounds: T = UW * (2 * scale * freq)^2 / 386.4 */
  function tension(gaugeIn, scaleIn, freqHz, wound) {
    if (gaugeIn <= 0 || scaleIn <= 0 || freqHz <= 0) throw new Error('gauge, scale and frequency must be positive');
    return round1(unitWeight(gaugeIn, wound) * Math.pow(2 * scaleIn * freqHz, 2) / G);
  }

  /* tension after tuning down (negative semitones = down) */
  function detuneTension(tensionLb, semitones) {
    return round1(tensionLb * Math.pow(2, 2 * semitones / 12));
  }

  /* pick the standard gauge nearest the target tension */
  function gaugeForTension(targetLb, scaleIn, freqHz, wound) {
    var best = null, bestErr = Infinity;
    STANDARD_GAUGES.forEach(function (d) {
      var t = tension(d, scaleIn, freqHz, wound);
      var err = Math.abs(t - targetLb);
      if (err < bestErr) { bestErr = err; best = d; }
    });
    return { gauge: best, tension: tension(best, scaleIn, freqHz, wound) };
  }

  function setTotal(scaleIn, strings) {
    var total = 0;
    strings.forEach(function (s) { total += tension(s.gauge, scaleIn, s.freq, s.wound); });
    return round1(total);
  }

  function tensionVerdict(lbPerString) {
    if (lbPerString < 12) return 'floppy - fret buzz and pitch drift unless the touch is light';
    if (lbPerString < 15) return 'slinky - easy bends, watch the tuning stability';
    if (lbPerString <= 20) return 'the normal pocket - most sets live here';
    if (lbPerString <= 25) return 'firm - fight for the bends, win on the low end';
    return 'telephone-pole territory - check the neck relief and your hands';
  }

  /* classic sets: 10-46, standard tuning */
  function standardSet(freqScale) {
    var k = freqScale || 1;
    return [
      { gauge: 0.010, wound: false, freq: NOTES.E4 * k },
      { gauge: 0.013, wound: false, freq: NOTES.B3 * k },
      { gauge: 0.017, wound: false, freq: NOTES.G3 * k },
      { gauge: 0.026, wound: true, freq: NOTES.D3 * k },
      { gauge: 0.036, wound: true, freq: NOTES.A2 * k },
      { gauge: 0.046, wound: true, freq: NOTES.E2 * k }
    ];
  }

  return {
    NOTES: NOTES, STANDARD_GAUGES: STANDARD_GAUGES,
    semitoneFreq: semitoneFreq, unitWeight: unitWeight, tension: tension,
    detuneTension: detuneTension, gaugeForTension: gaugeForTension,
    setTotal: setTotal, tensionVerdict: tensionVerdict, standardSet: standardSet
  };
})();
if (typeof module !== 'undefined' && module.exports) module.exports = GuitarEngine;
