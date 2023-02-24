// Generated by CoffeeScript 2.5.1
var ILLEGALS, KNIGHT, KNIGHT_HOPS, QUEEN, S, TARGET, click, count, counts, illegals, info, knight, knightHops, makeCount, makeCounts, makeIllegals, makeKnight, makeKnightHops, makeMask, makeQueen, makeQueens, makeState, makeTaken, makeTarget, makeTargets, mask, queen, queens, setCount, setCounts, setIllegals, setInfo, setKnight, setKnightHops, setMask, setQueen, setQueens, setStart, setState, setTaken, setTarget, setTargets, show, showCircles, showCounts, showInfo, showLittera, showPieces, showRects, start, state, state0, state1, state2, taken, target, targets,
  indexOf = [].indexOf;

import _ from 'https://cdn.skypack.dev/lodash';

import {
  abs,
  N,
  col,
  row,
  log,
  Position,
  range,
  signal,
  effect,
  r4r,
  sum
} from '../js/utils.js';

import {
  svg,
  rect,
  text,
  circle,
  g
} from '../js/utils.js';

QUEEN = '♛';

KNIGHT = '♘';

S = 62; // square size

[state, setState] = signal(-1); // 0 or 1

[queens, setQueens] = signal([]); // indexes

[queen, setQueen] = signal(-1); // index

[knight, setKnight] = signal(-1); // index 

[illegals, setIllegals] = signal([]); // indexes

[targets, setTargets] = signal([]); // indexes

[taken, setTaken] = signal(-1); // count

[target, setTarget] = signal(-1); // index

[knightHops, setKnightHops] = signal([]); // indexes

[count, setCount] = signal(0); // count

[counts, setCounts] = signal([]); // counts moves per square

[mask, setMask] = signal(0); // 0,1,2 or 3

[info, setInfo] = signal(['x', 'y', 'z']);

[start, setStart] = signal(0);

show = (a, b) => {
  log(a, b);
  return b;
};

makeState = (state) => {
  return show('state', state);
};

makeQueens = () => { // anger de rutor som damen kan placeras på
  var c, cx, cy, dx, dy, j, k, len, len1, r, ref, ref1, ref2, res;
  cx = 7; // board center x
  cy = 7; // board center y
  res = [];
  ref = range(N);
  for (j = 0, len = ref.length; j < len; j++) {
    r = ref[j];
    ref1 = range(N);
    for (k = 0, len1 = ref1.length; k < len1; k++) {
      c = ref1[k];
      dx = abs(2 * c - cx);
      dy = abs(2 * r - cy);
      if ((ref2 = dx * dy) !== 3 && ref2 !== 7 && ref2 !== 9 && ref2 !== 15) {
        res.push(c + 8 * r);
      }
    }
  }
  res.sort(function(a, b) {
    return a - b;
  });
  return show('queens', res);
};

makeQueen = (queen) => {
  return show('queen', queen);
};

makeMask = (queen) => {
  return show('mask', (row(queen) + col(queen)) % 4);
};

makeIllegals = (queen) => {
  if (queen === -1) {
    return [];
  }
  return show('illegals', _.filter(range(N * N), (i) => {
    var ci, cq, dc, dr, ri, rq;
    ci = col(i);
    ri = row(i);
    cq = col(queen);
    rq = row(queen);
    dc = abs(ci - cq);
    dr = abs(ri - rq);
    return ci === cq || ri === rq || dc === dr;
  }));
};

makeTargets = (illegals) => {
  var res;
  if (illegals === []) {
    return [];
  }
  res = range(N * N).filter((i) => {
    return !illegals.includes(i);
  });
  res.sort(function(a, b) {
    return b - a;
  });
  return show('targets', res);
};

makeTaken = (taken) => {
  var res;
  if (taken === 64) {
    res = -1;
  } else {
    res = taken;
  }
  return show('taken', res);
};

makeTarget = (target) => {
  return show('target', target);
};

makeCount = (count) => {
  return show('count', count);
};

makeCounts = (counts) => {
  return show('counts', counts);
};

makeKnight = (targets) => {
  if (targets.length === 64) {
    return -1;
  }
  return show('knight', targets[0]);
};

makeKnightHops = (knight) => {
  var c, c2, dc, dr, index, j, k, len, len1, r, r2, ref, ref1, res;
  if (knight === -1) {
    return [];
  }
  res = [];
  c = col(knight);
  r = row(knight);
  ref = [-2, -1, 1, 2];
  for (j = 0, len = ref.length; j < len; j++) {
    dc = ref[j];
    ref1 = [-2, -1, 1, 2];
    for (k = 0, len1 = ref1.length; k < len1; k++) {
      dr = ref1[k];
      if (abs(dc) === abs(dr)) {
        continue;
      }
      c2 = c + dc;
      r2 = r + dr;
      index = c2 + 8 * r2;
      if (indexOf.call(range(8), c2) >= 0 && indexOf.call(range(8), r2) >= 0 && indexOf.call(targets(), index) >= 0) {
        res.push(index);
      }
    }
  }
  res.sort(function(a, b) {
    return a - b;
  });
  return show('knightHops', res);
};

click = function(index) {
  if (state() === 0) {
    return state0(index);
  } else if (state() === 1) {
    return state1(index);
  } else {
    return state2(index);
  }
};

state0 = (index) => { // handle queen clicks
  if (indexOf.call(queens(), index) >= 0) {
    setQueen(makeQueen(index));
    setMask(makeMask(queen()));
    setIllegals(makeIllegals(queen()));
    setTargets(makeTargets(illegals()));
    setTaken(makeTaken(1));
    setTarget(makeTarget(targets()[taken()]));
    setKnight(() => {
      return makeKnight(targets());
    });
    setKnightHops(makeKnightHops(knight()));
    setState(makeState(1));
    setCount(makeCount(0));
    setCounts(makeCounts([]));
    return setStart(new Date());
  } else {
    return log('not a valid queen position');
  }
};

state1 = (index) => { // handle knight clicks
  if (indexOf.call(knightHops(), index) >= 0) {
    setKnight(index);
    setKnightHops(makeKnightHops(knight()));
    setCount(makeCount(count() + 1));
    if (target() === index) {
      if (taken() === targets().length - 1) {
        return setState(makeState(2));
      } else {
        setTaken(makeTaken(taken() + 1));
        setTarget(makeTarget(targets()[taken()]));
        setCounts(makeCounts(_.concat(counts(), count())));
        return setCount(makeCount(0));
      }
    }
  } else {
    return log('not a valid knight position');
  }
};

state2 = () => {
  return setState(makeState(0));
};

showRects = () => {
  var c, fill, height, i, j, len, r, ref, results, width, x, y;
  ref = range(N * N);
  results = [];
  for (j = 0, len = ref.length; j < len; j++) {
    i = ref[j];
    r = 7 - row(i);
    c = col(i);
    x = S + S * c;
    y = S + S * r;
    width = S;
    height = S;
    fill = ['brown', 'gray'][(r + c) % 2];
    results.push(((i) => {
      return rect({
        x,
        y,
        width,
        height,
        fill,
        onClick: () => {
          return click(i);
        }
      });
    })(i));
  }
  return results;
};

showLittera = () => {
  var i, j, len, ref, results, style, x, y;
  style = {
    "text-anchor": "middle",
    "font-size": 0.5 * S,
    fill: "black"
  };
  ref = range(N);
  results = [];
  for (j = 0, len = ref.length; j < len; j++) {
    i = ref[j];
    x = S * (1.5 + i);
    y = S * (0.7 + N - i);
    results.push(g({}, text(_.merge({
      x,
      y: S * (N + 1.7)
    }, style), "abcdefgh"[i]), text(_.merge({
      x: S * 0.5,
      y
    }, style), "12345678"[i])));
  }
  return results;
};

showPieces = (pieces, PIECE, props) => {
  var c, j, len, piece, r, results, x, y;
  results = [];
  for (j = 0, len = pieces.length; j < len; j++) {
    piece = pieces[j];
    if (piece !== -1) {
      r = 7 - row(piece);
      c = col(piece);
      x = S * (1.5 + c);
      y = S * (1.9 + r);
      results.push(((piece) => {
        var props1;
        props1 = _.merge({
          x,
          y,
          "cursor": "default",
          "text-anchor": "middle",
          "font-size": S,
          fill: "white",
          onClick: () => {
            return click(piece);
          }
        }, props);
        return text(props1, PIECE);
      })(piece));
    } else {
      results.push(void 0);
    }
  }
  return results;
};

showCircles = (circles, CIRCLE) => {
  var c, circ, cx, cy, j, len, r, results;
  results = [];
  for (j = 0, len = circles.length; j < len; j++) {
    circ = circles[j];
    if (circ === -1 || circ === queen()) {
      continue;
    }
    r = 7 - row(circ);
    c = col(circ);
    cx = S * (1.5 + c);
    cy = S * (1.5 + r);
    results.push(((circ) => {
      return circle(_.merge({
        cx,
        cy,
        r: 10,
        "stroke-width": 4,
        onClick: () => {
          return click(circ);
        }
      }, CIRCLE));
    })(circ));
  }
  return results;
};

showCounts = (counts) => {
  var c, counter, i, index, j, len, r, ref, results, x, y;
  ref = range(counts.length);
  results = [];
  for (j = 0, len = ref.length; j < len; j++) {
    i = ref[j];
    counter = counts[i];
    index = targets()[i];
    r = 7 - row(index);
    c = col(index);
    x = S * (1.5 + c);
    y = S * (1.8 + r);
    results.push(((index) => {
      return text({
        x,
        y,
        "cursor": "default",
        "text-anchor": "middle",
        "font-size": 0.7 * S,
        fill: "black",
        onClick: () => {
          return click(index);
        }
      }, counter);
    })(index));
  }
  return results;
};

showInfo = (info) => {
  var style;
  style = {
    x: 5 * S,
    "text-anchor": "middle",
    "font-size": 0.5 * S,
    fill: "black"
  };
  return g({}, state() === 0 ? text(_.merge({
    y: S * (N + 2.5 + 0)
  }, style), 'Click on any queen to start.') : void 0, state() === 1 ? text(_.merge({
    y: S * (N + 2.5 + 0)
  }, style), 'Move the knight to the ring.') : void 0, state() === 2 ? (text(_.merge({
    y: S * (N + 2.5 + 0)
  }, style), sum(counts()), ' moves took ', (new Date() - start()) / 1000, ' seconds.'), text(_.merge({
    y: S * (N + 2.5 + 1)
  }, style), 'Click to continue.')) : void 0);
};

setState(makeState(0));

setQueens(makeQueens());

TARGET = {
  stroke: "yellow",
  fill: "none"
};

ILLEGALS = {
  stroke: "none",
  fill: "black",
  r: 6
};

KNIGHT_HOPS = {
  stroke: "none",
  fill: "white",
  r: 6
};

r4r(() => { // Har ej förstått varför TVÅ loopar behövs.
  return svg({
    viewBox: `0 0 ${10 * S} ${12 * S}`,
    width: 8 * S,
    height: 8 * S
  }, showRects(), showLittera(), () => {
    return showInfo(info());
  }, () => {
    if (state() === 0) {
      return showPieces(queens(), QUEEN, {
        fill: "black"
      });
    }
  }, () => {
    if (state() === 1) {
      return g({}, showCounts(counts()), showPieces([queen()], QUEEN, {
        fill: "black"
      }), showPieces([knight()], KNIGHT, {
        fill: "white"
      }), showCircles([target()], TARGET), mask() & 1 ? showCircles(illegals(), ILLEGALS) : void 0, mask() & 2 ? showCircles(knightHops(), KNIGHT_HOPS) : void 0);
    }
  }, () => {
    if (state() === 2) {
      return g({}, showCounts(counts()), showPieces([queen()], QUEEN, {
        fill: "black"
      }), mask() & 1 ? showCircles(illegals(), ILLEGALS) : void 0);
    }
  });
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2tldGNoNy5qcyIsInNvdXJjZVJvb3QiOiIuLiIsInNvdXJjZXMiOlsiY29mZmVlXFxza2V0Y2g3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBQSxRQUFBLEVBQUEsTUFBQSxFQUFBLFdBQUEsRUFBQSxLQUFBLEVBQUEsQ0FBQSxFQUFBLE1BQUEsRUFBQSxLQUFBLEVBQUEsS0FBQSxFQUFBLE1BQUEsRUFBQSxRQUFBLEVBQUEsSUFBQSxFQUFBLE1BQUEsRUFBQSxVQUFBLEVBQUEsU0FBQSxFQUFBLFVBQUEsRUFBQSxZQUFBLEVBQUEsVUFBQSxFQUFBLGNBQUEsRUFBQSxRQUFBLEVBQUEsU0FBQSxFQUFBLFVBQUEsRUFBQSxTQUFBLEVBQUEsU0FBQSxFQUFBLFVBQUEsRUFBQSxXQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUEsRUFBQSxNQUFBLEVBQUEsUUFBQSxFQUFBLFNBQUEsRUFBQSxXQUFBLEVBQUEsT0FBQSxFQUFBLFNBQUEsRUFBQSxhQUFBLEVBQUEsT0FBQSxFQUFBLFFBQUEsRUFBQSxTQUFBLEVBQUEsUUFBQSxFQUFBLFFBQUEsRUFBQSxRQUFBLEVBQUEsU0FBQSxFQUFBLFVBQUEsRUFBQSxJQUFBLEVBQUEsV0FBQSxFQUFBLFVBQUEsRUFBQSxRQUFBLEVBQUEsV0FBQSxFQUFBLFVBQUEsRUFBQSxTQUFBLEVBQUEsS0FBQSxFQUFBLEtBQUEsRUFBQSxNQUFBLEVBQUEsTUFBQSxFQUFBLE1BQUEsRUFBQSxLQUFBLEVBQUEsTUFBQSxFQUFBLE9BQUE7RUFBQTs7QUFBQSxPQUFPLENBQVAsTUFBQTs7QUFDQSxPQUFBO0VBQVEsR0FBUjtFQUFZLENBQVo7RUFBYyxHQUFkO0VBQWtCLEdBQWxCO0VBQXNCLEdBQXRCO0VBQTBCLFFBQTFCO0VBQW1DLEtBQW5DO0VBQXlDLE1BQXpDO0VBQWdELE1BQWhEO0VBQXVELEdBQXZEO0VBQTJELEdBQTNEO0NBQUEsTUFBQTs7QUFDQSxPQUFBO0VBQVEsR0FBUjtFQUFZLElBQVo7RUFBaUIsSUFB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QUFDLEtBQUEsQ0FBQSxDQUFELENBQVgsRUFBc0IsS0FBdEIsRUFBNkI7UUFBQyxJQUFBLEVBQUs7TUFBTixDQUE3QixDQUZELEVBR0MsVUFBQSxDQUFXLENBQUMsTUFBQSxDQUFBLENBQUQsQ0FBWCxFQUF1QixNQUF2QixFQUErQjtRQUFDLElBQUEsRUFBSztNQUFOLENBQS9CLENBSEQsRUFJQyxXQUFBLENBQVksQ0FBQyxNQUFBLENBQUEsQ0FBRCxDQUFaLEVBQXVCLE1BQXZCLENBSkQsRUFLSSxJQUFBLENBQUEsQ0FBQSxHQUFTLENBQVosR0FBbUIsV0FBQSxDQUFZLFFBQUEsQ0FBQSxDQUFaLEVBQXVCLFFBQXZCLENBQW5CLEdBQUEsTUFMRCxFQU1JLElBQUEsQ0FBQSxDQUFBLEdBQVMsQ0FBWixHQUFtQixXQUFBLENBQVksVUFBQSxDQUFBLENBQVosRUFBeUIsV0FBekIsQ0FBbkIsR0FBQSxNQU5ELEVBREU7O0VBQUgsQ0FSRCxFQWdCQyxDQUFBLENBQUEsR0FBQTtJQUFHLElBQUcsS0FBQSxDQUFBLENBQUEsS0FBVyxDQUFkO2FBQ0YsQ0FBQSxDQUFFLENBQUEsQ0FBRixFQUNDLFVBQUEsQ0FBVyxNQUFBLENBQUEsQ0FBWCxDQURELEVBRUMsVUFBQSxDQUFXLENBQUMsS0FBQSxDQUFBLENBQUQsQ0FBWCxFQUFzQixLQUF0QixFQUE2QjtRQUFDLElBQUEsRUFBSztNQUFOLENBQTdCLENBRkQsRUFHSSxJQUFBLENBQUEsQ0FBQSxHQUFTLENBQVosR0FBbUIsV0FBQSxDQUFZLFFBQUEsQ0FBQSxDQUFaLEVBQXVCLFFBQXZCLENBQW5CLEdBQUEsTUFIRCxFQURFOztFQUFILENBaEJEO0FBREcsQ0FBSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2h0dHBzOi8vY2RuLnNreXBhY2suZGV2L2xvZGFzaCdcclxuaW1wb3J0IHthYnMsTixjb2wscm93LGxvZyxQb3NpdGlvbixyYW5nZSxzaWduYWwsZWZmZWN0LHI0cixzdW19IGZyb20gJy4uL2pzL3V0aWxzLmpzJ1xyXG5pbXBvcnQge3N2ZyxyZWN0LHRleHQsY2lyY2xlLGd9IGZyb20gJy4uL2pzL3V0aWxzLmpzJ1xyXG5cclxuUVVFRU4gPSAn4pmbJyBcclxuS05JR0hUID0gJ+KZmCdcclxuUyA9IDYyICMgc3F1YXJlIHNpemVcclxuXHJcbltzdGF0ZSxzZXRTdGF0ZV0gPSBzaWduYWwgLTEgIyAwIG9yIDFcclxuW3F1ZWVucyxzZXRRdWVlbnNdID0gc2lnbmFsIFtdICMgaW5kZXhlc1xyXG5bcXVlZW4sc2V0UXVlZW5dID0gc2lnbmFsIC0xICMgaW5kZXhcclxuW2tuaWdodCxzZXRLbmlnaHRdID0gc2lnbmFsIC0xICMgaW5kZXggXHJcbltpbGxlZ2Fscywgc2V0SWxsZWdhbHNdID0gc2lnbmFsIFtdICMgaW5kZXhlc1xyXG5bdGFyZ2V0cywgc2V0VGFyZ2V0c10gPSBzaWduYWwgW10gIyBpbmRleGVzXHJcblt0YWtlbiwgc2V0VGFrZW5dID0gc2lnbmFsIC0xICMgY291bnRcclxuW3RhcmdldCwgc2V0VGFyZ2V0XSA9IHNpZ25hbCAtMSAjIGluZGV4XHJcbltrbmlnaHRIb3BzLCBzZXRLbmlnaHRIb3BzXSA9IHNpZ25hbCBbXSAjIGluZGV4ZXNcclxuW2NvdW50LHNldENvdW50XSA9IHNpZ25hbCAwICMgY291bnRcclxuW2NvdW50cywgc2V0Q291bnRzXSA9IHNpZ25hbCBbXSAjIGNvdW50cyBtb3ZlcyBwZXIgc3F1YXJlXHJcblttYXNrLHNldE1hc2tdID0gc2lnbmFsIDAgIyAwLDEsMiBvciAzXHJcbltpbmZvLHNldEluZm9dID0gc2lnbmFsIFsneCcsJ3knLCd6J11cclxuW3N0YXJ0LHNldFN0YXJ0XSA9IHNpZ25hbCAwXHJcblxyXG5zaG93ID0gKGEsYikgPT5cclxuXHRsb2cgYSxiXHJcblx0YlxyXG5cclxubWFrZVN0YXRlID0gKHN0YXRlKSA9PiBzaG93ICdzdGF0ZScsIHN0YXRlXHJcblxyXG5tYWtlUXVlZW5zID0gPT4gIyBhbmdlciBkZSBydXRvciBzb20gZGFtZW4ga2FuIHBsYWNlcmFzIHDDpVxyXG5cdGN4ID0gNyAjIGJvYXJkIGNlbnRlciB4XHJcblx0Y3kgPSA3ICMgYm9hcmQgY2VudGVyIHlcclxuXHRyZXMgPSBbXVxyXG5cdGZvciByIGluIHJhbmdlIE5cclxuXHRcdGZvciBjIGluIHJhbmdlIE5cclxuXHRcdFx0ZHggPSBhYnMgMipjIC0gY3hcclxuXHRcdFx0ZHkgPSBhYnMgMipyIC0gY3lcclxuXHRcdFx0aWYgZHggKiBkeSBub3QgaW4gWzMsNyw5LDE1XSB0aGVuIHJlcy5wdXNoIGMrOCpyXHJcblx0cmVzLnNvcnQgKGEsYikgLT4gYS1iXHJcblx0c2hvdyAncXVlZW5zJywgcmVzXHJcblxyXG5tYWtlUXVlZW4gPSAocXVlZW4pID0+IHNob3cgJ3F1ZWVuJywgcXVlZW5cclxuXHJcbm1ha2VNYXNrID0gKHF1ZWVuKSA9PiBzaG93ICdtYXNrJywgKHJvdyhxdWVlbikrY29sKHF1ZWVuKSkgJSA0XHJcblxyXG5tYWtlSWxsZWdhbHMgPSAocXVlZW4pID0+XHJcblx0aWYgcXVlZW49PS0xIHRoZW4gcmV0dXJuIFtdXHJcblx0c2hvdyAnaWxsZWdhbHMnLCBfLmZpbHRlciByYW5nZShOKk4pLCAoaSkgPT5cclxuXHRcdGNpID0gY29sIGlcclxuXHRcdHJpID0gcm93IGlcclxuXHRcdGNxID0gY29sIHF1ZWVuXHJcblx0XHRycSA9IHJvdyBxdWVlblxyXG5cdFx0ZGMgPSBhYnMgY2kgLSBjcVxyXG5cdFx0ZHIgPSBhYnMgcmkgLSBycVxyXG5cdFx0Y2kgPT0gY3Egb3IgcmkgPT0gcnEgb3IgZGMgPT0gZHJcclxuXHJcbm1ha2VUYXJnZXRzID0gKGlsbGVnYWxzKT0+XHJcblx0aWYgaWxsZWdhbHM9PVtdIHRoZW4gcmV0dXJuIFtdXHJcblx0cmVzID0gcmFuZ2UoTipOKS5maWx0ZXIgKGkpID0+IG5vdCBpbGxlZ2Fscy5pbmNsdWRlcyBpXHJcblx0cmVzLnNvcnQgKGEsYikgLT4gYi1hXHJcblx0c2hvdyAndGFyZ2V0cycsIHJlc1xyXG5cclxubWFrZVRha2VuID0gKHRha2VuKSA9PlxyXG5cdGlmIHRha2VuPT02NCB0aGVuIHJlcyA9IC0xIGVsc2UgcmVzID0gdGFrZW5cclxuXHRzaG93ICd0YWtlbicsIHJlc1xyXG5cclxubWFrZVRhcmdldCA9ICh0YXJnZXQpID0+IHNob3cgJ3RhcmdldCcsIHRhcmdldFxyXG5tYWtlQ291bnQgPSAoY291bnQpID0+IHNob3cgJ2NvdW50JywgY291bnRcclxubWFrZUNvdW50cyA9IChjb3VudHMpID0+IHNob3cgJ2NvdW50cycsIGNvdW50c1xyXG5cclxubWFrZUtuaWdodCA9ICh0YXJnZXRzKSA9PlxyXG5cdGlmIHRhcmdldHMubGVuZ3RoPT02NCB0aGVuIHJldHVybiAtMVxyXG5cdHNob3cgJ2tuaWdodCcsIHRhcmdldHNbMF1cclxuXHJcbm1ha2VLbmlnaHRIb3BzID0gKGtuaWdodCkgPT5cclxuXHRpZiBrbmlnaHQ9PS0xIHRoZW4gcmV0dXJuIFtdXHJcblx0cmVzID0gW11cclxuXHRjID0gY29sIGtuaWdodFxyXG5cdHIgPSByb3cga25pZ2h0XHJcblx0Zm9yIGRjIGluIFstMiwtMSwxLDJdXHJcblx0XHRmb3IgZHIgaW4gWy0yLC0xLDEsMl1cclxuXHRcdFx0aWYgYWJzKGRjKSA9PSBhYnMoZHIpIHRoZW4gY29udGludWVcclxuXHRcdFx0YzIgPSBjICsgZGNcclxuXHRcdFx0cjIgPSByICsgZHJcclxuXHRcdFx0aW5kZXggPSBjMis4KnIyXHJcblx0XHRcdGlmIGMyIGluIHJhbmdlKDgpIGFuZCByMiBpbiByYW5nZSg4KSBhbmQgaW5kZXggaW4gdGFyZ2V0cygpIHRoZW4gcmVzLnB1c2ggaW5kZXhcclxuXHRyZXMuc29ydCAoYSxiKSAtPiBhLWJcclxuXHRzaG93ICdrbmlnaHRIb3BzJywgcmVzXHJcblxyXG5jbGljayA9IChpbmRleCkgLT5cclxuXHRpZiBzdGF0ZSgpID09IDAgdGhlbiBzdGF0ZTAgaW5kZXhcclxuXHRlbHNlIGlmIHN0YXRlKCkgPT0gMSB0aGVuIHN0YXRlMSBpbmRleFxyXG5cdGVsc2Ugc3RhdGUyIGluZGV4XHJcblxyXG5zdGF0ZTAgPSAoaW5kZXgpID0+ICMgaGFuZGxlIHF1ZWVuIGNsaWNrc1xyXG5cdGlmIGluZGV4IGluIHF1ZWVucygpXHJcblx0XHRzZXRRdWVlbiBtYWtlUXVlZW4gaW5kZXhcclxuXHRcdHNldE1hc2sgbWFrZU1hc2sgcXVlZW4oKVxyXG5cdFx0c2V0SWxsZWdhbHMgbWFrZUlsbGVnYWxzIHF1ZWVuKClcclxuXHRcdHNldFRhcmdldHMgbWFrZVRhcmdldHMgaWxsZWdhbHMoKVxyXG5cdFx0c2V0VGFrZW4gbWFrZVRha2VuIDFcclxuXHRcdHNldFRhcmdldCBtYWtlVGFyZ2V0IHRhcmdldHMoKVt0YWtlbigpXVxyXG5cdFx0c2V0S25pZ2h0ID0+IG1ha2VLbmlnaHQgdGFyZ2V0cygpXHJcblx0XHRzZXRLbmlnaHRIb3BzIG1ha2VLbmlnaHRIb3BzIGtuaWdodCgpXHJcblx0XHRzZXRTdGF0ZSBtYWtlU3RhdGUgMVxyXG5cdFx0c2V0Q291bnQgbWFrZUNvdW50IDBcclxuXHRcdHNldENvdW50cyBtYWtlQ291bnRzIFtdXHJcblx0XHRzZXRTdGFydCBuZXcgRGF0ZSgpXHJcblx0ZWxzZSBsb2cgJ25vdCBhIHZhbGlkIHF1ZWVuIHBvc2l0aW9uJ1xyXG5cclxuc3RhdGUxID0gKGluZGV4KSA9PiAjIGhhbmRsZSBrbmlnaHQgY2xpY2tzXHJcblx0aWYgaW5kZXggaW4ga25pZ2h0SG9wcygpXHJcblx0XHRzZXRLbmlnaHQgaW5kZXhcclxuXHRcdHNldEtuaWdodEhvcHMgbWFrZUtuaWdodEhvcHMga25pZ2h0KClcclxuXHRcdHNldENvdW50IG1ha2VDb3VudCBjb3VudCgpICsgMVxyXG5cdFx0aWYgdGFyZ2V0KCkgPT0gaW5kZXhcclxuXHRcdFx0aWYgdGFrZW4oKSA9PSB0YXJnZXRzKCkubGVuZ3RoIC0gMVxyXG5cdFx0XHRcdHNldFN0YXRlIG1ha2VTdGF0ZSAyXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRzZXRUYWtlbiBtYWtlVGFrZW4gdGFrZW4oKSArIDFcclxuXHRcdFx0XHRzZXRUYXJnZXQgbWFrZVRhcmdldCB0YXJnZXRzKClbdGFrZW4oKV1cclxuXHRcdFx0XHRzZXRDb3VudHMgbWFrZUNvdW50cyBfLmNvbmNhdCBjb3VudHMoKSwgY291bnQoKVxyXG5cdFx0XHRcdHNldENvdW50IG1ha2VDb3VudCAwXHJcblx0ZWxzZSBsb2cgJ25vdCBhIHZhbGlkIGtuaWdodCBwb3NpdGlvbidcclxuXHJcbnN0YXRlMiA9ID0+IHNldFN0YXRlIG1ha2VTdGF0ZSAwXHJcblxyXG5zaG93UmVjdHMgPSA9PlxyXG5cdGZvciBpIGluIHJhbmdlIE4qTlxyXG5cdFx0ciA9IDcgLSByb3cgaVxyXG5cdFx0YyA9IGNvbCBpXHJcblx0XHR4ID0gUyArIFMqY1xyXG5cdFx0eSA9IFMgKyBTKnJcclxuXHRcdHdpZHRoID0gU1xyXG5cdFx0aGVpZ2h0ID0gU1xyXG5cdFx0ZmlsbCA9IFsnYnJvd24nLCdncmF5J11bKHIrYykgJSAyXVxyXG5cdFx0ZG8gKGkpID0+XHJcblx0XHRcdHJlY3Qge3gsIHksIHdpZHRoLCBoZWlnaHQsIGZpbGwsIG9uQ2xpY2s6ID0+IGNsaWNrIGl9XHJcblxyXG5zaG93TGl0dGVyYSA9ID0+XHJcblx0c3R5bGUgPSB7XCJ0ZXh0LWFuY2hvclwiOlwibWlkZGxlXCIsIFwiZm9udC1zaXplXCI6MC41KlMsIGZpbGw6XCJibGFja1wifVxyXG5cdGZvciBpIGluIHJhbmdlIE5cclxuXHRcdHggPSBTKigxLjUraSlcclxuXHRcdHkgPSBTKigwLjcrTi1pKVxyXG5cdFx0ZyB7fSxcclxuXHRcdFx0dGV4dCBfLm1lcmdlKHt4LCB5OlMqKE4rMS43KX0sIHN0eWxlKSwgXCJhYmNkZWZnaFwiW2ldXHJcblx0XHRcdHRleHQgXy5tZXJnZSh7eDpTKigwLjUpLCB5fSwgICBzdHlsZSksIFwiMTIzNDU2NzhcIltpXVxyXG5cclxuc2hvd1BpZWNlcyA9IChwaWVjZXMsUElFQ0UscHJvcHMpID0+XHJcblx0Zm9yIHBpZWNlIGluIHBpZWNlc1xyXG5cdFx0aWYgcGllY2UgIT0gLTFcclxuXHRcdFx0ciA9IDcgLSByb3cgcGllY2VcclxuXHRcdFx0YyA9IGNvbCBwaWVjZVxyXG5cdFx0XHR4ID0gUyooMS41K2MpXHJcblx0XHRcdHkgPSBTKigxLjkrcilcclxuXHRcdFx0ZG8gKHBpZWNlKSA9PlxyXG5cdFx0XHRcdHByb3BzMSA9IF8ubWVyZ2Uge3gsIHksIFwiY3Vyc29yXCI6IFwiZGVmYXVsdFwiLCBcInRleHQtYW5jaG9yXCI6XCJtaWRkbGVcIiwgXCJmb250LXNpemVcIjpTLCBmaWxsOlwid2hpdGVcIiwgb25DbGljazogPT4gY2xpY2sgcGllY2V9LHByb3BzXHJcblx0XHRcdFx0dGV4dCBwcm9wczEsIFBJRUNFXHJcblxyXG5zaG93Q2lyY2xlcyA9IChjaXJjbGVzLENJUkNMRSkgPT5cclxuXHRmb3IgY2lyYyBpbiBjaXJjbGVzXHJcblx0XHRpZiBjaXJjID09IC0xIG9yIGNpcmM9PXF1ZWVuKCkgdGhlbiBjb250aW51ZVxyXG5cdFx0ciA9IDcgLSByb3cgY2lyY1xyXG5cdFx0YyA9IGNvbCBjaXJjXHJcblx0XHRjeCA9IFMqKDEuNStjKVxyXG5cdFx0Y3kgPSBTKigxLjUrcilcclxuXHRcdGRvIChjaXJjKSA9PlxyXG5cdFx0XHRjaXJjbGUgXy5tZXJnZSB7Y3gsIGN5LCByOjEwLCBcInN0cm9rZS13aWR0aFwiOjQsIG9uQ2xpY2s6ID0+IGNsaWNrIGNpcmN9LCBDSVJDTEVcclxuXHJcbnNob3dDb3VudHMgPSAoY291bnRzKSA9PlxyXG5cdGZvciBpIGluIHJhbmdlIGNvdW50cy5sZW5ndGhcclxuXHRcdGNvdW50ZXIgPSBjb3VudHNbaV0gIyBjb3VudFxyXG5cdFx0aW5kZXggPSB0YXJnZXRzKClbaV0gIyB0YXJnZXRcclxuXHRcdHIgPSA3IC0gcm93IGluZGV4XHJcblx0XHRjID0gY29sIGluZGV4XHJcblx0XHR4ID0gUyooMS41K2MpXHJcblx0XHR5ID0gUyooMS44K3IpXHJcblx0XHRkbyAoaW5kZXgpID0+XHJcblx0XHRcdHRleHQge3gsIHksIFwiY3Vyc29yXCI6IFwiZGVmYXVsdFwiLCBcInRleHQtYW5jaG9yXCI6XCJtaWRkbGVcIiwgXCJmb250LXNpemVcIjowLjcqUywgZmlsbDpcImJsYWNrXCIsIG9uQ2xpY2s6ID0+IGNsaWNrIGluZGV4fSwgY291bnRlclxyXG5cclxuc2hvd0luZm8gPSAoaW5mbykgPT5cclxuXHRzdHlsZSA9IHt4OjUqUywgXCJ0ZXh0LWFuY2hvclwiOlwibWlkZGxlXCIsIFwiZm9udC1zaXplXCI6MC41KlMsIGZpbGw6XCJibGFja1wifVxyXG5cdGcge30sXHJcblx0XHRpZiBzdGF0ZSgpPT0wXHJcblx0XHRcdHRleHQgXy5tZXJnZSh7eTpTKihOKzIuNSswKX0sIHN0eWxlKSwgJ0NsaWNrIG9uIGFueSBxdWVlbiB0byBzdGFydC4nXHJcblx0XHRpZiBzdGF0ZSgpID09IDFcclxuXHRcdFx0dGV4dCBfLm1lcmdlKHt5OlMqKE4rMi41KzApfSwgc3R5bGUpLCAnTW92ZSB0aGUga25pZ2h0IHRvIHRoZSByaW5nLidcclxuXHRcdGlmIHN0YXRlKCk9PTJcclxuXHRcdFx0dGV4dCBfLm1lcmdlKHt5OlMqKE4rMi41KzApfSwgc3R5bGUpLCBzdW0oY291bnRzKCkpLCAnIG1vdmVzIHRvb2sgJywobmV3IERhdGUoKSAtIHN0YXJ0KCkpLzEwMDAsJyBzZWNvbmRzLidcclxuXHRcdFx0dGV4dCBfLm1lcmdlKHt5OlMqKE4rMi41KzEpfSwgc3R5bGUpLCAnQ2xpY2sgdG8gY29udGludWUuJ1xyXG5cclxuc2V0U3RhdGUgbWFrZVN0YXRlIDBcclxuc2V0UXVlZW5zIG1ha2VRdWVlbnMoKVxyXG5cclxuVEFSR0VUICAgICAgPSB7c3Ryb2tlOlwieWVsbG93XCIsIGZpbGw6XCJub25lXCJ9XHJcbklMTEVHQUxTICAgID0ge3N0cm9rZTpcIm5vbmVcIiwgICBmaWxsOlwiYmxhY2tcIiwgcjo2fVxyXG5LTklHSFRfSE9QUyA9IHtzdHJva2U6XCJub25lXCIsICAgZmlsbDpcIndoaXRlXCIsIHI6Nn1cclxuXHJcbnI0ciA9PiAjIEhhciBlaiBmw7Zyc3TDpXR0IHZhcmbDtnIgVFbDhSBsb29wYXIgYmVow7Z2cy5cclxuXHRzdmdcclxuXHRcdHZpZXdCb3ggOiBcIjAgMCAjezEwKlN9ICN7MTIqU31cIlxyXG5cdFx0d2lkdGggOiA4KlNcclxuXHRcdGhlaWdodCA6IDgqU1xyXG5cdFx0c2hvd1JlY3RzKClcclxuXHRcdHNob3dMaXR0ZXJhKClcclxuXHRcdD0+IHNob3dJbmZvIGluZm8oKVxyXG5cdFx0PT4gaWYgc3RhdGUoKSA9PSAwIHRoZW4gc2hvd1BpZWNlcyBxdWVlbnMoKSxRVUVFTiwge2ZpbGw6XCJibGFja1wifVxyXG5cdFx0PT4gaWYgc3RhdGUoKSA9PSAxXHJcblx0XHRcdGcge30sXHJcblx0XHRcdFx0c2hvd0NvdW50cyBjb3VudHMoKVxyXG5cdFx0XHRcdHNob3dQaWVjZXMgW3F1ZWVuKCldLCBRVUVFTiwge2ZpbGw6XCJibGFja1wifVxyXG5cdFx0XHRcdHNob3dQaWVjZXMgW2tuaWdodCgpXSwgS05JR0hULCB7ZmlsbDpcIndoaXRlXCJ9XHJcblx0XHRcdFx0c2hvd0NpcmNsZXMgW3RhcmdldCgpXSxUQVJHRVRcclxuXHRcdFx0XHRpZiBtYXNrKCkgJiAxIHRoZW4gc2hvd0NpcmNsZXMgaWxsZWdhbHMoKSxJTExFR0FMU1xyXG5cdFx0XHRcdGlmIG1hc2soKSAmIDIgdGhlbiBzaG93Q2lyY2xlcyBrbmlnaHRIb3BzKCksS05JR0hUX0hPUFNcclxuXHRcdD0+IGlmIHN0YXRlKCkgPT0gMlxyXG5cdFx0XHRnIHt9LFxyXG5cdFx0XHRcdHNob3dDb3VudHMgY291bnRzKClcclxuXHRcdFx0XHRzaG93UGllY2VzIFtxdWVlbigpXSwgUVVFRU4sIHtmaWxsOlwiYmxhY2tcIn1cclxuXHRcdFx0XHRpZiBtYXNrKCkgJiAxIHRoZW4gc2hvd0NpcmNsZXMgaWxsZWdhbHMoKSxJTExFR0FMU1xyXG4iXX0=
//# sourceURL=c:\github\2023-013-Knightmoves-solidjs\coffee\sketch7.coffee